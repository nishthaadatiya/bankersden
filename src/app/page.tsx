'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import {
  Home as HomeIcon,
  Briefcase,
  Car,
  GraduationCap,
  Building2,
  TrendingUp,
  ArrowRight,
  IndianRupee,
  CheckCircle,
  Star,
  Calculator,
  Phone,
  Zap,
  Target,
  Globe,
  Shield,
  Sparkles,
  TrendingDown,
  Users,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { FAQ } from '@/components/FAQ';
import { BankLogosMarquee } from '@/components/BankLogosMarquee';
import { generalFAQs } from '@/data/faqs';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'down' | 'up'>('down');
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const [isCtaDropdownOpen, setIsCtaDropdownOpen] = useState(false);
  const [ctaDropdownPosition, setCtaDropdownPosition] = useState<'down' | 'up'>('down');
  const ctaDropdownButtonRef = useRef<HTMLButtonElement>(null);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleApplyClick = (link: string) => {
    if (isAuthenticated) {
      router.push(link);
    } else {
      setPendingRoute(link);
      setIsAuthModalOpen(true);
    }
  };

  const [currentHeroCard, setCurrentHeroCard] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (isDropdownOpen && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Dropdown menu is roughly 320px tall
      if (spaceBelow < 320 && rect.top > 320) {
        setDropdownPosition('up');
      } else {
        setDropdownPosition('down');
      }
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isCtaDropdownOpen && ctaDropdownButtonRef.current) {
      const rect = ctaDropdownButtonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 320 && rect.top > 320) {
        setCtaDropdownPosition('up');
      } else {
        setCtaDropdownPosition('down');
      }
    }
  }, [isCtaDropdownOpen]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const heroCards = [
    {
      title: "Personal Loans",
      subtitle: "Instant Digital Approval",
      description: "Get personal loans up to ₹50 lakhs with competitive interest rates starting from 8.5% p.a. 100% digital process with instant approval.",
      icon: IndianRupee,
      buttonText: "Apply Now",
      buttonLink: "/loans/personal",
      gradient: "from-[#FF6B35] to-[#FF8C42]",
      bgGradient: "from-[#0F172A] to-[#1E293B]"
    },
    {
      title: "Home Loans",
      subtitle: "Your Dream Home Awaits",
      description: "Secure your dream home with India's lowest interest rates starting from 7.10% p.a. Pre-approved loans up to ₹5 crores with flexible tenure.",
      icon: HomeIcon,
      buttonText: "Get Pre-Approved",
      buttonLink: "/loans/home",
      gradient: "from-[#FF6B35] to-[#FF8C42]",
      bgGradient: "from-[#0F172A] to-[#1E293B]"
    },
    {
      title: "Business Loans",
      subtitle: "Fuel Your Growth Story",
      description: "Power your business expansion with collateral-free loans up to ₹75 lakhs. Quick disbursals and competitive rates for MSMEs.",
      icon: TrendingUp,
      buttonText: "Scale Your Business",
      buttonLink: "/loans/business",
      gradient: "from-[#FF6B35] to-[#FF8C42]",
      bgGradient: "from-[#0F172A] to-[#1E293B]"
    },
  ];

  const loanProducts = [
    {
      icon: HomeIcon,
      title: "Home Loan",
      description: "India's lowest rates starting from 8.25% p.a. with doorstep service",
      rate: "7.10%",
      amount: "₹5 Cr",
      link: "/loans/home",
      color: "from-[#FF6B35] to-[#FF8C42]"
    },
    {
      icon: IndianRupee,
      title: "Personal Loan",
      description: "Instant approval up to ₹50 lakhs with minimal documentation",
      rate: "8.5%",
      amount: "₹50 L",
      link: "/loans/personal",
      color: "from-[#FF6B35] to-[#FF8C42]"
    },
    {
      icon: Briefcase,
      title: "Business Loan",
      description: "Collateral-free business loans for MSMEs and startups",
      rate: "9.5%",
      amount: "₹75 L",
      link: "/loans/business",
      color: "from-[#FF6B35] to-[#FF8C42]"
    },
    {
      icon: Car,
      title: "Car Loan",
      description: "Drive your dream car with 90% financing and quick approval",
      rate: "8.75%",
      amount: "₹1 Cr",
      link: "/loans/car",
      color: "from-[#FF6B35] to-[#FF8C42]"
    },
    {
      icon: GraduationCap,
      title: "Education Loan",
      description: "Study abroad or in India with comprehensive education financing",
      rate: "9.25%",
      amount: "₹1.5 Cr",
      link: "/loans/education",
      color: "from-[#FF6B35] to-[#FF8C42]"
    },
    {
      icon: Building2,
      title: "Property Loan",
      description: "Unlock your property's value with attractive interest rates",
      rate: "8.75%",
      amount: "₹10 Cr",
      link: "/loans/property",
      color: "from-[#FF6B35] to-[#FF8C42]"
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Quick Approval",
      description: "Get loan approvals quickly with our advanced credit assessment system.",
      stat: "Fast"
    },
    {
      icon: Target,
      title: "Lowest Rates",
      description: "Access India's most competitive interest rates across 50+ leading banks and NBFCs.",
      stat: "8.25%"
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "Bank-grade security with 256-bit SSL encryption and RBI-compliant data protection.",
      stat: "256-bit"
    },
    {
      icon: Globe,
      title: "Pan India Service",
      description: "Serving customers across 500+ cities with dedicated relationship managers.",
      stat: "500+ Cities"
    },
  ];

  const testimonials = [
    {
      name: "Nakul Phanse",
      role: "Customer",
      content: "Very smooth and streamlined loan process. Mrs Aarti helped us every time and solved each problem without any hassle. Every process was done online with security measures.",
      rating: 5,
      amount: "Home Loan"
    },
    {
      name: "Yugandhara Ghanwat",
      role: "Customer",
      content: "Great experience! The bank manager was very supportive, staff was professional and customer service was excellent. They resolved my queries promptly.",
      rating: 5,
      amount: "Home Loan"
    },
    {
      name: "Hrishikesh Bodkhe",
      role: "Customer",
      content: "Excellent experience with Ms. Mayuri's outstanding support. She was professional, knowledgeable, and made the entire process completely hassle-free with timely updates.",
      rating: 5,
      amount: "Loan Processing"
    },
    {
      name: "Sachin Magar",
      role: "Customer",
      content: "Special thanks to Ms. Mayuri Patil and Ms. Sonal for excellent support. They handled every query with patience, kept me updated, and made the process effortless.",
      rating: 5,
      amount: "Home Loan"
    },
    {
      name: "Ashish Patil",
      role: "Customer",
      content: "Smooth and hassle-free experience with BD Phygital. Mayuri Ma'am and Sonal Ma'am guided me clearly at every step with great professionalism and dedication.",
      rating: 5,
      amount: "Home Loan"
    }
  ];

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroCard((prev) => (prev + 1) % heroCards.length);
    }, 5000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(heroInterval);
      clearInterval(testimonialInterval);
    };
  }, [heroCards.length, testimonials.length]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "Bankers Den",
            "description": "India's #1 Digital Lending Platform",
            "url": typeof window !== 'undefined' ? window.location.origin : "https://bankersdens.com",
          })
        }}
      />

      <div className="min-h-screen bg-white">
        <section className="relative z-40 min-h-screen flex items-end">
          {/* Background Video with Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-110"
            >
              <source src="/hero-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/70 to-[#0F172A]/55"></div>
          </div>

          <div className="relative z-10 pb-10 md:pb-20 pt-28 px-4 sm:px-8 lg:pl-48 lg:pr-8">
            <div className="max-w-3xl">
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#FF8C42] mb-6 font-medium">Trusted by 700+ Customers Across India</p>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] text-white" style={{ letterSpacing: '-0.03em' }}>
                Your Dreams,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                  Our Finance
                </span>
              </h1>

              <p className="text-base md:text-lg mb-10 text-slate-300 max-w-xl font-normal leading-relaxed" style={{ lineHeight: '1.8' }}>
                From home loans to business expansion — we make borrowing simple, fast, and transparent. ₹585+ Crores disbursed with India's most competitive rates.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative z-50">
                  <button
                    ref={dropdownButtonRef}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-white font-semibold tracking-wide py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 w-full sm:w-auto"
                  >
                    <div className="flex items-center justify-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Get Instant Loan
                      <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <div className={`absolute left-0 z-50 w-full sm:w-60 bg-white rounded-2xl shadow-2xl border border-orange-100 transition-all duration-300 overflow-hidden transform ${dropdownPosition === 'up' ? 'bottom-full mb-3 origin-bottom-left' : 'top-full mt-3 origin-top-left'
                    } ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    {[
                      { name: 'Personal Loan', path: '/loans/personal' },
                      { name: 'Home Loan', path: '/loans/home' },
                      { name: 'Business Loan', path: '/loans/business' },
                      { name: 'Car Loan', path: '/loans/car' },
                      { name: 'Education Loan', path: '/loans/education' },
                      { name: 'Property Loan', path: '/loans/property' },
                    ].map((loan) => (
                      <button
                        key={loan.name}
                        onClick={() => handleApplyClick(loan.path)}
                        className="w-full text-left px-6 py-3.5 hover:bg-orange-50 text-gray-700 hover:text-[#FF6B35] font-semibold transition-colors duration-200 border-b border-gray-50 last:border-0 relative overflow-hidden group/item"
                      >
                        <span className="relative z-10">{loan.name}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent translate-x-[-100%] group-hover/item:translate-x-0 transition-transform duration-300"></div>
                      </button>
                    ))}
                  </div>
                </div>
                <Link href="/calculators">
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold tracking-wide py-4 px-8 rounded-full border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate EMI
                    </div>
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Loan Products Hero Cards Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B35]/5 rounded-full blur-3xl"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-[#0A1F44]/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Cards Slider */}
            <div className="relative max-w-6xl mx-auto">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentHeroCard * 100}%)` }}
                >
                  {heroCards.map((card, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className={`bg-gradient-to-br ${card.bgGradient} p-6 sm:p-10 md:p-16 min-h-[380px] sm:min-h-[500px] md:min-h-[600px] flex items-center relative overflow-hidden`}>
                        {/* Elegant Background Elements */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35] rounded-full blur-3xl"></div>
                          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
                        </div>

                        {/* Regular Loan Cards with Illustration */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center w-full relative z-10">
                          <div className="space-y-6">
                            <div className="flex items-center mb-6">
                              <div className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center mr-4 shadow-xl animate-pulse`}>
                                <card.icon className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
                                  {card.title}
                                </h2>
                                <p className="text-sm text-slate-300 font-medium">
                                  {card.subtitle}
                                </p>
                              </div>
                            </div>
                            <p className="text-base mb-6 text-slate-300 font-normal" style={{ lineHeight: '1.6' }}>
                              {card.description}
                            </p>
                            <button
                              onClick={() => handleApplyClick(card.buttonLink)}
                              className={`bg-gradient-to-r ${card.gradient} text-white font-semibold tracking-wide py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}
                            >
                              <div className="flex items-center">
                                {card.buttonText}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </button>
                          </div>
                          <div className="hidden lg:block">
                            <div className="relative">
                              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-500">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-base text-slate-400 font-medium">Interest Rate</span>
                                    <span className="font-bold text-[#FF6B35] text-xl tracking-tight">Starting 8.25%</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-base text-slate-400 font-medium">Processing Time</span>
                                    <span className="font-bold text-[#FF6B35] text-xl tracking-tight">Quick</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-base text-slate-400 font-medium">Documentation</span>
                                    <span className="font-bold text-[#FF6B35] text-xl tracking-tight">Minimal</span>
                                  </div>
                                  <div className="pt-4 border-t border-white/20">
                                    <div className="flex items-center text-[#FF6B35]">
                                      <CheckCircle className="w-5 h-5 mr-2 animate-pulse" />
                                      <span className="font-semibold text-base">Quick Approval</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Indicators */}
              <div className="flex justify-center mt-8 space-x-3">
                {heroCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroCard(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${index === currentHeroCard
                      ? "bg-[#FF6B35] w-12"
                      : "bg-gray-300 w-8"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-[#FF6B35] group-hover:scale-110 transition-transform">₹585Cr+</div>
                <div className="text-gray-600 text-sm font-medium">Loans Disbursed</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-[#FF6B35] group-hover:scale-110 transition-transform">700+</div>
                <div className="text-gray-600 text-sm font-medium">Happy Customers</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-[#FF6B35] group-hover:scale-110 transition-transform">Fast</div>
                <div className="text-gray-600 text-sm font-medium">Approval Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Video Side */}
              <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover rounded-2xl"
                >
                  <source src="/vecteezy_personal-loan-online-approved-2d-animation_38998780.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Content Side */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#0A1F44] mb-6">
                    About{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                      Us
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    {/* Content to be filled in later */}
                    Your trusted partner in financial solutions. We are committed to providing seamless loan services with transparency and efficiency.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {/* Additional content to be filled in later */}
                    With years of expertise and a customer-first approach, we help you achieve your financial goals with ease.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-gray-50 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FF6B35]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#0A1F44]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div
              id="features-section"
              data-animate
              className={`text-center mb-16 transition-all duration-1000 ${isVisible['features-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A1F44] mb-6">
                Why{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                  700+ Customers
                </span>{" "}
                Choose Us
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of lending with our cutting-edge technology and personalized service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  data-animate
                  id={`feature-${index}`}
                  className={`group text-center bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 ${isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#0A1F44] to-[#0D2A5C] text-white rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl relative">
                    <feature.icon className="w-10 h-10" />
                    {/* Pulse ring effect */}
                    <div className="absolute inset-0 rounded-3xl bg-[#FF6B35] opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></div>
                  </div>

                  <div className="text-3xl font-bold text-[#FF6B35] mb-2">{feature.stat}</div>

                  <h3 className="text-xl font-bold text-[#0A1F44] mb-4 group-hover:text-[#FF6B35] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white relative overflow-hidden">

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              id="testimonials-section"
              data-animate
              className={`text-center mb-16 transition-all duration-1000 ${isVisible['testimonials-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A1F44] mb-6">
                Success Stories from Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
                  Happy Customers
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real experiences from real people who achieved their financial goals with us
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200 shadow-xl">
                        <div className="text-center">
                          <div className="flex justify-center mb-6">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-6 h-6 text-[#FF6B35] fill-current" />
                            ))}
                          </div>

                          <blockquote className="text-base sm:text-xl md:text-2xl text-[#0A1F44] mb-8 leading-relaxed italic">
                            "{testimonial.content}"
                          </blockquote>

                          <div className="flex items-center justify-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#0A1F44] to-[#0D2A5C] rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xl">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                            <div className="text-left">
                              <div className="text-[#0A1F44] font-bold text-lg">{testimonial.name}</div>
                              <div className="text-gray-600">{testimonial.role}</div>
                              <div className="text-[#FF6B35] font-semibold">{testimonial.amount}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                      ? "bg-[#FF6B35] w-12"
                      : "bg-gray-300 w-8"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-40 py-24">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="/cta-bg.jpg"
              alt="Financial Consultation"
              className="w-full h-full object-cover" style={{ objectPosition: 'center 25%' }}
            />
            <div className="absolute inset-0 bg-[#0A1F44]/75"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Your Loan Approved?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied customers who got their loans approved quickly.
              Start your journey to financial freedom today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative z-50">
                <button
                  ref={ctaDropdownButtonRef}
                  onClick={() => setIsCtaDropdownOpen(!isCtaDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsCtaDropdownOpen(false), 200)}
                  className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  <div className="flex items-center justify-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Apply for Loan Now
                    <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-300 ${isCtaDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <div className={`absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-full sm:w-60 bg-white rounded-2xl shadow-2xl border border-orange-100 transition-all duration-300 overflow-hidden transform ${ctaDropdownPosition === 'up' ? 'bottom-full mb-3 origin-bottom' : 'top-full mt-3 origin-top'
                  } ${isCtaDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                  {[
                    { name: 'Personal Loan', path: '/loans/personal' },
                    { name: 'Home Loan', path: '/loans/home' },
                    { name: 'Business Loan', path: '/loans/business' },
                    { name: 'Car Loan', path: '/loans/car' },
                    { name: 'Education Loan', path: '/loans/education' },
                    { name: 'Property Loan', path: '/loans/property' },
                  ].map((loan) => (
                    <button
                      key={loan.name}
                      onClick={() => handleApplyClick(loan.path)}
                      className="w-full text-left px-6 py-3.5 hover:bg-orange-50 text-gray-700 hover:text-[#FF6B35] font-semibold transition-colors duration-200 border-b border-gray-50 last:border-0 relative overflow-hidden group/item"
                    >
                      <span className="relative z-10">{loan.name}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent translate-x-[-100%] group-hover/item:translate-x-0 transition-transform duration-300"></div>
                    </button>
                  ))}
                </div>
              </div>
              <Link href="/contact">
                <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0A1F44] font-bold py-4 px-8 rounded-xl transition-all duration-300">
                  <div className="flex items-center justify-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Talk to Banker
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Bank Logos Marquee */}
        <BankLogosMarquee />

        {/* General FAQs */}
        <FAQ items={generalFAQs} />

      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          if (pendingRoute) {
            router.push(pendingRoute);
            setPendingRoute(null);
          }
        }}
        title="Apply for Loan"
        subtitle="Please sign in with Google to continue your application and get instant approvals."
      />
    </>
  );
}
