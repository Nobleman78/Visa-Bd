"use client";

import Image from 'next/image';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Globe2,
  ArrowRight,
} from 'lucide-react';
import { WORK_VISAS, REGIONS, WorkVisa } from '../data/visa-data';
import { fetchPublishedVisas } from '../lib/supabase';

interface ExploreWorkVisaProps {
  /** @deprecated kept for backward compat — cards now navigate directly */
  onSelectVisa?: (visa: never) => void;
  selectedFilterCountry?: string | null;
}

export default function ExploreWorkVisa({ selectedFilterCountry }: ExploreWorkVisaProps) {
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [visas, setVisas] = useState<WorkVisa[]>(WORK_VISAS);

  useEffect(() => {
    fetchPublishedVisas().then((apiVisas) => {
      if (apiVisas.length) setVisas(apiVisas);
    });
  }, []);

  // Filter visas
  const filteredVisas = visas.filter((v) => {
    if (selectedFilterCountry) {
      return v.country.toLowerCase().includes(selectedFilterCountry.toLowerCase());
    }
    if (activeRegion === 'All') return true;
    return v.region === activeRegion;
  });
  const displayedVisas = !selectedFilterCountry && activeRegion === 'All'
    ? filteredVisas.slice(0, 8)
    : filteredVisas;

  return (
    <section id="explore-visas" className="relative py-16 lg:py-24 scroll-mt-20 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white">
      <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-100/40 via-amber-100/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
         
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-display tracking-tight">
            Explore Work Visa by <span className="text-amber-500">Country</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Hand-selected international career pathways with verified employer sponsorships, predictable consular timelines, and high visa grant ratios.
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {REGIONS.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setActiveRegion(region)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeRegion === region && !selectedFilterCountry
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {region === 'All' ? 'All Continents' : `${region}`}
            </button>
          ))}
          {selectedFilterCountry && (
            <button
              type="button"
              onClick={() => setActiveRegion('All')}
              className="px-4 py-2 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1.5"
            >
              <span>Showing: {selectedFilterCountry}</span>
              <span className="text-xs">✕ Clear</span>
            </button>
          )}
        </div>

        {/* Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayedVisas.map((visa) => (
            <Link
              key={visa.id}
              href={`/visa/${visa.countrySlug}/${visa.slug}`}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-card hover:shadow-lift transition-all duration-300 flex flex-col hover:-translate-y-1 relative"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={visa.image}
                  alt={visa.country}
                  loading="lazy"
                  className="block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                 width={1200} height={800} />
              </div>
              <div className="px-5 py-4 text-center">
                <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-brand-700 transition-colors">
                  {visa.country}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {!selectedFilterCountry && activeRegion === 'All' && filteredVisas.length > 8 && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/country"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800"
            >
              Show All Countries
              <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
