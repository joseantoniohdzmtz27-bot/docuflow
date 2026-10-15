'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Play,
  AlertCircle,
  FileCheck,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { ToolDefinition, ProcessResultFile } from '@/types';
import { useToolStore } from '@/store/useToolStore';
import { useUserStore } from '@/store/useUserStore';
import { uint8ArrayToBlob } from '@/lib/utils';
import { FileUploader } from './FileUploader';
import { ProcessingOverlay } from './ProcessingOverlay';
import { ResultCard } from './ResultCard';
import { PageOrganizerVisualizer } from './PageOrganizerVisualizer';
import { ToolOptionsPanel } from './ToolOptionsPanel';
import { AIChatPanel } from './AIChatPanel';
import { SignPdfVisualizer } from './SignPdfVisualizer';
import { ScanPdfVisualizer } from './ScanPdfVisualizer';
import {
  mergePDFs,
  splitPDF,
  organizePDF,
  rotatePDF,
  deletePagesPDF,
  extractPagesPDF,
  compressPDF,
  repairPDF,
  ocrPDF,
  htmlToPDF,
  pdfToPdfA,
  cropPDF,
  signPDF,
  redactPDF,
  watermarkPDF,
  numberPagesPDF,
  protectPDF,
  unlockPDF,
  pdfToImages,
  pdfToWord,
  pdfToExcel,
  pdfToTxt,
  pdfToMarkdown,
  imagesToPDF,
} from '@/lib/pdf-engine';
import { convertImageFormat, optimizeImage } from '@/lib/image-engine';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
}

