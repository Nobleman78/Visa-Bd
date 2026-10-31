"use client";

import React, { useEffect, useState } from 'react';
import { Search, X, AlertCircle } from 'lucide-react';
import { fetchTrackedSubmission, getStoredAccessToken } from '../lib/supabase';

interface TrackVisaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackingId?: string;
}

export default function TrackVisaModal({ isOpen, onClose, initialTrackingId }: TrackVisaModalProps) {
  const [trackingInput, setTrackingInput] = useState(initialTrackingId || 'VBD-2026-89412');
  const [errorMessage, setErrorMessage] = useState('');
  const [application, setApplication] = useState<Record<string, unknown> | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setApplication(null);
    if (!getStoredAccessToken()) {
      setErrorMessage('Please log in before tracking an application.');
    } else {
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = trackingInput.trim().toUpperCase();
    if (!getStoredAccessToken()) {
      setApplication(null);
      setErrorMessage('Please log in before tracking an application.');
      return;
    }
    setIsSearching(true);
    setErrorMessage('');
    try {
      const backendApplication = await fetchTrackedSubmission(cleanId);
      if (backendApplication) {
        setApplication(backendApplication);
        setIsSearching(false);
        return;
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to track this application.');
      setApplication(null);
      setIsSearching(false);
      return;
    }
    setErrorMessage(`No active application found for ID "${cleanId}".`);
    setApplication(null);
    setIsSearching(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" aria-label="Live Work Visa Application Tracker" className="relative w-full max-w-2xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex shrink-0 items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 bg-white border-b border-slate-100">
          <div className="flex min-w-0 items-start sm:items-center gap-3">
            <span className="hidden sm:flex shrink-0 items-center justify-center size-10 rounded-xl bg-brand-50 text-brand-600">
              <Search className="size-5 text-brand-700" />
            </span>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display leading-tight">Live Work Visa Application Tracker</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">Real-time status updates directly linked with embassy case files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close tracker"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search Bar & Demo Pills */}
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter Tracking ID (e.g. VBD-2026-89412)"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="justify-center px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-medium rounded-xl text-sm transition-all shadow-sm flex items-center gap-1.5"
            >
              {isSearching ? 'Searching...' : 'Track Now'}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-3 p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {application && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
              <p className="font-bold text-slate-900">Application found</p>
              <p className="mt-1 text-slate-600">Status: {String(application.status ?? 'Under Review')}</p>
              <p className="text-slate-600">Visa: {String(application.visa_title ?? application.visa ?? '')}</p>
              <p className="text-slate-600">Country: {String(application.country ?? '')}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-auto">
          <p className="text-xs text-slate-500 text-center sm:text-left">Need urgent inquiry? Call our Dhaka hotline: <strong>+880 9612-884422</strong></p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
