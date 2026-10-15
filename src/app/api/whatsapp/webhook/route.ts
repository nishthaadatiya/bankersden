import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import WhatsAppConversation from '@/models/WhatsAppConversation';
import WhatsAppService from '@/lib/whatsapp';
import { handleUserMessage, getSession, setSession } from '@/lib/whatsappBot';
import Lead from '@/models/Lead';

export const dynamic = 'force-dynamic';

// Facebook Meta WhatsApp Webhook endpoint
// Handles webhook verification, incoming user messages (opens 24h window), and status updates

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

    // Verify webhook subscription from Meta
    if (mode === 'subscribe' && token === expectedToken) {
      console.log('✅ WhatsApp webhook verified successfully');
      return new NextResponse(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    console.error('❌ WhatsApp webhook verification failed. Token mismatch.');
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
  } catch (error) {
    console.error('WhatsApp webhook GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.object === 'whatsapp_business_account') {
      const whatsappService = new WhatsAppService();

      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            const value = change.value;

            // 1. Handle incoming user messages (starts/renews 24-hour window)
            if (value.messages && value.messages.length > 0) {
              const contact = value.contacts?.[0];
              const contactName = contact?.profile?.name || '';

              for (const message of value.messages) {
                await handleIncomingMessage(message, contactName, whatsappService);
              }
            }

            // 2. Handle message delivery receipts (sent, delivered, read, failed)
            if (value.statuses && value.statuses.length > 0) {
              for (const status of value.statuses) {
                await handleMessageStatus(status);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('WhatsApp webhook POST error:', error);
    // Always return 200 to Meta so it does not flood retries on payload errors
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 200 });
  }
}

async function handleIncomingMessage(
  message: any,
  contactName: string,
  whatsappService: WhatsAppService
) {
  const fromNumber = message.from;
  const messageId = message.id;
  const textBody =
    message.type === 'text'
      ? message.text?.body || ''
      : `[${message.type || 'media'} received]`;

  const now = new Date();
  const windowExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  console.log(`📨 Incoming WhatsApp from ${fromNumber} (${contactName}): "${textBody}"`);

  // 1. Fetch existing conversation state (in-memory cache + DB fallback)
  const cached = getSession(fromNumber);

  let existingConvo: any = cached || null;
  if (!existingConvo && process.env.MONGODB_URI) {
    try {
      await connectDB();
      existingConvo = await WhatsAppConversation.findOne({ phoneNumber: fromNumber });
    } catch (dbErr) {
      console.error('Database error fetching conversation:', dbErr);
    }
  }

  // 2. Execute rule-based flow (whatsapp.md)
  const botResult = handleUserMessage(
    textBody,
    existingConvo?.step,
    existingConvo?.enquiryData,
    contactName,
    fromNumber
  );

  // Store in in-memory session cache so multi-turn conversation persists across all requests
  setSession(fromNumber, {
    step: botResult.step,
    enquiryData: botResult.enquiryData,
    contactName: contactName || existingConvo?.contactName || '',
    lastUserMessageAt: now,
  });

  let createdLeadId: any = existingConvo?.leadId || null;

  // 3. Create lead in database when all details are gathered
  if (botResult.isComplete && botResult.leadPayload && !createdLeadId && process.env.MONGODB_URI) {
    try {
      await connectDB();
      const leadDoc = await Lead.create(botResult.leadPayload);
      createdLeadId = leadDoc._id;
      console.log(`🎯 Lead created from WhatsApp: ${leadDoc.applicationNumber}`);
    } catch (leadErr) {
      console.error('Error creating lead from WhatsApp enquiry:', leadErr);
    }
  }

  // 4. Save/update conversation state in DB
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      await WhatsAppConversation.findOneAndUpdate(
        { phoneNumber: fromNumber },
        {
          $set: {
            contactName: contactName || undefined,
            lastMessageText: textBody,
            lastUserMessageAt: now,
            windowExpiresAt: windowExpiresAt,
            status: 'active',
            step: botResult.step,
            enquiryData: botResult.enquiryData,
            ...(createdLeadId ? { leadId: createdLeadId } : {}),
          },
          $push: {
            messages: {
              messageId,
              direction: 'inbound',
              text: textBody,
              status: 'delivered',
              timestamp: now,
            },
          },
        },
        { upsert: true, new: true }
      );
    } catch (dbError) {
      console.error('Database error storing WhatsApp conversation:', dbError);
    }
  }

  // 5. Send automated bot response
  try {
    if (whatsappService.isConfigured()) {
      const sendResult = await whatsappService.sendMessage(fromNumber, botResult.replyText);

      if (sendResult.success && sendResult.messageId && process.env.MONGODB_URI) {
        await connectDB();
        await WhatsAppConversation.updateOne(
          { phoneNumber: fromNumber },
          {
            $push: {
              messages: {
                messageId: sendResult.messageId,
                direction: 'outbound',
                text: botResult.replyText,
                status: 'sent',
                timestamp: new Date(),
              },
            },
          }
        );
      }
    } else {
      console.log('ℹ️ WhatsApp credentials not configured. Reply generated:', botResult.replyText);
    }
  } catch (replyError) {
    console.error('Error sending WhatsApp bot reply:', replyError);
  }
}

async function handleMessageStatus(status: any) {
  const messageId = status.id;
  const newStatus = status.status; // sent, delivered, read, failed

  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      await WhatsAppConversation.updateOne(
        { 'messages.messageId': messageId },
        {
          $set: {
            'messages.$.status': newStatus,
          },
        }
      );
    }
  } catch (dbError) {
    console.error('Database error updating WhatsApp message status:', dbError);
  }
}