"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Phone, RotateCw, X } from 'lucide-react';
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
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [phoneNumber, setPhoneNumber] = useState('+8801712345678');
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phoneNumber || phoneNumber.length < 8) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/auth/phone/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const result = await readJsonResponse<{ error?: string }>(response);
      if (!response.ok) {
        setErrorMessage(result.error || 'Unable to send the verification code.');
        return;
      }
      setStep('otp');
      setCountdown(60);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error sending phone OTP.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setIsVerifying(true);

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

      if (!response.ok || !result.session || !result.user) {
        setErrorMessage(result.error || 'Invalid phone verification code.');
        return;
      }

      storeSupabaseSession(result.session);
      const loggedInUser = {
        name: result.user.name || 'Verified Applicant',
        phone: result.user.phone || phoneNumber,
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
      setErrorMessage(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="relative border-b border-slate-100 px-6 py-5">
          <button
            onClick={onClose}
            aria-label="Close login"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
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
            {step === 'input' && 'Sign in with Mobile'}
            {step === 'otp' && 'Verify Phone Number'}
            {step === 'success' && 'Authentication Successful!'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {step === 'input' && 'Access visa tracking, document lockers, and consular updates.'}
            {step === 'otp' && `Enter the 6-digit code sent to ${phoneNumber}`}
            {step === 'success' && 'Redirecting to your applicant dashboard...'}
          </p>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <div className="p-6">
          {step === 'input' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                  Mobile Number (with country code)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
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
                className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm"
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

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display">
                    6-Digit Security Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('input');
                      setOtpCode('');
                      setErrorMessage('');
                    }}
                    className="text-xs text-brand-700 font-semibold hover:underline"
                  >
                    Change Phone
                  </button>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
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
                disabled={otpCode.length !== 6 || isVerifying}
                className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm"
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

          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-display">Authentication Successful</h4>
              <p className="text-xs text-slate-500">Your phone has been verified. Opening your applicant profile...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
