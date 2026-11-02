"use client";

import Image from 'next/image';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';
import { Story } from '../../../data/stories-data';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import TrackVisaModal from '../../../components/TrackVisaModal';
import AuthModal from '../../../components/AuthModal';

interface Props {
  story: Story;
  relatedStories: Story[];
}

export default function ArticleContent({ story, relatedStories }: Props) {
  const router = useRouter();
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    phone?: string;
    email?: string;
    role: string;
    avatar: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSelectCountryVisa={() => {
          router.push('/#explore-visas');
        }}
        user={user}
        onLogout={() => setUser(null)}
      />

      <main className="flex-1 py-10 lg:py-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-6"
          >
            <Link
              href="/"
              className="hover:text-brand-700 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Home
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className="hover:text-brand-700 transition-colors"
            >
              Blogs
            </Link>
            <span>/</span>
            <span className="text-slate-800 truncate max-w-xs">
              {story.title}
            </span>
          </nav>

          {/* Article Header */}
          <header className="space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm inline-block">
              {story.category}
            </span>

            <h1 className="article-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-display tracking-tight leading-tight">
              {story.title}
            </h1>

            {/* Author & Date strip */}
            <div className="py-4 border-y border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <Image
                  src={story.author.avatar}
                  alt={story.author.name}
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover ring-2 ring-brand-100"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900">
                      {story.author.name}
                    </p>
                    <ShieldCheck className="size-3.5 text-brand-600" />
                  </div>
                  <p className="text-slate-500">{story.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="size-4" />
                  {story.publishedAt}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="size-4" />
                  {story.readingTime}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 font-semibold flex items-center gap-1.5 text-slate-700 transition-colors"
                >
                  <Share2 className="size-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </header>

          {/* Hero Cover Image */}
          <div className="mt-8 relative aspect-video overflow-hidden rounded-3xl shadow-lift bg-slate-900 border border-slate-200">
            <Image
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover"
             width={1200} height={800} />
          </div>

          {/* Excerpt Lead Box */}
          <div className="mt-8 p-5 bg-brand-50 border-l-4 border-brand-600 rounded-r-2xl">
            <p className="text-base sm:text-lg font-medium text-brand-950 leading-relaxed">
              {story.excerpt}
            </p>
          </div>

          {/* Article Body */}
          <div className="mt-8 prose prose-slate max-w-none text-slate-800 leading-relaxed text-base space-y-5">
            <div className="whitespace-pre-line leading-relaxed font-sans">
              {story.content}
            </div>

            {/* Consular CTA Box */}
            <div className="my-8 p-6 bg-slate-900 text-white rounded-3xl shadow-card border border-slate-800">
              <div className="flex items-center gap-2.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 font-display">
                <ShieldCheck className="size-4" />
                Consular Legal Verification Notice
              </div>
              <h4 className="text-lg font-bold font-display text-white mb-2">
                Need your documents evaluated before embassy submission?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our licensed immigration solicitors verify certificate
                translations, Prometric score validity, and police clearance
                expiration windows. Contact our Dhaka consular counter for a
                full file audit.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="tel:+8801711752231"
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
                >
                  <PhoneCall className="size-3.5" />
                  <span>Call: +8801711-752231</span>
                </a>
                <Link
                  href="/#explore-visas"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Explore Work Visa Programs</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Related Blogs */}
          {relatedStories.length > 0 && (
            <section
              aria-labelledby="related-heading"
              className="mt-16 pt-12 border-t border-slate-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="related-heading"
                  className="text-xl font-bold font-display text-slate-950"
                >
                  Related Blogs
                </h2>
                <Link
                  href="/blog"
                  className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRight className="size-3" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {relatedStories.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group block bg-white rounded-2xl p-4 border border-slate-200 shadow-card hover:shadow-lift transition-all duration-200"
                  >
                    <div className="aspect-16/10 overflow-hidden rounded-xl mb-3 bg-slate-100">
                      <Image
                        src={rel.coverImage}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                       width={1200} height={800} />
                    </div>
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider font-display">
                      {rel.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-display mt-1 group-hover:text-brand-700 transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Modals */}
      <TrackVisaModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
      />
    </div>
  );
}
