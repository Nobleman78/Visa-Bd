"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  CheckCircle2,
  Search,
  UserCheck,
  Newspaper,
  MessageCircle,
} from 'lucide-react';

interface FooterProps {
  onOpenTrackModal?: () => void;
  onOpenAuthModal?: () => void;
}

export default function Footer({ onOpenTrackModal, onOpenAuthModal }: FooterProps = {}) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Subscription Row */}
        <div className="py-12 border-b border-white/10 grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Subscribe to visa quota & embassy alerts
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Receive breaking immigration policy revisions, salary guideline adjustments, and direct consulate appointment availability once a week.
            </p>
          </div>

          <div>
            {isSubscribed ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="size-5 shrink-0" />
                <span>Thank you! You are subscribed to VisaBD consular alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="size-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Multi-Column Links */}
        <div className="py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="size-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white">
                <Compass className="size-5 text-amber-400" />
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                Visa<span className="text-amber-400">BD</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              VisaBD is an accredited work visa and manpower consultation agency specializing in verified legal work authorizations, skilled worker permits, and embassy document attestation across 30+ destinations.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4 text-amber-400 shrink-0" />
                <span>Level 7, Concord Tower, Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-amber-400 shrink-0" />
                <span>Consular Hotline: <strong>+880 9612-884422</strong> (Open 9 AM – 8 PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-amber-400 shrink-0" />
                <span>support@visabd.com • caseworkers@visabd.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Work Visas Asia & Middle East */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display mb-4">
              Asia & Middle East
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/visa/japan/specified-skilled-worker-visa" className="hover:text-white transition-colors">
                  Japan SSW Work Visa
                </Link>
              </li>
              <li>
                <Link href="/visa/malaysia/malaysia-single-entry-business-visa-express" className="hover:text-white transition-colors">
                  Malaysia Express Work Visa
                </Link>
              </li>
              <li>
                <Link href="/visa/united-arab-emirates/green-golden-residence-visa" className="hover:text-white transition-colors">
                  UAE Green & Golden Residence
                </Link>
              </li>
              <li>
                <Link href="/visa/singapore/employment-pass-s-pass" className="hover:text-white transition-colors">
                  Singapore Employment Pass
                </Link>
              </li>
              <li>
                <Link href="/visa/saudi-arabia/professional-work-visa-svp" className="hover:text-white transition-colors">
                  Saudi Arabia Skilled Visa
                </Link>
              </li>
              <li>
                <Link href="/country" className="hover:text-amber-400 text-amber-500 font-semibold transition-colors flex items-center gap-1">
                  <span>Explore All Asia Programs</span>
                  <ArrowRight className="size-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Work Visas Europe & Americas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display mb-4">
              Europe & Americas
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/visa/germany/chancenkarte-opportunity-card" className="hover:text-white transition-colors">
                  Germany Opportunity Card
                </Link>
              </li>
              <li>
                <Link href="/visa/united-kingdom/skilled-worker-visa" className="hover:text-white transition-colors">
                  UK Skilled Worker Visa
                </Link>
              </li>
              <li>
                <Link href="/visa/romania/eu-work-authorization-aviz-de-munca" className="hover:text-white transition-colors">
                  Romania EU Work Permit
                </Link>
              </li>
              <li>
                <Link href="/visa/canada/lmia-work-permit-global-talent" className="hover:text-white transition-colors">
                  Canada LMIA Work Permit
                </Link>
              </li>
              <li>
                <Link href="/#explore-visas" className="hover:text-white transition-colors">
                  Continental Pathways
                </Link>
              </li>
              <li>
                <Link href="/country" className="hover:text-amber-400 text-amber-500 font-semibold transition-colors flex items-center gap-1">
                  <span>View All 90+ Countries</span>
                  <ArrowRight className="size-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Candidate Services & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display mb-4">
              Candidate Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                {onOpenTrackModal ? (
                  <button
                    type="button"
                    onClick={onOpenTrackModal}
                    className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                  >
                    <Search className="size-3.5 text-amber-400" />
                    <span>Track Visa Application</span>
                  </button>
                ) : (
                  <Link href="/#explore-visas" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Search className="size-3.5 text-amber-400" />
                    <span>Track Visa Application</span>
                  </Link>
                )}
              </li>
              <li>
                {onOpenAuthModal ? (
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                  >
                    <UserCheck className="size-3.5 text-amber-400" />
                    <span>Candidate Portal Login</span>
                  </button>
                ) : (
                  <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <UserCheck className="size-3.5 text-amber-400" />
                    <span>Candidate Portal Login</span>
                  </Link>
                )}
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Newspaper className="size-3.5 text-amber-400" />
                  <span>Immigration News & Blogs</span>
                </Link>
              </li>
              <li>
                <Link href="/#why-choose" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-amber-400" />
                  <span>Accreditation & Standards</span>
                </Link>
              </li>
              <li>
                <a
                  href="tel:+8809612884422"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Phone className="size-3.5 text-amber-400" />
                  <span>Call Hotline: +880 9612-884422</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/8809612884422?text=Hello%20VisaBD,%20I%20would%20like%20to%20inquire%20about%20overseas%20work%20visa%20services."
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 text-emerald-400 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="size-3.5" />
                  <span>WhatsApp Liaison Desk</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Accreditation Seals & Bottom Copyright */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-400" />
            <span>Govt. Approved Recruiting Agency RL-1842 | BMET License No. 4920/2026</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/blog" className="hover:text-white transition-colors">Policy Updates</Link>
            <Link href="/#why-choose" className="hover:text-white transition-colors">Consular Representation</Link>
            <Link href="/country" className="hover:text-white transition-colors">Country Directory</Link>
          </div>

          <p className="text-slate-500">
            © 2026 VisaBD Agency Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
