"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import HeroSearch from '../components/HeroSearch';
import ExploreWorkVisa from '../components/ExploreWorkVisa';
import WhyChooseUs from '../components/WhyChooseUs';
import TestimonialsSection from '../components/TestimonialsSection';
import StoriesSection from '../components/StoriesSection';
import Footer from '../components/Footer';

import TrackVisaModal from '../components/TrackVisaModal';
import AuthModal from '../components/AuthModal';

export default function Home() {
  // Modal states
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [currentTrackingId, setCurrentTrackingId] = useState('VBD-2026-89412');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    phone: string;
    role: string;
    avatar: string;
  } | null>(null);

  // Handle header country selection
  const handleSelectCountryFromHeader = (countryName: string) => {
    const el = document.getElementById('explore-visas');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* 1. Global Header Navigation */}
      <Header
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSelectCountryVisa={handleSelectCountryFromHeader}
        user={user}
        onLogout={() => setUser(null)}
      />

      <main className="flex-1">
        {/* 2. Hero Section: "Find Your Work Visa" */}
        <HeroSearch />

        {/* 3. Explore Work Visa by Country */}
        <ExploreWorkVisa />

        {/* 4. Why Choose Our Visa Agency */}
        <WhyChooseUs />

        {/* 5. What Our Candidates Say (Testimonials) */}
        <TestimonialsSection />

        {/* 6. Stay Updated on the Blogs (Links to /blog/[slug] and /blog) */}
        <StoriesSection />
      </main>

      {/* 7. Global Footer */}
      <Footer
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* MODALS */}
      {/* Track Work Visa Modal */}
      <TrackVisaModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        initialTrackingId={currentTrackingId}
      />

      {/* Phone Number + OTP Verification Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
      />

    </div>
  );
}
