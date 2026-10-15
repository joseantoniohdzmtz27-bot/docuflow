'use client';

import React, { useEffect, useState } from 'react';
import {
  Download,
  Archive,
  RefreshCw,
  CheckCircle2,
  Share2,
  FileCheck,
  HardDrive,
  Copy,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToolStore } from '@/store/useToolStore';
import { formatBytes, downloadFile } from '@/lib/utils';
import { createZip, downloadZipFile } from '@/lib/zip-engine';
import { ToolDefinition } from '@/types';
import Link from 'next/link';

interface ResultCardProps {
  tool: ToolDefinition;
}

export function ResultCard({ tool }: ResultCardProps) {
  const { results, resetAll } = useToolStore();
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti on finish
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  if (results.length === 0) return null;

  const totalOriginalSize = results.reduce((acc, r) => acc + (r.originalSize || r.size), 0);
  const totalNewSize = results.reduce((acc, r) => acc + r.size, 0);
  const savedBytes = Math.max(0, totalOriginalSize - totalNewSize);
  const savedPercent = totalOriginalSize > 0 ? Math.round((savedBytes / totalOriginalSize) * 100) : 0;

  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      const zipBlob = await createZip(
        results.map((r) => ({
          name: r.name,
          data: r.blob,
        }))
      );
      downloadZipFile(zipBlob, `${tool.slug}_resultados.zip`);
    } catch (err) {
      console.error('Error creating ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Success Card Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ¡Documento procesado con éxito!
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Tus archivos están listos para ser descargados de forma segura e instantánea.
        </p>

        {/* Savings Badge if compressed */}
        {savedBytes > 0 && (
          <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>
              Ahorraste {formatBytes(savedBytes)} ({savedPercent}% más ligero)
            </span>
          </div>
        )}

        {/* Primary Download Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {results.length === 1 ? (
            <button
              type="button"
              onClick={() => downloadFile(results[0].blob, results[0].name)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-purpleBrand-600 to-accentCyan-600 hover:opacity-95 text-white font-extrabold text-base shadow-xl shadow-brand-500/25 flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              <span>Descargar {results[0].name}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-purpleBrand-600 to-accentCyan-600 hover:opacity-95 text-white font-extrabold text-base shadow-xl shadow-brand-500/25 flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Archive className="w-5 h-5" />
                <span>{isZipping ? 'Comprimiendo ZIP...' : 'Descargar todos (.ZIP)'}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={resetAll}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Procesar otro</span>
          </button>
        </div>
      </div>

      {/* Result Files List (if multiple or detailed) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          <span>Archivos generados ({results.length})</span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline cursor-pointer lowercase font-medium"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? '¡Enlace copiado!' : 'compartir herramienta'}</span>
          </button>
        </div>

        {results.map((r, i) => (
          <div
            key={r.id || i}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {r.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {formatBytes(r.size)}
                  {r.originalSize && r.originalSize > r.size && (
                    <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                      (Antes: {formatBytes(r.originalSize)})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => downloadFile(r.blob, r.name)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/70 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              title="Descargar archivo"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