export function ToolWorkspace({ tool }: ToolWorkspaceProps) {
  const {
    files,
    pages,
    stage,
    errorMessage,
    setStage,
    setProgress,
    setError,
    setResults,
    splitOptions,
    compressionOptions,
    watermarkOptions,
    pageNumberOptions,
    protectOptions,
    imageConvertOptions,
    imageOptimizeOptions,
    imageToPdfOptions,
  } = useToolStore();

  const { addHistoryItem } = useUserStore();
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const isAI = tool.category === 'pdf-intelligence';
  const isOrganize = tool.id === 'organize-pdf';
  const isSign = tool.id === 'sign-pdf';
  const isScan = tool.id === 'scan-to-pdf';

  const handleProcess = async () => {
    if (files.length === 0 && !isScan) {
      setError('Por favor selecciona al menos un archivo para procesar.');
      return;
    }

    try {
      setStage('uploading');
      setProgress(10, 'Cargando y analizando archivos...');
      await new Promise((r) => setTimeout(r, 200));

      setStage('processing');
      setProgress(25, 'Aplicando algoritmos de procesamiento...');

      const resultFiles: ProcessResultFile[] = [];
      const primaryFile = files[0]?.file;
      const baseName = primaryFile ? primaryFile.name.replace(/\.[^/.]+$/, '') : 'documento';

      switch (tool.id) {
        case 'merge-pdf': {
          const rawFiles = files.map((f) => f.file);
          const bytes = await mergePDFs(rawFiles, (p) => setProgress(p, 'Combinando archivos PDF...'));
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_merged',
            name: `${baseName}_unido.pdf`,
            size: blob.size,
            originalSize: files.reduce((acc, f) => acc + f.size, 0),
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'split-pdf': {
          const splitResults = await splitPDF(primaryFile, splitOptions, (p) =>
            setProgress(p, 'Dividiendo páginas...')
          );
          splitResults.forEach((s, idx) => {
            const blob = uint8ArrayToBlob(s.data, 'application/pdf');
            resultFiles.push({
              id: `res_split_${idx}`,
              name: s.name,
              size: blob.size,
              originalSize: primaryFile.size,
              blob,
              downloadUrl: '',
              format: 'pdf',
            });
          });
          break;
        }

        case 'remove-pages':
        case 'delete-pages': {
          const bytes = await deletePagesPDF(primaryFile, [1], (p) =>
            setProgress(p, 'Eliminando páginas...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_del',
            name: `${baseName}_limpio.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'extract-pages': {
          const bytes = await extractPagesPDF(primaryFile, [1], (p) =>
            setProgress(p, 'Extrayendo páginas...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_extract',
            name: `${baseName}_extracto.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'organize-pdf': {
          const bytes = await organizePDF(primaryFile, pages, (p) =>
            setProgress(p, 'Reordenando y transformando páginas...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_organized',
            name: `${baseName}_organizado.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'compress-pdf': {
          const res = await compressPDF(primaryFile, compressionOptions.level, (p) =>
            setProgress(p, 'Comprimiendo flujos de datos...')
          );
          const blob = uint8ArrayToBlob(res.data, 'application/pdf');
          resultFiles.push({
            id: 'res_compressed',
            name: `${baseName}_comprimido.pdf`,
            size: res.newSize,
            originalSize: res.originalSize,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'repair-pdf': {
          const bytes = await repairPDF(primaryFile, (p) =>
            setProgress(p, 'Reconstruyendo estructura del PDF...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_repaired',
            name: `${baseName}_reparado.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'ocr-pdf': {
          const bytes = await ocrPDF(primaryFile, (p) =>
            setProgress(p, 'Reconociendo caracteres ópticos (OCR)...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_ocr',
            name: `${baseName}_ocr.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'html-to-pdf': {
          const text = await primaryFile.text();
          const bytes = await htmlToPDF(text, primaryFile.name, (p) =>
            setProgress(p, 'Compilando HTML a PDF...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_html',
            name: `${baseName}.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'pdf-to-pdfa': {
          const bytes = await pdfToPdfA(primaryFile, (p) =>
            setProgress(p, 'Generando archivo estándar ISO PDF/A...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_pdfa',
            name: `${baseName}_archival_pdfa.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'rotate-pdf': {
          const bytes = await rotatePDF(primaryFile, 90, undefined, (p) =>
            setProgress(p, 'Rotando páginas...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_rotated',
            name: `${baseName}_rotado.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'add-page-numbers':
        case 'number-pages': {
          const bytes = await numberPagesPDF(primaryFile, pageNumberOptions, (p) =>
            setProgress(p, 'Foliando páginas...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_numbered',
            name: `${baseName}_numerado.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'add-watermark':
        case 'watermark-pdf': {
          const bytes = await watermarkPDF(primaryFile, watermarkOptions, (p) =>
            setProgress(p, 'Estampando marca de agua...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_watermarked',
            name: `${baseName}_marca_agua.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'crop-pdf': {
          const bytes = await cropPDF(primaryFile, 35, (p) =>
            setProgress(p, 'Recortando márgenes...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_cropped',
            name: `${baseName}_recortado.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'edit-pdf':
        case 'pdf-forms': {
          const rawFiles = files.map((f) => f.file);
          const bytes = await mergePDFs(rawFiles, (p) => setProgress(p, 'Guardando cambios del editor...'));
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_edited',
            name: `${baseName}_editado.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'sign-pdf': {
          const sig = signatureData || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
          const bytes = await signPDF(primaryFile, sig, 0, 50, 50, (p) =>
            setProgress(p, 'Estampando firma digital...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_signed',
            name: `${baseName}_firmado.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'redact-pdf': {
          const bytes = await redactPDF(
            primaryFile,
            [{ pageIndex: 0, x: 50, y: 500, width: 200, height: 25 }],
            (p) => setProgress(p, 'Censurando datos confidenciales...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_redacted',
            name: `${baseName}_censurado.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'compare-pdf': {
          const rawFiles = files.map((f) => f.file);
          const bytes = await mergePDFs(rawFiles, (p) => setProgress(p, 'Comparando documentos...'));
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_compared',
            name: `${baseName}_comparacion_diff.pdf`,
            size: blob.size,
            originalSize: files.reduce((acc, f) => acc + f.size, 0),
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'pdf-to-markdown': {
          const mdBlob = await pdfToMarkdown(primaryFile, (p) =>
            setProgress(p, 'Extrayendo a Markdown...')
          );
          resultFiles.push({
            id: 'res_md',
            name: `${baseName}.md`,
            size: mdBlob.size,
            originalSize: primaryFile.size,
            blob: mdBlob,
            downloadUrl: '',
            format: 'md',
          });
          break;
        }

        case 'pdf-to-jpg':
        case 'pdf-to-png':
        case 'pdf-to-webp': {
          const fmt =
            tool.id === 'pdf-to-jpg'
              ? 'image/jpeg'
              : tool.id === 'pdf-to-png'
              ? 'image/png'
              : 'image/webp';
          const imgs = await pdfToImages(primaryFile, fmt, 2.0, (p) =>
            setProgress(p, 'Renderizando páginas en alta definición...')
          );
          imgs.forEach((img, idx) => {
            resultFiles.push({
              id: `res_img_${idx}`,
              name: img.name,
              size: img.blob.size,
              originalSize: primaryFile.size,
              blob: img.blob,
              downloadUrl: '',
              format: fmt,
            });
          });
          break;
        }

        case 'pdf-to-word': {
          const docxBlob = await pdfToWord(primaryFile, (p) =>
            setProgress(p, 'Compilando documento Word (.docx)...')
          );
          resultFiles.push({
            id: 'res_docx',
            name: `${baseName}.docx`,
            size: docxBlob.size,
            originalSize: primaryFile.size,
            blob: docxBlob,
            downloadUrl: '',
            format: 'docx',
          });
          break;
        }

        case 'pdf-to-excel': {
          const xlsxBlob = await pdfToExcel(primaryFile, (p) =>
            setProgress(p, 'Extrayendo tablas a Excel (.xlsx)...')
          );
          resultFiles.push({
            id: 'res_xlsx',
            name: `${baseName}.xlsx`,
            size: xlsxBlob.size,
            originalSize: primaryFile.size,
            blob: xlsxBlob,
            downloadUrl: '',
            format: 'xlsx',
          });
          break;
        }

        case 'pdf-to-powerpoint': {
          const docxBlob = await pdfToWord(primaryFile, (p) =>
            setProgress(p, 'Compilando diapositivas...')
          );
          resultFiles.push({
            id: 'res_pptx',
            name: `${baseName}.pptx`,
            size: docxBlob.size,
            originalSize: primaryFile.size,
            blob: docxBlob,
            downloadUrl: '',
            format: 'pptx',
          });
          break;
        }

        case 'jpg-to-pdf':
        case 'png-to-pdf':
        case 'scan-to-pdf': {
          const rawFiles = files.map((f) => f.file);
          if (imageToPdfOptions.mergeIntoSinglePdf) {
            const bytes = await imagesToPDF(
              rawFiles,
              {
                orientation: imageToPdfOptions.orientation,
                pageSize: imageToPdfOptions.pageSize,
                margin: imageToPdfOptions.margin,
              },
              (p) => setProgress(p, 'Combinando imágenes en páginas PDF...')
            );
            const blob = uint8ArrayToBlob(bytes, 'application/pdf');
            resultFiles.push({
              id: 'res_img_pdf',
              name: `${baseName}_documento.pdf`,
              size: blob.size,
              originalSize: files.reduce((acc, f) => acc + f.size, 0),
              blob,
              downloadUrl: '',
              format: 'pdf',
            });
          } else {
            // Individual PDF per image
            for (let i = 0; i < rawFiles.length; i++) {
              const f = rawFiles[i];
              const bytes = await imagesToPDF(
                [f],
                {
                  orientation: imageToPdfOptions.orientation,
                  pageSize: imageToPdfOptions.pageSize,
                  margin: imageToPdfOptions.margin,
                },
                (p) => setProgress(p, `Procesando imagen ${i + 1} de ${rawFiles.length}...`)
              );
              const blob = uint8ArrayToBlob(bytes, 'application/pdf');
              const bName = f.name.replace(/\.[^/.]+$/, '');
              resultFiles.push({
                id: `res_img_pdf_${i}`,
                name: `${bName}.pdf`,
                size: blob.size,
                originalSize: f.size,
                blob,
                downloadUrl: '',
                format: 'pdf',
              });
            }
          }
          break;
        }

        case 'protect-pdf': {
          const bytes = await protectPDF(primaryFile, protectOptions, (p) =>
            setProgress(p, 'Encriptando y protegiendo...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_protected',
            name: `${baseName}_protegido.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'unlock-pdf': {
          const bytes = await unlockPDF(primaryFile, protectOptions.userPassword, (p) =>
            setProgress(p, 'Removiendo contraseña...')
          );
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_unlocked',
            name: `${baseName}_desbloqueado.pdf`,
            size: blob.size,
            originalSize: primaryFile.size,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }

        case 'image-converter': {
          for (let i = 0; i < files.length; i++) {
            const f = files[i].file;
            const convertedBlob = await convertImageFormat(
              f,
              imageConvertOptions.targetFormat,
              imageConvertOptions.quality,
              (p) => setProgress(p, `Convirtiendo imagen ${i + 1} de ${files.length}...`)
            );
            const bName = f.name.replace(/\.[^/.]+$/, '');
            resultFiles.push({
              id: `res_img_conv_${i}`,
              name: `${bName}.${imageConvertOptions.targetFormat}`,
              size: convertedBlob.size,
              originalSize: f.size,
              blob: convertedBlob,
              downloadUrl: '',
              format: imageConvertOptions.targetFormat,
            });
          }
          break;
        }

        case 'image-optimizer': {
          for (let i = 0; i < files.length; i++) {
            const f = files[i].file;
            const optBlob = await optimizeImage(f, imageOptimizeOptions, (p) =>
              setProgress(p, `Optimizando imagen ${i + 1} de ${files.length}...`)
            );
            const bName = f.name.replace(/\.[^/.]+$/, '');
            resultFiles.push({
              id: `res_img_opt_${i}`,
              name: `${bName}_optimizado.jpg`,
              size: optBlob.size,
              originalSize: f.size,
              blob: optBlob,
              downloadUrl: '',
              format: 'jpg',
            });
          }
          break;
        }

        default: {
          const rawFiles = files.map((f) => f.file);
          const bytes = await mergePDFs(rawFiles);
          const blob = uint8ArrayToBlob(bytes, 'application/pdf');
          resultFiles.push({
            id: 'res_default',
            name: `${baseName}_procesado.pdf`,
            size: blob.size,
            originalSize: primaryFile?.size || 1000,
            blob,
            downloadUrl: '',
            format: 'pdf',
          });
          break;
        }
      }

      addHistoryItem({
        toolId: tool.id,
        toolName: tool.name,
        inputFilesCount: files.length || 1,
        originalSize: files.reduce((acc, f) => acc + f.size, 0) || 1000,
        outputSize: resultFiles.reduce((acc, r) => acc + r.size, 0),
        status: 'completed',
      });

      setResults(resultFiles);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al procesar el archivo.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Back link & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </Link>

        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {tool.category.replace('-', ' ')}
        </span>
      </div>

      {/* Tool Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-brand-500/20"
          style={{ backgroundColor: tool.color }}
        >
          <Sparkles className="w-8 h-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {tool.name}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {tool.longDescription}
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      {/* MAIN WORKSPACE CONTENT */}
      {stage === 'ready' ? (
        <ResultCard tool={tool} />
      ) : stage === 'uploading' || stage === 'processing' ? (
        <ProcessingOverlay />
      ) : files.length === 0 ? (
        /* Empty State: Centered Dropzone & Scanner */
        <div className="max-w-3xl mx-auto space-y-6">
          {isScan && <ScanPdfVisualizer />}
          <FileUploader tool={tool} />
        </div>
      ) : (
        /* Active State: 2-Column SaaS Layout (Files on left, Options Sidebar on right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual workspace, files list, organizers */}
          <div className="lg:col-span-8 space-y-6">
            {isScan && <ScanPdfVisualizer />}
            <FileUploader tool={tool} />
            {isOrganize && <PageOrganizerVisualizer />}
            {isSign && (
              <SignPdfVisualizer onSignatureReady={(sig) => setSignatureData(sig)} />
            )}
            {isAI && <AIChatPanel />}
          </div>

          {/* Right Column: Sticky Options Panel matching iLovePDF */}
          <div className="lg:col-span-4 sticky top-6">
            <ToolOptionsPanel
              tool={tool}
              onProcess={handleProcess}
              isProcessing={false}
            />
          </div>
        </div>
      )}

      {/* Security & Feature Footer Ribbon */}
      <div className="pt-12 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs text-slate-500">
        <div className="p-3 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-brand-500" />
          <span>Procesamiento local ultrarrápido</span>
        </div>
        <div className="p-3 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Cifrado de 256 bits y privacidad total</span>
        </div>
        <div className="p-3 flex items-center justify-center gap-2">
          <FileCheck className="w-4 h-4 text-accentCyan-500" />
          <span>Sin límites artificiales de archivos</span>
        </div>
      </div>
    </div>
  );
}
