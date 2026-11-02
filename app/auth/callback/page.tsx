"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, RotateCw, AlertCircle } from 'lucide-react';
import { storeSupabaseSession } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your Google credentials...');

  useEffect(() => {
    async function handleAuth() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
        const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
        let accessToken = '';
        let refreshToken = '';
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const queryParams = new URLSearchParams(window.location.search);
        const oauthError = hashParams.get('error_description') || queryParams.get('error_description');

        if (oauthError) {
          throw new Error(oauthError.replace(/\+/g, ' '));
        }

        accessToken = hashParams.get('access_token') || queryParams.get('access_token') || '';
        refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token') || '';

        if (!accessToken) {
          setStatus('error');
          setMessage('Unable to extract Google authentication token. Please try again.');
          return;
        }

        // Store session
        storeSupabaseSession({ access_token: accessToken, refresh_token: refreshToken });

        // Fetch user profile from Supabase
        if (supabaseUrl && publishableKey) {
          const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
              apikey: publishableKey,
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (userRes.ok) {
            const userData = await userRes.json() as {
              id: string;
              email?: string;
              user_metadata?: { full_name?: string; avatar_url?: string; picture?: string; name?: string };
            };
            const name = userData.user_metadata?.full_name || userData.user_metadata?.name || userData.email?.split('@')[0] || 'Google User';
            const avatar = userData.user_metadata?.avatar_url || userData.user_metadata?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
            const userObj = {
              name,
              email: userData.email || '',
              phone: '',
              role: 'Verified Applicant',
              avatar,
            };
            localStorage.setItem('visabd_user', JSON.stringify(userObj));
          }
        }

        setStatus('success');
        setMessage('Gmail successfully verified! Redirecting to WorkVisaBd...');
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Authentication failed.');
      }
    }

    void handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-2xl space-y-4">
        {status === 'verifying' && (
          <div className="space-y-4 py-6">
            <div className="size-16 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center mx-auto">
              <RotateCw className="size-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Verifying with Google</h2>
            <p className="text-xs text-slate-500">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-6 animate-in zoom-in-95">
            <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Gmail Verified!</h2>
            <p className="text-xs text-slate-500">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-6">
            <div className="size-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="size-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Verification Failed</h2>
            <p className="text-xs text-red-600">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
