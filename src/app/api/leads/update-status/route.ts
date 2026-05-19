import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Lead from '@/models/Lead';
import ResendEmailService from '@/lib/email';

export const dynamic = 'force-dynamic';

// Update lead status and send email notification
export async function POST(request: NextRequest) {
  try {
    const { leadId, status, notes } = await request.json();
    
    if (!leadId || !status) {
      return NextResponse.json(
        { error: 'Lead ID and status are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update lead in database
    const lead = await Lead.findOne({ applicationNumber: leadId });
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    lead.status = status;
    if (notes) {
      lead.notes = notes;
    }
    lead.updatedAt = new Date();
    await lead.save();

    // Send status update to customer via email
    const emailService = new ResendEmailService();
    const statusMessage = formatStatusUpdateMessage(lead, status, notes);
    
    if (lead.email) {
      await emailService.sendEmail('Loan Status Update - Banker\'s Den', statusMessage, lead.email);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lead status updated and customer notified',
      leadId,
      status
    });
    
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function formatStatusUpdateMessage(lead: any, status: string, notes?: string): string {
  const statusMessages = {
    'processing': `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { background: #17a2b8; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 15px 0; }
            .phone-link { color: #0066cc; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔄 Application Update</h1>
                <p>Banker's Den</p>
            </div>
            <p>Dear <strong>${lead.full_name}</strong>,</p>
            <p>Your loan application is now being processed.</p>
            <div class="info-box">
                <p><strong>Application ID:</strong> ${lead.applicationNumber}</p>
                <p><strong>Current Status:</strong> Processing</p>
                <p><strong>Updated:</strong> ${new Date().toLocaleString('en-IN')}</p>
            </div>
            <h3>📞 Next Steps:</h3>
            <ul>
                <li>Document verification in progress</li>
                <li>Our team will contact you for any additional requirements</li>
                <li>Expected completion: 24-48 hours</li>
            </ul>
            ${notes ? `<p><strong>Note:</strong> ${notes}</p>` : ''}
            <p>For any queries, call <a href="tel:+919145023840" class="phone-link">+91 9145023840</a></p>
            <p>Thank you for your patience!</p>
            <p>🌐 <a href="https://bankersdens.com" class="phone-link">bankersdens.com</a></p>
        </div>
    </body>
    </html>`,

    'approved': `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .info-box { background: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 15px 0; }
            .phone-link { color: #0066cc; text-decoration: none; font-weight: bold; }
            .success-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="success-icon">🎉</div>
                <h1>Great News - Loan Approved!</h1>
                <p>Banker's Den</p>
            </div>
            <p>Dear <strong>${lead.full_name}</strong>,</p>
            <p><strong>Congratulations! Your loan application has been APPROVED!</strong></p>
            <div class="info-box">
                <p><strong>Loan Amount:</strong> ₹${lead.loanAmount?.toLocaleString('en-IN') || 'N/A'}</p>
                <p><strong>Status:</strong> APPROVED ✅</p>
                <p><strong>Approved:</strong> ${new Date().toLocaleString('en-IN')}</p>
            </div>
            <h3>📞 Next Steps:</h3>
            <ol>
                <li>Our executive will call you within 1 hour</li>
                <li>Final documentation and agreement signing</li>
                <li>Disbursement process initiation</li>
            </ol>
            ${notes ? `<p><strong>Special Instructions:</strong> ${notes}</p>` : ''}
            <p><strong>🎯 Ready for disbursement!</strong></p>
            <p>Call <a href="tel:+919145023840" class="phone-link">+91 9145023840</a></p>
            <p>Congratulations from Team Banker's Den! 🎉</p>
            <p>🌐 <a href="https://bankersdens.com" class="phone-link">bankersdens.com</a></p>
        </div>
    </body>
    </html>`,

    'rejected': `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { background: #dc3545; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .info-box { background: #f8d7da; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin: 15px 0; }
            .phone-link { color: #0066cc; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>❌ Application Status Update</h1>
                <p>Banker's Den</p>
            </div>
            <p>Dear <strong>${lead.full_name}</strong>,</p>
            <p>We regret to inform you that your loan application could not be approved at this time.</p>
            <div class="info-box">
                <p><strong>Application ID:</strong> ${lead.applicationNumber}</p>
                <p><strong>Status:</strong> Not Approved</p>
                <p><strong>Updated:</strong> ${new Date().toLocaleString('en-IN')}</p>
            </div>
            ${notes ? `<p><strong>Reason:</strong> ${notes}</p>` : ''}
            <h3>🔄 Alternative Options:</h3>
            <ul>
                <li>Reapply after 3 months</li>
                <li>Consider a different loan amount</li>
                <li>Improve credit score and reapply</li>
            </ul>
            <p>Our team is here to help you understand the decision and explore alternatives.</p>
            <p>Call <a href="tel:+919145023840" class="phone-link">+91 9145023840</a></p>
            <p>Thank you for choosing Banker's Den.</p>
            <p>🌐 <a href="https://bankersdens.com" class="phone-link">bankersdens.com</a></p>
        </div>
    </body>
    </html>`,

    'completed': `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .info-box { background: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 15px 0; }
            .phone-link { color: #0066cc; text-decoration: none; font-weight: bold; }
            .success-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="success-icon">🎉</div>
                <h1>Loan Disbursed Successfully!</h1>
                <p>Banker's Den</p>
            </div>
            <p>Dear <strong>${lead.full_name}</strong>,</p>
            <p><strong>✅ Your loan has been successfully disbursed!</strong></p>
            <div class="info-box">
                <p><strong>Application:</strong> ${lead.applicationNumber}</p>
                <p><strong>Amount:</strong> ₹${lead.loanAmount?.toLocaleString('en-IN') || 'N/A'}</p>
                <p><strong>Status:</strong> COMPLETED ✅</p>
                <p><strong>Disbursed:</strong> ${new Date().toLocaleString('en-IN')}</p>
            </div>
            <h3>📱 Important:</h3>
            <ul>
                <li>Check your bank account for the credited amount</li>
                <li>EMI details will be shared separately</li>
                <li>Keep all loan documents safe</li>
            </ul>
            ${notes ? `<p><strong>Note:</strong> ${notes}</p>` : ''}
            <p><strong>🙏 Thank you for choosing Banker's Den!</strong></p>
            <p>For any support, call <a href="tel:+919145023840" class="phone-link">+91 9145023840</a></p>
            <p>🌐 <a href="https://bankersdens.com" class="phone-link">bankersdens.com</a></p>
        </div>
    </body>
    </html>`
  };

  return statusMessages[status as keyof typeof statusMessages] || 
    `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { background: #6c757d; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .phone-link { color: #0066cc; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📋 Status Update</h1>
                <p>Banker's Den</p>
            </div>
            <p>Dear <strong>${lead.full_name}</strong>,</p>
            <p>Your application status has been updated.</p>
            <p><strong>Status:</strong> ${status.toUpperCase()}</p>
            <p><strong>Updated:</strong> ${new Date().toLocaleString('en-IN')}</p>
            ${notes ? `<p><strong>Note:</strong> ${notes}</p>` : ''}
            <p>For queries, call <a href="tel:+919145023840" class="phone-link">+91 9145023840</a></p>
            <p>🌐 <a href="https://bankersdens.com" class="phone-link">bankersdens.com</a></p>
        </div>
    </body>
    </html>`;
}