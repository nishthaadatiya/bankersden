import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Facebook Meta WhatsApp Webhook endpoint
// This handles incoming messages and delivery receipts

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Verify webhook
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log('✅ WhatsApp webhook verified successfully');
      return new NextResponse(challenge, { status: 200 });
    } else {
      console.error('❌ WhatsApp webhook verification failed');
      return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
    }
  } catch (error) {
    console.error('WhatsApp webhook GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log incoming webhook data
    console.log('📱 WhatsApp webhook received:', JSON.stringify(body, null, 2));

    // Process webhook data
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            const value = change.value;
            
            // Handle incoming messages
            if (value.messages) {
              for (const message of value.messages) {
                await handleIncomingMessage(message, value.contacts?.[0], value.metadata);
              }
            }
            
            // Handle message status updates (delivered, read, etc.)
            if (value.statuses) {
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleIncomingMessage(message: any, contact: any, metadata: any) {
  try {
    console.log('📨 Incoming WhatsApp message:', {
      from: message.from,
      id: message.id,
      timestamp: message.timestamp,
      type: message.type,
      text: message.text?.body,
      contact: contact?.profile?.name
    });

    // Here you can implement auto-responses or forward messages to admin
    // For example, send an auto-reply for business hours
    
    const currentHour = new Date().getHours();
    const isBusinessHours = currentHour >= 9 && currentHour <= 18;
    
    if (!isBusinessHours && message.type === 'text') {
      // Send auto-reply for after hours
      const autoReply = `🏦 *Banker's Den - Auto Reply*

Thank you for contacting us! 

⏰ Our business hours are 9 AM to 6 PM, Monday to Saturday.

📞 For urgent queries:
• WhatsApp: ${process.env.ADMIN_WHATSAPP}
• Email: info@bankersdens.com

We'll respond to your message during business hours.`;

      // You can implement auto-reply logic here
      console.log('🤖 Auto-reply would be sent:', autoReply);
    }
    
  } catch (error) {
    console.error('Error handling incoming message:', error);
  }
}

async function handleMessageStatus(status: any) {
  try {
    console.log('📊 Message status update:', {
      id: status.id,
      status: status.status,
      timestamp: status.timestamp,
      recipient_id: status.recipient_id
    });

    // You can track message delivery status here
    // Update database with delivery status if needed
    
  } catch (error) {
    console.error('Error handling message status:', error);
  }
}