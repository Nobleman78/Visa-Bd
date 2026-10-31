"use client";

import Image from "next/image";

import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { TESTIMONIALS } from "../data/testimonials-data";

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const carousel = scrollRef.current;
    if (!carousel) return;

    const updateArrows = () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      setCanScrollLeft(carousel.scrollLeft > 1);
      setCanScrollRight(carousel.scrollLeft < maxScroll - 1);
    };

    updateArrows();
    carousel.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      carousel.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-slate-50 border-y border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Scroll Navigation */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-display tracking-tight">
              Real Stories from{" "}
              <span className="text-brand-700">Placed Candidates</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl font-normal">
              Read how skilled professionals and technical graduates
              successfully relocated with full work authorization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="size-11 rounded-full bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-700 text-slate-700 flex items-center justify-center shadow-sm transition-all disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 disabled:opacity-60 disabled:hover:border-slate-100"
              aria-label="Previous testimonials"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="size-11 rounded-full bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-700 text-slate-700 flex items-center justify-center shadow-sm transition-all disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 disabled:opacity-60 disabled:hover:border-slate-100"
              aria-label="Next testimonials"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Cards Carousel */}
        <div
          ref={scrollRef}
          className="mt-10 flex gap-6 overflow-x-auto no-scrollbar pb-6 pt-2 snap-x"
        >
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.id}
              className="w-[85%] sm:w-[24rem] shrink-0 snap-start bg-white rounded-md p-7 border border-slate-200/80 shadow-card hover:shadow-lift transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {t.flag} {t.country}
                </span>
              </div>

              <blockquote className="text-sm text-slate-700 leading-relaxed italic flex-1">
                &ldquo;{t.comment}&rdquo;
              </blockquote>

              <figcaption className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  className="size-12 rounded-full object-cover ring-2 ring-slate-100"
                  width={1200}
                  height={800}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 font-display truncate">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {t.role} •{" "}
                    <span className="text-brand-700">{t.visaType}</span>
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
