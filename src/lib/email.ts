// Resend Email notification service
// Sends email notifications to both admin and users

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

interface ResendResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

class ResendEmailService {
  private readonly adminEmail = process.env.ADMIN_EMAIL || 'admin@bankersdens.com';
  private readonly resendApiKey = process.env.RESEND_API_KEY;
  private readonly fromEmail = process.env.FROM_EMAIL || 'noreply@bankersdens.com';
  private readonly resendApiUrl = 'https://api.resend.com/emails';

  private formatEmail(email: string): string {
    // Basic email validation and formatting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
    return email.toLowerCase().trim();
  }

  async sendEmail(subject: string, html: string, to: string): Promise<boolean> {
    try {
      const formattedEmail = this.formatEmail(to);
      
      // Debug logging
      console.log(`🔍 Debug - Admin email from env: ${process.env.ADMIN_EMAIL}`);
      console.log(`🔍 Debug - Admin email used: ${this.adminEmail}`);
      console.log(`🔍 Debug - Recipient: ${formattedEmail}`);
      
      // Development mode - log to console
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 Email to ${formattedEmail}:`);
        console.log(`Subject: ${subject}`);
        console.log(`HTML: ${html}`);
        console.log('---');
        
        // If Resend API key is configured, also try to send the email
        if (this.resendApiKey) {
          console.log('🚀 Resend API key found, attempting to send email...');
          // Continue to production logic below
        } else {
          console.log('⚠️ Resend API key not configured, email only logged');
          return true;
        }
      }
      
      // Production mode - Resend Email API
      if (!this.resendApiKey) {
        console.error('❌ Resend API key not configured');
        return false;
      }

      const response = await fetch(this.resendApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [formattedEmail],
          subject: subject,
          html: html
        })
      });
      
      if (response.ok) {
        const result: ResendResponse = await response.json();
        console.log(`✅ Email sent to ${formattedEmail}:`, result.id);
        return true;
      } else {
        const error = await response.text();
        console.error(`❌ Failed to send email to ${formattedEmail}:`, error);
        return false;
      }
      
    } catch (error) {
      console.error('Resend email service error:', error);
      return false;
    }
  }

  async sendToMultiple(subject: string, html: string, recipients: string[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const sent = await this.sendEmail(subject, html, recipient);
      if (sent) {
        success++;
      } else {
        failed++;
      }
      
      // Add small delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return { success, failed };
  }

  // Format loan application email for admin with enhanced lead info
  formatLoanApplicationEmailForAdmin(data: any, applicationNumber: string): { subject: string; html: string } {
    const subject = `🏦 New Loan Application - ${data.full_name} - ${applicationNumber}`;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Loan Application</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; }
            .info-label { font-weight: bold; color: #555; }
            .info-value { color: #333; margin-top: 5px; }
            .actions { background: #e8f4fd; padding: 20px; border-radius: 8px; margin-top: 30px; }
            .actions h3 { color: #0066cc; margin-top: 0; }
            .phone-link { color: #0066cc; text-decoration: none; font-weight: bold; }
            .phone-link:hover { text-decoration: underline; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏦 NEW LOAN APPLICATION</h1>
                <p>Banker's Den - Lead Notification</p>
            </div>
            
            <div class="section">
                <h3>📋 Application Details</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Application ID</div>
                        <div class="info-value">${applicationNumber}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Loan Type</div>
                        <div class="info-value">${data.loanType?.toUpperCase() || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Loan Amount</div>
                        <div class="info-value">₹${data.loanAmount?.toLocaleString('en-IN') || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Submitted</div>
                        <div class="info-value">${new Date().toLocaleString('en-IN')}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h3>👤 Applicant Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Name</div>
                        <div class="info-value">${data.full_name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div class="info-value"><a href="tel:+91${data.phone}" class="phone-link">+91 ${data.phone}</a></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value"><a href="mailto:${data.email}" class="phone-link">${data.email}</a></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">PAN Number</div>
                        <div class="info-value">${data.panNumber || 'N/A'}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h3>💼 Financial Profile</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Monthly Income</div>
                        <div class="info-value">₹${data.monthlyIncome?.toLocaleString('en-IN') || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Employment Type</div>
                        <div class="info-value">${data.employmentType || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Company</div>
                        <div class="info-value">${data.companyName || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Experience</div>
                        <div class="info-value">${data.workExperience || 'N/A'} years</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h3>📍 Location Details</h3>
                <div class="info-item">
                    <div class="info-label">Address</div>
                    <div class="info-value">${data.address || 'N/A'}, ${data.city || 'N/A'}, ${data.state || 'N/A'} - ${data.pincode || 'N/A'}</div>
                </div>
            </div>

            <div class="actions">
                <h3>🎯 Next Actions Required</h3>
                <ol>
                    <li><strong>Call Customer:</strong> <a href="tel:+91${data.phone}" class="phone-link">+91 ${data.phone}</a></li>
                    <li><strong>Send Documents Checklist</strong></li>
                    <li><strong>Schedule Verification Call</strong></li>
                    <li><strong>Update Status in Admin Panel</strong></li>
                </ol>
                <p><strong>Priority:</strong> Contact within 2 hours for best conversion rate</p>
            </div>

            <div class="footer">
                <p>🌐 <strong>Banker's Den</strong> | <a href="https://bankersdens.com/admin" class="phone-link">Admin Dashboard</a></p>
                <p>This is an automated notification from your loan application system.</p>
            </div>
        </div>
    </body>
    </html>`;

    return { subject, html };
  }

  // Format loan application confirmation email for applicant
  formatLoanApplicationEmailForApplicant(data: any, applicationNumber: string): { subject: string; html: string } {
    const subject = `✅ Loan Application Received - ${applicationNumber} - Banker's Den`;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Received</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .section h3 { color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 5px; }
            .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 15px 0; }
            .steps { background: #e8f5e8; padding: 20px; border-radius: 8px; }
            .steps ol { margin: 0; padding-left: 20px; }
            .steps li { margin-bottom: 8px; }
            .contact-info { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; }
            .phone-link { color: #0066cc; text-decoration: none; font-weight: bold; }
            .phone-link:hover { text-decoration: underline; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
            .success-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="success-icon">🎉</div>
                <h1>Application Received Successfully!</h1>
                <p>Thank you for choosing Banker's Den</p>
            </div>
            
            <p>Dear <strong>${data.full_name}</strong>,</p>
            
            <p>Your ${data.loanType || 'loan'} application has been successfully submitted and is now being processed by our expert team.</p>

            <div class="section">
                <h3>📋 Your Application Summary</h3>
                <div class="info-box">
                    <p><strong>Application ID:</strong> ${applicationNumber}</p>
                    <p><strong>Loan Type:</strong> ${data.loanType?.toUpperCase() || 'N/A'}</p>
                    <p><strong>Loan Amount:</strong> ₹${data.loanAmount?.toLocaleString('en-IN') || 'N/A'}</p>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div class="section">
                <h3>📞 What Happens Next</h3>
                <div class="steps">
                    <ol>
                        <li><strong>Expert Review:</strong> Our loan expert will review your application within 2 hours</li>
                        <li><strong>Document Verification:</strong> We'll verify your PAN, salary slips, and bank statements</li>
                        <li><strong>Approval Process:</strong> Complete evaluation within 24-48 hours</li>
                        <li><strong>Disbursement:</strong> Quick disbursement after approval</li>
                    </ol>
                </div>
            </div>

            <div class="contact-info">
                <h3>📱 Stay Connected</h3>
                <p><strong>Save our contact details:</strong></p>
                <p>📞 Phone: <a href="tel:+919145023840" class="phone-link">+91 9145023840</a></p>
                <p>📧 Email: <a href="mailto:support@bankersdens.com" class="phone-link">support@bankersdens.com</a></p>
                <p><strong>Our team will contact you shortly with updates!</strong></p>
            </div>

            <div class="section">
                <h3>🎯 Need Immediate Assistance?</h3>
                <p>If you have any questions or need immediate help, please don't hesitate to contact us:</p>
                <p>📞 Call us at <a href="tel:+919145023840" class="phone-link">+91 9145023840</a></p>
                <p>📧 Email us at <a href="mailto:support@bankersdens.com" class="phone-link">support@bankersdens.com</a></p>
            </div>

            <div class="footer">
                <p><strong>Thank you for choosing Banker's Den!</strong></p>
                <p>🌐 Visit us at <a href="https://bankersdens.com" class="phone-link">bankersdens.com</a></p>
                <p>This is an automated confirmation email. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>`;

    return { subject, html };
  }

  // Format contact form email for admin with enhanced lead info
  formatContactEmailForAdmin(data: any): { subject: string; html: string } {
    const subject = `📞 New Contact Inquiry - ${data.full_name} - ${data.category}`;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Inquiry</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .section h3 { color: #17a2b8; border-bottom: 2px solid #17a2b8; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8; }
            .info-label { font-weight: bold; color: #555; }
            .info-value { color: #333; margin-top: 5px; }
            .message-box { background: #e8f4fd; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; }
            .actions { background: #fff3cd; padding: 20px; border-radius: 8px; margin-top: 30px; }
            .actions h3 { color: #856404; margin-top: 0; }
            .phone-link { color: #0066cc; text-decoration: none; font-weight: bold; }
            .phone-link:hover { text-decoration: underline; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📞 NEW CONTACT INQUIRY</h1>
                <p>Banker's Den - Customer Support</p>
            </div>
            
            <div class="section">
                <h3>👤 Contact Details</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Name</div>
                        <div class="info-value">${data.full_name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div class="info-value"><a href="tel:+91${data.phone}" class="phone-link">+91 ${data.phone}</a></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value"><a href="mailto:${data.email}" class="phone-link">${data.email}</a></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Category</div>
                        <div class="info-value">${data.category}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h3>💬 Customer Message</h3>
                <div class="message-box">
                    <p><strong>Subject:</strong> ${data.category}</p>
                    <p><strong>Message:</strong></p>
                    <p>"${data.message}"</p>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div class="actions">
                <h3>🎯 Next Actions Required</h3>
                <ol>
                    <li><strong>Call Customer:</strong> <a href="tel:+91${data.phone}" class="phone-link">+91 ${data.phone}</a></li>
                    <li><strong>Address Inquiry:</strong> ${data.category}</li>
                    <li><strong>Follow up within 2 hours</strong></li>
                    <li><strong>Send detailed response via email</strong></li>
                </ol>
                <p><strong>Priority:</strong> Respond within 2 hours for best customer satisfaction</p>
            </div>

            <div class="footer">
                <p>🌐 <strong>Banker's Den</strong> | <a href="https://bankersdens.com/admin" class="phone-link">Admin Dashboard</a></p>
                <p>This is an automated notification from your contact form system.</p>
            </div>
        </div>
    </body>
    </html>`;

    return { subject, html };
  }

  // Format contact form confirmation email for user
  formatContactEmailForUser(data: any): { subject: string; html: string } {
    const subject = `✅ Message Received - We'll Contact You Soon - Banker's Den`;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Received</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .section h3 { color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 5px; }
            .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 15px 0; }
            .steps { background: #e8f5e8; padding: 20px; border-radius: 8px; }
            .contact-info { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; }
            .phone-link { color: #0066cc; text-decoration: none; font-weight: bold; }
            .phone-link:hover { text-decoration: underline; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
            .success-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="success-icon">✅</div>
                <h1>Message Received Successfully!</h1>
                <p>Thank you for contacting Banker's Den</p>
            </div>
            
            <p>Dear <strong>${data.full_name}</strong>,</p>
            
            <p>Your inquiry has been received successfully and our expert team will get back to you shortly.</p>

            <div class="section">
                <h3>📋 Your Message Summary</h3>
                <div class="info-box">
                    <p><strong>Category:</strong> ${data.category}</p>
                    <p><strong>Your Message:</strong></p>
                    <p>"${data.message}"</p>
                    <p><strong>Received:</strong> ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div class="section">
                <h3>📞 What's Next</h3>
                <div class="steps">
                    <ul>
                        <li><strong>Expert Review:</strong> Our specialist will review your inquiry within 2 hours</li>
                        <li><strong>Personalized Response:</strong> You'll receive a detailed response tailored to your needs</li>
                        <li><strong>Direct Contact:</strong> We'll call you on <strong>+91 ${data.phone}</strong> if needed</li>
                        <li><strong>Follow-up Support:</strong> Ongoing assistance until your query is resolved</li>
                    </ul>
                </div>
            </div>

            <div class="contact-info">
                <h3>📱 Stay Connected</h3>
                <p><strong>Need immediate assistance? Contact us:</strong></p>
                <p>📞 Phone: <a href="tel:+919145023840" class="phone-link">+91 9145023840</a></p>
                <p>📧 Email: <a href="mailto:support@bankersdens.com" class="phone-link">support@bankersdens.com</a></p>
                <p><strong>Our team is ready to help you!</strong></p>
            </div>

            <div class="footer">
                <p><strong>Thank you for contacting Banker's Den!</strong></p>
                <p>🌐 Visit us at <a href="https://bankersdens.com" class="phone-link">bankersdens.com</a></p>
                <p>This is an automated confirmation email. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>`;

    return { subject, html };
  }

  // Send loan application notification to both admin and applicant
  async notifyLoanApplication(data: any, applicationNumber: string): Promise<{ adminSent: boolean; applicantSent: boolean }> {
    // Send email to admin
    const adminEmail = this.formatLoanApplicationEmailForAdmin(data, applicationNumber);
    const adminSent = await this.sendEmail(adminEmail.subject, adminEmail.html, this.adminEmail);
    
    // Send confirmation email to applicant
    let applicantSent = false;
    if (data.email) {
      const applicantEmail = this.formatLoanApplicationEmailForApplicant(data, applicationNumber);
      applicantSent = await this.sendEmail(applicantEmail.subject, applicantEmail.html, data.email);
    }
    
    return { adminSent, applicantSent };
  }

  // Send contact form notification to both admin and user
  async notifyContactForm(data: any): Promise<{ adminSent: boolean; userSent: boolean }> {
    // Send email to admin
    const adminEmail = this.formatContactEmailForAdmin(data);
    const adminSent = await this.sendEmail(adminEmail.subject, adminEmail.html, this.adminEmail);
    
    // Send confirmation email to user
    let userSent = false;
    if (data.email) {
      const userEmail = this.formatContactEmailForUser(data);
      userSent = await this.sendEmail(userEmail.subject, userEmail.html, data.email);
    }
    
    return { adminSent, userSent };
  }

  // Send custom email to user
  async notifyUser(subject: string, html: string, email: string): Promise<boolean> {
    return await this.sendEmail(subject, html, email);
  }
}

export default ResendEmailService;