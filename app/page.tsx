import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import QuickBookingBar from '@/components/home/QuickBookingBar';
import SmileCostCalculator from '@/components/home/SmileCostCalculator';
import ServicesSection from '@/components/home/ServicesSection';
import WhyUsSection from '@/components/home/WhyUsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import DoctorsSection from '@/components/home/DoctorsSection';
import BranchesSection from '@/components/home/BranchesSection';
import FaqSection from '@/components/home/FaqSection';
import Footer from '@/components/layout/Footer';
import SmileAssistant from '@/components/ai/SmileAssistant';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <QuickBookingBar />
        <ServicesSection />
        <SmileCostCalculator />
        <WhyUsSection />
        <TestimonialsSection />
        <DoctorsSection />
        <BranchesSection />
        <FaqSection />
      </main>

      <Footer />
      <SmileAssistant />
    </div>
  );
}

