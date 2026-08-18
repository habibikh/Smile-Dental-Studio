import React from 'react';
import Navbar from '@/components/layout/Navbar';
import BranchesSection from '@/components/home/BranchesSection';
import Footer from '@/components/layout/Footer';
import SmileAssistant from '@/components/ai/SmileAssistant';

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />
      <main className="flex-1 pt-20">
        <BranchesSection />
      </main>
      <Footer />
      <SmileAssistant />
    </div>
  );
}
