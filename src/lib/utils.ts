import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function truncateFileName(name: string, maxLength = 30): string {
  if (name.length <= maxLength) return name;
  const extension = name.substring(name.lastIndexOf('.'));
  const baseName = name.substring(0, name.lastIndexOf('.'));
  const remainingLength = maxLength - extension.length - 3;
  if (remainingLength <= 0) return name.substring(0, maxLength - 3) + '...';
  return `${baseName.substring(0, remainingLength)}...${extension}`;
}

export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  const clean = rangeStr.replace(/\s+/g, '');
  if (!clean) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const parts = clean.split(',');
  const pages = new Set<number>();

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = Math.max(1, parseInt(startStr, 10) || 1);
      const end = Math.min(totalPages, parseInt(endStr, 10) || totalPages);
      for (let i = start; i <= end; i++) {
        pages.add(i);
      }
    } else {
      const p = parseInt(part, 10);
      if (p >= 1 && p <= totalPages) {
        pages.add(p);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
}

export function uint8ArrayToBlob(bytes: Uint8Array, mimeType = 'application/pdf'): Blob {
  return new Blob([bytes as unknown as BlobPart], { type: mimeType });
}

export function downloadFile(blob: Blob | Uint8Array, fileName: string) {
  const actualBlob = blob instanceof Blob ? blob : uint8ArrayToBlob(blob);
  const url = window.URL.createObjectURL(actualBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(url), 10000);
}
