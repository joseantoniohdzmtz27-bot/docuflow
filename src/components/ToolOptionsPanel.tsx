'use client';

import React from 'react';
import {
  ArrowRight,
  ArrowRightCircle,
  Sliders,
  Check,
  Lock,
  Unlock,
  Stamp,
  Hash,
  Scissors,
  Minimize2,
  RotateCw,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Layers,
  Sparkles,
  Globe,
  Crop,
  EyeOff,
  PenTool,
  Wrench,
  FileCheck,
} from 'lucide-react';
import { useToolStore } from '@/store/useToolStore';
import { ToolDefinition } from '@/types';

interface ToolOptionsPanelProps {
  tool: ToolDefinition;
  onProcess?: () => void;
  isProcessing?: boolean;
}

export function ToolOptionsPanel({ tool, onProcess, isProcessing = false }: ToolOptionsPanelProps) {
  const {
    files,
    compressionOptions,
    setCompressionOptions,
    splitOptions,
    setSplitOptions,
    watermarkOptions,
    setWatermarkOptions,
    pageNumberOptions,
    setPageNumberOptions,
    protectOptions,
    setProtectOptions,
    imageConvertOptions,
    setImageConvertOptions,
    imageOptimizeOptions,
    setImageOptimizeOptions,
    imageToPdfOptions,
    setImageToPdfOptions,
    mergePdfOptions,
    setMergePdfOptions,
    pdfToJpgOptions,
    setPdfToJpgOptions,
    rotatePdfOptions,
    setRotatePdfOptions,
    ocrPdfOptions,
    setOcrPdfOptions,
    reorderFiles,
  } = useToolStore();

  // Helper to get formatted header title
  const getPanelTitle = () => {
    switch (tool.id) {
      case 'jpg-to-pdf':
      case 'png-to-pdf':
      case 'scan-to-pdf':
        return 'Image to PDF options';
      case 'merge-pdf':
        return 'Merge PDF options';
      case 'split-pdf':
        return 'Split PDF options';
      case 'compress-pdf':
        return 'Compress PDF options';
      case 'pdf-to-jpg':
      case 'pdf-to-png':
      case 'pdf-to-webp':
        return 'PDF to Image options';
      case 'word-to-pdf':
      case 'excel-to-pdf':
      case 'powerpoint-to-pdf':
      case 'html-to-pdf':
        return 'Document to PDF options';
      case 'pdf-to-word':
      case 'pdf-to-excel':
      case 'pdf-to-powerpoint':
      case 'pdf-to-txt':
      case 'pdf-to-markdown':
        return 'Convert PDF options';
      case 'rotate-pdf':
        return 'Rotate PDF options';
      case 'protect-pdf':
        return 'Protect PDF options';
      case 'unlock-pdf':
        return 'Unlock PDF options';
      case 'watermark-pdf':
      case 'add-watermark':
        return 'Watermark options';
      case 'number-pages':
      case 'add-page-numbers':
        return 'Page numbers options';
      case 'remove-pages':
      case 'delete-pages':
        return 'Remove pages options';
      case 'extract-pages':
        return 'Extract pages options';
      case 'organize-pdf':
        return 'Organize PDF options';
      case 'repair-pdf':
        return 'Repair PDF options';
      case 'ocr-pdf':
        return 'OCR PDF options';
      case 'sign-pdf':
        return 'Sign PDF options';
      case 'redact-pdf':
        return 'Redact PDF options';
      case 'crop-pdf':
        return 'Crop PDF options';
      case 'pdf-to-pdfa':
        return 'PDF/A options';
      case 'image-converter':
        return 'Image converter options';
      case 'image-optimizer':
        return 'Image optimizer options';
      default:
        return `${tool.shortName || tool.name} options`;
    }
  };

  // Helper to get action button label
  const getActionLabel = () => {
    switch (tool.id) {
      case 'jpg-to-pdf':
      case 'png-to-pdf':
      case 'scan-to-pdf':
        return 'Convert to PDF';
      case 'merge-pdf':
        return 'Merge PDF';
      case 'split-pdf':
        return 'Split PDF';
      case 'compress-pdf':
        return 'Compress PDF';
      case 'pdf-to-jpg':
        return 'Convert to JPG';
      case 'pdf-to-png':
        return 'Convert to PNG';
      case 'pdf-to-word':
        return 'Convert to Word';
      case 'pdf-to-excel':
        return 'Convert to Excel';
      case 'pdf-to-powerpoint':
        return 'Convert to PPTX';
      case 'pdf-to-txt':
        return 'Convert to Text';
      case 'pdf-to-markdown':
        return 'Convert to Markdown';
      case 'word-to-pdf':
      case 'excel-to-pdf':
      case 'powerpoint-to-pdf':
      case 'html-to-pdf':
        return 'Convert to PDF';
      case 'rotate-pdf':
        return 'Rotate PDF';
      case 'protect-pdf':
        return 'Protect PDF';
      case 'unlock-pdf':
        return 'Unlock PDF';
      case 'watermark-pdf':
      case 'add-watermark':
        return 'Add Watermark';
      case 'number-pages':
      case 'add-page-numbers':
        return 'Add Page Numbers';
      case 'remove-pages':
      case 'delete-pages':
        return 'Remove Pages';
      case 'extract-pages':
        return 'Extract Pages';
      case 'organize-pdf':
        return 'Save Organized PDF';
      case 'repair-pdf':
        return 'Repair PDF';
      case 'ocr-pdf':
        return 'Run OCR PDF';
      case 'sign-pdf':
        return 'Sign PDF';
      case 'redact-pdf':
        return 'Redact PDF';
      case 'crop-pdf':
        return 'Crop PDF';
      case 'pdf-to-pdfa':
        return 'Convert to PDF/A';
      case 'image-converter':
        return 'Convert Images';
      case 'image-optimizer':
        return 'Optimize Images';
      default:
        return tool.shortName || tool.name;
    }
  };

  // Sort files helper for merge-pdf
  const handleSortChange = (sortBy: 'none' | 'name-asc' | 'name-desc') => {
    setMergePdfOptions({ sortBy });
    if (sortBy === 'name-asc') {
      const sorted = [...files].sort((a, b) => a.name.localeCompare(b.name));
      reorderFiles(sorted);
    } else if (sortBy === 'name-desc') {
      const sorted = [...files].sort((a, b) => b.name.localeCompare(a.name));
      reorderFiles(sorted);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* 1. Header matching iLovePDF */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 text-center">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {getPanelTitle()}
        </h2>
      </div>

      {/* 2. Options Content Area */}
      <div className="p-5 sm:p-6 space-y-6 flex-1 text-slate-800 dark:text-slate-200">
        {/* ============================================================== */}
        {/* IMAGE TO PDF OPTIONS (Matches user screenshot 100%)            */}
        {/* ============================================================== */}
        {(tool.id === 'jpg-to-pdf' || tool.id === 'png-to-pdf' || tool.id === 'scan-to-pdf') && (
          <div className="space-y-6">
            {/* Page Orientation */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Page orientation
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Portrait */}
                <button
                  type="button"
                  onClick={() => setImageToPdfOptions({ orientation: 'portrait' })}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                    imageToPdfOptions.orientation === 'portrait'
                      ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500 bg-slate-50/40 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="w-5 h-7 border-2 border-current rounded-xs mb-2 flex items-center justify-center" />
                  <span className="text-xs">Portrait</span>
                </button>

                {/* Landscape */}
                <button
                  type="button"
                  onClick={() => setImageToPdfOptions({ orientation: 'landscape' })}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                    imageToPdfOptions.orientation === 'landscape'
                      ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500 bg-slate-50/40 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="w-7 h-5 border-2 border-current rounded-xs mb-2 flex items-center justify-center" />
                  <span className="text-xs">Landscape</span>
                </button>
              </div>
            </div>

            {/* Page Size */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Page size
              </label>
              <select
                value={imageToPdfOptions.pageSize}
                onChange={(e) => setImageToPdfOptions({ pageSize: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                <option value="a4">A4 (297x210 mm)</option>
                <option value="letter">US Letter (215x279 mm)</option>
                <option value="fit">Fit (same page size as image)</option>
              </select>
            </div>

            {/* Margin */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Margin
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* No margin */}
                <button
                  type="button"
                  onClick={() => setImageToPdfOptions({ margin: 'none' })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                    imageToPdfOptions.margin === 'none'
                      ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500 bg-slate-50/40 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="w-6 h-6 border-2 border-current flex items-center justify-center rounded-xs mb-1.5 p-0.5">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] leading-tight text-center">No margin</span>
                </button>

                {/* Small margin */}
                <button
                  type="button"
                  onClick={() => setImageToPdfOptions({ margin: 'small' })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                    imageToPdfOptions.margin === 'small'
                      ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500 bg-slate-50/40 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="w-6 h-6 border border-dashed border-current flex items-center justify-center rounded-xs mb-1.5 p-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] leading-tight text-center">Small</span>
                </button>

                {/* Big margin */}
                <button
                  type="button"
                  onClick={() => setImageToPdfOptions({ margin: 'big' })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                    imageToPdfOptions.margin === 'big'
                      ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500 bg-slate-50/40 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="w-6 h-6 border-2 border-current flex items-center justify-center rounded-xs mb-1.5 p-1.5">
                    <ImageIcon className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] leading-tight text-center">Big</span>
                </button>
              </div>
            </div>

            {/* Merge Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={imageToPdfOptions.mergeIntoSinglePdf}
                  onChange={(e) => setImageToPdfOptions({ mergeIntoSinglePdf: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Merge all images in one PDF file
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MERGE PDF OPTIONS                                              */}
        {/* ============================================================== */}
        {tool.id === 'merge-pdf' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Ordenar archivos automáticamente
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'Original' },
                  { id: 'name-asc', label: 'A ➔ Z' },
                  { id: 'name-desc', label: 'Z ➔ A' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSortChange(s.id as any)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mergePdfOptions.sortBy === s.id
                        ? 'border-2 border-red-500 bg-red-50/20 text-red-500'
                        : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-800/40'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Documentos listos:</span>
                <span className="text-slate-900 dark:text-white font-mono">{files.length}</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Los archivos se unirán exactamente en el orden mostrado en pantalla. Puedes arrastrar las tarjetas a la izquierda para reordenarlos manualmente.
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SPLIT PDF OPTIONS                                              */}
        {/* ============================================================== */}
        {tool.id === 'split-pdf' && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Modo de división
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSplitOptions({ mode: 'range' })}
                className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  splitOptions.mode === 'range'
                    ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xs">Por rangos</span>
              </button>
              <button
                type="button"
                onClick={() => setSplitOptions({ mode: 'all' })}
                className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  splitOptions.mode === 'all'
                    ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xs">Todas las páginas</span>
              </button>
            </div>

            {splitOptions.mode === 'range' && (
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Rangos de páginas (ej. 1-3, 5, 8-10):
                </label>
                <input
                  type="text"
                  value={splitOptions.rangeString}
                  onChange={(e) => setSplitOptions({ rangeString: e.target.value })}
                  placeholder="1-3, 5, 8-10"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
                />
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* COMPRESS PDF OPTIONS                                           */}
        {/* ============================================================== */}
        {tool.id === 'compress-pdf' && (
          <div className="space-y-3.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Nivel de compresión
            </label>
            <div className="space-y-2.5">
              {[
                { id: 'extreme', label: 'Compresión extrema', desc: 'Menor calidad, alta compresión', saving: '~85%' },
                { id: 'medium', label: 'Compresión recomendada', desc: 'Buena calidad, buena compresión', saving: '~50%' },
                { id: 'low', label: 'Baja compresión', desc: 'Alta calidad, menor compresión', saving: '~20%' },
              ].map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setCompressionOptions({ level: lvl.id as any })}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    compressionOptions.level === lvl.id
                      ? 'border-red-500 bg-red-50/20 text-slate-900 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{lvl.label}</span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {lvl.saving}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lvl.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PDF TO JPG / PNG OPTIONS                                       */}
        {/* ============================================================== */}
        {(tool.id === 'pdf-to-jpg' || tool.id === 'pdf-to-png' || tool.id === 'pdf-to-webp') && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Modo de extracción
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPdfToJpgOptions({ mode: 'pages' })}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    pdfToJpgOptions.mode === 'pages'
                      ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs">Páginas a imágenes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPdfToJpgOptions({ mode: 'extract' })}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    pdfToJpgOptions.mode === 'extract'
                      ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs">Extraer imágenes</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Calidad de renderizado
              </label>
              <select
                value={pdfToJpgOptions.dpi}
                onChange={(e) => setPdfToJpgOptions({ dpi: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <option value="150">Estándar (150 DPI - Más rápido)</option>
                <option value="300">Alta definición (300 DPI - HD)</option>
              </select>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ROTATE PDF OPTIONS                                             */}
        {/* ============================================================== */}
        {tool.id === 'rotate-pdf' && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Ángulo de giro
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { angle: 90, label: '90° Derecha' },
                { angle: 180, label: '180° Invertir' },
                { angle: 270, label: '90° Izquierda' },
              ].map((r) => (
                <button
                  key={r.angle}
                  type="button"
                  onClick={() => setRotatePdfOptions({ angle: r.angle as any })}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    rotatePdfOptions.angle === r.angle
                      ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <RotateCw className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] leading-tight block">{r.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Aplicar a
              </label>
              <select
                value={rotatePdfOptions.applyTo}
                onChange={(e) => setRotatePdfOptions({ applyTo: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <option value="all">Todas las páginas</option>
                <option value="odd">Solo páginas impares</option>
                <option value="even">Solo páginas pares</option>
              </select>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PROTECT PDF OPTIONS                                            */}
        {/* ============================================================== */}
        {tool.id === 'protect-pdf' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Escribe una contraseña:
              </label>
              <input
                type="password"
                value={protectOptions.userPassword}
                onChange={(e) => setProtectOptions({ userPassword: e.target.value })}
                placeholder="Ingresa la clave deseada..."
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 inline mr-1" />
              Cifrado estándar <strong>AES-256</strong> militar.
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* UNLOCK PDF OPTIONS                                             */}
        {/* ============================================================== */}
        {tool.id === 'unlock-pdf' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Contraseña actual (si la tiene):
              </label>
              <input
                type="password"
                value={protectOptions.userPassword}
                onChange={(e) => setProtectOptions({ userPassword: e.target.value })}
                placeholder="O déjala en blanco si es de permisos..."
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              DocuFlow Pro eliminará de forma instantánea cualquier restricción de edición, copia o contraseña.
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* WATERMARK OPTIONS                                              */}
        {/* ============================================================== */}
        {(tool.id === 'add-watermark' || tool.id === 'watermark-pdf') && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Texto de marca de agua
              </label>
              <input
                type="text"
                value={watermarkOptions.text}
                onChange={(e) => setWatermarkOptions({ text: e.target.value })}
                placeholder="CONFIDENCIAL"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Posición
              </label>
              <select
                value={watermarkOptions.position}
                onChange={(e) => setWatermarkOptions({ position: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <option value="diagonal">Diagonal 45°</option>
                <option value="center">Centro</option>
                <option value="top-left">Superior Izquierda</option>
                <option value="bottom-right">Inferior Derecha</option>
              </select>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* NUMBER PAGES OPTIONS                                           */}
        {/* ============================================================== */}
        {(tool.id === 'add-page-numbers' || tool.id === 'number-pages') && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Posición
              </label>
              <select
                value={pageNumberOptions.position}
                onChange={(e) => setPageNumberOptions({ position: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <option value="bottom-right">Inferior Derecha</option>
                <option value="bottom-center">Inferior Centro</option>
                <option value="bottom-left">Inferior Izquierda</option>
                <option value="top-right">Superior Derecha</option>
                <option value="top-center">Superior Centro</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Formato del número
              </label>
              <select
                value={pageNumberOptions.format}
                onChange={(e) => setPageNumberOptions({ format: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <option value="page_of_total">Página 1 de N</option>
                <option value="page">Solo número (1)</option>
              </select>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* OCR PDF OPTIONS                                                */}
        {/* ============================================================== */}
        {tool.id === 'ocr-pdf' && (
          <div className="space-y-3.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Idioma principal del documento
            </label>
            <select
              value={ocrPdfOptions.language}
              onChange={(e) => setOcrPdfOptions({ language: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="fr">Francés</option>
              <option value="de">Alemán</option>
              <option value="it">Italiano</option>
              <option value="pt">Portugués</option>
            </select>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              Genera una capa de texto oculta y buscable sobre las hojas escaneadas.
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* IMAGE CONVERTER / OPTIMIZER                                    */}
        {/* ============================================================== */}
        {tool.id === 'image-converter' && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Convertir a formato
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['png', 'jpg', 'webp', 'bmp', 'tiff'].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setImageConvertOptions({ targetFormat: fmt as any })}
                  className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    imageConvertOptions.targetFormat === fmt
                      ? 'border-2 border-red-500 bg-red-50/20 text-red-500'
                      : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/40'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        )}

        {tool.id === 'image-optimizer' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Calidad de compresión ({Math.round(imageOptimizeOptions.quality * 100)}%)
              </label>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={imageOptimizeOptions.quality}
                onChange={(e) => setImageOptimizeOptions({ quality: parseFloat(e.target.value) })}
                className="w-full accent-red-500"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* DEFAULT / OFFICE / MISC TOOL OPTIONS (Guarantees every tool has options!) */}
        {/* ============================================================== */}
        {![
          'jpg-to-pdf',
          'png-to-pdf',
          'scan-to-pdf',
          'merge-pdf',
          'split-pdf',
          'compress-pdf',
          'pdf-to-jpg',
          'pdf-to-png',
          'pdf-to-webp',
          'rotate-pdf',
          'protect-pdf',
          'unlock-pdf',
          'add-watermark',
          'watermark-pdf',
          'add-page-numbers',
          'number-pages',
          'ocr-pdf',
          'image-converter',
          'image-optimizer',
        ].includes(tool.id) && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Documento activo:</span>
                <span className="text-slate-900 dark:text-white truncate max-w-[150px]">
                  {files[0]?.name || '1 archivo'}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Procesamiento:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">100% Automático</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Calidad de conversión
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer">
                <option value="high">Alta fidelidad (Recomendada)</option>
                <option value="web">Optimizado para correo y web</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 3. Big Action Button at bottom (matches iLovePDF) */}
      <div className="p-5 sm:p-6 bg-slate-50/60 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onProcess}
          disabled={isProcessing}
          className="w-full py-4 px-6 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white font-black text-base shadow-xl shadow-red-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{getActionLabel()}</span>
          <ArrowRightCircle className="w-6 h-6 fill-white text-red-500" />
        </button>
      </div>
    </div>
  );
}
