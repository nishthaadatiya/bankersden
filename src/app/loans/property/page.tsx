'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import {
  Building,
  CheckCircle,
  Star,
  Clock,
  Shield,
  FileText,
  ArrowRight,
  Phone,
  Home,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { SecondaryNav } from '@/components/SecondaryNav';
import { FAQ } from '@/components/FAQ';
import { propertyLoanFAQs } from '@/data/faqs';

export default function PropertyLoanPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [loanAmount, setLoanAmount] = useState(5000000);
  const [tenure, setTenure] = useState(15);
  const [interestRate, setInterestRate] = useState(8.75);

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
    if (isAuthenticated) {
      router.push('/loans/property/apply');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const fmt = (val: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val);

  const sliderBg = (val: number, min: number, max: number) => {
    const pct = ((val - min) / (max - min)) * 100;
    return `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`;
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

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section
          id="overview"
          className="relative flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden"
          style={{ minHeight: '100vh' }}
        >
          {/* blobs */}
          <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-0 w-64 h-64 bg-[#FF8C42]/10 rounded-full blur-3xl pointer-events-none" />

          <div
            className="flex-1 flex items-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-8"
            style={{ flex: '1 1 auto' }}
          >
            <div className="grid lg:grid-cols-2 gap-10 items-center w-full">

              {/* copy */}
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium">
                  Property Loan
                </p>
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  Unlock Your<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                    Property's Value
                  </span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md">
                  Leverage your property with high loan amounts starting at{' '}
                  <span className="font-semibold text-[#FF6B35]">8.75% p.a.</span> Get up to{' '}
                  <span className="font-semibold text-[#FF6B35]">₹200 crore</span> with flexible
                  repayment options and no end-use restrictions.
                </p>

                <div className="grid grid-cols-2 gap-2 max-w-md">
                  {['High Loan Amount', 'Competitive Rates', 'Long Tenure up to 20 yrs', 'Flexible End-Use'].map((f) => (
                    <div key={f} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleApplyNow}
                    className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-white font-semibold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center text-sm"
                  >
                    Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  <button
                    onClick={() => router.push('/contact')}
                    className="flex items-center justify-center gap-2 border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 text-sm"
                  >
                    <Phone className="w-4 h-4" /> Talk to Banker
                  </button>
                </div>
              </div>

              {/* lottie */}
              <div className="hidden lg:flex justify-center items-center -mr-16">
                <iframe
                  src="https://lottie.host/embed/87359122-caca-434c-bacd-8ae76a1f7b41/0I6rxtBGKc.lottie"
                  className="w-full max-w-[800px] h-[500px] xl:h-[600px] scale-[1.25] transform transition-transform duration-500 hover:scale-[1.3]"
                  style={{ border: 'none' }}
                  title="Property Loan Animation"
                />
              </div>
            </div>
          </div>

          {/* stats bar */}
          <div className="w-full bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-orange-200 max-w-3xl mx-auto gap-4 sm:gap-0">
                {[
                  { value: '8.75% – 16%', label: 'Interest Rate' },
                  { value: '₹10L – ₹200Cr', label: 'Loan Amount' },
                  { value: '5 – 20 yrs', label: 'Tenure' },
                ].map((s) => (
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

        {/* ── EMI CALCULATOR ───────────────────────────────────────── */}
        <section id="calculator" className="py-20 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* calculator card */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-[#0F172A] px-6 py-5">
                  <h2 className="text-xl font-bold text-white text-center">
                    How much do you need?
                  </h2>
                </div>

                <div className="px-6 py-6 space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-600 font-medium">I want to borrow:</p>
                      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#FF6B35] focus-within:border-transparent">
                        <span className="pl-3 pr-1 text-gray-500 font-medium">₹</span>
                        <input type="number" min={1000000} max={2000000000} step={500000} value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-28 py-1.5 px-2 bg-transparent text-right font-bold text-gray-900 focus:outline-none" />
                      </div>
                    </div>
                    <input type="range" min={1000000} max={2000000000} step={500000}
                      value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ background: sliderBg(loanAmount, 1000000, 2000000000) }} />
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                      <span>₹10L</span><span>₹200Cr</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-600 font-medium">For a period of:</p>
                      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#FF6B35] focus-within:border-transparent">
                        <input type="number" min={1} max={20} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-20 py-1.5 px-2 bg-transparent text-right font-bold text-gray-900 focus:outline-none" />
                        <span className="pr-3 pl-1 text-gray-500 font-medium">yrs</span>
                      </div>
                    </div>
                    <input type="range" min={1} max={20} step={1}
                      value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ background: sliderBg(tenure, 1, 20) }} />
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                      <span>1 yr</span><span>20 yrs</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-600 font-medium">Interest rate:</p>
                      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#FF6B35] focus-within:border-transparent">
                        <input type="number" min={8.75} max={16} step={0.5} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-20 py-1.5 px-2 bg-transparent text-right font-bold text-gray-900 focus:outline-none" />
                        <span className="pr-3 pl-1 text-gray-500 font-medium">%</span>
                      </div>
                    </div>
                    <input type="range" min={8.75} max={16} step={0.5}
                      value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ background: sliderBg(interestRate, 8.75, 16) }} />
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                      <span>8.75%</span><span>16%</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Total Interest:</span>
                      <span className="font-medium text-gray-700">₹{fmt(totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                      <span className="text-sm font-semibold text-gray-800">Monthly EMI:</span>
                      <span className="text-2xl font-bold text-[#FF6B35]">₹{fmt(emi)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Total Payable:</span>
                      <span className="font-medium text-gray-700">₹{fmt(totalPayable)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleApplyNow}
                    className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-white font-bold py-3.5 rounded-full text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    Get my loan now <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[11px] text-gray-400">
                    No hidden fees · Transparent rates · Expert guidance
                  </p>
                </div>
              </div>

              {/* right pitch — centered */}
              <div className="flex flex-col items-center text-center space-y-6">

                {/* Dynamic Donut Chart */}
                <div className="relative flex items-center justify-center">
                  {(() => {
                    const size = 200;
                    const strokeWidth = 28;
                    const r = (size - strokeWidth) / 2;
                    const circ = 2 * Math.PI * r;
                    const principalPct = totalPayable > 0 ? loanAmount / totalPayable : 0.5;
                    const interestPct = 1 - principalPct;
                    const principalDash = principalPct * circ;
                    const interestDash = interestPct * circ;
                    return (
                      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
                        {/* outer glow ring */}
                        <circle cx={size/2} cy={size/2} r={r + strokeWidth/2 + 8}
                          fill="none" stroke="#FF6B35" strokeWidth="1.5" opacity="0.15" />
                        <circle cx={size/2} cy={size/2} r={r + strokeWidth/2 + 18}
                          fill="none" stroke="#FF6B35" strokeWidth="1" opacity="0.08" />
                        {/* background track */}
                        <circle cx={size/2} cy={size/2} r={r}
                          fill="none" stroke="#FFE8DF" strokeWidth={strokeWidth} />
                        {/* interest arc (orange) */}
                        <circle cx={size/2} cy={size/2} r={r}
                          fill="none"
                          stroke="url(#orangeGrad)"
                          strokeWidth={strokeWidth}
                          strokeDasharray={`${interestDash} ${circ - interestDash}`}
                          strokeDashoffset={circ * 0.25}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dasharray 0.6s ease' }}
                        />
                        {/* principal arc (light orange) */}
                        <circle cx={size/2} cy={size/2} r={r}
                          fill="none"
                          stroke="#FFCBB8"
                          strokeWidth={strokeWidth}
                          strokeDasharray={`${principalDash} ${circ - principalDash}`}
                          strokeDashoffset={circ * 0.25 - interestDash}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dasharray 0.6s ease' }}
                        />
                        <defs>
                          <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF6B35" />
                            <stop offset="100%" stopColor="#FF8C42" />
                          </linearGradient>
                        </defs>
                        {/* center text */}
                        <text x={size/2} y={size/2 - 8} textAnchor="middle"
                          className="font-bold" fontSize="11" fill="#6b7280">EMI / mo</text>
                        <text x={size/2} y={size/2 + 12} textAnchor="middle"
                          fontSize="15" fontWeight="800" fill="#FF6B35">₹{fmt(emi)}</text>
                      </svg>
                    );
                  })()}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FFCBB8] inline-block" />
                    Principal
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] inline-block" />
                    Interest
                  </span>
                </div>

                <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-[#FF6B35] inline-block" />
                  CALCULATOR
                  <span className="w-8 h-0.5 bg-[#FF6B35] inline-block" />
                </p>
                <h2
                  className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  A smarter plan for<br />property loans built{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                    around your life
                  </span>
                </h2>
                <p className="text-gray-500 leading-relaxed max-w-sm">
                  No hidden charges. No end-use restrictions. Simple, transparent loans
                  against residential or commercial property.
                </p>
              </div>
            </div>
          </div>

          <style jsx>{`
            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 18px; height: 18px;
              border-radius: 50%;
              background: #FF6B35;
              cursor: pointer;
              box-shadow: 0 0 0 3px rgba(255,107,53,0.2);
            }
            input[type='range']::-moz-range-thumb {
              width: 18px; height: 18px;
              border-radius: 50%;
              background: #FF6B35;
              cursor: pointer;
              border: none;
              box-shadow: 0 0 0 3px rgba(255,107,53,0.2);
            }
          `}</style>
        </section>

        {/* ── KEY FEATURES & BENEFITS ──────────────────────────────── */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">WHY CHOOSE US</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
                Key Features &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                  Benefits
                </span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Building, title: 'High Loan-to-Value', desc: 'Get up to 75% of your property value as loan amount.' },
                  { icon: Home, title: 'Continue Using Property', desc: 'Mortgage your property while continuing to live or use it.' },
                  { icon: CheckCircle, title: 'Flexible End-Use', desc: 'Use funds for business, education, medical, or any personal need.' },
                  { icon: Star, title: 'Tax Benefits', desc: 'Claim interest deduction on loans used for business purposes.' },
                  { icon: Shield, title: 'Part Payment', desc: 'Many lenders (especially for individuals) charge NIL penalty on floating rates. Partial prepayment is often free up to 25% of the principal.' },
                  { icon: Home, title: 'Door Step Service', desc: 'Enjoy hassle-free processing with our premium doorstep document collection and assistance.' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group bg-gray-50 hover:bg-orange-50 rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-9 h-9 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* lottie — same as education benefits */}
              <div className="flex items-center justify-center">
                <iframe
                  src="https://lottie.host/embed/cb809e12-fc8e-468a-9c66-6819a7fc549f/NwYfydX4yi.lottie"
                  className="w-full max-w-md h-[360px]"
                  style={{ border: 'none' }}
                  title="Benefits Animation"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── ELIGIBILITY & DOCUMENTS ──────────────────────────────── */}
        <section id="eligibility" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">REQUIREMENTS</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
                Eligibility &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                  Documents
                </span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* lottie */}
              <div className="flex items-center justify-center order-2 lg:order-1">
                <iframe
                  src="https://lottie.host/embed/5a7f6edc-87ad-427a-9312-27e0577901b9/nELKiPN9uw.lottie"
                  className="w-full max-w-md h-[360px]"
                  style={{ border: 'none' }}
                  title="Eligibility Animation"
                />
              </div>

              <div className="order-1 lg:order-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#FF6B35]" /> Eligibility Criteria
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Age: 25–70 years',
                      'Must own a residential or commercial property',
                      'Stable income (salaried or self-employed)',
                      'CIBIL score of 650 or above',
                      'Clear and unencumbered property title',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
                        <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#FF6B35]" /> Required Documents
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Property documents (title deed, sale deed)',
                      'Identity & address proof (Aadhaar / PAN)',
                      'Income proof (salary slips / ITR)',
                      'Bank statements (last 6 months)',
                      'Property valuation report & NOC from society',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
                        <span className="w-2 h-2 rounded-full bg-[#FF6B35] flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROCESSING DETAILS ───────────────────────────────────── */}
        <section id="fees" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">PROCESS</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
                Processing{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                  Details
                </span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { icon: Clock, title: 'Processing Time', value: '7–15 days', desc: 'From application to approval' },
                  { icon: FileText, title: 'Processing Fee', value: '0.5–1%', desc: 'Of the sanctioned loan amount' },
                  { icon: Building, title: 'LTV Ratio', value: 'Up to 75%', desc: 'Of your property market value' },
                  { icon: Shield, title: 'Approval Rate', value: '90%+', desc: 'For eligible applicants' },
                ].map((item) => (
                  <div key={item.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200 group">
                    <div className="w-9 h-9 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{item.value}</p>
                    <p className="text-sm font-semibold text-gray-700 mb-1">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* lottie — same as education processing */}
              <div className="flex items-center justify-center">
                <iframe
                  src="https://lottie.host/embed/cad9e870-2371-4e52-aff6-e63e71bb0e1e/beCpBNWW3A.lottie"
                  className="w-full max-w-md h-[340px]"
                  style={{ border: 'none' }}
                  title="Processing Animation"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="bg-[#FF8C42] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to Unlock Your Property's Value?
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              Get high loan amounts with competitive rates and no end-use restrictions.
              Our experts are ready to help you at every step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleApplyNow} size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#FF6B35] font-bold rounded-full px-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Apply Now
              </Button>
              <Button onClick={() => router.push('/contact')} size="lg" variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#FF6B35] font-bold rounded-full px-10 transition-all duration-300">
                Contact Us
              </Button>
            </div>
          </div>
        </section>

        {/* Property Loan FAQs */}
        <div id="faqs">
          <FAQ items={propertyLoanFAQs} title="Loan Against Property FAQs" />
        </div>

      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Apply for Loan Against Property"
        subtitle="Sign in with Google to unlock your property's value and get the best financing options."
      />
    </>
  );
}