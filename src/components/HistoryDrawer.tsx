'use client';

import React from 'react';
import { X, History, Trash2, ArrowUpRight, FileCheck, HardDrive } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { formatBytes } from '@/lib/utils';
import Link from 'next/link';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryDrawer({ isOpen, onClose }: HistoryDrawerProps) {
  const { history, clearHistory } = useUserStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Historial de Archivos
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                title="Limpiar historial"
                className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <FileCheck className="w-10 h-10 mx-auto mb-3 opacity-30 text-brand-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Sin archivos procesados recientemente
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tus conversiones y descargas aparecerán aquí para fácil acceso.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const saved = item.originalSize - item.outputSize;
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 px-2 py-0.5 rounded-md border border-brand-200/40 dark:border-brand-800/40">
                      {item.toolName}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatBytes(item.outputSize)}</span>
                    </div>

                    {saved > 0 && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        -{Math.round((saved / item.originalSize) * 100)}% ahorrado
                      </span>
                    )}
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <Link
                      href={`/${item.toolId}`}
                      onClick={onClose}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Volver a usar</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
          Los archivos temporales se eliminan automáticamente tras el procesamiento local.
        </div>
      </div>
    </div>
  );
}
