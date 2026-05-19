import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Lead from '@/models/Lead';
import ResendEmailService from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { full_name, email, phone, category, message } = await request.json();
    const applicationNumber = `CT${Date.now()}`;

    await connectDB();

    // Save to database
    const lead = new Lead({
      applicationNumber,
      type: 'contact',
      full_name,
      email,
      phone,
      category: category || 'general',
      message,
      status: 'active'
    });
    await lead.save();

    // Send email notifications to both admin and user
    try {
      const emailService = new ResendEmailService();
      const notificationResult = await emailService.notifyContactForm({ full_name, email, phone, category, message });
      
      console.log('Email notifications:', {
        adminSent: notificationResult.adminSent,
        userSent: notificationResult.userSent
      });
    } catch (emailError) {
      console.error('Email sending failed, but form saved:', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully', 
      applicationNumber 
    });
  } catch (error) {
    console.error('Error sending contact form:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Failed to send message', error: errorMessage },
      { status: 500 }
    );
  }
}