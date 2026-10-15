'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Files,
  Users,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import { PLATFORM_STATS } from '@/lib/constants';

interface HeroProps {
  onSelectFilesClick?: () => void;
}

export function Hero({ onSelectFilesClick }: HeroProps) {
  const statIcons: Record<string, any> = {
    Files: Files,
    Users: Users,
    CheckCircle2: CheckCircle2,
    Zap: Zap,
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Subtle background glow spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/15 via-purpleBrand-500/15 to-accentCyan-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200/60 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
          <span>La suite documental de nueva generación • Más rápida y potente</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Todas tus herramientas PDF e imágenes en{' '}
          <span className="bg-gradient-to-r from-brand-600 via-purpleBrand-600 to-accentCyan-500 bg-clip-text text-transparent">
            un solo lugar
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Une, divide, convierte, comprime y optimiza tus archivos de forma rápida y segura. Procesamiento local de alta velocidad con inteligencia artificial.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/merge-pdf"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-purpleBrand-600 to-brand-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Seleccionar archivo</span>
          </Link>

          <a
            href="#herramientas"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explorar herramientas</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Sin límites molestos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-brand-500" />
            <span>100% Procesamiento en navegador</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-accentCyan-500" />
            <span>Cero registro obligatorio</span>
          </div>
        </div>

        {/* Live Platform Stats */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-xl backdrop-blur-md">
          {PLATFORM_STATS.map((stat, i) => {
            const Icon = statIcons[stat.icon] || Files;
            return (
              <div
                key={i}
                className="p-3.5 text-center flex flex-col items-center justify-center rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
