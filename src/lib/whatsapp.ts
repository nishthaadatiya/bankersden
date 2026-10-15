export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: any;
}

export class WhatsAppService {
  private phoneNumberId: string;
  private accessToken: string;
  private apiVersion: string;

  constructor() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.apiVersion = process.env.WHATSAPP_API_VERSION || 'v21.0';
  }

  isConfigured(): boolean {
    return Boolean(this.phoneNumberId && this.accessToken);
  }

  /**
   * Send a standard freeform text message via Meta WhatsApp Cloud API.
   * Can be sent within the 24-hour customer service window initiated by user message.
   */
  async sendMessage(to: string, text: string): Promise<WhatsAppSendResult> {
    if (!this.isConfigured()) {
      console.warn('⚠️ WhatsApp API not configured: missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN');
      return {
        success: false,
        error: 'WhatsApp service not configured in environment variables.',
      };
    }

    // Clean phone number (strip non-digits, plus signs)
    const sanitizedTo = to.replace(/\D/g, '');

    const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: sanitizedTo,
      type: 'text',
      text: {
        preview_url: false,
        body: text,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Meta WhatsApp API error:', data);
        return {
          success: false,
          error: data.error?.message || 'Meta API returned an error',
          details: data.error,
        };
      }

      const messageId = data.messages?.[0]?.id;
      console.log(`✅ WhatsApp message sent to ${sanitizedTo}. Message ID: ${messageId}`);

      return {
        success: true,
        messageId,
        details: data,
      };
    } catch (err: any) {
      console.error('❌ WhatsApp network/fetch error:', err);
      return {
        success: false,
        error: err.message || 'Unknown network error',
      };
    }
  }

  /**
   * Welcome response triggered when a user sends "Hi" or initiates a chat.
   */
  async sendWelcomeResponse(to: string, name?: string): Promise<WhatsAppSendResult> {
    const greetingName = name?.trim() ? ` ${name.trim()}` : '';
    const welcomeText = `👋 Hello${greetingName}! Welcome to Banker's Den.

We received your message! Our direct support connection is now open for the next 24 hours.

How can we help you today?
1️⃣ Home Loan
2️⃣ Personal Loan
3️⃣ Business Loan
4️⃣ Speak to a Banker

Reply here and our loan advisor will assist you directly.`;

    return this.sendMessage(to, welcomeText);
  }

  /**
   * Helper to verify if a 24h window timestamp is still active.
   */
  static isWindowOpen(windowExpiresAt: Date | string | null | undefined): boolean {
    if (!windowExpiresAt) return false;
    return new Date() < new Date(windowExpiresAt);
  }
}

export default WhatsAppService;
