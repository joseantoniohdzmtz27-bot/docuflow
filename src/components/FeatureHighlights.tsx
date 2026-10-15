import React from 'react';
import { ShieldCheck, Zap, Laptop, Lock, Sparkles, Cpu } from 'lucide-react';

export function FeatureHighlights() {
  const features = [
    {
      icon: Zap,
      title: 'Procesamiento en Navegador',
      description:
        'La mayoría de las conversiones se realizan a través del motor WebAssembly de tu propio navegador. Cero tiempos de subida pesados y máxima velocidad.',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50',
    },
    {
      icon: ShieldCheck,
      title: 'Privacidad y Seguridad Total',
      description:
        'Tus archivos confidenciales nunca se almacenan permanentemente. Cifrado de extremo a extremo y borrado automático en minutos.',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      icon: Cpu,
      title: 'Document Intelligence con IA',
      description:
        'Chatea con tus PDFs, extrae cláusulas legales, importes y genera resúmenes ejecutivos con modelos de lenguaje de última generación.',
      color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/50',
    },
    {
      icon: Laptop,
      title: '100% Multiplataforma',
      description:
        'Optimizado al milímetro para computadoras de escritorio, tablets y smartphones sin necesidad de instalar programas adicionales.',
      color: 'text-purpleBrand-500 bg-purple-50 dark:bg-purple-950/50',
    },
  ];

  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ¿Por qué elegir DocuPulse Pro?
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Diseñado para empresas y profesionales que exigen rapidez, diseño de vanguardia y seguridad sin compromisos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
