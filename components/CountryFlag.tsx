"use client";

import Image from 'next/image';

import React, { useState } from 'react';

interface CountryFlagProps {
  code: string;
  name: string;
  size?: string;
  className?: string;
}

const FALLBACK_EMOJIS: Record<string, string> = {
  bd: '🇧🇩',
  in: '🇮🇳',
  pk: '🇵🇰',
  np: '🇳🇵',
  ph: '🇵🇭',
  lk: '🇱🇰',
  id: '🇮🇩',
  ng: '🇳🇬',
  eg: '🇪🇬',
  jp: '🇯🇵',
  de: '🇩🇪',
  ae: '🇦🇪',
  gb: '🇬🇧',
  sg: '🇸🇬',
  ro: '🇷🇴',
  ca: '🇨🇦',
  sa: '🇸🇦',
  au: '🇦🇺',
  kr: '🇰🇷',
  my: '🇲🇾',
  it: '🇮🇹',
  fr: '🇫🇷',
  qa: '🇶🇦',
  za: '🇿🇦',
  us: '🇺🇸',
  ch: '🇨🇭',
  tr: '🇹🇷',
  gr: '🇬🇷',
  th: '🇹🇭',
  mu: '🇲🇺'
};

export default function CountryFlag({ code, name, size = "size-5", className = "" }: CountryFlagProps) {
  const [hasError, setHasError] = useState(false);
  const cleanCode = code ? code.toLowerCase().trim() : '';

  if (hasError || !cleanCode) {
    return (
      <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>
        {FALLBACK_EMOJIS[cleanCode] || '🌐'}
      </span>
    );
  }

  return (
    <Image
      src={`https://flagcdn.com/w80/${cleanCode}.png`}
      alt={`${name} flag`}
      loading="lazy"
      width={80}
      height={80}
      onError={() => setHasError(true)}
      className={`${size} shrink-0 rounded-full object-cover ring-1 ring-slate-200/90 shadow-xs ${className}`}
    />
  );
}
