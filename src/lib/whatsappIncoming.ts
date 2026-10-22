import connectDB from '@/lib/database';
import WhatsAppConversation from '@/models/WhatsAppConversation';
import WhatsAppService from '@/lib/whatsapp';
import { handleUserMessage, getSession, setSession } from '@/lib/whatsappBot';
import Lead from '@/models/Lead';
import { logWebhookEvent } from '@/lib/webhookLogger';

export async function handleIncomingMessage(
  message: any,
  contactName: string,
  whatsappService: WhatsAppService
) {
  const fromNumber = message.from;
  const messageId = message.id;

  // Extract message content & media information
  const msgType = message.type || 'text';
  let textBody = '';
  let mediaId = '';
  let mimeType = '';
  let filename = '';
  let caption = '';

  if (msgType === 'text') {
    textBody = message.text?.body || '';
  } else if (msgType === 'image') {
    mediaId = message.image?.id || '';
    mimeType = message.image?.mime_type || 'image/jpeg';
    caption = message.image?.caption || '';
    textBody = caption || '[Image received]';
  } else if (msgType === 'document') {
    mediaId = message.document?.id || '';
    mimeType = message.document?.mime_type || 'application/pdf';
    filename = message.document?.filename || 'document.pdf';
    caption = message.document?.caption || '';
    textBody = caption ? `${caption} (${filename})` : `[Document: ${filename}]`;
  } else if (msgType === 'audio') {
    mediaId = message.audio?.id || '';
    mimeType = message.audio?.mime_type || 'audio/ogg';
    textBody = '[Voice note received]';
  } else if (msgType === 'video') {
    mediaId = message.video?.id || '';
    mimeType = message.video?.mime_type || 'video/mp4';
    caption = message.video?.caption || '';
    textBody = caption || '[Video received]';
  } else {
    textBody = `[${msgType} message]`;
  }

  const now = new Date();
  const windowExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  console.log(`📨 Incoming WhatsApp (${msgType}) from ${fromNumber} (${contactName}): "${textBody}"`);

  logWebhookEvent({
    type: 'INCOMING_POST',
    status: 'success',
    summary: `Incoming ${msgType} from ${contactName || fromNumber}: "${textBody.slice(0, 50)}"`,
    sender: fromNumber,
    messageText: textBody,
    messageId,
    payload: {
      msgType,
      mediaId,
      filename,
      mimeType,
      caption,
      message,
    },
  });

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

  const isBotPaused = Boolean(existingConvo?.isBotPaused);

  // If bot is paused (admin intervened), do not execute automated questionnaire bot
  let botResult: any = null;
  if (!isBotPaused) {
    botResult = handleUserMessage(
      textBody,
      existingConvo?.step,
      existingConvo?.enquiryData,
      contactName,
      fromNumber
    );

    // Store in in-memory session cache
    setSession(fromNumber, {
      step: botResult.step,
      enquiryData: botResult.enquiryData,
      contactName: contactName || existingConvo?.contactName || '',
      lastUserMessageAt: now,
    });
  }

  let createdLeadId: any = existingConvo?.leadId || null;

  // 3. Create lead in database when all details are gathered
  if (botResult?.isComplete && botResult.leadPayload && !createdLeadId && process.env.MONGODB_URI) {
    try {
      await connectDB();
      const leadDoc = await Lead.create(botResult.leadPayload);
      createdLeadId = leadDoc._id;
      console.log(`🎯 Lead created from WhatsApp: ${leadDoc.applicationNumber}`);
      logWebhookEvent({
        type: 'BOT_REPLY',
        status: 'success',
        summary: `🎉 New lead generated: ${leadDoc.applicationNumber} (${leadDoc.full_name})`,
        sender: fromNumber,
        payload: botResult.leadPayload,
      });
    } catch (leadErr: any) {
      console.error('Error creating lead from WhatsApp enquiry:', leadErr);
    }
  }

  // 4. Save/update conversation state in DB with media metadata
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      await WhatsAppConversation.findOneAndUpdate(
        { phoneNumber: fromNumber },
        {
          $set: {
            contactName: contactName || existingConvo?.contactName || undefined,
            lastMessageText: textBody,
            lastUserMessageAt: now,
            windowExpiresAt: windowExpiresAt,
            status: 'active',
            ...(botResult ? { step: botResult.step, enquiryData: botResult.enquiryData } : {}),
            ...(createdLeadId ? { leadId: createdLeadId } : {}),
          },
          $inc: { unreadAdminCount: 1 },
          $push: {
            messages: {
              messageId,
              direction: 'inbound',
              sender: 'user',
              type: msgType,
              text: textBody,
              mediaId: mediaId || undefined,
              mimeType: mimeType || undefined,
              filename: filename || undefined,
              caption: caption || undefined,
              status: 'delivered',
              timestamp: now,
            },
          },
        },
        { upsert: true, new: true }
      );
    } catch (dbError: any) {
      console.error('Database error storing WhatsApp conversation:', dbError);
    }
  }

  // 5. If bot is paused by admin, skip sending automated bot reply
  if (isBotPaused) {
    console.log(`🛑 Bot is paused for ${fromNumber} (Admin Intervention mode). Message queued for admin.`);
    logWebhookEvent({
      type: 'INCOMING_POST',
      status: 'info',
      summary: `Bot paused for ${fromNumber}. Admin intervention active.`,
      sender: fromNumber,
    });
    return;
  }

  // 6. Send automated bot response
  try {
    if (botResult?.replyText && whatsappService.isConfigured()) {
      const sendResult = await whatsappService.sendMessage(fromNumber, botResult.replyText);

      logWebhookEvent({
        type: 'BOT_REPLY',
        status: sendResult.success ? 'success' : 'error',
        summary: sendResult.success
          ? `Bot reply sent to ${fromNumber} (Step: ${botResult.step})`
          : `Failed to send bot reply to ${fromNumber}: ${sendResult.error}`,
        recipient: fromNumber,
        messageText: botResult.replyText,
        messageId: sendResult.messageId,
        payload: {
          step: botResult.step,
          enquiryData: botResult.enquiryData,
          replyText: botResult.replyText,
          sendResult,
        },
        error: sendResult.error,
      });

      if (sendResult.success && sendResult.messageId && process.env.MONGODB_URI) {
        await connectDB();
        await WhatsAppConversation.updateOne(
          { phoneNumber: fromNumber },
          {
            $push: {
              messages: {
                messageId: sendResult.messageId,
                direction: 'outbound',
                sender: 'bot',
                type: 'text',
                text: botResult.replyText,
                status: 'sent',
                timestamp: new Date(),
              },
            },
          }
        );
      }
    }
  } catch (replyError: any) {
    console.error('Error sending WhatsApp bot reply:', replyError);
    logWebhookEvent({
      type: 'ERROR',
      status: 'error',
      summary: `Failed to dispatch WhatsApp bot reply: ${replyError.message}`,
      recipient: fromNumber,
      error: { message: replyError.message, stack: replyError.stack },
    });
  }
}

export async function handleMessageStatus(status: any) {
  const messageId = status.id;
  const newStatus = status.status; // sent, delivered, read, failed

  logWebhookEvent({
    type: 'STATUS_UPDATE',
    status: newStatus === 'failed' ? 'error' : 'info',
    summary: `Receipt status: "${newStatus}" for message ${messageId ? messageId.slice(0, 20) + '...' : ''} (recipient: ${status.recipient_id || 'unknown'})`,
    recipient: status.recipient_id,
    messageId,
    payload: status,
    error: status.errors ? status.errors : undefined,
  });

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
