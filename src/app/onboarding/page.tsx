"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Check,
  ChevronRight,
} from 'lucide-react';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPhone = searchParams.get('phone') || '';
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState<'name' | 'google' | 'done'>('name');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(queryPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkedGoogleEmail, setLinkedGoogleEmail] = useState<string | null>(null);

  useEffect(() => {
    // If phone not in search params, check user or localStorage
    if (!phone) {
      if (user?.phone) {
        setPhone(user.phone.replace(/\D/g, ''));
      } else if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('user');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.phone) {
              setPhone(parsed.phone.replace(/\D/g, ''));
            }
            if (parsed.name) {
              setName(parsed.name);
            }
          }
        } catch (e) {}
      }
    }
  }, [phone, user]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/whatsapp/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          name: name.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        // Update user in context & localStorage
        updateUser({
          name: data.user.name,
          isOnboarded: true,
          phone: phone || data.user.phone,
        });

        // Advance to Step 2: Google Account Linking
        setStep('google');
      } else {
        setError(data.error || 'Failed to save name. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLink = async (credential: string) => {
    setIsLinkingGoogle(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/google/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential,
          phone,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setLinkedGoogleEmail(data.user.email);
        updateUser({
          googleId: data.user.googleId,
          email: data.user.email,
          picture: data.user.picture,
          name: data.user.name || name,
        });
        setStep('done');

        // Redirect after brief celebration
        setTimeout(() => {
          window.location.href = '/';
        }, 1800);
      } else {
        setError(data.error || 'Failed to link Google account.');
      }
    } catch (err) {
      setError('Connection error while linking Google account.');
    } finally {
      setIsLinkingGoogle(false);
    }
  };

  const handleSkipGoogle = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-[#FF6B35]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center mb-6">
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

          {/* Stepper Indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              step === 'name'
                ? 'bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF8C42]'
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            }`}>
              {step !== 'name' ? <Check className="w-3.5 h-3.5" /> : <span>1</span>}
              <span>Your Name</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              step === 'google'
                ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                : step === 'done'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              {step === 'done' ? <Check className="w-3.5 h-3.5" /> : <span>2</span>}
              <span>Link Google</span>
            </div>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {step === 'name' && "Welcome! What's your name?"}
            {step === 'google' && "Enable 1-Tap Google Login"}
            {step === 'done' && "All set, welcome aboard!"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {step === 'name' && "Tell us your full name so our loan advisors know who they're assisting."}
            {step === 'google' && "Connect your Google account so you can log in instantly next time with 1 tap — no OTP needed."}
            {step === 'done' && "Your account is verified and ready. Redirecting..."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent rounded-full" />

          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              {error}
            </div>
          )}

          {/* STEP 1: Full Name */}
          {step === 'name' && (
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. Saatvik Agnihotri"
                    className="w-full bg-slate-950/70 border border-slate-700 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 rounded-xl py-3.5 pl-12 pr-4 text-white text-base placeholder-slate-500 outline-none transition-all font-medium"
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  This will appear on your loan applications and dashboard profile.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-wide group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Next: Connect Google</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified WhatsApp: {phone ? `+${phone}` : 'Active'}</span>
              </div>
            </form>
          )}

          {/* STEP 2: Link Google */}
          {step === 'google' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-[#FF6B35]/20 text-[#FF8C42] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">1-Tap Fast Login:</span> Returning visits skip OTP codes entirely when you sign in with Google.
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Safe & Linked:</span> Connects directly to your verified phone number (+{phone}).
                  </div>
                </div>
              </div>

              {/* Google Button */}
              <div className="flex flex-col items-center gap-3 pt-2">
                {isLinkingGoogle ? (
                  <div className="py-4 flex items-center justify-center gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                    <span>Linking Google account...</span>
                  </div>
                ) : (
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        if (credentialResponse.credential) {
                          await handleGoogleLink(credentialResponse.credential);
                        }
                      }}
                      onError={() => setError('Google connection failed. You can skip for now.')}
                      width="100%"
                      theme="filled_black"
                      shape="pill"
                      text="continue_with"
                    />
                  </div>
                )}
                <p className="text-[11px] text-slate-400 text-center">
                  Click above to choose the Google account you want to link.
                </p>
              </div>

              {/* Skip CTA */}
              <div className="pt-2 border-t border-slate-800/80 text-center">
                <button
                  type="button"
                  onClick={handleSkipGoogle}
                  className="text-xs text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline py-1"
                >
                  Skip for now, I&apos;ll use WhatsApp OTP to log in
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Done Confirmation */}
          {step === 'done' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Google Connected!</h3>
                <p className="text-xs text-slate-300">
                  Linked account: <span className="text-emerald-400 font-semibold">{linkedGoogleEmail}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Next time, simply click &quot;Sign in with Google&quot; for instant access.
                </p>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => { window.location.href = '/'; }}
                  className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:opacity-95 text-white font-semibold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <span>Go to Banker&apos;s Den</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OnboardingContent />
    </React.Suspense>
  );
}
