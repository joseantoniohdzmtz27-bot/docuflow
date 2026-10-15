import React from 'react';
import { Hero } from '@/components/Hero';
import { ToolGrid } from '@/components/ToolGrid';
import { FeatureHighlights } from '@/components/FeatureHighlights';
import { FAQ_ITEMS } from '@/lib/constants';
import { HelpCircle, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Full Tool Catalog */}
      <ToolGrid />

      {/* 3. Platform Architecture & Features */}
      <FeatureHighlights />

      {/* 4. FAQ Section */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Preguntas Frecuentes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Todo lo que necesitas saber
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Respuestas claras sobre la seguridad, velocidad y capacidades de DocuPulse Pro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQ_ITEMS.map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
            >
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom CTA Banner */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-brand-600 via-purpleBrand-600 to-accentCyan-600 text-white shadow-2xl shadow-brand-500/20 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              ¿Listo para procesar tus documentos más rápido que nunca?
            </h2>
            <p className="text-xs sm:text-sm text-brand-100 max-w-lg mx-auto leading-relaxed">
              Únete a millones de profesionales y empresas que utilizan DocuPulse Pro a diario para sus flujos de trabajo.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/merge-pdf"
                className="px-8 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 font-black text-sm shadow-xl transition-all hover:scale-105"
              >
                Comenzar gratis ahora
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
