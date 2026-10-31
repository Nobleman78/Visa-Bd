"use client";

import Image from 'next/image';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Award,
  CheckCircle2,
  FileText,
  Shield,
  ArrowRight,
  Globe2,
  Briefcase,
  PhoneCall,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  BadgeCheck,
  CalendarDays,
  BedDouble,
  Repeat2,
  Timer,
} from 'lucide-react';
import { WORK_VISAS, WorkVisa } from '../../../../data/visa-data';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import TrackVisaModal from '../../../../components/TrackVisaModal';
import AuthModal from '../../../../components/AuthModal';
import CountryFlag from '../../../../components/CountryFlag';
import { createSubmission } from '../../../../lib/supabase';

interface Props {
  visa: WorkVisa;
  relatedVisas: WorkVisa[];
}

export default function VisaDetailPage({ visa, relatedVisas }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'requirements' | 'stages' | 'apply'
  >('overview');
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    phone: string;
    role: string;
    avatar: string;
  } | null>(null);

  // Application form
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    nid: '',
    dateOfBirth: '',
    education: 'Bachelor Degree',
    experienceYears: '3',
    hasPassport: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const trackId = `VBD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const documentNames = Object.fromEntries(
      ['passport-photo', 'passport-copy', 'nid-copy', 'resume', 'education-certificates', 'experience-certificates', 'police-clearance', 'medical-report']
        .map((name) => {
          const file = formData.get(name);
          return [name, file instanceof File ? file.name : null];
        })
    );
    createSubmission({
      tracking_id: trackId,
      name: form.name,
      phone: form.phone,
      email: form.email,
      nid: form.nid,
      date_of_birth: form.dateOfBirth || null,
      education: form.education,
      experience_years: form.experienceYears,
      has_passport: form.hasPassport,
      country: visa.country,
      visa_slug: visa.slug,
      visa_title: visa.visaTitle,
      documents: documentNames,
      status: 'Under Review',
    }).then(() => {
      setSuccessId(trackId);
      setIsSubmitting(false);
      setActiveTab('overview');
    }).catch((error) => {
      console.error(error);
      setIsSubmitting(false);
      window.alert('Application could not be submitted. Please check the database setup and try again.');
    });
  };

  const tabs: { key: 'overview' | 'requirements' | 'stages' | 'apply'; label: string; accent?: boolean }[] = [
    { key: 'overview', label: 'Overview & Benefits' },
    { key: 'requirements', label: 'Eligibility & Checklist' },
    { key: 'stages', label: 'Embassy Stages & Fees' },
    { key: 'apply', label: 'Required Documents', accent: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSelectCountryVisa={(name) => {
          // navigate to the correct visa page from header dropdown
          const match = WORK_VISAS.find(
            (v: WorkVisa) => v.country.toLowerCase() === name.toLowerCase()
          );
          if (match) router.push(`/visa/${match.countrySlug}/${match.slug}`);
        }}
        user={user}
        onLogout={() => setUser(null)}
      />

      <main className="flex-1">
        {/* ─── Hero Banner ─── */}
        <div className="relative h-64 md:h-80 bg-slate-900 overflow-hidden">
          <Image
            src={visa.image}
            alt={visa.country}
            className="w-full h-full object-cover opacity-50"
           width={1200} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-5 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-white/60"
            >
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="size-3" /> Home
              </Link>
              <ChevronRight className="size-3" />
              <Link href="/#explore-visas" className="hover:text-white transition-colors">
                Work Visas
              </Link>
              <ChevronRight className="size-3" />
              <span className="text-white">{visa.country}</span>
            </nav>
          </div>

          {/* Title block */}
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <CountryFlag code={visa.countryCode} name={visa.country} size="size-7" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-black/50 backdrop-blur px-2.5 py-0.5 rounded-full border border-amber-400/30">
                {visa.region} · {visa.country}
              </span>
              {visa.badge && (
                <span className="text-xs font-bold text-white bg-brand-600 px-2.5 py-0.5 rounded-full">
                  {visa.badge}
                </span>
              )}
              <span className="text-xs font-bold text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full">
                {visa.categoryTag}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-display leading-tight">
              {visa.visaTitle}
            </h1>
          </div>
        </div>

        {/* ─── Quick Metrics Bar ─── */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <span className="size-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                  <Clock className="size-5" />
                </span>
                <div>
                  <dt className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Processing
                  </dt>
                  <dd className="text-sm font-bold text-slate-900">{visa.processingTime}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="size-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Calendar className="size-5" />
                </span>
                <div>
                  <dt className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Validity
                  </dt>
                  <dd className="text-sm font-bold text-slate-900">{visa.validity}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="size-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Award className="size-5" />
                </span>
                <div>
                  <dt className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Min. Education
                  </dt>
                  <dd className="text-sm font-bold text-slate-900">{visa.minEducation}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        {/* ─── Main Content + Sidebar ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid lg:grid-cols-[1fr_340px] gap-10">
            {/* LEFT: Tabbed content */}
            <div>
              {/* Success banner after application */}
              {successId && (
                <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4">
                  <CheckCircle2 className="size-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      Application Submitted Successfully!
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Your tracking ID:{' '}
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {successId}
                      </span>
                    </p>
                    <button
                      onClick={() => setIsTrackModalOpen(true)}
                      className="mt-2 text-xs font-bold text-brand-700 underline hover:no-underline"
                    >
                      Track this application →
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Nav */}
              <div className="flex border-b border-slate-200 bg-white rounded-t-2xl overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.key
                        ? tab.accent
                          ? 'border-amber-500 text-amber-600 bg-amber-50'
                          : 'border-brand-600 text-brand-700'
                        : `border-transparent ${tab.accent ? 'text-amber-600 hover:text-amber-700' : 'text-slate-600 hover:text-slate-900'}`
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-6 space-y-6">
                {/* TAB: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 font-display mb-2">
                        Program Overview
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {visa.overview}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-display mb-3">
                        Key Candidate Advantages
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {visa.keyBenefits.map((benefit, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                          >
                            <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Language Requirement
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {visa.languageRequirement}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Permit Currency
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {visa.currency} — {visa.country}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: REQUIREMENTS */}
                {activeTab === 'requirements' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 font-display mb-3 flex items-center gap-2">
                        <Shield className="size-4 text-brand-600" />
                        Eligibility Criteria
                      </h2>
                      <div className="space-y-2.5">
                        {visa.eligibilityChecklist.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800"
                          >
                            <span className="size-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 font-display mb-3 flex items-center gap-2">
                        <FileText className="size-4 text-emerald-600" />
                        Mandatory Document Dossier
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {visa.requiredDocuments.map((doc, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                          >
                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: STAGES */}
                {activeTab === 'stages' && (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                          Transparent Pricing
                        </span>
                        <h3 className="text-lg font-bold font-display mt-0.5">
                          Government & Agency Fees
                        </h3>
                      </div>
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p className="text-xs text-slate-400">Embassy Stamping Fee</p>
                          <p className="text-sm font-bold text-white">{visa.govtFee}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Legal Consultation</p>
                          <p className="text-base font-bold text-amber-400">{visa.serviceFee}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 font-display mb-4">
                        Step-by-Step Application Pathway
                      </h2>
                      <div className="space-y-3">
                        {visa.applicationStages.map((stage, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200"
                          >
                            <div className="size-9 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {String(i + 1).padStart(2, '0')}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 font-medium">
                              {stage}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: APPLY */}
                {activeTab === 'apply' && (
                  <form onSubmit={handleApply} className="space-y-5">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
                      <strong>Fast-Track Application:</strong> Submit your details to receive a real tracking ID and trigger our agency verification pipeline.
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Tariqul Islam"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+8801712345678"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                          NID / National ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="National ID number"
                          value={form.nid}
                          onChange={(e) => setForm({ ...form, nid: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          required
                          value={form.dateOfBirth}
                          onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                          Highest Qualification
                        </label>
                        <select
                          value={form.education}
                          onChange={(e) => setForm({ ...form, education: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                        >
                          <option>HSC / High School</option>
                          <option>Diploma in Engineering</option>
                          <option>Bachelor Degree</option>
                          <option>Master&apos;s / Postgraduate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                          Work Experience
                        </label>
                        <select
                          value={form.experienceYears}
                          onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                        >
                          <option value="0">Fresh Candidate (0 years)</option>
                          <option value="1">1 to 2 Years</option>
                          <option value="3">3 to 5 Years</option>
                          <option value="5">5+ Years (Senior)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3">Required Documents</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          ['Passport photo', 'passport-photo'],
                          ['Passport copy', 'passport-copy'],
                          ['NID front and back', 'nid-copy'],
                          ['Updated CV / Resume', 'resume'],
                          ['Educational certificates', 'education-certificates'],
                          ['Experience certificates', 'experience-certificates'],
                          ['Police clearance certificate', 'police-clearance'],
                          ['Medical report', 'medical-report'],
                        ].map(([label, name]) => (
                          <label key={name} className="block p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <span className="block text-xs font-bold text-slate-700 mb-2">{label} *</span>
                            <input
                              type="file"
                              name={name}
                              required
                              accept="image/jpeg,image/png,application/pdf"
                              className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-brand-700 hover:file:bg-brand-100"
                            />
                            <span className="mt-1.5 block text-[10px] text-slate-400">JPG, PNG or PDF</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        id="hasPassport"
                        checked={form.hasPassport}
                        onChange={(e) => setForm({ ...form, hasPassport: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500 size-4 shrink-0"
                      />
                      <span className="text-xs text-slate-700 font-medium">
                        I hold a valid passport with at least 12 months remaining validity.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Generating Official File & Tracking ID...</span>
                      ) : (
                        <>
                          <span>Submit Application for {visa.country} — {visa.visaTitle}</span>
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* CTA bar */}
              {activeTab !== 'apply' && (
                <div className="mt-4 flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Shield className="size-4 text-emerald-600 shrink-0" />
                    Embassy-Accredited Pre-Screening Guaranteed
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('apply')}
                    className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    Apply for this Work Visa <ArrowRight className="size-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: Sidebar */}
            <aside className="space-y-5">
              {/* Call-to-action card */}
             

              {/* Visa details card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg font-bold text-slate-900 font-display">Visa Details</h4>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{visa.badge || 'Visa'}</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 text-slate-500"><BadgeCheck className="size-4 text-brand-500" />Visa type</span><span className="font-semibold text-slate-900 text-right">{visa.categoryTag}</span></div>
                  <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 text-slate-500"><CalendarDays className="size-4 text-brand-500" />Validity</span><span className="font-semibold text-slate-900">{visa.validity}</span></div>
                  {visa.country === 'Malaysia' && <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 text-slate-500"><BedDouble className="size-4 text-brand-500" />Stay period</span><span className="font-semibold text-slate-900">30 Days</span></div>}
                  <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 text-slate-500"><Repeat2 className="size-4 text-brand-500" />Entry type</span><span className="font-semibold text-slate-900">{visa.country === 'Malaysia' ? 'Single Entry' : 'As stated'}</span></div>
                  <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 text-slate-500"><Timer className="size-4 text-brand-500" />Processing</span><span className="font-semibold text-slate-900 text-right">{visa.processingTime}</span></div>
                </div>
                <div className="border-t border-dashed border-slate-200 pt-4">
                  <div className="flex items-center justify-between py-2 text-sm"><span className="text-slate-500">Visa Fee × 1</span><span className="font-semibold text-slate-800">{visa.country === 'Malaysia' ? '৳ 4,250' : visa.govtFee}</span></div>
                  <div className="flex items-center justify-between py-2 text-sm"><span className="text-slate-500">Service Fee × 1</span><span className="font-semibold text-slate-800">{visa.country === 'Malaysia' ? '৳ 598' : visa.serviceFee}</span></div>
                  <div className="mt-3 flex items-end justify-between border-t border-dashed border-slate-200 pt-4"><span className="font-bold text-slate-900">Total Payable</span><span className="text-2xl font-black text-brand-700">{visa.country === 'Malaysia' ? '৳ 4,848' : visa.serviceFee}</span></div>
                  <button type="button" onClick={() => setActiveTab('apply')} className="mt-4 flex w-full items-center justify-center rounded-xl bg-amber-500 py-3 text-sm font-bold text-slate-950 hover:bg-amber-600">
                    Submit Documents <ArrowRight className="ml-2 size-4" />
                  </button>
                </div>
              </div>

              {/* Visa consultant */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h4 className="text-lg font-bold text-slate-900 font-display">Your Visa Consultant</h4>
                <div className="mt-5 flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-black text-brand-700">MU</div>
                  <div><p className="font-bold text-slate-900">Md. Mohi Uddin</p><p className="text-xs text-slate-500">Malaysia desk · since May 2020</p></div>
                </div>
                <div className="mt-5 divide-y divide-slate-100 text-sm">
                  <a href="tel:+8801811667722" className="flex items-center gap-3 py-3 text-slate-600 hover:text-brand-700"><PhoneCall className="size-4 text-brand-600" />+880 1811 667722</a>
                  <a href="mailto:info@visaboo.com" className="flex items-center gap-3 py-3 text-slate-600 hover:text-brand-700"><Mail className="size-4 text-brand-600" />info@visaboo.com</a>
                  <p className="flex items-start gap-3 py-3 text-slate-600"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" />Kabbokash Super Market, 4th Floor, Suite 14</p>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <a href="https://wa.me/8801811667722" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-bold text-emerald-700"><MessageCircle className="size-4" />WhatsApp</a>
                  <a href="mailto:info@visaboo.com" className="flex items-center justify-center gap-2 rounded-xl bg-brand-700 py-3 text-sm font-bold text-white"><MessageCircle className="size-4" />Chat Now</a>
                </div>
              </div>

              {/* Related visas */}
              {relatedVisas.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
                    <Globe2 className="size-4 text-brand-600" />
                    Also in {visa.region}
                  </h4>
                  <div className="space-y-2">
                    {relatedVisas.map((r) => (
                      <Link
                        key={r.id}
                        href={`/visa/${r.countrySlug}/${r.slug}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-50 group transition-colors"
                      >
                        <CountryFlag code={r.countryCode} name={r.country} size="size-6" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                            {r.country}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{r.visaTitle}</p>
                        </div>
                        <ArrowRight className="size-3.5 text-slate-300 group-hover:text-brand-600 transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <TrackVisaModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />
    </div>
  );
}
