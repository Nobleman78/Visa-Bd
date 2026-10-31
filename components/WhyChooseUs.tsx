"use client";

import Image from 'next/image';
import { 
  ShieldCheck, 
  ThumbsUp, 
  Timer, 
  Receipt, 
  Headphones, 
  Award
} from 'lucide-react';

export default function WhyChooseUs() {
  const pillars = [
    {
      title: "98.4% Proven Approval Rate",
      description: "A visa file is only as strong as its weakest document. Every dossier is scrutinized by senior immigration consultants before submission.",
      icon: ThumbsUp,
      badgeColor: "bg-emerald-500",
      textColor: "text-emerald-400"
    },
    {
      title: "Fast & Predictable Processing",
      description: "Direct embassy consular appointments, official document translations, and live status updates without unnecessary bureaucratic bottlenecks.",
      icon: Timer,
      badgeColor: "bg-amber-500",
      textColor: "text-amber-400"
    },
    {
      title: "100% Transparent Fees",
      description: "Government consular tariffs, attestation costs, and our legal service charges are published upfront with zero surprise surcharges.",
      icon: Receipt,
      badgeColor: "bg-brand-500",
      textColor: "text-blue-400"
    },
    {
      title: "Consular Support That Answers",
      description: "Direct telephone hotline, designated WhatsApp case liaison, and physical consultation counters in Dhaka, Chittagong, and Sylhet.",
      icon: Headphones,
      badgeColor: "bg-rose-500",
      textColor: "text-rose-400"
    }
  ];

  return (
    <section id="why-choose" className="py-20 lg:py-28 bg-slate-950 text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Visual Photo Mosaic (Visaboo style) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80"
                  alt="Legal Work Visa Consultation"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <p className="text-xs font-bold text-white">One-on-One Embassy Guidance</p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80"
                  alt="International Airport Departure"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <p className="text-xs font-bold text-white">Guaranteed Travel Coordination</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
                  alt="Official Embassy Document Verification"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <p className="text-xs font-bold text-white">Certified Document Attestations</p>
                </div>
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-brand-900/60 p-6 flex flex-col justify-between">
                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
                  <Award className="size-7" />
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold font-display text-white">12+ Years</h4>
                  <p className="text-xs text-slate-300 mt-1">Dedicated international labor & consular legal expertise</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Values & Copy */}
          <div>
            <div className="eyebrow-dark mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/10">
              <ShieldCheck className="size-3.5 text-amber-400" />
              <span>Accredited Work Visa Agency</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-tight">
              Why Choose Our <span className="text-amber-400">Work Visa Agency?</span>
            </h2>

            <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Obtaining an overseas work visa is a life-defining milestone. Rather than leaving your application to unpredictable middlemen, our team of licensed immigration solicitors, language trainers, and consular caseworkers ensures your file complies fully with foreign labor ministry guidelines.
            </p>

            {/* 4 Pillars List */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {pillars.map((pillar, i) => {
                const IconComponent = pillar.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <span className={`size-11 shrink-0 rounded-2xl ${pillar.badgeColor} text-white flex items-center justify-center shadow-md`}>
                      <IconComponent className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-white">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
}
