"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  ArrowRight,
  Shield,
  Briefcase,
  Headphones,
  Check,
  ChevronDown,
} from "lucide-react";
import CountryFlag from "./CountryFlag";
import { WorkVisa } from "../data/visa-data";
import { fetchPublishedVisas } from "../lib/supabase";

const CITIZEN_COUNTRIES = [
  { name: "Bangladesh", code: "bd" },
  { name: "India", code: "in" },
  { name: "Pakistan", code: "pk" },
  { name: "Nepal", code: "np" },
  { name: "Philippines", code: "ph" },
  { name: "Sri Lanka", code: "lk" },
  { name: "Indonesia", code: "id" },
  { name: "Nigeria", code: "ng" },
  { name: "Egypt", code: "eg" },
];

const DESTINATION_COUNTRIES = [
  { name: "Japan", code: "jp", program: "Specified Skilled Worker (SSW-1/2)" },
  { name: "Germany", code: "de", program: "Chancenkarte & EU Blue Card" },
  {
    name: "United Arab Emirates",
    code: "ae",
    program: "Green & 10-Yr Golden Visa",
  },
  {
    name: "United Kingdom",
    code: "gb",
    program: "Skilled Worker & Healthcare",
  },
  { name: "Singapore", code: "sg", program: "Employment Pass & S-Pass" },
  { name: "Romania", code: "ro", program: "EU Schengen Work Permit" },
  { name: "Canada", code: "ca", program: "LMIA & Global Talent Stream" },
  {
    name: "Saudi Arabia",
    code: "sa",
    program: "Vision 2030 Skill Verification",
  },
  { name: "Australia", code: "au", program: "TSS 482 & Employer Sponsored" },
  {
    name: "South Korea",
    code: "kr",
    program: "E-7 Professional & E-9 Skilled",
  },
  { name: "Malaysia", code: "my", program: "Category I-III Professional Pass" },
  { name: "Italy", code: "it", program: "Decreto Flussi & Tech Visas" },
];

