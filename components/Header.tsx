"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Search,
  User,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  LogOut,
  FileCheck2,
  Sparkles,
  Compass,
} from "lucide-react";
import { POPULAR_COUNTRIES_BY_REGION, WorkVisa } from "../data/visa-data";
import CountryFlag from "./CountryFlag";
import Image from "next/image";
import { fetchPublishedVisas } from "../lib/supabase";

interface HeaderProps {
  onOpenTrackModal: () => void;
  onOpenAuthModal: () => void;
  onSelectCountryVisa: (countryName: string) => void;
  user: { name: string; phone?: string; email?: string; role: string; avatar: string } | null;
  onLogout: () => void;
}

export default function Header({
  onOpenTrackModal,
  onOpenAuthModal,
  onSelectCountryVisa,
  user,
  onLogout,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [visaDropdownOpen, setVisaDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<
    "Asia" | "Middle East" | "Europe" | "Africa" | "Americas"
  >("Asia");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [visas, setVisas] = useState<WorkVisa[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisaDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    fetchPublishedVisas().then(setVisas);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMobileMenuOpen(false);
      setVisaDropdownOpen(false);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  const regionsList = Object.keys(POPULAR_COUNTRIES_BY_REGION) as Array<
    keyof typeof POPULAR_COUNTRIES_BY_REGION
  >;

  /** Scroll to a section on the home page, or navigate home first */
  const scrollToSection = (sectionId: string) => {
    setVisaDropdownOpen(false);
    setMobileMenuOpen(false);
    if (isHome) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  const navLinkClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
      active
        ? "bg-brand-50 text-brand-700"
        : "text-slate-700 hover:text-brand-700 hover:bg-brand-50"
    }`;

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#eff6ff]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="WorkVisaBd Home"
        >
          <div className="relative flex size-9 items-center justify-center rounded-lg border border-brand-800 bg-brand-900 text-white transition-transform duration-300 group-hover:-translate-y-0.5 sm:size-11">
            <Compass className="size-[22px] text-white" strokeWidth={1.8} />
            <span className="absolute bottom-1 right-1 size-1.5 rounded-full bg-amber-400 ring-2 ring-brand-900" />
          </div>
          <div className="flex items-center">
            <span className="font-display text-lg font-extrabold tracking-[-0.04em] text-slate-950 sm:text-[23px]">
              WorkVisa<span className="text-brand-600">Bd</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2"
          aria-label="Main navigation"
        >
          {/* Home */}
          <Link href="/" className={navLinkClass(isHome && !visaDropdownOpen)}>
            Home
          </Link>

          {/* Work Visas mega-dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setVisaDropdownOpen((prev) => !prev)}
              onMouseEnter={() => setVisaDropdownOpen(true)}
              aria-expanded={visaDropdownOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                visaDropdownOpen
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-700 hover:text-brand-700 hover:bg-brand-50"
              }`}
            >
              <span>Work Visas</span>
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  visaDropdownOpen
                    ? "rotate-180 text-brand-700"
                    : "text-slate-400"
                }`}
              />
            </button>

            {/* Mega Menu */}
            {visaDropdownOpen && (
              <div
                onMouseLeave={() => setVisaDropdownOpen(false)}
                className="absolute top-full left-0 mt-2 w-[34rem] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-2 z-50"
                role="menu"
              >
                {/* Region tabs */}
                <div className="flex border-b border-slate-100 pb-2 px-2 gap-1 overflow-x-auto no-scrollbar">
                  {regionsList.map((region) => (
                    <button
                      key={region}
                      type="button"
                      onMouseEnter={() => setSelectedRegion(region)}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        selectedRegion === region
                          ? "bg-brand-700 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>

                {/* Country list */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                      Programs in {selectedRegion}
                    </span>
                    <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-1">
                      <Sparkles className="size-3" /> Embassy Accredited
                    </span>
                  </div>

                  <ul className="grid grid-cols-2 gap-1.5" role="none">
                    {POPULAR_COUNTRIES_BY_REGION[selectedRegion].map((c) => (
                      <li key={c.code} role="none">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={async () => {
                            setVisaDropdownOpen(false);
                            const liveVisas = await fetchPublishedVisas();
                            const match = liveVisas.find(
                              (v: {
                                country: string;
                                countrySlug: string;
                                slug: string;
                              }) =>
                                v.country.toLowerCase() ===
                                c.name.toLowerCase(),
                            );
                            if (match) {
                              router.push(
                                `/visa/${match.countrySlug}/${match.slug}`,
                              );
                            } else {
                              // Country exists in nav but no dedicated visa page yet
                              onSelectCountryVisa(c.name);
                            }
                          }}
                          className="w-full text-left group/item flex items-start gap-2.5 p-2.5 rounded-2xl hover:bg-brand-50 transition-colors"
                        >
                          <CountryFlag
                            code={c.code}
                            name={c.name}
                            size="size-5"
                            className="mt-0.5 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-900 group-hover/item:text-brand-700 transition-colors">
                                {c.name}
                              </span>
                              <ArrowRight className="size-3.5 text-slate-300 group-hover/item:text-brand-600 group-hover/item:translate-x-0.5 transition-all opacity-0 group-hover/item:opacity-100" />
                            </div>
                            <p className="text-[11px] text-slate-500 truncate leading-snug">
                              {c.desc}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer bar */}
                <div className="bg-slate-50 rounded-2xl p-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                    <span>Free pre-screening by our legal consultants</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToSection("explore-visas")}
                    className="font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 shrink-0"
                  >
                    All Visas <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Why Choose Us — scrolls to section */}
          <button
            type="button"
            onClick={() => scrollToSection("why-choose")}
            className={navLinkClass(false)}
          >
            Why Choose Us
          </button>

          {/* Blogs — real page */}
          <Link
            href="/blog"
            className={navLinkClass(pathname.startsWith("/blog"))}
          >
            Blogs
          </Link>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Track Work Visa */}
          <button
            type="button"
            onClick={onOpenTrackModal}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-800 bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 shadow-sm transition-all"
          >
            <Search className="size-4 text-brand-700" />
            <span className="hidden sm:inline">Track Work Visa</span>
          </button>

          {/* User / Login */}
          {user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Image
                  height={1000}
                  width={1000}
                  src={user.avatar}
                  alt={user.name}
                  className="size-7 rounded-full object-cover ring-2 ring-amber-400"
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold leading-none">
                    {user.name.split(" ")[0]}
                  </p>
                  <p className="text-[10px] text-amber-300 font-medium leading-tight">
                    Verified
                  </p>
                </div>
                <ChevronDown className="size-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 top-full w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="p-2.5 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      {user.phone || user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenTrackModal();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition-colors"
                  >
                    <FileCheck2 className="size-4 text-emerald-600" />
                    <span>My Applications</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="size-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-brand-700 hover:bg-brand-800 text-white shadow-md hover:shadow-lg transition-all"
            >
              <User className="size-4" />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-white border-t border-slate-100 px-4 py-4 space-y-1 shadow-lg"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center py-3 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            Home
          </Link>

          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2 px-3">
              Work Visas by Region
            </p>
            <div className="grid grid-cols-2 gap-2">
              {regionsList.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToSection("explore-visas");
                  }}
                  className="text-left p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection("why-choose")}
            className="flex w-full items-center py-3 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            Why Choose Us
          </button>

          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center py-3 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            Blogs
          </Link>

          <div className="pt-3 border-t border-slate-100 mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackModal();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Search className="size-4" />
              Track Work Visa
            </button>
            {!user && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-brand-700 text-white hover:bg-brand-800 transition-colors"
              >
                <User className="size-4" />
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
