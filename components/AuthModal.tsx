"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, RotateCw } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; phone: string; role: string; avatar: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+8801712345678');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [mockSmsBanner, setMockSmsBanner] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) return;
    setStep('otp');
    setCountdown(60);
    setMockSmsBanner(`[SMS SIMULATION] VisaBD Security Code: 849201. Valid for 5 minutes.`);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('success');
      setTimeout(() => {
        onLoginSuccess({
          name: 'Md. Tariqul Islam',
          phone: phoneNumber,
          role: 'Verified Applicant',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        });
        onClose();
        setStep('phone');
      }, 1200);
    }, 800);
  };

  const autoFillCode = () => {
    setOtpCode('849201');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/50">
      <div className="relative w-full max-w-md max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="relative border-b border-slate-200 px-6 py-5">
          <button
            onClick={onClose}
            aria-label="Close login"
            className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
          <h3 className="pr-8 text-xl font-bold text-slate-900">
            {step === 'phone' && 'Candidate Portal Login'}
            {step === 'otp' && 'Verify Phone Number'}
            {step === 'success' && 'Login Verified!'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {step === 'phone' && 'Enter your mobile number to receive a secure one-time passcode.'}
            {step === 'otp' && `Enter the 6-digit verification code sent to ${phoneNumber}.`}
            {step === 'success' && 'Redirecting to your personalized immigration dashboard...'}
          </p>
        </div>

        {/* SMS Simulator Banner */}
        {mockSmsBanner && step === 'otp' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between">
            <span className="font-mono font-medium">{mockSmsBanner}</span>
            <button
              onClick={autoFillCode}
              type="button"
              className="text-xs font-bold text-amber-700 underline hover:text-amber-900 ml-2 shrink-0 flex items-center gap-1"
            >
              Auto-Fill
            </button>
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: Phone input */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-display">
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
                <p className="text-[11px] text-slate-500 mt-1.5">
                  We will send a 6-digit OTP code via SMS. Standard carrier rates may apply.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                  By logging in, you agree to our <a href="#" className="underline text-slate-600">Terms of Service</a> & <a href="#" className="underline text-slate-600">Privacy Policy</a>.
                </p>
              </div>
            </form>
          )}

          {/* STEP 2: OTP input */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display">
                    6-Digit Security Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-xs text-brand-700 font-semibold hover:underline"
                  >
                    Change Phone
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="849201"
                  className="w-full text-center tracking-[0.5em] py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xl font-bold font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={otpCode.length < 6 || isVerifying}
                className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
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
                <span>Didn&apos;t receive SMS?</span>
                {countdown > 0 ? (
                  <span className="font-semibold text-slate-600">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCountdown(60);
                      setMockSmsBanner(`[NEW SMS] VisaBD Security Code: 849201.`);
                    }}
                    className="font-bold text-brand-700 hover:underline"
                  >
                    Resend Code Now
                  </button>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: Success state */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-display">Authentication Successful</h4>
              <p className="text-xs text-slate-500">Welcome back, Md. Tariqul Islam. Opening your applicant profile...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
