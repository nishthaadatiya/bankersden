import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Banker\'s Den',
  description: 'Privacy Policy for Banker\'s Den - How we collect, use, and protect your personal information including email communications.',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> December 17, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Banker's Den ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://bankersdens.com" className="text-blue-600 hover:underline">bankersdens.com</a> and use our services, including our email communication services.
              </p>
              <p className="text-gray-700">
                By using our services, you consent to the data practices described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">We collect personal information that you voluntarily provide to us when:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Filling out loan application forms</li>
                <li>Contacting us through our contact form</li>
                <li>Communicating with us via email</li>
                <li>Using our EMI calculators and other tools</li>
              </ul>

              <p className="text-gray-700 mb-4">This information may include:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Address and location details</li>
                <li>Employment information</li>
                <li>Financial information (income, loan amount, etc.)</li>
                <li>PAN number and other identification details</li>
                <li>Company name and work experience</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Email Communication Data</h3>
              <p className="text-gray-700 mb-4">When you communicate with us via email, we collect:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Your email address</li>
                <li>Email content and messages you send to us</li>
                <li>Email delivery and read receipts</li>
                <li>Timestamp of email communications</li>
                <li>Email metadata (subject lines, attachments)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>IP address and browser information</li>
                <li>Device type and operating system</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referral sources</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Primary Uses</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Process and evaluate loan applications</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send application confirmations and status updates</li>
                <li>Communicate important information about our services</li>
                <li>Verify your identity and prevent fraud</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Email Communication</h3>
              <p className="text-gray-700 mb-4">We use email to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Send instant notifications about your loan applications</li>
                <li>Provide application confirmations and updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send important service-related information</li>
                <li>Facilitate communication between you and our team</li>
                <li>Send status updates on your loan application progress</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 Internal Operations</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Improve our website and services</li>
                <li>Analyze usage patterns and preferences</li>
                <li>Maintain records for compliance purposes</li>
                <li>Train our AI chatbot to provide better assistance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Third-Party Sharing</h3>
              <p className="text-gray-700 mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Financial Partners:</strong> Banks and lending institutions for loan processing</li>
                <li><strong>Service Providers:</strong> Third-party companies that help us operate our business (MongoDB, Resend Email API, etc.)</li>
                <li><strong>Legal Compliance:</strong> When required by law or to protect our rights</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Email Data Sharing</h3>
              <p className="text-gray-700 mb-6">
                Email communications are processed through our email service provider (Resend). Your email data is subject to our email provider's privacy policy in addition to ours. We do not share your email conversations with third parties except as necessary for loan processing or as required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">We implement appropriate security measures to protect your personal information:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Secure email API integration with encryption</li>
              </ul>
              <p className="text-gray-700 mb-6">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 mb-4">We retain your personal information for as long as necessary to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide our services and support</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain business records as required by law</li>
              </ul>
              <p className="text-gray-700 mb-6">
                Email communications are typically retained for up to 2 years for customer service and compliance purposes, unless you request deletion or longer retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">7.1 Access and Control</h3>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Access your personal information we hold</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information (<a href="/data-deletion" className="text-blue-600 hover:underline">Data Deletion Request</a>)</li>
                <li>Object to processing of your information</li>
                <li>Request data portability</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">7.2 Email Communication</h3>
              <p className="text-gray-700 mb-4">You can:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Opt out of email communications by clicking "unsubscribe" in our emails</li>
                <li>Request to stop receiving promotional emails</li>
                <li>Request deletion of your email conversation history</li>
                <li>Update your email preferences at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                Our website uses cookies and similar technologies to enhance your experience. These help us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Remember your preferences</li>
                <li>Analyze website traffic and usage</li>
                <li>Improve our services</li>
                <li>Provide personalized content</li>
              </ul>
              <p className="text-gray-700 mb-6">
                You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 mb-6">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700 mb-6">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> <a href="mailto:privacy@bankersdens.com" className="text-blue-600 hover:underline">privacy@bankersdens.com</a></li>
                  <li><strong>Phone:</strong> <a href="tel:+919145023840" className="text-blue-600 hover:underline">+91 9145023840</a></li>
                  <li><strong>Website:</strong> <a href="https://bankersdens.com" className="text-blue-600 hover:underline">https://bankersdens.com</a></li>
                  <li><strong>Address:</strong> Banker's Den, India</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Compliance</h2>
              <p className="text-gray-700 mb-4">
                This Privacy Policy complies with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Information Technology Act, 2000 (India)</li>
                <li>Email service provider policies</li>
                <li>General Data Protection Regulation (GDPR) principles</li>
                <li>Other applicable data protection laws</li>
              </ul>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500">
                This Privacy Policy is effective as of December 17, 2024, and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}