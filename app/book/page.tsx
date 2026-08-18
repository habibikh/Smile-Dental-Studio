import React, { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingWizard from '@/components/booking/BookingWizard';
import SmileAssistant from '@/components/ai/SmileAssistant';
import { Loader2 } from 'lucide-react';

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 relative overflow-hidden">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-teal-700 mb-3" />
              <p className="text-sm font-medium text-slate-600">Loading appointment booking wizard...</p>
            </div>
          }
        >
          <BookingWizard />
        </Suspense>
      </main>

      <Footer />
      <SmileAssistant />
    </div>
  );
}
