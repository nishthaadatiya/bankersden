'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Pages with dark hero backgrounds where transparent navbar works
  const darkHeroPages = ['/'];
  const hasDarkHero = darkHeroPages.includes(pathname);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY.current && isVisibleRef.current) {
          setIsVisible(false); // scrolling down
          isVisibleRef.current = false;
        } else if (currentScrollY < lastScrollY.current && !isVisibleRef.current) {
          setIsVisible(true); // scrolling up
          isVisibleRef.current = true;
        }
      } else {
        setIsVisible(true);
        isVisibleRef.current = true;
      }

      lastScrollY.current = currentScrollY;

      if (hasDarkHero) {
        setIsScrolled(currentScrollY > 100);
      } else {
        setIsScrolled(true); // Always show solid navbar on light pages
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasDarkHero]);

  // Define page-specific text colors only
  const getPageColors = () => {
    switch (pathname) {
      case '/loans/home':
        return {
          text: 'text-[#581c87]',
          hoverBg: 'hover:bg-[#581c87]/10',
          buttonBg: 'bg-[#581c87] text-white hover:bg-[#581c87]/90'
        };
      case '/loans/property':
        return {
          text: 'text-[#235a56]',
          hoverBg: 'hover:bg-[#235a56]/10',
          buttonBg: 'bg-[#235a56] text-white hover:bg-[#235a56]/90'
        };
      case '/loans/car':
        return {
          text: 'text-[#7c2d12]',
          hoverBg: 'hover:bg-[#7c2d12]/10',
          buttonBg: 'bg-[#7c2d12] text-white hover:bg-[#7c2d12]/90'
        };
      case '/loans/personal':
        return {
          text: 'text-[#15803d]',
          hoverBg: 'hover:bg-[#15803d]/10',
          buttonBg: 'bg-[#15803d] text-white hover:bg-[#15803d]/90'
        };
      case '/loans/business':
        return {
          text: 'text-[#581c87]',
          hoverBg: 'hover:bg-[#581c87]/10',
          buttonBg: 'bg-[#581c87] text-white hover:bg-[#581c87]/90'
        };
      case '/loans/education':
        return {
          text: 'text-[#FF6B35]',
          hoverBg: 'hover:bg-[#FF6B35]/10',
          buttonBg: 'bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90'
        };
      case '/about':
        return {
          text: 'text-black',
          hoverBg: 'hover:bg-gray-100',
          buttonBg: 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white hover:from-[#FF8C42] hover:to-[#FF6B35]'
        };
      case '/contact':
        return {
          text: 'text-[#3B82F6]',
          hoverBg: 'hover:bg-[#3B82F6]/10',
          buttonBg: 'bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90'
        };
      case '/calculators':
        return {
          text: 'text-[#2563eb]',
          hoverBg: 'hover:bg-[#2563eb]/10',
          buttonBg: 'bg-[#2563eb] text-white hover:bg-[#2563eb]/90'
        };
      case '/blog':
        return {
          text: 'text-[#1e40af]',
          hoverBg: 'hover:bg-[#1e40af]/10',
          buttonBg: 'bg-[#1e40af] text-white hover:bg-[#1e40af]/90'
        };
      case '/cibil-score':
        return {
          text: 'text-[#be185d]',
          hoverBg: 'hover:bg-[#be185d]/10',
          buttonBg: 'bg-[#be185d] text-white hover:bg-[#be185d]/90'
        };
      default:
        return {
          text: 'text-gray-900',
          hoverBg: 'hover:bg-gray-100',
          buttonBg: 'bg-gray-800 text-white hover:bg-gray-900'
        };
    }
  };

  const colors = getPageColors();
  const { user, login, logout, isAuthenticated } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dynamic navbar styles based on scroll
  const navBg = isScrolled
    ? 'bg-white/70 backdrop-blur-xl border border-gray-200/50 shadow-lg'
    : 'bg-white/10 backdrop-blur-md border border-white/20 shadow-xl';
  const navText = isScrolled ? 'text-gray-900' : 'text-white';
  const navHover = isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10';
  const logoColor = isScrolled ? 'text-[#0A1F44]' : 'text-white';
  const mobileIconColor = isScrolled ? 'text-gray-900' : 'text-white';

  return (
    <header className={`fixed top-4 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-[150%]'}`}>
      <nav className={`max-w-7xl mx-auto rounded-3xl transition-all duration-300 ${navBg}`}>
        <div className="flex justify-between items-center h-16 md:h-18 px-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-200">
              <img
                src="/logobg.png"
                alt="BankersDen Logo"
                className="h-9 w-auto object-contain"
              />
              <span className={`text-xl md:text-2xl font-bold ${logoColor} hidden sm:inline`}>BankersDen</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button className={`${navText} font-medium px-3 py-2 rounded-lg ${navHover} transition-all duration-200 relative`}>
                Loans
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] group-hover:w-full transition-all duration-300"></span>
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200">
                <Link href="/loans/home" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-[#581c87] transition-colors text-sm">Home Loan</Link>
                <Link href="/loans/property" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-[#235a56] transition-colors text-sm">Loan Against Property</Link>
                <Link href="/loans/car" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-[#7c2d12] transition-colors text-sm">Car Loan</Link>
                <Link href="/loans/personal" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-[#15803d] transition-colors text-sm">Personal Loan</Link>
                <Link href="/loans/business" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-[#581c87] transition-colors text-sm">Business Loan</Link>
                <Link href="/loans/education" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-[#FF6B35] transition-colors text-sm">Education Loan</Link>
              </div>
            </div>
            <Link href="/calculators" className={`${navText} font-medium px-3 py-2 rounded-lg ${navHover} transition-all duration-200 relative group`}>
              Calculators
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/about" className={`${navText} font-medium px-3 py-2 rounded-lg ${navHover} transition-all duration-200 relative group`}>
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/blog" className={`${navText} font-medium px-3 py-2 rounded-lg ${navHover} transition-all duration-200 relative group`}>
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contact" className={`${navText} font-medium px-3 py-2 rounded-lg ${navHover} transition-all duration-200 relative group`}>
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center space-x-2 ${isScrolled ? 'bg-gray-100 border-gray-200' : 'bg-white/20 border-white/30'} backdrop-blur-md border rounded-full pl-1 pr-3 py-1 ${isScrolled ? 'hover:bg-gray-200' : 'hover:bg-white/30'} transition-all`}
                >
                  <img src={user?.picture} alt={user?.name} className="w-8 h-8 rounded-full border border-white/50" />
                  <span className={`text-sm font-medium ${navText}`}>{user?.name.split(' ')[0]}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      My Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="scale-90 origin-right">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      login(credentialResponse.credential);
                    }
                  }}
                  onError={() => console.log('Login Failed')}
                  useOneTap
                  theme="outline"
                  shape="pill"
                />
              </div>
            )}

            {!isAuthenticated && (
              <Link
                href="/contact"
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-white px-6 py-2 rounded-full font-medium shadow-lg transition-all duration-200 hover:scale-105"
              >
                Get Started
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4 md:hidden">
            {isAuthenticated && (
              <img src={user?.picture} alt={user?.name} className="w-8 h-8 rounded-full border border-white/50" />
            )}
            <button
              className={mobileIconColor}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 bg-white/95 backdrop-blur-sm rounded-b-2xl">
            <div className="flex flex-col space-y-2 px-4">
              {isAuthenticated && (
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mx-2 mb-2">
                  <img src={user?.picture} alt={user?.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              )}

              <Link href="/loans/home" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>Home Loan</Link>
              <Link href="/loans/property" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>Loan Against Property</Link>
              <Link href="/loans/car" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>Car Loan</Link>
              <Link href="/loans/personal" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>Personal Loan</Link>
              <Link href="/loans/business" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>Business Loan</Link>
              <Link href="/loans/education" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>Education Loan</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>About Us</Link>

              {!isAuthenticated ? (
                <div className="px-4 py-2">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      if (credentialResponse.credential) {
                        login(credentialResponse.credential);
                      }
                    }}
                    onError={() => console.log('Login Failed')}
                  />
                </div>
              ) : (
                <div className="flex flex-col border-t border-gray-100 mt-2 pt-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center font-medium py-2 px-4 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    My Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center font-medium py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
              <Link href="/bd-partner" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>BD Partner</Link>
              <Link href="/insurance" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>Insurance</Link>
              <Link href="/calculators" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>Calculators</Link>
              <Link href="/cibil-score" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>CIBIL Score</Link>
              <Link href="/blog" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>Blog</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className={`${colors.text} font-medium py-2 px-4 ${colors.hoverBg} rounded-lg transition-colors`}>Contact</Link>
              {!isAuthenticated && (
                <Link href="/contact" className={`${colors.buttonBg} px-4 py-2 rounded-lg font-medium text-center mt-2 transition-colors`}>Get Started</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};