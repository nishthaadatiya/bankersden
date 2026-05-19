'use client';

import { useState, useMemo } from 'react';
import { Calculator, CheckCircle, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/* ─── helpers ─────────────────────────────────────────── */
const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(v);

const sliderBg = (val: number, min: number, max: number) => {
  const p = ((val - min) / (max - min)) * 100;
  return `linear-gradient(to right,#FF6B35 0%,#FF6B35 ${p}%,#e5e7eb ${p}%,#e5e7eb 100%)`;
};

function Slider({ label, val, display, min, max, step, set, lo, hi }: {
  label: string; val: number; display: string;
  min: number; max: number; step: number;
  set: (n: number) => void; lo: string; hi: string;
}) {
  const isRupee = display.includes('₹');
  const isYears = display.includes('yrs');
  const isMonths = display.includes('months');
  const isPercent = display.includes('%');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#FF6B35] focus-within:border-transparent">
          {isRupee && <span className="pl-3 pr-1 text-gray-500 font-medium">₹</span>}
          <input 
            type="number" 
            min={min} max={max} step={step} 
            value={val} 
            onChange={e => set(Number(e.target.value))} 
            className="w-24 py-1 px-2 bg-transparent text-right font-bold text-gray-900 focus:outline-none text-sm" 
          />
          {isYears && <span className="pr-3 pl-1 text-gray-500 font-medium">yrs</span>}
          {isMonths && <span className="pr-3 pl-1 text-gray-500 font-medium">mo</span>}
          {isPercent && <span className="pr-3 pl-1 text-gray-500 font-medium">%</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e => set(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: sliderBg(val, min, max) }} />
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{lo}</span><span>{hi}</span>
      </div>
    </div>
  );
}

