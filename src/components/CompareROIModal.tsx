import React from 'react';
import { X, Building, CheckCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompareROIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompareROIModal: React.FC<CompareROIModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  if (!isOpen) return null;

  const banks = [
    { name: 'Bank of Maharashtra', roi: '7.10% – 9.50%', processingFee: 'Up to 0.25%', highlight: true, badge: 'Lowest ROI' },
    { name: 'Canara Bank', roi: '7.15% – 9.25%', processingFee: 'Up to 0.50%', highlight: false, badge: '' },
    { name: 'Bank of Baroda', roi: '7.25% – 10.15%', processingFee: 'Up to 0.25%', highlight: false, badge: '' },
    { name: 'HDFC Bank', roi: '7.45% – 9.15%', processingFee: 'Up to 0.50%', highlight: false, badge: '' },
    { name: 'ICICI Bank', roi: '7.50% – 9.40%', processingFee: '0.50% – 1.00%', highlight: false, badge: '' },
    { name: 'SBI', roi: '7.70% – 9.05%', processingFee: 'Zero for approved projects', highlight: false, badge: 'Popular' },
    { name: 'Punjab National Bank', roi: '7.20% – 10.25%', processingFee: 'Up to 0.35%', highlight: false, badge: '' },
    { name: 'Axis Bank', roi: '7.60% – 9.10%', processingFee: 'Up to ₹10,000', highlight: false, badge: '' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B35]/20 rounded-full blur-3xl pointer-events-none -mt-10 -mr-10" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#FF6B35]/20 text-[#FF8C42] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Compare Rates
                </span>
              </div>
              <h2 className="text-3xl font-extrabold mb-2">Bank-wise ROI Comparison</h2>
              <p className="text-gray-300 text-sm max-w-lg">
                Find the best home loan interest rates tailored to your profile. Compare top banks and apply instantly.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="grid gap-4">
            {banks.map((bank, i) => (
              <div 
                key={bank.name} 
                className={`flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                  bank.highlight 
                    ? 'bg-orange-50 border-orange-200 shadow-md transform hover:-translate-y-1' 
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                {/* Bank Info */}
                <div className="flex items-center gap-4 w-full sm:w-1/3 mb-4 sm:mb-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bank.highlight ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF8C42]' : 'bg-gray-100'}`}>
                    <Building className={`w-6 h-6 ${bank.highlight ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      {bank.name}
                    </h3>
                    {bank.badge && (
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${bank.highlight ? 'bg-[#FF6B35] text-white' : 'bg-blue-100 text-blue-700'}`}>
                        {bank.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* ROI & Processing Fee */}
                <div className="flex w-full sm:w-1/2 justify-between px-4 sm:border-l sm:border-gray-200 mb-4 sm:mb-0">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Interest Rate (p.a.)</p>
                    <p className={`font-extrabold text-xl ${bank.highlight ? 'text-[#FF6B35]' : 'text-gray-900'}`}>
                      {bank.roi}
                    </p>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="text-xs text-gray-500 font-medium mb-1">Processing Fee</p>
                    <p className="font-medium text-gray-700 text-sm">
                      {bank.processingFee}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="w-full sm:w-auto flex justify-end">
                  <button 
                    onClick={() => {
                      onClose();
                      router.push('/loans/home/apply');
                    }}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all w-full sm:w-auto ${
                      bank.highlight
                        ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Apply <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex items-start gap-2 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
            <p>
              <strong>Note:</strong> Interest rates and processing fees are subject to change. The final ROI applied to your loan will depend on your credit profile, property type, and loan amount. Apply now to get a personalized offer.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