export default function HeroSearch() {
  const router = useRouter();
  const [citizenCountry, setCitizenCountry] = useState("Bangladesh");
  const [destinationCountry, setDestinationCountry] = useState("Japan");
  const [visas, setVisas] = useState<WorkVisa[]>([]);

  const [destMenuOpen, setDestMenuOpen] = useState(false);
  const [destSearchQuery, setDestSearchQuery] = useState("");
  const destDropdownRef = useRef<HTMLDivElement>(null);

  const [citizenMenuOpen, setCitizenMenuOpen] = useState(false);
  const citizenDropdownRef = useRef<HTMLDivElement>(null);

  const selectedCitizen =
    CITIZEN_COUNTRIES.find((c) => c.name === citizenCountry) ||
    CITIZEN_COUNTRIES[0];
  const selectedDest =
    DESTINATION_COUNTRIES.find((c) => c.name === destinationCountry) ||
    DESTINATION_COUNTRIES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        destDropdownRef.current &&
        !destDropdownRef.current.contains(event.target as Node)
      ) {
        setDestMenuOpen(false);
      }
      if (
        citizenDropdownRef.current &&
        !citizenDropdownRef.current.contains(event.target as Node)
      ) {
        setCitizenMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    fetchPublishedVisas().then(setVisas);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const liveVisas = await fetchPublishedVisas();
    const matched = liveVisas.find(
      (v) => v.country.toLowerCase() === destinationCountry.toLowerCase(),
    );
    if (matched) {
      router.push(`/visa/${matched.countrySlug}/${matched.slug}`);
    } else {
      // Fallback: scroll to explore section
      const el = document.getElementById("explore-visas");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredDestinations = DESTINATION_COUNTRIES.filter(
    (d) =>
      d.name.toLowerCase().includes(destSearchQuery.toLowerCase()) ||
      d.program.toLowerCase().includes(destSearchQuery.toLowerCase()),
  );

  return (
    <section className="relative pt-8 pb-16 lg:pt-20 lg:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white">
      {/* Background soft glow rings */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-100/40 via-amber-100/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Eyebrow & Titles */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 font-display tracking-tight leading-[1.12]">
            Find Your <span className="text-brand-700">Work Visa</span> &
            Accelerate Your Global Career
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Accredited consular assistance for skilled professionals, engineers,
            and tradespeople. Verified embassy appointments, document
            legalizations, and fast-track processing.
          </p>
        </div>

        {/* Dedicated "Find your Work Visa" Search Engine Card */}
        <div className="mt-10 lg:mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lift border border-slate-200/80 transition-all hover:border-brand-200">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col lg:flex-row lg:items-end gap-4"
            >
              {/* Field 1: I am a citizen of (with Country Icon + Country Name) */}
              <div className="flex-1 relative" ref={citizenDropdownRef}>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-display">
                  I am a citizen of
                </label>
                <button
                  type="button"
                  onClick={() => setCitizenMenuOpen(!citizenMenuOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-3 bg-slate-50 hover:bg-slate-100/90 focus:bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CountryFlag
                      code={selectedCitizen.code}
                      name={selectedCitizen.name}
                      size="size-5"
                    />
                    <span className="truncate">{selectedCitizen.name}</span>
                  </div>
                  <ChevronDown
                    className={`size-4 text-slate-400 transition-transform shrink-0 ${citizenMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu for Citizen */}
                {citizenMenuOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {CITIZEN_COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCitizenCountry(c.name);
                          setCitizenMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-sm transition-colors ${
                          c.name === citizenCountry
                            ? "bg-brand-50 text-brand-700 font-bold"
                            : "hover:bg-slate-50 text-slate-800 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CountryFlag
                            code={c.code}
                            name={c.name}
                            size="size-5"
                          />
                          <span>{c.name}</span>
                        </div>
                        {c.name === citizenCountry && (
                          <Check className="size-4 text-brand-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 2: Need visa for (with Country Icon + shows strictly by Country Name) */}
              <div className="flex-[1.4] relative" ref={destDropdownRef}>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-display">
                  Need visa for
                </label>

                {/* Clickable selector displaying selected Country Name + Icon */}
                <div
                  onClick={() => {
                    setDestMenuOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 bg-slate-50 hover:bg-slate-100/90 focus-within:bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 rounded-2xl text-sm font-semibold text-slate-900 transition-colors cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <CountryFlag
                      code={selectedDest.code}
                      name={selectedDest.name}
                      size="size-5"
                    />
                    <input
                      type="text"
                      value={destMenuOpen ? destSearchQuery : selectedDest.name}
                      placeholder={selectedDest.name}
                      onChange={(e) => {
                        setDestSearchQuery(e.target.value);
                        if (!destMenuOpen) setDestMenuOpen(true);
                      }}
                      onFocus={() => {
                        setDestMenuOpen(true);
                        setDestSearchQuery("");
                      }}
                      className="bg-transparent border-none outline-none font-semibold text-slate-900 w-full p-0 cursor-pointer focus:cursor-text placeholder:text-slate-900"
                    />
                  </div>
                  <ChevronDown
                    className={`size-4 text-slate-400 transition-transform shrink-0 ${destMenuOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {/* Dropdown Menu for Destination Countries */}
                {destMenuOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 max-h-72 overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Select Destination Country
                    </div>

                    <div className="space-y-0.5">
                      {filteredDestinations.map((d) => (
                        <button
                          key={d.code}
                          type="button"
                          onClick={() => {
                            setDestinationCountry(d.name);
                            setDestSearchQuery("");
                            setDestMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-sm transition-colors group ${
                            d.name === destinationCountry
                              ? "bg-brand-50 text-brand-700 font-bold"
                              : "hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <CountryFlag
                              code={d.code}
                              name={d.name}
                              size="size-6"
                            />
                            <div className="min-w-0">
                              {/* Prominently displays the Country Name */}
                              <div className="font-bold text-slate-900 group-hover:text-brand-700">
                                {d.name}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate font-normal">
                                {d.program}
                              </div>
                            </div>
                          </div>
                          {d.name === destinationCountry ? (
                            <Check className="size-4 text-brand-600 shrink-0" />
                          ) : (
                            <span className="text-xs text-brand-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              Select
                            </span>
                          )}
                        </button>
                      ))}

                      {filteredDestinations.length === 0 && (
                        <div className="py-4 text-center text-xs text-slate-500 font-medium">
                          No countries matched &quot;{destSearchQuery}&quot;.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button: Check Requirements */}
              <button
                type="submit"
                className="h-[48px] w-full lg:w-auto px-8 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lift transition-all flex items-center justify-center gap-2 shrink-0 group"
              >
                <span>Check Requirements</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Quick Pills under search */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <span className="font-medium text-slate-600">
                Quick Country Select:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "Japan", code: "jp" },
                  { name: "Germany", code: "de" },
                  { name: "United Arab Emirates", code: "ae" },
                  { name: "United Kingdom", code: "gb" },
                  { name: "Singapore", code: "sg" },
                  { name: "Canada", code: "ca" },
                ].map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => {
                      setDestinationCountry(p.name);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                      destinationCountry === p.name
                        ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                        : "bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 border-slate-200/80"
                    }`}
                  >
                    <CountryFlag code={p.code} name={p.name} size="size-3.5" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats counter bar matching Visaboo */}
        <div className="mt-14 pt-10 border-t border-slate-200/80">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left sm:text-center">
          <div className="flex items-center gap-4 justify-start sm:justify-center">
              <span className="size-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                <Globe className="size-6" />
              </span>
              <div className="text-left">
                <dd className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  90+
                </dd>
                <dt className="text-xs sm:text-sm font-medium text-slate-500">
                  Destination Countries
                </dt>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-start sm:justify-center">
              <span className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Briefcase className="size-6" />
              </span>
              <div className="text-left">
                <dd className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  500+
                </dd>
                <dt className="text-xs sm:text-sm font-medium text-slate-500">
                  Work Visa Pathways
                </dt>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-start sm:justify-center">
              <span className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Shield className="size-6" />
              </span>
              <div className="text-left">
                <dd className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  98.4%
                </dd>
                <dt className="text-xs sm:text-sm font-medium text-slate-500">
                  Document Accuracy
                </dt>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-start sm:justify-center">
              <span className="size-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Headphones className="size-6" />
              </span>
              <div className="text-left">
                <dd className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  24/7
                </dd>
                <dt className="text-xs sm:text-sm font-medium text-slate-500">
                  Case Officer Support
                </dt>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
