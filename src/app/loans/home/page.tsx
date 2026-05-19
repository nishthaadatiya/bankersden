'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Home, CheckCircle, Star, Clock, Shield, FileText, ArrowRight, Phone, BarChart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { CompareROIModal } from '@/components/CompareROIModal';
import { FAQ } from '@/components/FAQ';
import { SecondaryNav } from '@/components/SecondaryNav';
import { homeLoanFAQs } from '@/data/faqs';

export default function HomeLoanPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [tenure, setTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(9.5);

  const emi = useMemo(() => {
    // EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)
    const P = loanAmount;
    const r = (interestRate / 12) / 100;
    const n = tenure * 12;
    if (r === 0) return P / n;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [loanAmount, tenure, interestRate]);

  const totalPayable = emi * tenure * 12;
  const totalInterest = totalPayable - loanAmount;

  const handleApplyNow = () => {
    if (isAuthenticated) router.push('/loans/home/apply');
    else setIsAuthModalOpen(true);
  };

  const fmt = (v: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(v);
  const sliderBg = (val: number, min: number, max: number) => {
    const p = ((val - min) / (max - min)) * 100;
    return `linear-gradient(to right,#FF6B35 0%,#FF6B35 ${p}%,#e5e7eb ${p}%,#e5e7eb 100%)`;
  };

  const navSections = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'calculator', label: 'EMI CALCULATOR' },
    { id: 'features', label: 'FEATURES' },
    { id: 'eligibility', label: 'ELIGIBILITY' },
    { id: 'fees', label: 'FEES & CHARGES' },
    { id: 'faqs', label: 'FAQ\'s' }
  ];

  return (
    <>
      <div className="min-h-screen bg-white">

        {/* HERO */}
        <section id="overview" className="relative flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden" style={{ minHeight: '100vh' }}>
          <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-0 w-64 h-64 bg-[#FF8C42]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex-1 flex items-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-8" style={{ flex: '1 1 auto' }}>
            <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium">Home Loan</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight" style={{ letterSpacing: '-0.03em' }}>
                  Make Your<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">Dream Home Real</span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md">
                  Aim of Bankers Den - Honesty - Integrity - Transparency and Service.<br/>
                  India's lowest interest rates starting at <span className="font-semibold text-[#FF6B35]">7.10% p.a.</span> Get up to{' '}
                  <span className="font-semibold text-[#FF6B35]">94.5% financing</span> with Best in Industry TAT for processing with zero hidden charges.
                </p>
                <div className="grid grid-cols-2 gap-2 max-w-md">
                  {['In principle approval within 24 hours', 'Up to 94.5% Financing', 'Minimal Documentation', 'Tax Benefits up to ₹3.5L'].map(f => (
                    <div key={f} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <button onClick={handleApplyNow} className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-white font-semibold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center text-sm">
                    Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  <button onClick={() => setIsCompareModalOpen(true)} className="flex items-center justify-center gap-2 border-2 border-[#1E293B] text-[#1E293B] hover:bg-[#1E293B] hover:text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 text-sm">
                    <BarChart className="w-4 h-4" /> Compare ROI
                  </button>
                  <button onClick={() => router.push('/contact')} className="flex items-center justify-center gap-2 border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 text-sm">
                    <Phone className="w-4 h-4" /> Talk to Banker
                  </button>
                </div>
              </div>
              <div className="hidden lg:flex justify-center items-center">
                <iframe src="https://lottie.host/embed/87359122-caca-434c-bacd-8ae76a1f7b41/0I6rxtBGKc.lottie" className="w-full max-w-lg h-[420px]" style={{ border: 'none' }} title="Home Loan Animation" />
              </div>
            </div>
          </div>

          <div className="w-full bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-orange-200 max-w-3xl mx-auto gap-4 sm:gap-0">
                {[{ value: '7.10% – 10.50%', label: 'Interest Rate' }, { value: '₹30L – ₹10Cr', label: 'Loan Amount' }, { value: '5 – 30 yrs', label: 'Tenure' }].map(s => (
                  <div key={s.label} className="text-center sm:px-6 py-2 sm:py-0">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FF6B35]">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SecondaryNav sections={navSections} />

        {/* EMI CALCULATOR */}
        <section id="calculator" className="py-20 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-[#0F172A] px-6 py-5"><h2 className="text-xl font-bold text-white text-center">How much do you need?</h2></div>
                <div className="px-6 py-6 space-y-6">
                  {[
                    { label: 'I want to borrow:', val: `₹${fmt(loanAmount)}`, min: 3000000, max: 100000000, step: 100000, value: loanAmount, set: setLoanAmount, lo: '₹30L', hi: '₹10Cr' },
                    { label: 'For a period of:', val: `${tenure} years`, min: 5, max: 30, step: 1, value: tenure, set: setTenure, lo: '5 yrs', hi: '30 yrs' },
                    { label: 'Interest rate:', val: `${interestRate.toFixed(2)}% p.a.`, min: 7.10, max: 10.50, step: 0.05, value: interestRate, set: setInterestRate, lo: '7.10%', hi: '10.50%' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-600 font-medium">{s.label}</p>
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#FF6B35] focus-within:border-transparent">
                          {s.label.includes('borrow') && <span className="pl-3 pr-1 text-gray-500 font-medium">₹</span>}
                          <input 
                            type="number" 
                            min={s.min} max={s.max} step={s.step} 
                            value={s.value} 
                            onChange={e => s.set(Number(e.target.value))} 
                            className="w-28 py-1.5 px-2 bg-transparent text-right font-bold text-gray-900 focus:outline-none" 
                          />
                          {s.label.includes('period') && <span className="pr-3 pl-1 text-gray-500 font-medium">yrs</span>}
                          {s.label.includes('rate') && <span className="pr-3 pl-1 text-gray-500 font-medium">%</span>}
                        </div>
                      </div>
                      <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.set(Number(e.target.value))} className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(s.value, s.min, s.max) }} />
                      <div className="flex justify-between text-[11px] text-gray-400 mt-1"><span>{s.lo}</span><span>{s.hi}</span></div>
                    </div>
                  ))}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500"><span>Total Interest:</span><span className="font-medium text-gray-700">₹{fmt(totalInterest)}</span></div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2"><span className="text-sm font-semibold text-gray-800">Monthly EMI:</span><span className="text-2xl font-bold text-[#FF6B35]">₹{fmt(emi)}</span></div>
                    <div className="flex justify-between text-sm text-gray-500"><span>Total Payable:</span><span className="font-medium text-gray-700">₹{fmt(totalPayable)}</span></div>
                  </div>
                  <button onClick={handleApplyNow} className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-white font-bold py-3.5 rounded-full text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                    Get my loan now <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[11px] text-gray-400">No hidden fees · Transparent rates · Expert guidance</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-6">
                {(() => {
                  const size = 200, sw = 28, r = (size - sw) / 2, circ = 2 * Math.PI * r;
                  const iPct = totalPayable > 0 ? totalInterest / totalPayable : 0.3;
                  const pPct = 1 - iPct;
                  return (
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
                      <circle cx={size/2} cy={size/2} r={r + sw/2 + 8} fill="none" stroke="#FF6B35" strokeWidth="1.5" opacity="0.15" />
                      <circle cx={size/2} cy={size/2} r={r + sw/2 + 18} fill="none" stroke="#FF6B35" strokeWidth="1" opacity="0.08" />
                      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#FFE8DF" strokeWidth={sw} />
                      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#og_home)" strokeWidth={sw} strokeDasharray={`${iPct*circ} ${(1-iPct)*circ}`} strokeDashoffset={circ*0.25} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
                      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#FFCBB8" strokeWidth={sw} strokeDasharray={`${pPct*circ} ${(1-pPct)*circ}`} strokeDashoffset={circ*0.25 - iPct*circ} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
                      <defs><linearGradient id="og_home" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FF6B35"/><stop offset="100%" stopColor="#FF8C42"/></linearGradient></defs>
                      <text x={size/2} y={size/2-8} textAnchor="middle" fontSize="11" fill="#6b7280">EMI / mo</text>
                      <text x={size/2} y={size/2+12} textAnchor="middle" fontSize="15" fontWeight="800" fill="#FF6B35">₹{fmt(emi)}</text>
                    </svg>
                  );
                })()}
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#FFCBB8] inline-block" />Principal</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#FF6B35] inline-block" />Interest</span>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium flex items-center gap-2"><span className="w-8 h-0.5 bg-[#FF6B35] inline-block" />CALCULATOR<span className="w-8 h-0.5 bg-[#FF6B35] inline-block" /></p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight" style={{ letterSpacing: '-0.03em' }}>
                  A smarter plan for<br />home loans built <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">around your life</span>
                </h2>
                <p className="text-gray-500 leading-relaxed max-w-sm">No surprises. No hidden charges. Simple, transparent home loans with the best rates in the market.</p>
              </div>
            </div>
          </div>
          <style jsx>{`input[type='range']::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#FF6B35;cursor:pointer;box-shadow:0 0 0 3px rgba(255,107,53,0.2)}input[type='range']::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#FF6B35;cursor:pointer;border:none;box-shadow:0 0 0 3px rgba(255,107,53,0.2)}`}</style>
        </section>

        {/* FEATURES & BENEFITS */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">WHY CHOOSE US</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>Key Features & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">Benefits</span></h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Home, title: 'Competitive Rates', desc: 'Starting from 7.10% p.a. — among the lowest in the market.' },
                  { icon: Star, title: 'Tax Benefits', desc: 'Deductions under Section 24 (interest) and 80C (principal) up to ₹3.5L.' },
                  { icon: CheckCircle, title: 'Up to 94.5% LTV', desc: 'Finance up to 94.5% of the property value.' },
                  { icon: Clock, title: 'Long Tenure', desc: 'Flexible repayment periods up to 30 years.' },
                  { icon: Shield, title: 'Balance Transfer', desc: 'Transfer your existing home loan and save more.' },
                  { icon: FileText, title: 'Top-Up Available', desc: 'Get additional funds on your existing home loan.' },
                ].map(item => (
                  <div key={item.title} className="group bg-gray-50 hover:bg-orange-50 rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                    <div className="w-9 h-9 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <iframe src="https://lottie.host/embed/cb809e12-fc8e-468a-9c66-6819a7fc549f/NwYfydX4yi.lottie" className="w-full max-w-md h-[360px]" style={{ border: 'none' }} title="Benefits Animation" />
              </div>
            </div>
          </div>
        </section>

        {/* ELIGIBILITY & DOCUMENTS */}
        <section id="eligibility" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">REQUIREMENTS</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>Eligibility & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">Documents</span></h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex items-center justify-center order-2 lg:order-1">
                <iframe src="https://lottie.host/embed/5a7f6edc-87ad-427a-9312-27e0577901b9/nELKiPN9uw.lottie" className="w-full max-w-md h-[360px]" style={{ border: 'none' }} title="Eligibility Animation" />
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#FF6B35]" />Eligibility Criteria</h3>
                  <ul className="space-y-3">{['Min Entry Age of applicant 18-65 years', 'Min income criteria should be Rs 50000/ month', 'Cibil score should be 680 or above', 'Stable employment and business History of min 2 years', 'Valid prop documents', 'No default in Loan as per Cibil'].map(item => (
                    <li key={item} className="flex items-start gap-3 text-gray-700 text-sm"><span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-3 h-3 text-[#FF6B35]" /></span>{item}</li>
                  ))}</ul>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-[#FF6B35]" />Required Documents</h3>
                  <ul className="space-y-3">{['Identity & address proof ( Adhar & Pan )', 'Income Proof ( salary slips / Form 16 / ITR / financial documents for businessmen)', 'Bank statement ( last 6 months )', 'Property documents & title deed', 'Employment / business certificate'].map(item => (
                    <li key={item} className="flex items-start gap-3 text-gray-700 text-sm"><span className="w-2 h-2 rounded-full bg-[#FF6B35] flex-shrink-0 mt-1.5" />{item}</li>
                  ))}</ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESSING DETAILS */}
        <section id="fees" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">PROCESS</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>Processing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">Details</span></h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="grid sm:grid-cols-2 gap-5">
                {[{ icon: Clock, title: 'Processing Time', value: 'Max 24 hrs', desc: 'For In principal approval' }, { icon: FileText, title: 'Processing Fee', value: '0 - 0.25%', desc: 'Of sanctioned loan + GST' }, { icon: Home, title: 'Max LTV', value: '94.5%', desc: 'For under construction, 90% for existing' }, { icon: Shield, title: 'Approval Rate', value: '99%+', desc: 'For eligible customers with No default' }].map(item => (
                  <div key={item.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200 group">
                    <div className="w-9 h-9 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><item.icon className="w-4 h-4 text-white" /></div>
                    <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{item.value}</p>
                    <p className="text-sm font-semibold text-gray-700 mb-1">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <iframe src="https://lottie.host/embed/cad9e870-2371-4e52-aff6-e63e71bb0e1e/beCpBNWW3A.lottie" className="w-full max-w-md h-[340px]" style={{ border: 'none' }} title="Processing Animation" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#FF8C42] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Apply for a Home Loan?</h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">Get started with our simple online application. Expert guidance at every step of the journey.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleApplyNow} size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#FF6B35] font-bold rounded-full px-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">Apply Now</Button>
              <Button onClick={() => router.push('/contact')} size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#FF6B35] font-bold rounded-full px-10 transition-all duration-300">Contact Us</Button>
            </div>
          </div>
        </section>

        {/* Home Loan FAQs */}
        <div id="faqs">
          <FAQ items={homeLoanFAQs} title="Home Loan FAQs" />
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} title="Apply for Home Loan" subtitle="Sign in with Google to check your eligibility and start your home loan application." />
      <CompareROIModal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} />
    </>
  );
}