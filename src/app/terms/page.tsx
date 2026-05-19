import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Banker\'s Den',
  description: 'Terms and Conditions for using Banker\'s Den services including loan applications and email communications.',
  robots: 'index, follow',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> December 17, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Banker's Den website (<a href="https://bankersdens.com" className="text-blue-600 hover:underline">bankersdens.com</a>) and our services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Services Provided</h2>
              <p className="text-gray-700 mb-4">Banker's Den provides:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Loan application processing and facilitation</li>
                <li>Financial calculators and tools</li>
                <li>Customer support via email and phone</li>
                <li>Information about financial products and services</li>
                <li>AI-powered chatbot assistance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Email Communications</h2>
              <p className="text-gray-700 mb-4">By providing your email address, you consent to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Receiving application confirmations and status updates</li>
                <li>Customer support communications</li>
                <li>Service-related notifications</li>
                <li>Important updates about your applications</li>
                <li>Promotional emails about our services (you can opt out)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can opt out of promotional emails at any time by clicking "unsubscribe" in our emails or contacting us directly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">You agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate and complete information</li>
                <li>Keep your login credentials secure</li>
                <li>Use our services only for lawful purposes</li>
                <li>Not misuse or abuse our services</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Loan Applications</h2>
              <p className="text-gray-700 mb-4">
                Banker's Den acts as an intermediary between customers and financial institutions. We do not guarantee loan approval and final decisions rest with the respective lenders.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>All applications are subject to lender approval</li>
                <li>Interest rates and terms are determined by lenders</li>
                <li>Processing fees may apply as per lender policies</li>
                <li>We reserve the right to reject applications that don't meet criteria</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The information on this website is for general information purposes only. We make no representations or warranties about the accuracy, completeness, or suitability of the information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Banker's Den shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> <a href="mailto:support@bankersdens.com" className="text-blue-600 hover:underline">support@bankersdens.com</a></li>
                  <li><strong>Phone:</strong> <a href="tel:+919145023840" className="text-blue-600 hover:underline">+91 9145023840</a></li>
                  <li><strong>Website:</strong> <a href="https://bankersdens.com" className="text-blue-600 hover:underline">https://bankersdens.com</a></li>
                </ul>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500">
                By using our services, you acknowledge that you have read and understood these Terms & Conditions and agree to be bound by them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}