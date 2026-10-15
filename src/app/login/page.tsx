"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Phone,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const { user, login, loginWithWhatsApp, isAuthenticated, loading } = useAuth();

  const promptParam = searchParams.get('prompt');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [sandboxNotice, setSandboxNotice] = useState<string | null>(null);
  const [whatsAppPrompt, setWhatsAppPrompt] = useState(promptParam === 'whatsapp');

  // If already authenticated, redirect
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, loading, redirectUrl, router]);

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(val);
    setError(null);
    setSandboxNotice(null);
    setWhatsAppPrompt(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSandboxNotice(null);
    setWhatsAppPrompt(false);

    try {
      const res = await fetch('/api/auth/whatsapp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `91${phoneNumber}` }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setOtpSent(true);
        setResendTimer(30);
        if (data.metaWarning) {
          setSandboxNotice(
            `Meta Sandbox note: ${data.metaWarning} (Dev OTP: ${data.debugOtp || 'Check console'})`
          );
        }
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      setError('Unable to reach auth server. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1).replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      // Focus the next empty input or last one
      const nextEmpty = pastedData.length < 6 ? pastedData.length : 5;
      const nextInput = document.getElementById(`otp-input-${nextEmpty}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/whatsapp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `91${phoneNumber}`,
          otp: fullOtp,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        const storedUser = {
          name: data.user?.name || '',
          phone: `91${phoneNumber}`,
          email: data.user?.email || `user_${phoneNumber}@bankersdens.com`,
          picture: data.user?.picture || '/chatbot-icon.png',
          isOnboarded: Boolean(data.user?.isOnboarded),
        };

        loginWithWhatsApp(storedUser);

        // If first time user → onboarding (name + Google connect)
        if (data.isNewUser || !data.user?.isOnboarded || !data.user?.name) {
          window.location.href = `/onboarding?phone=91${phoneNumber}`;
        } else {
          // Returning user → go home
          window.location.href = '/';
        }
      } else {
        setError(data.error || 'Invalid OTP. Please check and try again.');
      }
    } catch (err) {
      setError('Unable to verify OTP right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    try {
      await fetch('/api/auth/whatsapp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `91${phoneNumber}` }),
      });
      setResendTimer(30);
    } catch (err) {
      console.error(err);
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setIsLoading(true);
    setError(null);
    setWhatsAppPrompt(false);

    try {
      const result = await login(credential);
      if (result.success) {
        router.push(redirectUrl);
      } else if (result.requiresWhatsApp) {
        // New user tried Google first — show WhatsApp prompt
        setWhatsAppPrompt(true);
        setError(null);
      } else {
        setError(result.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-[#FF6B35]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Logo / Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8C42] p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <span className="text-xl font-black bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] bg-clip-text text-transparent">
                  BD
                </span>
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Banker&apos;s<span className="text-[#FF6B35]">Den</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {otpSent ? 'Verify WhatsApp OTP' : 'Get Started with Banker\u2019s Den'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {otpSent
              ? `We sent a 6-digit verification code to +91 ${phoneNumber}`
              : 'Sign in to check loan eligibility, track applications & get instant approvals.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent rounded-full" />

          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              {error}
            </div>
          )}

          {sandboxNotice && (
            <div className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              {sandboxNotice}
            </div>
          )}

          {/* WhatsApp-first prompt when Google was clicked by a new user */}
          {whatsAppPrompt && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-semibold mb-1">
                    WhatsApp verification required
                  </p>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    New accounts must first verify via WhatsApp OTP. Enter your phone number below to get started. You can link your Google account afterwards for 1-tap login!
                  </p>
                </div>
              </div>
            </div>
          )}

          {!otpSent ? (
            /* ── Step 1: Phone Input ── */
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-300 font-medium text-sm pr-2.5 border-r border-slate-700">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-slate-950/70 border border-slate-700 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 rounded-xl py-3.5 pl-24 pr-4 text-white text-base placeholder-slate-500 outline-none transition-all tracking-wide font-medium"
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
                  We will send a fast verification code on WhatsApp.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading || phoneNumber.length !== 10}
                className="w-full bg-gradient-to-r from-[#25D366] to-[#20ba59] hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-wide group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Send WhatsApp OTP</span>
                    <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ── Step 2: OTP Verification ── */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp(['', '', '', '', '', '']);
                    }}
                    className="text-xs text-[#FF6B35] hover:underline font-medium"
                  >
                    Edit Phone
                  </button>
                </div>

                <div className="flex justify-between gap-2 sm:gap-2.5">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-input-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                      className="w-12 h-14 bg-slate-950/80 border border-slate-700 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 rounded-xl text-center text-xl font-bold text-white outline-none transition-all"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Verify CTA */}
              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>

              {/* Resend Timer */}
              <div className="text-center text-xs text-slate-400">
                {resendTimer > 0 ? (
                  <span>Resend OTP via WhatsApp in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-[#25D366] hover:underline font-semibold flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    Resend OTP on WhatsApp
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">
                Returning user?
              </span>
            </div>
          </div>

          {/* Google Sign-In */}
          <div className="flex flex-col items-center gap-2">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  await handleGoogleLogin(credentialResponse.credential);
                }
              }}
              onError={() => setError('Google sign-in failed. Please try again.')}
              width="100%"
              theme="filled_black"
              shape="pill"
              text="signin_with"
            />
            <p className="text-[10px] text-slate-500 text-center">
              Google login works only if you&apos;ve linked your account after WhatsApp verification.
            </p>
          </div>

          {/* Security Features */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>256-Bit SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant Approvals</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-500">
          By signing in, you agree to Banker&apos;s Den{' '}
          <Link href="/terms" className="text-slate-400 hover:text-white underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="text-slate-400 hover:text-white underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}
