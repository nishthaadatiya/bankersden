import { NextRequest, NextResponse } from 'next/server';
import WhatsAppService from '@/lib/whatsapp';
import { logWebhookEvent } from '@/lib/webhookLogger';
import { handleIncomingMessage, handleMessageStatus } from '@/lib/whatsappIncoming';

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
      logWebhookEvent({
        type: 'VERIFICATION_GET',
        status: 'success',
        summary: `Webhook verified successfully (challenge: ${challenge})`,
        payload: { mode, token, challenge },
      });
      console.log('✅ WhatsApp webhook verified successfully');
      return new NextResponse(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    logWebhookEvent({
      type: 'VERIFICATION_GET',
      status: 'error',
      summary: `Webhook verification failed. Received token: "${token || 'none'}", Expected: "${expectedToken || 'none'}"`,
      payload: { mode, token, expectedToken, challenge },
    });
    console.error('❌ WhatsApp webhook verification failed. Token mismatch.');
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
  } catch (error: any) {
    logWebhookEvent({
      type: 'ERROR',
      status: 'error',
      summary: `Webhook GET error: ${error.message}`,
      error: { message: error.message, stack: error.stack },
    });
    console.error('WhatsApp webhook GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    logWebhookEvent({
      type: 'INCOMING_POST',
      status: 'info',
      summary: `Meta Webhook POST event received (object: ${body.object || 'unknown'})`,
      payload: body,
    });

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
  } catch (error: any) {
    logWebhookEvent({
      type: 'ERROR',
      status: 'error',
      summary: `Webhook POST error: ${error.message}`,
      error: { message: error.message, stack: error.stack },
    });
    console.error('WhatsApp webhook POST error:', error);
    // Always return 200 to Meta so it does not flood retries on payload errors
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 200 });
  }
}