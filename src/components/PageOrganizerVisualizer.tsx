'use client';

import React, { useEffect, useState } from 'react';
import {
  RotateCw,
  Trash2,
  Copy,
  Undo2,
  ZoomIn,
  Check,
  Eye,
  GripHorizontal,
} from 'lucide-react';
import { useToolStore } from '@/store/useToolStore';
import { renderPdfPageToCanvas, loadPDFDocument } from '@/lib/pdf-engine';
import { PDFPageItem } from '@/types';

export function PageOrganizerVisualizer() {
  const { files, pages, setPages, rotatePage, deletePage, rotateAllPages } = useToolStore();
  const [loadingThumbnails, setLoadingThumbnails] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const file = files[0]?.file;

  useEffect(() => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) return;

    let isMounted = true;
    async function loadPages() {
      setLoadingThumbnails(true);
      try {
        const pdfjsLib = await import('pdfjs-dist');
        if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        }

        const { bytes } = await loadPDFDocument(file);
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const total = pdf.numPages;

        const initialPages: PDFPageItem[] = [];

        for (let i = 0; i < total; i++) {
          initialPages.push({
            pageNumber: i + 1,
            originalIndex: i,
            rotation: 0,
            isDeleted: false,
          });
        }

        if (isMounted) {
          setPages(initialPages);
        }

        // Render thumbnails progressively
        for (let i = 0; i < total; i++) {
          if (!isMounted) break;
          const url = await renderPdfPageToCanvas(file, i, 0.4);
          if (isMounted) {
            setPages(
              initialPages.map((p, idx) => (idx === i ? { ...p, dataUrl: url } : p))
            );
          }
        }
      } catch (err) {
        console.error('Error loading page thumbnails:', err);
      } finally {
        if (isMounted) setLoadingThumbnails(false);
      }
    }

    loadPages();

    return () => {
      isMounted = false;
    };
  }, [file, setPages]);

  if (!file) return null;

  const handleDuplicate = (index: number) => {
    const target = pages[index];
    const newPage: PDFPageItem = {
      ...target,
      pageNumber: pages.length + 1,
    };
    const updated = [...pages];
    updated.splice(index + 1, 0, newPage);
    setPages(updated);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const items = [...pages];
    const [dragged] = items.splice(draggedIndex, 1);
    items.splice(index, 0, dragged);
    setDraggedIndex(index);
    setPages(items);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const activePagesCount = pages.filter((p) => !p.isDeleted).length;

  return (
    <div className="space-y-5">
      {/* Top Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            {activePagesCount} de {pages.length} páginas seleccionadas
          </span>
          {loadingThumbnails && (
            <span className="text-xs text-brand-600 dark:text-brand-400 animate-pulse font-medium">
              • Generando miniaturas...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => rotateAllPages(90)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rotar todas 90°</span>
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pages.map((page, index) => {
          return (
            <div
              key={`${page.originalIndex}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative rounded-2xl border p-3 flex flex-col items-center justify-between transition-all group select-none ${
                page.isDeleted
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 opacity-40'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-brand-500'
              }`}
            >
              {/* Top Page Header */}
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Pág. {index + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => rotatePage(page.pageNumber)}
                    className="p-1 rounded text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
                    title="Rotar página 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(index)}
                    className="p-1 rounded text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-slate-800 transition-colors"
                    title="Duplicar página"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePage(page.pageNumber)}
                    className={`p-1 rounded transition-colors ${
                      page.isDeleted
                        ? 'text-rose-600 bg-rose-100 dark:bg-rose-950'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800'
                    }`}
                    title={page.isDeleted ? 'Restaurar página' : 'Eliminar página'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Page Thumbnail Canvas/Image */}
              <div
                className="w-full h-44 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2 relative shadow-inner cursor-grab active:cursor-grabbing"
              >
                {page.dataUrl ? (
                  <img
                    src={page.dataUrl}
                    alt={`Página ${index + 1}`}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 rounded shadow-xs"
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto mb-1" />
                    <span className="text-[10px]">Página {index + 1}</span>
                  </div>
                )}

                {page.isDeleted && (
                  <div className="absolute inset-0 bg-rose-900/40 backdrop-blur-xs flex items-center justify-center">
                    <span className="text-xs font-black text-white px-2 py-1 bg-rose-600 rounded-lg shadow-sm">
                      ELIMINADA
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Drag Handle info */}
              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripHorizontal className="w-3 h-3" />
                <span>Arrastra para reordenar</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
