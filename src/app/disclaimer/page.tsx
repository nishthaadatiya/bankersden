import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - Banker\'s Den',
  description: 'Important disclaimers and limitations regarding Banker\'s Den financial services and information.',
  robots: 'index, follow',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Disclaimer</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> December 17, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">General Information</h2>
              <p className="text-gray-700 mb-4">
                The information contained on Banker's Den website is for general information purposes only. The information is provided by Banker's Den and while we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Financial Services Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                Banker's Den acts as an intermediary between customers and financial institutions. We do not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Guarantee loan approval or specific interest rates</li>
                <li>Provide financial advice or recommendations</li>
                <li>Act as a lender or financial institution</li>
                <li>Make final decisions on loan applications</li>
              </ul>
              <p className="text-gray-700 mb-4">
                All loan applications are subject to the terms, conditions, and approval processes of the respective financial institutions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Calculator and Tools Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The calculators and financial tools provided on our website are for illustrative purposes only. The results generated:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Are estimates based on the information provided</li>
                <li>May not reflect actual loan terms or conditions</li>
                <li>Should not be considered as financial advice</li>
                <li>May vary from actual offers from lenders</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Links</h2>
              <p className="text-gray-700 mb-4">
                Our website may contain links to third-party websites. These links are provided for convenience only. We have no control over the content of these websites and accept no responsibility for them or for any loss or damage that may arise from your use of them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event will Banker's Den be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Professional Advice</h2>
              <p className="text-gray-700 mb-4">
                The information on this website is not intended to replace professional financial advice. We recommend consulting with qualified financial advisors before making any financial decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accuracy of Information</h2>
              <p className="text-gray-700 mb-4">
                While we strive to provide accurate and up-to-date information, we cannot guarantee that all information on our website is current or error-free. Interest rates, terms, and conditions are subject to change without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this disclaimer, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> <a href="mailto:support@bankersdens.com" className="text-blue-600 hover:underline">support@bankersdens.com</a></li>
                  <li><strong>WhatsApp:</strong> <a href="https://wa.me/919145023840" className="text-blue-600 hover:underline">+91 9145023840</a></li>
                  <li><strong>Website:</strong> <a href="https://bankersdens.com" className="text-blue-600 hover:underline">https://bankersdens.com</a></li>
                </ul>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500">
                This disclaimer is subject to change without notice. Please review this page periodically for updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}