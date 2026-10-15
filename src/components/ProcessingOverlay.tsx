'use client';

import React from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToolStore } from '@/store/useToolStore';

export function ProcessingOverlay() {
  const { stage, progressPercent, stageMessage } = useToolStore();

  if (stage !== 'uploading' && stage !== 'processing') {
    return null;
  }

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center flex flex-col items-center justify-center max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <Sparkles className="w-5 h-5 text-accentCyan-500 absolute -top-1 -right-1 animate-bounce" />
      </div>

      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
        {stageMessage || 'Procesando tu documento...'}
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
        Por favor espera unos segundos mientras optimizamos tu archivo
      </p>

      {/* Progress Bar Container */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 via-purpleBrand-500 to-accentCyan-500 transition-all duration-300 shadow-sm"
          style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
        />
      </div>

      <div className="w-full flex items-center justify-between text-xs text-slate-400 font-semibold mt-2">
        <span>{stage === 'uploading' ? 'Cargando datos' : 'Procesando algoritmo'}</span>
        <span>{progressPercent}%</span>
      </div>
    </div>
  );
}
