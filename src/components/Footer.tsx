import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Zap, Lock, Heart, Globe, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-purpleBrand-500 to-accentCyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                DocuPulse<span className="text-accentCyan-400 text-xs ml-1 px-1.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-semibold uppercase">PRO</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              La plataforma SaaS de procesamiento y optimización de documentos PDF e imágenes de mayor rendimiento. Seguridad de nivel empresarial y procesamiento ultra rápido.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-400">
                <Zap className="w-4 h-4" />
                <span>WebAssembly Fast</span>
              </div>
              <div className="flex items-center gap-1.5 text-accentCyan-400">
                <Lock className="w-4 h-4" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>

          {/* PDF Esenciales */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              PDF Esenciales
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/merge-pdf" className="hover:text-white transition-colors">
                  Unir PDF
                </Link>
              </li>
              <li>
                <Link href="/split-pdf" className="hover:text-white transition-colors">
                  Dividir PDF
                </Link>
              </li>
              <li>
                <Link href="/organize-pdf" className="hover:text-white transition-colors">
                  Organizar páginas
                </Link>
              </li>
              <li>
                <Link href="/compress-pdf" className="hover:text-white transition-colors">
                  Comprimir PDF
                </Link>
              </li>
              <li>
                <Link href="/rotate-pdf" className="hover:text-white transition-colors">
                  Rotar PDF
                </Link>
              </li>
              <li>
                <Link href="/delete-pages" className="hover:text-white transition-colors">
                  Eliminar páginas
                </Link>
              </li>
            </ul>
          </div>

          {/* Conversiones */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Conversiones
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/pdf-to-word" className="hover:text-white transition-colors">
                  PDF a Word (.docx)
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-excel" className="hover:text-white transition-colors">
                  PDF a Excel (.xlsx)
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-jpg" className="hover:text-white transition-colors">
                  PDF a JPG HD
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-png" className="hover:text-white transition-colors">
                  PDF a PNG
                </Link>
              </li>
              <li>
                <Link href="/jpg-to-pdf" className="hover:text-white transition-colors">
                  JPG a PDF
                </Link>
              </li>
              <li>
                <Link href="/image-converter" className="hover:text-white transition-colors">
                  Conversor Universal
                </Link>
              </li>
            </ul>
          </div>

          {/* IA & Plataforma */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              IA & Plataforma
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/ai-chat" className="text-accentCyan-400 hover:text-accentCyan-300 font-semibold transition-colors flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" />
                  Chat con PDF (IA)
                </Link>
              </li>
              <li>
                <Link href="/ai-summarizer" className="hover:text-white transition-colors">
                  Resumen Ejecutivo IA
                </Link>
              </li>
              <li>
                <Link href="/protect-pdf" className="hover:text-white transition-colors">
                  Proteger con clave
                </Link>
              </li>
              <li>
                <Link href="/watermark-pdf" className="hover:text-white transition-colors">
                  Marca de agua
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard de Métricas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DocuPulse Pro SaaS. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Español (Global)
            </span>
            <span className="hover:text-slate-400 cursor-pointer">Privacidad & Seguridad</span>
            <span className="hover:text-slate-400 cursor-pointer">Términos de Servicio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
