import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ServicesSection from '@/components/home/ServicesSection';
import FaqSection from '@/components/home/FaqSection';
import Footer from '@/components/layout/Footer';
import SmileAssistant from '@/components/ai/SmileAssistant';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />
      <main className="flex-1 pt-20">
        <ServicesSection />
        <FaqSection />
      </main>
      <Footer />
      <SmileAssistant />
    </div>
  );
}
