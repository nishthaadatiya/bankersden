import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Lead from '@/models/Lead';
import ResendEmailService from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const applicationNumber = `LA${Date.now()}`;

    await connectDB();

    // Save to database
    const lead = new Lead({
      applicationNumber,
      type: 'loan',
      status: 'active',
      ...formData
    });
    await lead.save();

    // Send email notifications to both admin and applicant
    const emailService = new ResendEmailService();
    const notificationResult = await emailService.notifyLoanApplication(formData, applicationNumber);
    
    console.log('Email notifications:', {
      adminSent: notificationResult.adminSent,
      applicantSent: notificationResult.applicantSent,
      applicantPhone: formData.phone
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationNumber 
    });
  } catch (error) {
    console.error('Error submitting loan application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}