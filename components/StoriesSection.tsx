"use client";

import Image from 'next/image';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { STORIES, Story } from '../data/stories-data';
import { fetchPublishedStories } from '../lib/supabase';

export default function StoriesSection() {
  const [stories, setStories] = useState<Story[]>(STORIES);

  useEffect(() => {
    fetchPublishedStories().then((apiStories) => {
      if (apiStories.length) setStories(apiStories);
    });
  }, []);

  // Show first 3 stories on homepage
  const featuredStories = stories.slice(0, 3);

  return (
    <section id="stories" className="py-16 lg:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-display tracking-tight">
            Stay <span className="text-amber-500">Updated</span> on the Stories
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Essential policy changes, embassy quota releases, and career guides written by our senior immigration caseworkers.
          </p>
        </div>

        {/* 3 Story Cards Grid Linking Directly to /blog/[slug] */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {featuredStories.map((story) => (
            <article
              key={story.id}
              className="group bg-white rounded-xl p-4 border border-slate-200/90 shadow-card hover:shadow-lift transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Cover Image & Category Chip */}
              <Link
                href={`/blog/${story.slug}`}
                className="block relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-100"
              >
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 width={1200} height={800} />
              </Link>

              {/* Body */}
              <div className="flex-1 flex flex-col px-2 pt-5 pb-2">
                <Link href={`/blog/${story.slug}`}>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                </Link>

                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
                  {story.excerpt}
                </p>

                {/* Author & Date Footer */}
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
                    Read Story <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all button linking to /blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-slate-200 hover:border-brand-600 hover:text-brand-700 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-sm"
          >
            <span>View All Stories & Articles</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
