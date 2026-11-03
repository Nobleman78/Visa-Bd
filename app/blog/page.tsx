"use client";

import Image from 'next/image';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Search,
  BookOpen,
} from "lucide-react";
import { STORIES, Story } from "../../data/stories-data";
import { fetchPublishedStories } from "../../lib/supabase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import TrackVisaModal from "../../components/TrackVisaModal";
import AuthModal from "../../components/AuthModal";
export default function BlogListingPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>(STORIES);

  useEffect(() => {
    fetchPublishedStories().then((apiStories) => {
      if (apiStories.length) setStories(apiStories);
    });
  }, []);
  const [user, setUser] = useState<{
    name: string;
    phone?: string;
    email?: string;
    role: string;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem('visabd_user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  const categories = [
    "All",
    "Work Policy Updates",
    "Job Seeker Guides",
    "Visa Regulations",
    "Middle East Visas",
    "Consular Checklist",
  ];

  const filteredStories = stories.filter((s) => {
    const matchesCategory =
      selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredStory = stories[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSelectCountryVisa={() => {
          router.push('/#explore-visas');
        }}
        user={user}
        onLogout={() => {
          localStorage.removeItem('visabd_user');
          localStorage.removeItem('visabd_supabase_session');
          setUser(null);
        }}
      />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Navigation */}

          {/* Hero Banner */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-950 font-display tracking-tight leading-tight">
              Stay Updated on{" "}
              <span className="text-amber-500">Immigration Blogs</span>
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
              Direct intelligence from our licensed solicitors on foreign
              ministry quota openings, salary threshold revisions, and visa
              application checklists.
            </p>

            {/* Search Box */}
            <div className="mt-8 max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs by country, visa type or policy..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-brand-700 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Article Card (Visaboo style prominent story) */}
          {selectedCategory === "All" && !searchQuery && (
            <div className="mb-14">
              <Link
                href={`/blog/${featuredStory.slug}`}
                className="group block bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-lift transition-all duration-300"
              >
                <div className="grid lg:grid-cols-12 items-center">
                  <div className="lg:col-span-7 relative aspect-16/10 lg:aspect-16/11 overflow-hidden bg-slate-900">
                    <Image
                      height={1000}
                      width={1000}
                      src={featuredStory.coverImage}
                      alt={featuredStory.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-3 text-xs font-bold text-brand-700 uppercase tracking-wider mb-2 font-display">
                        <span>{featuredStory.category}</span>
                        <span>•</span>
                        <span className="text-slate-400 font-normal">
                          {featuredStory.readingTime}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 group-hover:text-brand-700 transition-colors leading-snug">
                        {featuredStory.title}
                      </h2>

                      <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {featuredStory.excerpt}
                      </p>
                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          height={1000}
                          width={1000}
                          src={featuredStory.author.avatar}
                          alt={featuredStory.author.name}
                          className="size-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {featuredStory.author.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {featuredStory.author.role}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 group-hover:translate-x-1 transition-transform">
                        Read Story <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid of All Blogs */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <article
                key={story.id}
                className="group bg-white rounded-3xl p-4 border border-slate-200/90 shadow-card hover:shadow-lift transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <Link
                  href={`/blog/${story.slug}`}
                  className="block relative aspect-16/10 overflow-hidden rounded-2xl bg-slate-100"
                >
                  <Image
                    src={story.coverImage}
                    alt={story.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                   width={1200} height={800} />
                </Link>

                <div className="flex-1 flex flex-col px-2 pt-5 pb-2">
                  <Link href={`/blog/${story.slug}`}>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                  </Link>

                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                    {story.excerpt}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-2 min-w-0">
                      <Image
                        src={story.author.avatar}
                        alt={story.author.name}
                        className="size-7 rounded-full object-cover shrink-0"
                       width={1200} height={800} />
                      <span className="font-semibold text-slate-800 truncate">
                        {story.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${story.slug}`}
                      className="font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 shrink-0"
                    >
                      Read <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <BookOpen className="size-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">
                No blogs matched your filter
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing your search term or choosing a different category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-4 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
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
