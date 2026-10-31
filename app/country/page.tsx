"use client";

import Image from 'next/image';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Globe2, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TrackVisaModal from '../../components/TrackVisaModal';
import AuthModal from '../../components/AuthModal';
import { WorkVisa } from '../../data/visa-data';
import { fetchPublishedVisas } from '../../lib/supabase';

export default function CountriesPage() {
  const router = useRouter();
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; phone: string; role: string; avatar: string } | null>(null);
  const [visas, setVisas] = useState<WorkVisa[]>([]);

  useEffect(() => {
    fetchPublishedVisas().then((apiVisas) => {
      if (apiVisas.length) setVisas(apiVisas);
    });
  }, []);

  const countries = Array.from(
    new Map(visas.map((visa) => [visa.country, visa])).values()
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSelectCountryVisa={(countryName) => {
          const match = visas.find((visa) => visa.country.toLowerCase() === countryName.toLowerCase());
          if (match) router.push(`/visa/${match.countrySlug}/${match.slug}`);
        }}
        user={user}
        onLogout={() => setUser(null)}
      />

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow mb-3 justify-center">
            <Globe2 className="size-3.5 text-brand-600" />
            <span>All Destinations</span>
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Explore Work Visa by <span className="text-amber-500">Country</span>
          </h1>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {countries.map((visa) => (
            <Link
              key={visa.country}
              href={`/visa/${visa.countrySlug}/${visa.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={visa.image}
                  alt={visa.country}
                  loading="lazy"
                  className="block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                 width={1200} height={800} />
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="font-display text-base font-bold text-slate-900 group-hover:text-brand-700">{visa.country}</h2>
                <ArrowRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
      <TrackVisaModal isOpen={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={setUser} />
    </div>
  );
}
