import { NextRequest, NextResponse } from 'next/server';
import WhatsAppService from '@/lib/whatsapp';
import connectDB from '@/lib/database';
import WhatsAppConversation from '@/models/WhatsAppConversation';

export const dynamic = 'force-dynamic';

// GET: Check WhatsApp configuration and active 24h windows
export async function GET() {
  try {
    const whatsappService = new WhatsAppService();

    const config = {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ? '✅ Configured' : '❌ Missing',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN ? '✅ Configured' : '❌ Missing',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ? '✅ Configured' : '❌ Missing',
      adminWhatsApp: process.env.ADMIN_WHATSAPP || 'Not set',
      isReady: whatsappService.isConfigured(),
    };

    let activeWindows: any[] = [];
    if (process.env.MONGODB_URI) {
      try {
        await connectDB();
        const convos = await WhatsAppConversation.find({
          windowExpiresAt: { $gt: new Date() },
        })
          .sort({ windowExpiresAt: -1 })
          .limit(10)
          .lean();

        activeWindows = convos.map((c: any) => ({
          phoneNumber: c.phoneNumber,
          contactName: c.contactName,
          lastUserMessageAt: c.lastUserMessageAt,
          windowExpiresAt: c.windowExpiresAt,
          hoursRemaining: (
            (new Date(c.windowExpiresAt).getTime() - Date.now()) /
            (1000 * 60 * 60)
          ).toFixed(1),
        }));
      } catch (dbErr) {
        console.error('Error fetching active windows:', dbErr);
      }
    }

    const inMemorySessions = Array.from(global.whatsAppSessionCache?.entries() || []).map(
      ([phone, s]) => ({ phone, step: s.step, data: s.enquiryData })
    );

    return NextResponse.json({
      service: 'Meta WhatsApp Business API',
      config,
      inMemorySessions,
      active24HourWindows: activeWindows,
      webhookUrl: '/api/whatsapp/webhook',
    });
  } catch (error: any) {
    console.error('WhatsApp config check error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Send test WhatsApp text message (works within 24h window)
export async function POST(request: NextRequest) {
  try {
    const { phone, message } = await request.json();

    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    const whatsappService = new WhatsAppService();
    if (!whatsappService.isConfigured()) {
      return NextResponse.json(
        {
          error:
            'WhatsApp API credentials missing. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in .env',
        },
        { status: 400 }
      );
    }

    // Check if 24h window is open in DB
    let windowStatus = 'unknown';
    if (process.env.MONGODB_URI) {
      try {
        await connectDB();
        const convo = await WhatsAppConversation.findOne({
          phoneNumber: phone.replace(/\D/g, ''),
        });
        if (convo) {
          const isOpen = WhatsAppService.isWindowOpen(convo.windowExpiresAt);
          windowStatus = isOpen ? 'open (< 24h)' : 'expired (> 24h)';
        }
      } catch (err) {
        console.error('Failed to check window status:', err);
      }
    }

    const result = await whatsappService.sendMessage(phone, message);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'WhatsApp message sent successfully',
        messageId: result.messageId,
        recipient: phone,
        customerServiceWindow: windowStatus,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          details: result.details,
          customerServiceWindow: windowStatus,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('WhatsApp test send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}