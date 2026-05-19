import React from 'react';
import Link from 'next/link';
import { MapPin, Shield, Users, TrendingUp, Award, Mail, Star, Heart, Phone, CheckCircle } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF8C42]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-4">Who We Are</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6" style={{ letterSpacing: '-0.03em' }}>
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                BankersDen
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your trusted partner in making smart, confident financial decisions — from home loans to business funding.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: copy */}
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium">Our Mission</p>
              <h2 className="text-4xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
                Simplifying{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                  Financial Decisions
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At <strong className="text-gray-900">Bankers Den</strong>, we help our customers choose the best loan scheme
                from various <strong className="text-gray-900">Nationalised Banks, Private Sector Banks, and NBFCs</strong>.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you&apos;re <strong>purchasing a new home</strong>, <strong>constructing your dream house</strong>,
                <strong> renovating</strong>, growing a business, or <strong>buying a plot</strong> — we assist you every step of the way
                with expert guidance and zero hidden surprises.
              </p>
              {/* mobile lottie */}
              <div className="lg:hidden flex justify-center">
                <iframe
                  src="https://lottie.host/embed/48c4345b-aed7-4b55-8d5e-c85c431eaab3/g6WAuLXGST.lottie"
                  className="w-full max-w-xs h-64"
                  style={{ border: 'none' }}
                  title="BankersDen Mission Animation"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/contact" className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center text-sm">
                  Get Started Today
                </Link>
                <Link href="/loans/home" className="border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 text-center text-sm">
                  Explore Loans
                </Link>
              </div>
            </div>

            {/* Right: Lottie + stats */}
            <div className="flex flex-col gap-6">
              <div className="hidden lg:flex justify-center">
                <iframe
                  src="https://lottie.host/embed/48c4345b-aed7-4b55-8d5e-c85c431eaab3/g6WAuLXGST.lottie"
                  className="w-full max-w-sm h-72"
                  style={{ border: 'none' }}
                  title="BankersDen Mission Animation"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { value: '₹585Cr+', label: 'Disbursed', icon: TrendingUp },
                  { value: '700+', label: 'Happy Customers', icon: Users },
                  { value: '50+', label: 'Partner Banks', icon: Award },
                  { value: '10+', label: 'Years Experience', icon: Star },
                ].map((s) => (
                  <div key={s.label} className="group bg-orange-50 hover:bg-gradient-to-br hover:from-[#FF6B35] hover:to-[#FF8C42] rounded-2xl p-6 text-center border border-orange-100 hover:border-transparent hover:shadow-xl transition-all duration-300">
                    <s.icon className="w-7 h-7 text-[#FF6B35] group-hover:text-white mx-auto mb-3 transition-colors" />
                    <p className="text-3xl font-extrabold text-[#FF6B35] group-hover:text-white transition-colors">{s.value}</p>
                    <p className="text-sm text-gray-500 group-hover:text-orange-100 mt-1 transition-colors">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">What We Stand For</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              Our Core{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">Values</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Honesty', desc: 'Transparent dealings with complete disclosure at every step.' },
              { icon: Award, title: 'Integrity', desc: 'Ethical practices in all our operations — always.' },
              { icon: Users, title: 'Transparency', desc: 'Clear communication so you\'re never in the dark.' },
              { icon: Heart, title: 'Service', desc: 'Customer-first approach, always and without exception.' },
            ].map((item) => (
              <div key={item.title} className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1">
                <div className="w-14 h-14 bg-orange-50 group-hover:bg-gradient-to-r group-hover:from-[#FF6B35] group-hover:to-[#FF8C42] rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-[#FF6B35] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">Our Leaders</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              Meet the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">Founders</span>
            </h2>
          </div>
          
          <div className="space-y-12">
            {/* Founder */}
            <div className="flex flex-col lg:flex-row items-center gap-10 bg-[#f8f9fc] rounded-3xl p-8 lg:p-12 border border-blue-50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B35]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="lg:w-1/3 w-full relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-[#e4ebf5] rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-200 border-4 border-white shadow-md max-w-[300px] mx-auto">
                  <img src="/Bharat Adatiya.jpeg" alt="Bharat Adatiya - Founder" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="lg:w-2/3 w-full flex flex-col justify-center relative z-10 pl-0 lg:pl-6">
                <svg width="45" height="35" viewBox="0 0 512 512" fill="#3B82F6" className="mb-5 opacity-90">
                  <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" />
                </svg>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#3B82F6] mb-5 leading-tight">We Empower Our Clients by Giving Right Financial Advice</h3>
                <div className="border-l-[3px] border-red-500 pl-5 py-1 mb-6">
                  <p className="text-gray-600 text-base leading-relaxed">
                    "Our value, motto & mission remains to instil the right financial knowledge among our clients and bestow the finest services to individuals seeking credit aid. Leveraging upon new-age technologies, we endeavour to create a financial environment where we can serve a large segment of the population. With the mission to 'help you borrow right,' our core aim remains to impart principled information and bridge the gap between the credit-seeking individuals and authentic lenders."
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Bharat Adatiya</p>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">CEO & Founder of BankersDen</p>
                </div>
              </div>
            </div>

            {/* Co-Founder */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 bg-[#f8f9fc] rounded-3xl p-8 lg:p-12 border border-blue-50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FF6B35]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="lg:w-1/3 w-full relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-l from-blue-100 to-[#e4ebf5] rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-200 border-4 border-white shadow-md max-w-[300px] mx-auto">
                  <img src="/Ashwini Adatiya.jpeg" alt="Ashwini Adatiya - Co-Founder" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="lg:w-2/3 w-full flex flex-col justify-center relative z-10 pr-0 lg:pr-6">
                <svg width="45" height="35" viewBox="0 0 512 512" fill="#3B82F6" className="mb-5 opacity-90">
                  <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" />
                </svg>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#3B82F6] mb-5 leading-tight">Building Trust Through Transparency & Compassion</h3>
                <div className="border-l-[3px] border-red-500 pl-5 py-1 mb-6">
                  <p className="text-gray-600 text-base leading-relaxed">
                    "We strongly believe that a successful financial relationship is rooted in transparency. Our guiding light is to help every individual feel confident about their financial journey, steering clear of opaque processes. By building an elite network of dedicated bankers and advisors, we've successfully helped thousands realize their dreams, providing assurance from initial consultation to final disbursal."
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Ashwini Adatiya</p>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">Co-Founder of BankersDen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFICE CULTURE & CELEBRATIONS ──────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">Life at BankersDen</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              Office <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">Culture & Celebrations</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
              We believe in working hard and celebrating harder. Here is a glimpse into our vibrant work environment where every milestone is shared.
            </p>
          </div>
          
          {/* Photos Grid - Replace src with actual photos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[200px]">
            {/* Image 1 (Large Square) */}
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="relative w-full h-full bg-gray-200">
                <img src="/image1.jpeg" alt="Office Celebration" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </div>
            {/* Image 2 (Small Square) */}
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="relative w-full h-full bg-gray-200">
                <img src="/image2.jpeg" alt="Office Culture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            {/* Image 3 (Small Square) */}
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="relative w-full h-full bg-gray-200">
                <img src="/image3.jpeg" alt="Corporate Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            {/* Image 4 (Wide Rectangle) */}
            <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="relative w-full h-full bg-gray-200">
                <img src="/image4.jpeg" alt="Team Work" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            {/* Image 5 (Wide Rectangle) */}
            <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="relative w-full h-full bg-gray-200">
                <img src="/image5.jpeg" alt="Office Activity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            {/* Image 6 (Wide Rectangle) */}
            <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="relative w-full h-full bg-gray-200">
                <img src="/image6.jpeg" alt="Team Celebration" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY NUMBERS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">AT A GLANCE</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              Why Customers{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">Trust Us</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { val: '30 yrs', label: 'Max Repayment Tenure', icon: TrendingUp },
              { val: '94.5%', label: 'Max Loan-to-Value', icon: Award },
              { val: '7.10%', label: 'Starting Interest Rate', icon: Shield },
              { val: 'Transparent & Quick', label: 'Services through trusted banking partners', icon: Users },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-6 text-center shadow-md border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-r group-hover:from-[#FF6B35] group-hover:to-[#FF8C42] transition-all duration-300">
                  <s.icon className="w-6 h-6 text-[#FF6B35] group-hover:text-white transition-colors" />
                </div>
                <p className="text-2xl font-extrabold text-[#FF6B35] mb-1">{s.val}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-2">REACH US</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              Get in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">Touch</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Visit Us', lines: ['BD PHYGITAL PVT. LTD - Bankers Den', '1st Floor, City Avenue, 107,', 'Wakad, Pune, Maharashtra 411057'] },
              { icon: Phone, title: 'Call Us', lines: ['+91 9145023840', '+91 7758955586'] },
              { icon: Mail, title: 'Email Us', lines: ['support@bankersden.com', 'info@bankersden.com'] },
            ].map((card) => (
              <div key={card.title} className="text-center group">
                <div className="w-16 h-16 bg-orange-50 group-hover:bg-gradient-to-r group-hover:from-[#FF6B35] group-hover:to-[#FF8C42] rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 shadow-md">
                  <card.icon className="w-8 h-8 text-[#FF6B35] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                {card.lines.map((l) => (
                  <p key={l} className="text-gray-500 text-sm">{l}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Our Promise to You</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            We believe in simplifying your financial decisions and ensuring a smooth, stress-free loan experience.
            Your trusted financial partner — for life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-[#FF6B35] hover:bg-orange-50 font-bold rounded-full px-10 py-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-block">
              Get Started
            </Link>
            <Link href="/loans/home" className="border-2 border-white text-white hover:bg-white hover:text-[#FF6B35] font-bold rounded-full px-10 py-4 transition-all duration-300 inline-block">
              Explore Loans
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}