import { ImageConvertOptions, ImageOptimizeOptions } from '@/types';

/**
 * Load an image file into an HTMLImageElement
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Convert Image between JPG, PNG, WEBP, BMP, etc.
 */
export async function convertImageFormat(
  file: File,
  targetFormat: 'jpg' | 'png' | 'webp' | 'bmp' | 'tiff',
  quality = 0.9,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  if (onProgress) onProgress(20);
  const img = await loadImageFromFile(file);
  if (onProgress) onProgress(50);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d')!;

  // White background for JPG if transparent PNG
  if (targetFormat === 'jpg' || targetFormat === 'bmp') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);
  if (onProgress) onProgress(80);

  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
  };

  const mimeType = mimeMap[targetFormat] || 'image/jpeg';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (onProgress) onProgress(100);
        resolve(blob || new Blob());
      },
      mimeType,
      quality
    );
  });
}

/**
 * Resize, Compress, Rotate and Optimize Image
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizeOptions,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  if (onProgress) onProgress(20);
  const img = await loadImageFromFile(file);
  if (onProgress) onProgress(45);

  let targetWidth = img.naturalWidth || img.width;
  let targetHeight = img.naturalHeight || img.height;

  if (options.resizePercent && options.resizePercent > 0 && options.resizePercent < 100) {
    const factor = options.resizePercent / 100;
    targetWidth = Math.round(targetWidth * factor);
    targetHeight = Math.round(targetHeight * factor);
  } else if (options.width && options.height) {
    targetWidth = options.width;
    targetHeight = options.height;
  } else if (options.width) {
    if (options.maintainAspectRatio) {
      const ratio = targetHeight / targetWidth;
      targetWidth = options.width;
      targetHeight = Math.round(options.width * ratio);
    } else {
      targetWidth = options.width;
    }
  }

  const canvas = document.createElement('canvas');
  const angle = options.rotateAngle % 360;

  if (angle === 90 || angle === 270) {
    canvas.width = targetHeight;
    canvas.height = targetWidth;
  } else {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  const ctx = canvas.getContext('2d')!;

  ctx.save();
  if (angle === 90) {
    ctx.translate(canvas.width, 0);
    ctx.rotate((90 * Math.PI) / 180);
  } else if (angle === 180) {
    ctx.translate(canvas.width, canvas.height);
    ctx.rotate((180 * Math.PI) / 180);
  } else if (angle === 270) {
    ctx.translate(0, canvas.height);
    ctx.rotate((270 * Math.PI) / 180);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  ctx.restore();

  if (onProgress) onProgress(85);

  let mimeType = file.type || 'image/jpeg';
  if (options.format === 'jpg') mimeType = 'image/jpeg';
  else if (options.format === 'png') mimeType = 'image/png';
  else if (options.format === 'webp') mimeType = 'image/webp';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (onProgress) onProgress(100);
        resolve(blob || new Blob());
      },
      mimeType,
      options.quality || 0.85
    );
  });
}
