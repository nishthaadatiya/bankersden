import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import WhatsAppConversation from '@/models/WhatsAppConversation';
import WhatsAppService from '@/lib/whatsapp';
import { authenticateAdmin } from '@/lib/auth';
import { logWebhookEvent } from '@/lib/webhookLogger';

export const dynamic = 'force-dynamic';

// GET: Retrieve single conversation thread and reset unreadAdminCount
export async function GET(
  request: NextRequest,
  { params }: { params: { phoneNumber: string } }
) {
  const admin = await authenticateAdmin(request);
  if (admin instanceof Response) return admin;

  try {
    await connectDB();
    const { phoneNumber } = params;

    // Reset unread counter when admin opens the conversation
    const conversation: any = await WhatsAppConversation.findOneAndUpdate(
      { phoneNumber },
      { $set: { unreadAdminCount: 0 } },
      { new: true }
    )
      .populate('leadId')
      .lean();

    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    }

    const now = new Date();
    const expiresAt = new Date(conversation.windowExpiresAt);
    const isWindowOpen = expiresAt > now;
    const hoursRemaining = isWindowOpen
      ? ((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)).toFixed(1)
      : '0';

    return NextResponse.json({
      success: true,
      conversation: {
        ...conversation,
        isWindowOpen,
        hoursRemaining,
      },
    });
  } catch (error: any) {
    console.error('Error fetching conversation thread:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Admin intervenes and sends a message directly to customer via WhatsApp
export async function POST(
  request: NextRequest,
  { params }: { params: { phoneNumber: string } }
) {
  const admin = await authenticateAdmin(request);
  if (admin instanceof Response) return admin;

  try {
    await connectDB();
    const { phoneNumber } = params;
    const { text, pauseBot = true } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ success: false, error: 'Message text cannot be empty' }, { status: 400 });
    }

    const whatsappService = new WhatsAppService();
    if (!whatsappService.isConfigured()) {
      return NextResponse.json(
        { success: false, error: 'WhatsApp service is not configured in environment variables' },
        { status: 500 }
      );
    }

    // Send the live WhatsApp message to customer
    const sendResult = await whatsappService.sendMessage(phoneNumber, text.trim());

    if (!sendResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: sendResult.error || 'Failed to send message via WhatsApp Cloud API',
          details: sendResult.details,
        },
        { status: 400 }
      );
    }

    const now = new Date();

    // Store in conversation thread as outbound message from 'admin'
    const updatedConvo: any = await WhatsAppConversation.findOneAndUpdate(
      { phoneNumber },
      {
        $set: {
          lastMessageText: `[Admin]: ${text.trim()}`,
          ...(pauseBot ? { isBotPaused: true } : {}),
        },
        $push: {
          messages: {
            messageId: sendResult.messageId || `admin_${Date.now()}`,
            direction: 'outbound',
            sender: 'admin',
            type: 'text',
            text: text.trim(),
            status: 'sent',
            timestamp: now,
          },
        },
      },
      { new: true }
    ).lean();

    logWebhookEvent({
      type: 'TEST_OUTBOUND',
      status: 'success',
      summary: `Admin intervened and messaged ${phoneNumber}: "${text.trim().slice(0, 40)}"`,
      recipient: phoneNumber,
      messageText: text.trim(),
      messageId: sendResult.messageId,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin message sent to customer via WhatsApp successfully',
      messageId: sendResult.messageId,
      conversation: updatedConvo,
    });
  } catch (error: any) {
    console.error('Error sending admin WhatsApp message:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Toggle bot pause status or mark conversation active/closed
export async function PATCH(
  request: NextRequest,
  { params }: { params: { phoneNumber: string } }
) {
  const admin = await authenticateAdmin(request);
  if (admin instanceof Response) return admin;

  try {
    await connectDB();
    const { phoneNumber } = params;
    const body = await request.json();

    const updates: any = {};
    if (typeof body.isBotPaused === 'boolean') {
      updates.isBotPaused = body.isBotPaused;
    }
    if (body.status && ['active', 'closed'].includes(body.status)) {
      updates.status = body.status;
    }

    const updated: any = await WhatsAppConversation.findOneAndUpdate(
      { phoneNumber },
      { $set: updates },
      { new: true }
    ).lean();

    return NextResponse.json({
      success: true,
      conversation: updated,
    });
  } catch (error: any) {
    console.error('Error updating conversation settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