/* ─── Donut chart ─────────────────────────────────────── */
function Donut({ pct, label, val, id }: { pct: number; label: string; val: string; id: string }) {
  const size = 180, sw = 24, r = (size - sw) / 2, circ = 2 * Math.PI * r;
  const filled = Math.min(1, Math.max(0, pct)) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-md">
      <circle cx={size/2} cy={size/2} r={r + sw/2 + 6} fill="none" stroke="#FF6B35" strokeWidth="1.5" opacity="0.12" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#FFE8DF" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`url(#g_${id})`} strokeWidth={sw}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ * 0.25} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      <defs>
        <linearGradient id={`g_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FF8C42" />
        </linearGradient>
      </defs>
      <text x={size/2} y={size/2 - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">{label}</text>
      <text x={size/2} y={size/2 + 12} textAnchor="middle" fontSize="14" fontWeight="800" fill="#FF6B35">{val}</text>
    </svg>
  );
}

/* ─── Horizontal bar ──────────────────────────────────── */
function HBar({ left, leftLabel, right, rightLabel }: {
  left: number; leftLabel: string; right: number; rightLabel: string;
}) {
  const total = left + right;
  const lPct = total > 0 ? (left / total) * 100 : 50;
  return (
    <div className="w-full">
      <div className="flex rounded-full overflow-hidden h-4" style={{ transition: 'all 0.5s ease' }}>
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] transition-all duration-500" style={{ width: `${lPct}%` }} />
        <div className="bg-[#FFE8DF] transition-all duration-500 flex-1" />
      </div>
      <div className="flex justify-between mt-2 text-xs">
        <span className="flex items-center gap-1.5 text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] inline-block" />
          {leftLabel}
        </span>
        <span className="flex items-center gap-1.5 text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFE8DF] border border-orange-200 inline-block" />
          {rightLabel}
        </span>
      </div>
    </div>
  );
}

/* ─── EMI Tab ─────────────────────────────────────────── */
function EmiTab() {
  const [principal, setPrincipal] = useState(1500000);
  const [tenure, setTenure] = useState(10);
  const [rate, setRate] = useState(11.5);

  const emi = useMemo(() => {
    // EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)
    const P = principal;
    const r = (rate / 12) / 100;
    const n = tenure * 12;
    if (r === 0) return P / n;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [principal, tenure, rate]);

  const totalPayable = emi * tenure * 12;
  const totalInterest = totalPayable - principal;
  const intPct = totalPayable > 0 ? totalInterest / totalPayable : 0.4;

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-[#0F172A] px-6 py-5">
          <h3 className="text-lg font-bold text-white text-center">Loan Details</h3>
        </div>
        <div className="px-6 py-6 space-y-6">
          <Slider label="Loan Amount" val={principal} display={`₹${fmt(principal)}`}
            min={100000} max={15000000} step={50000} set={setPrincipal} lo="₹1L" hi="₹1.5Cr" />
          <Slider label="Tenure" val={tenure} display={`${tenure} yrs`}
            min={1} max={30} step={1} set={setTenure} lo="1 yr" hi="30 yrs" />
          <Slider label="Interest Rate" val={rate} display={`${rate.toFixed(1)}% p.a.`}
            min={6} max={24} step={0.5} set={setRate} lo="6%" hi="24%" />
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 border border-gray-100">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Principal:</span><span className="font-medium text-gray-700">₹{fmt(principal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total Interest:</span><span className="font-medium text-gray-700">₹{fmt(totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-2.5">
              <span className="font-semibold text-gray-800">Monthly EMI:</span>
              <span className="text-2xl font-extrabold text-[#FF6B35]">₹{fmt(emi)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total Payable:</span><span className="font-medium text-gray-700">₹{fmt(totalPayable)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <Donut pct={intPct} label="Interest %" val={`${(intPct * 100).toFixed(1)}%`} id="emi" />
        <HBar left={totalInterest} leftLabel={`Interest ₹${fmt(totalInterest)}`}
          right={principal} rightLabel={`Principal ₹${fmt(principal)}`} />
        <div className="w-full bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-3">
          {[
            { label: 'Monthly EMI', val: `₹${fmt(emi)}`, highlight: true },
            { label: 'Total Interest', val: `₹${fmt(totalInterest)}` },
            { label: 'Total Amount Payable', val: `₹${fmt(totalPayable)}` },
          ].map(row => (
            <div key={row.label} className={`flex justify-between py-2 ${row.highlight ? 'border-t border-orange-100 pt-3' : ''}`}>
              <span className={`text-sm ${row.highlight ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{row.label}</span>
              <span className={`font-bold ${row.highlight ? 'text-xl text-[#FF6B35]' : 'text-gray-700'}`}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Eligibility Tab ────────────────────────────────── */
function EligibilityTab() {
  const [income, setIncome] = useState(75000);
  const [existingEmi, setExistingEmi] = useState(5000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(20);
  const [creditScore, setCreditScore] = useState(750);

  const availableEmi = income * 0.5 - existingEmi;
  const r = rate / 100 / 12, n = tenure * 12;
  const maxLoan = availableEmi > 0
    ? (availableEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))
    : 0;
  const qualifying = creditScore >= 700 && availableEmi > 0;
  const scorePct = (creditScore - 300) / (900 - 300);
  const scoreColor = creditScore >= 750 ? '#FF6B35' : creditScore >= 650 ? '#F59E0B' : '#EF4444';
  const scoreLabel = creditScore >= 750 ? 'Excellent' : creditScore >= 700 ? 'Good' : creditScore >= 650 ? 'Fair' : 'Poor';

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-[#0F172A] px-6 py-5">
          <h3 className="text-lg font-bold text-white text-center">Your Financial Profile</h3>
        </div>
        <div className="px-6 py-6 space-y-6">
          <Slider label="Monthly Income" val={income} display={`₹${fmt(income)}`}
            min={20000} max={500000} step={5000} set={setIncome} lo="₹20K" hi="₹5L" />
          <Slider label="Existing EMIs / Month" val={existingEmi} display={`₹${fmt(existingEmi)}`}
            min={0} max={100000} step={1000} set={setExistingEmi} lo="₹0" hi="₹1L" />
          <Slider label="Interest Rate" val={rate} display={`${rate.toFixed(1)}% p.a.`}
            min={6} max={20} step={0.5} set={setRate} lo="6%" hi="20%" />
          <Slider label="Preferred Tenure" val={tenure} display={`${tenure} yrs`}
            min={1} max={30} step={1} set={setTenure} lo="1 yr" hi="30 yrs" />
          <Slider label="Credit Score" val={creditScore} display={`${creditScore} — ${scoreLabel}`}
            min={300} max={900} step={10} set={setCreditScore} lo="300" hi="900" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Credit score gauge */}
        <div className="relative flex items-center justify-center">
          <svg width={200} height={110} viewBox="0 0 200 110">
            <path d="M 15 95 A 85 85 0 0 1 185 95" fill="none" stroke="#FFE8DF" strokeWidth={22} strokeLinecap="round" />
            <path d="M 15 95 A 85 85 0 0 1 185 95" fill="none" stroke={scoreColor}
              strokeWidth={22} strokeLinecap="round"
              strokeDasharray={`${scorePct * 267} 267`}
              style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.3s ease' }} />
            <text x="100" y="80" textAnchor="middle" fontSize="22" fontWeight="800" fill={scoreColor}>{creditScore}</text>
            <text x="100" y="97" textAnchor="middle" fontSize="10" fill="#9ca3af">Credit Score — {scoreLabel}</text>
          </svg>
        </div>

        <div className={`w-full rounded-2xl p-5 border text-center ${qualifying ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm font-bold ${qualifying ? 'text-[#FF6B35]' : 'text-red-500'}`}>
            {qualifying ? '✅ You may be eligible for a loan' : '⚠️ Eligibility needs improvement'}
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-3">
          {[
            { label: 'Net Available EMI', val: `₹${fmt(Math.max(0, availableEmi))}` },
            { label: 'Eligible Loan Amount', val: `₹${fmt(Math.max(0, maxLoan))}`, highlight: true },
            { label: 'FOIR Used', val: `${Math.min(100, Math.round((existingEmi / income) * 100))}%` },
            { label: 'Recommended Score', val: '700+' },
          ].map(row => (
            <div key={row.label} className={`flex justify-between py-2 ${row.highlight ? 'border-t border-orange-100 pt-3' : ''}`}>
              <span className={`text-sm ${row.highlight ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{row.label}</span>
              <span className={`font-bold ${row.highlight ? 'text-xl text-[#FF6B35]' : 'text-gray-700'}`}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Part Payment Tab ───────────────────────────────── */
function PartPaymentTab() {
  const [principal, setPrincipal] = useState(3000000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(20);
  const [partPayment, setPartPayment] = useState(500000);
  const [paidMonths, setPaidMonths] = useState(24);

  const r = (rate / 12) / 100;
  const n = tenure * 12;

  const originalEmi = useMemo(() => {
    const P = principal;
    if (r === 0) return P / n;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [principal, rate, tenure, r, n]);

  const outstanding = useMemo(() => {
    return principal * Math.pow(1 + r, paidMonths) - originalEmi * ((Math.pow(1 + r, paidMonths) - 1) / r);
  }, [principal, originalEmi, r, paidMonths]);

  const newPrincipal = Math.max(0, outstanding - partPayment);
  const remainingMonths = Math.max(1, n - paidMonths);

  const newEmi = useMemo(() => {
    const P = newPrincipal;
    if (r === 0) return P / remainingMonths;
    return (P * r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1);
  }, [newPrincipal, r, remainingMonths]);

  const originalTotal = originalEmi * n;
  const newTotal = originalEmi * paidMonths + newEmi * remainingMonths + partPayment;
  const savings = Math.max(0, originalTotal - newTotal);
  const savingsPct = originalTotal > 0 ? savings / originalTotal : 0;

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-[#0F172A] px-6 py-5">
          <h3 className="text-lg font-bold text-white text-center">Loan & Payment Details</h3>
        </div>
        <div className="px-6 py-6 space-y-6">
          <Slider label="Original Loan Amount" val={principal} display={`₹${fmt(principal)}`}
            min={100000} max={20000000} step={100000} set={setPrincipal} lo="₹1L" hi="₹2Cr" />
          <Slider label="Interest Rate" val={rate} display={`${rate.toFixed(1)}% p.a.`}
            min={6} max={20} step={0.5} set={setRate} lo="6%" hi="20%" />
          <Slider label="Original Tenure" val={tenure} display={`${tenure} yrs`}
            min={1} max={30} step={1} set={setTenure} lo="1 yr" hi="30 yrs" />
          <Slider label="Months Already Paid" val={paidMonths} display={`${paidMonths} months`}
            min={1} max={Math.max(1, n - 1)} step={1} set={setPaidMonths} lo="1 mo" hi={`${Math.max(1, n-1)} mo`} />
          <Slider label="Part-Payment Amount" val={partPayment}
            display={`₹${fmt(partPayment)}`}
            min={10000} max={Math.max(10000, Math.round(Math.max(0, outstanding) * 0.9))} step={10000}
            set={setPartPayment} lo="₹10K" hi={`₹${fmt(Math.round(Math.max(0, outstanding) * 0.9))}`} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <Donut pct={savingsPct} label="Savings %" val={`₹${fmt(savings)}`} id="pp" />
        <HBar left={savings} leftLabel={`Savings ₹${fmt(savings)}`}
          right={newTotal} rightLabel={`New Total ₹${fmt(newTotal)}`} />
        <div className="w-full bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-3">
          {[
            { label: 'Original EMI', val: `₹${fmt(originalEmi)}` },
            { label: 'New EMI (after part payment)', val: `₹${fmt(newEmi)}`, highlight: true },
            { label: 'EMI Reduction', val: `₹${fmt(Math.max(0, originalEmi - newEmi))}` },
            { label: 'Total Interest Saved', val: `₹${fmt(savings)}` },
          ].map(row => (
            <div key={row.label} className={`flex justify-between py-2 ${row.highlight ? 'border-t border-orange-100 pt-3' : ''}`}>
              <span className={`text-sm ${row.highlight ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{row.label}</span>
              <span className={`font-bold ${row.highlight ? 'text-xl text-[#FF6B35]' : 'text-gray-700'}`}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
type Tab = 'emi' | 'eligibility' | 'partpayment';

const TABS: { id: Tab; label: string; icon: typeof Calculator }[] = [
  { id: 'emi', label: 'EMI Calculator', icon: Calculator },
  { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
  { id: 'partpayment', label: 'Part Payment', icon: CreditCard },
];

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('emi');

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF8C42]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-4">Smart Tools</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6" style={{ letterSpacing: '-0.03em' }}>
            Loan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
              Calculators
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your EMI, check loan eligibility, or see how a part payment saves you money — all in one place.
          </p>
        </div>
      </section>

      {/* TAB SWITCHER + CONTENT */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 3 tab buttons */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-1.5 shadow-md border border-gray-100 flex flex-wrap gap-1 justify-center">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      active
                        ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white shadow-lg scale-[1.03]'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === 'emi' && <EmiTab />}
          {activeTab === 'eligibility' && <EligibilityTab />}
          {activeTab === 'partpayment' && <PartPaymentTab />}
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

      {/* CTA */}
      <section className="bg-[#FF8C42] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Apply?</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
            Our experts will match you with the best loan offer — no hidden fees, no surprises.
          </p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#FF6B35] hover:bg-orange-50 font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm">
            Talk to a Banker <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}