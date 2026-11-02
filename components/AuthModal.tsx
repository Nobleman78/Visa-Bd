"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, RotateCw, Mail, Phone, ExternalLink } from 'lucide-react';
import { storeSupabaseSession } from '../lib/supabase';

async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text.slice(0, 200) || 'The authentication server returned an empty response.');
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; phone?: string; email?: string; role: string; avatar: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [authMethod, setAuthMethod] = useState<'gmail' | 'phone'>('gmail');
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  
  // Gmail state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Phone state
  const [phoneNumber, setPhoneNumber] = useState('+8801712345678');
  
  // Common OTP state
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // Send OTP (Email or Phone)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSending(true);

    if (authMethod === 'gmail') {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setIsSending(false);
        setErrorMessage('Please enter a valid Gmail or email address.');
        return;
      }

      try {
        const response = await fetch('/api/auth/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, fullName }),
        });
        const result = await readJsonResponse<{ error?: string; message?: string }>(response);
        setIsSending(false);
        if (!response.ok) {
          setErrorMessage(result.error || 'Failed to send verification code.');
          return;
        }
        setStep('otp');
        setCountdown(60);
      } catch (err) {
        setIsSending(false);
        setErrorMessage(err instanceof Error ? err.message : 'Error sending verification code.');
      }
    } else {
      // Phone method
      if (!phoneNumber || phoneNumber.length < 8) {
        setIsSending(false);
        setErrorMessage('Please enter a valid phone number.');
        return;
      }
      try {
        const response = await fetch('/api/auth/phone/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneNumber }),
        });
        const result = await readJsonResponse<{ error?: string; message?: string }>(response);
        setIsSending(false);
        if (!response.ok) {
          setErrorMessage(result.error || 'Unable to send the verification code.');
          return;
        }
        setStep('otp');
        setCountdown(60);
      } catch (err) {
        setIsSending(false);
        setErrorMessage(err instanceof Error ? err.message : 'Error sending phone OTP.');
      }
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setIsVerifying(true);

    if (authMethod === 'gmail') {
      try {
        const response = await fetch('/api/auth/email/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), code: otpCode }),
        });
        const result = await readJsonResponse<{
          session?: { access_token: string; refresh_token: string };
          user?: { id: string; name: string; email: string; phone?: string; role: string; avatar: string };
          error?: string;
        }>(response);
        setIsVerifying(false);
        if (!response.ok || !result.session || !result.user) {
          setErrorMessage(result.error || 'Invalid or expired verification code.');
          return;
        }

        storeSupabaseSession(result.session);
        localStorage.setItem('visabd_user', JSON.stringify(result.user));
        setStep('success');

        setTimeout(() => {
          onLoginSuccess(result.user!);
          onClose();
          setStep('input');
        }, 1200);
      } catch (err) {
        setIsVerifying(false);
        setErrorMessage(err instanceof Error ? err.message : 'Verification failed.');
      }
    } else {
      // Phone verification
      try {
        const response = await fetch('/api/auth/phone/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneNumber, otp: otpCode }),
        });
        const result = await readJsonResponse<{
          session?: { access_token: string; refresh_token: string };
          user?: { name: string; phone: string };
          error?: string;
        }>(response);
        setIsVerifying(false);
        if (!response.ok || !result.session || !result.user) {
          setErrorMessage(result.error || 'Invalid phone verification code.');
          return;
        }
        storeSupabaseSession(result.session);
        const loggedInUser = {
          name: result.user?.name || 'Md. Tariqul Islam',
          phone: result.user?.phone || phoneNumber,
          email: '',
          role: 'Verified Applicant',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        };
        localStorage.setItem('visabd_user', JSON.stringify(loggedInUser));
        setStep('success');

        setTimeout(() => {
          onLoginSuccess(loggedInUser);
          onClose();
          setStep('input');
        }, 1200);
      } catch (err) {
        setIsVerifying(false);
        setErrorMessage(err instanceof Error ? err.message : 'Verification failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95">
        
        {/* Header */}
        <div className="relative border-b border-slate-100 px-6 py-5">
          <button
            onClick={onClose}
            aria-label="Close login"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="size-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display font-black text-slate-900 text-lg">
              WorkVisa<span className="text-amber-500">Bd</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full">
              Candidate Portal
            </span>
          </div>

          <h3 className="pr-8 text-xl font-bold text-slate-950 font-display">
            {step === 'input' && 'Sign in to Your Account'}
            {step === 'otp' && (authMethod === 'gmail' ? 'Verify Your Gmail' : 'Verify Phone Number')}
            {step === 'success' && 'Authentication Successful!'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {step === 'input' && 'Access visa tracking, document lockers, and consular updates.'}
            {step === 'otp' && (authMethod === 'gmail' ? `Enter the 6-digit code sent to ${email}` : `Enter the 6-digit code sent to ${phoneNumber}`)}
            {step === 'success' && 'Redirecting to your applicant dashboard...'}
          </p>
        </div>

        {/* Method Switcher Tabs (Only in input step) */}
        {step === 'input' && (
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMethod('gmail'); setErrorMessage(''); }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === 'gmail'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="size-3.5" />
                <span>Gmail / Email</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('phone'); setErrorMessage(''); }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === 'phone'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Phone className="size-3.5" />
                <span>Mobile Phone</span>
              </button>
            </div>
          </div>
        )}

        {/* Error message banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: INPUT */}
          {step === 'input' && (
            <div className="space-y-4">
              {authMethod === 'gmail' ? (
                <>
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                        Full Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Md. Tariqul Islam"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                        Gmail / Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        We will send a 6-digit security code to your Gmail to verify your identity.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full py-3 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm"
                    >
                      {isSending ? (
                        <>
                          <RotateCw className="size-4 animate-spin" />
                          <span>Sending Code to Gmail...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Verification Code</span>
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                      Mobile Number (with country code)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                        🇧🇩
                      </span>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+880 1712 345678"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      We will send a 6-digit OTP code via SMS. Standard carrier rates apply.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSending ? (
                      <>
                        <RotateCw className="size-4 animate-spin" />
                        <span>Sending SMS OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification OTP</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400">
                  By logging in, you agree to WorkVisaBd&apos;s <a href="#" className="underline text-slate-600">Terms of Service</a> & <a href="#" className="underline text-slate-600">Privacy Policy</a>.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: OTP INPUT */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display">
                    6-Digit Security Code
                  </label>
                  <button
                    type="button"
                    onClick={() => { setStep('input'); setErrorMessage(''); }}
                    className="text-xs text-brand-700 font-semibold hover:underline"
                  >
                    Change {authMethod === 'gmail' ? 'Email' : 'Phone'}
                  </button>
                </div>

                {authMethod === 'gmail' && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-900">
                    <span className="truncate">Code sent to <strong>{email}</strong></span>
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 font-bold text-brand-700 underline flex items-center gap-1 shrink-0"
                    >
                      <span>Open Gmail</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                )}

                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-[0.5em] py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xl font-bold font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={otpCode.length < 6 || isVerifying}
                className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="size-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    <span>Confirm & Access Portal</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <span>Didn&apos;t receive code?</span>
                {countdown > 0 ? (
                  <span className="font-semibold text-slate-600">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => void handleSendOtp(e)}
                    className="font-bold text-brand-700 hover:underline"
                  >
                    Resend Code Now
                  </button>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-display">Authentication Successful</h4>
              <p className="text-xs text-slate-500">
                {authMethod === 'gmail' ? 'Your Gmail has been verified.' : 'Your phone has been verified.'} Opening your applicant profile...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
