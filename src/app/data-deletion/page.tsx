import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Deletion Request - Banker\'s Den',
  description: 'Request deletion of your personal data from Banker\'s Den including WhatsApp conversations and application information.',
  robots: 'index, follow',
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Deletion Request</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> December 17, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Right to Data Deletion</h2>
              <p className="text-gray-700 mb-4">
                At Banker's Den, we respect your privacy and your right to control your personal data. You have the right to request deletion of your personal information that we have collected and stored.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Data Can Be Deleted</h2>
              <p className="text-gray-700 mb-4">You can request deletion of:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Personal Information:</strong> Name, email, phone number, address</li>
                <li><strong>Application Data:</strong> Loan applications, contact form submissions</li>
                <li><strong>WhatsApp Data:</strong> Message history, phone number, conversation logs</li>
                <li><strong>Financial Information:</strong> Income details, employment information</li>
                <li><strong>Identity Information:</strong> PAN number, other identification details</li>
                <li><strong>Usage Data:</strong> Website interaction logs, calculator usage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention Exceptions</h2>
              <p className="text-gray-700 mb-4">
                Some data may be retained for legal compliance purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Records required by financial regulations (up to 7 years)</li>
                <li>Data needed for ongoing loan processing</li>
                <li>Information required for legal disputes</li>
                <li>Anonymized data used for analytics (non-identifiable)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Request Data Deletion</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-medium text-blue-900 mb-4">📧 Email Request</h3>
                <p className="text-blue-800 mb-3">Send your deletion request to:</p>
                <p className="text-blue-900 font-medium">
                  <a href="mailto:privacy@bankersdens.com?subject=Data Deletion Request" className="hover:underline">
                    privacy@bankersdens.com
                  </a>
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  Subject: "Data Deletion Request"
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-medium text-green-900 mb-4">📱 WhatsApp Request</h3>
                <p className="text-green-800 mb-3">Message us on WhatsApp:</p>
                <p className="text-green-900 font-medium">
                  <a href="https://wa.me/919145023840?text=I%20want%20to%20delete%20my%20data%20from%20Banker's%20Den" 
                     className="hover:underline" target="_blank" rel="noopener noreferrer">
                    +91 9145023840
                  </a>
                </p>
                <p className="text-green-700 text-sm mt-2">
                  Message: "I want to delete my data from Banker's Den"
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Required for Deletion Request</h2>
              <p className="text-gray-700 mb-4">
                To process your deletion request, please provide:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Full Name:</strong> As provided in your applications</li>
                <li><strong>Email Address:</strong> Used for communications</li>
                <li><strong>Phone Number:</strong> Including WhatsApp number</li>
                <li><strong>Application Numbers:</strong> If you have any loan applications</li>
                <li><strong>Verification:</strong> Additional details to verify your identity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Deletion Process Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Request Received (Day 1)</h4>
                    <p className="text-gray-600 text-sm">We acknowledge your deletion request within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Identity Verification (Days 2-3)</h4>
                    <p className="text-gray-600 text-sm">We verify your identity to ensure data security</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Data Review (Days 4-7)</h4>
                    <p className="text-gray-600 text-sm">We identify all your data across our systems</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Data Deletion (Days 8-14)</h4>
                    <p className="text-gray-600 text-sm">We permanently delete your data from all systems</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Confirmation (Day 15)</h4>
                    <p className="text-gray-600 text-sm">We confirm completion of data deletion</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Happens After Deletion</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Your personal data is permanently removed from our systems</li>
                <li>WhatsApp conversation history is deleted</li>
                <li>You will no longer receive communications from us</li>
                <li>Any ongoing loan applications will be cancelled</li>
                <li>You can create a new account if needed in the future</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Alternative Options</h2>
              <p className="text-gray-700 mb-4">
                Instead of full deletion, you may also request:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Data Correction:</strong> Update incorrect information</li>
                <li><strong>Data Export:</strong> Download a copy of your data</li>
                <li><strong>Communication Opt-out:</strong> Stop receiving messages without deleting data</li>
                <li><strong>Account Deactivation:</strong> Temporarily disable your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Data Protection Officer</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> <a href="mailto:privacy@bankersdens.com" className="text-blue-600 hover:underline">privacy@bankersdens.com</a></li>
                  <li><strong>WhatsApp:</strong> <a href="https://wa.me/919145023840" className="text-blue-600 hover:underline">+91 9145023840</a></li>
                  <li><strong>Website:</strong> <a href="https://bankersdens.com" className="text-blue-600 hover:underline">https://bankersdens.com</a></li>
                  <li><strong>Response Time:</strong> Within 24 hours</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Q: Is data deletion free?</h4>
                  <p className="text-gray-700 text-sm">A: Yes, data deletion requests are processed free of charge.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Q: Can I recover my data after deletion?</h4>
                  <p className="text-gray-700 text-sm">A: No, data deletion is permanent and cannot be reversed.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Q: Will my ongoing loan application be affected?</h4>
                  <p className="text-gray-700 text-sm">A: Yes, ongoing applications will be cancelled. Consider waiting until completion.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Q: How do I know my data is actually deleted?</h4>
                  <p className="text-gray-700 text-sm">A: We provide written confirmation once deletion is complete.</p>
                </div>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500">
                This data deletion policy complies with applicable data protection laws including GDPR, WhatsApp Business Policy, and Indian data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}