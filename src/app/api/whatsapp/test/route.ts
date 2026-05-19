import { NextRequest, NextResponse } from 'next/server';
import ResendEmailService from '@/lib/email';

export const dynamic = 'force-dynamic';

// Test endpoint for Resend Email API
// Use this to test your email integration

export async function POST(request: NextRequest) {
  try {
    const { email, subject, message } = await request.json();
    
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Email, subject, and message are required' },
        { status: 400 }
      );
    }

    const emailService = new ResendEmailService();
    
    // Test email with HTML formatting
    const htmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧪 Test Email</h1>
                <p>Banker's Den - Email Service Test</p>
            </div>
            <p><strong>Test Message:</strong></p>
            <p>${message}</p>
            <p><strong>Sent:</strong> ${new Date().toLocaleString('en-IN')}</p>
            <p>🌐 <a href="https://bankersdens.com">bankersdens.com</a></p>
        </div>
    </body>
    </html>`;
    
    const success = await emailService.sendEmail(subject, htmlMessage, email);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully',
        email: email,
        adminEmail: process.env.ADMIN_EMAIL
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Test API configuration
    const config = {
      resendApiKey: process.env.RESEND_API_KEY ? '✅ Configured' : '❌ Missing',
      fromEmail: process.env.FROM_EMAIL ? '✅ Configured' : '❌ Missing',
      adminEmail: process.env.ADMIN_EMAIL || 'Not set',
      nodeEnv: process.env.NODE_ENV || 'Not set'
    };

    // Test email service instantiation
    const emailService = new ResendEmailService();

    return NextResponse.json({
      message: 'Resend Email API Configuration Status',
      config,
      ready: config.resendApiKey.includes('✅') && config.fromEmail.includes('✅'),
      debug: {
        resendApiKeyLength: process.env.RESEND_API_KEY?.length || 0,
        fromEmail: process.env.FROM_EMAIL,
        adminEmailFromEnv: process.env.ADMIN_EMAIL,
        currentTime: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Email config check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}