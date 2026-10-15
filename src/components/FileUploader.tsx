'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Trash2,
  Plus,
  FileSpreadsheet,
  FileCode,
  File,
  Sparkles,
} from 'lucide-react';
import { useToolStore } from '@/store/useToolStore';
import { formatBytes, truncateFileName } from '@/lib/utils';
import { ToolDefinition } from '@/types';

interface FileUploaderProps {
  tool: ToolDefinition;
}

export function FileUploader({ tool }: FileUploaderProps) {
  const { files, addFiles, removeFile, clearFiles, reorderFiles } = useToolStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // UNLIMITED FILES SUPPORT
        addFiles(acceptedFiles);
      }
    },
    [addFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    // Accept extensions based on tool
    accept: tool.acceptedFormats.reduce((acc, fmt) => {
      if (fmt.startsWith('.')) {
        acc[`application/${fmt.replace('.', '')}`] = [fmt];
      } else if (fmt.includes('/')) {
        acc[fmt] = [];
      }
      return acc;
    }, {} as Record<string, string[]>),
  });

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'].includes(ext || ''))
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (['xlsx', 'xls', 'csv'].includes(ext || ''))
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    if (['docx', 'doc', 'txt', 'md'].includes(ext || ''))
      return <FileCode className="w-5 h-5 text-indigo-500" />;
    return <File className="w-5 h-5 text-slate-500" />;
  };

  const moveFile = (dragIndex: number, hoverIndex: number) => {
    const items = [...files];
    const [dragged] = items.splice(dragIndex, 1);
    items.splice(hoverIndex, 0, dragged);
    reorderFiles(items);
  };

  if (files.length === 0) {
    return (
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
          isDragActive
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 scale-[0.99]'
            : isDragReject
            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40'
            : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20'
        }`}
      >
        <input {...getInputProps()} />

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 via-purpleBrand-500 to-accentCyan-500 text-white flex items-center justify-center shadow-xl shadow-brand-500/25 mb-5 animate-pulse-subtle">
          <UploadCloud className="w-10 h-10" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Arrastra y suelta tus archivos aquí
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
          O haz clic para seleccionar desde tu computadora.{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {tool.acceptedFormats.join(', ')}
          </span>
        </p>

        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-purpleBrand-600 to-brand-600 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-brand-500/25 flex items-center gap-2"
          >
            <span>Seleccionar archivos (Sin límite)</span>
          </button>

          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Soporta archivos ilimitados simultáneos</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action bar above files */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {files.length} archivo{files.length > 1 ? 's' : ''} cargado{files.length > 1 ? 's' : ''}
          </span>
          <span className="text-xs text-slate-400">
            (Total: {formatBytes(files.reduce((acc, f) => acc + f.size, 0))})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar más archivos</span>
            </button>
          </div>

          <button
            type="button"
            onClick={clearFiles}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar todos</span>
          </button>
        </div>
      </div>

      {/* Files List Cards (Unlimited scroll / grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[550px] overflow-y-auto p-1">
        {files.map((item, index) => (
          <div
            key={item.id}
            className="relative p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between group hover:border-red-500/50 transition-all"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getFileIcon(item.name)
                )}
              </div>

              <div className="overflow-hidden">
                <div
                  className="text-xs font-bold text-slate-900 dark:text-white truncate"
                  title={item.name}
                >
                  {truncateFileName(item.name, 22)}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span>{formatBytes(item.size)}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-bold">
                    #{index + 1}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {files.length > 1 && (
                <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveFile(index, index - 1)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px]"
                      title="Mover arriba"
                    >
                      ▲
                    </button>
                  )}
                  {index < files.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveFile(index, index + 1)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px]"
                      title="Mover abajo"
                    >
                      ▼
                    </button>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => removeFile(item.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Quitar archivo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add more files card at end of grid */}
        <div
          {...getRootProps()}
          className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 hover:bg-red-50/10 dark:hover:bg-red-950/10 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[80px] text-slate-500 hover:text-red-500 group"
        >
          <input {...getInputProps()} />
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-red-500/10 group-hover:text-red-500 flex items-center justify-center mb-1 text-slate-500 transition-colors">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">Añadir más</span>
        </div>
      </div>
    </div>
  );
}
