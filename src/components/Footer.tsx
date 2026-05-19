'use client';

import Link from 'next/link';
import { Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const SECRET_TAPS = 7;       // tap copyright 7 times on mobile
const TAP_WINDOW_MS = 3000;  // within 3 seconds
const KEY_PRESSES = 3;       // or Shift+A x3 on desktop

export const Footer = () => {
  const router = useRouter();

  // ── Desktop: Shift+A × 3 ─────────────────────────────────
  const keyCount = useRef(0);
  const keyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Mobile: tap copyright × 7 ────────────────────────────
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tapsLeft, setTapsLeft] = useState<number | null>(null); // subtle feedback

  // Desktop keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'A') {
        keyCount.current += 1;
        if (keyTimer.current) clearTimeout(keyTimer.current);
        keyTimer.current = setTimeout(() => { keyCount.current = 0; }, 2000);
        if (keyCount.current >= KEY_PRESSES) {
          keyCount.current = 0;
          router.push('/admin/login');
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [router]);

  // Mobile tap handler
  const handleCopyrightTap = () => {
    tapCount.current += 1;

    // Reset timer on each tap
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
      setTapsLeft(null);
    }, TAP_WINDOW_MS);

    const remaining = SECRET_TAPS - tapCount.current;

    if (tapCount.current >= SECRET_TAPS) {
      tapCount.current = 0;
      setTapsLeft(null);
      router.push('/admin/login');
    } else if (tapCount.current >= 3) {
      // Only show hint after 3 taps so accidental taps don't hint
      setTapsLeft(remaining);
      // Hide the hint after 1.5s
      setTimeout(() => setTapsLeft(null), 1500);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h3 className="text-white text-lg md:text-xl font-bold mb-3 md:mb-4">BankersDen</h3>
            <p className="text-sm mb-3 md:mb-4 leading-relaxed">
              Your trusted partner for all financial needs. Get the best deals on loans, credit cards, and insurance.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/bharat-adatiya-78110b245/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/bankersdens/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 md:mb-4">Loans</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/loans/home" className="hover:text-gray-100 transition-colors">Home Loan</Link></li>
              <li><Link href="/loans/personal" className="hover:text-gray-100 transition-colors">Personal Loan</Link></li>
              <li><Link href="/loans/business" className="hover:text-gray-100 transition-colors">Business Loan</Link></li>
              <li><Link href="/loans/car" className="hover:text-gray-100 transition-colors">Car Loan</Link></li>
              <li><Link href="/loans/education" className="hover:text-gray-100 transition-colors">Education Loan</Link></li>
              <li><Link href="/loans/property" className="hover:text-gray-100 transition-colors">Loan Against Property</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 md:mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-gray-100 transition-colors">About Us</Link></li>
              <li><Link href="/bd-partner" className="hover:text-gray-100 transition-colors">BD Partner</Link></li>
              <li><Link href="/insurance" className="hover:text-gray-100 transition-colors">Insurance</Link></li>
              <li><Link href="/calculators" className="hover:text-gray-100 transition-colors">Calculators</Link></li>
              <li><Link href="/cibil-score" className="hover:text-gray-100 transition-colors">CIBIL Score Check</Link></li>
              <li><Link href="/blog" className="hover:text-gray-100 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-gray-100 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 md:mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">BD PHYGITAL PVT. LTD - Bankers Den<br />1st Floor, City Avenue, 107,<br />Wakad, Pune, Maharashtra 411057, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                <span>+91 9145023840 / 7758955586</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                <span>bharat@bankersdens.com<br />mayuri@bankersdens.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">

            {/* Copyright — tap 7× on mobile to open admin */}
            <div className="relative select-none">
              <p
                onClick={handleCopyrightTap}
                className="cursor-default"
              >
                &copy; 2025 Bankers Den. All rights reserved.
              </p>
              {/* Subtle tap countdown hint — only visible after 3 taps */}
              {tapsLeft !== null && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap pointer-events-none">
                  {tapsLeft} more...
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-gray-100 transition-colors">Terms &amp; Conditions</Link>
              <Link href="/privacy-policy" className="hover:text-gray-100 transition-colors">Privacy Policy</Link>
              <Link href="/data-deletion" className="hover:text-gray-100 transition-colors">Data Deletion</Link>
              <Link href="/disclaimer" className="hover:text-gray-100 transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};