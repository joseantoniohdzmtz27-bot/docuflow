export type ToolCategory =
  | 'organize-pdf'
  | 'optimize-pdf'
  | 'convert-to-pdf'
  | 'convert-from-pdf'
  | 'edit-pdf'
  | 'pdf-security'
  | 'pdf-intelligence'
  | 'images';

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  category: ToolCategory;
  iconName: string;
  color: string;
  gradient: string;
  acceptedFormats: string[];
  maxFiles?: number; // Optional, defaults to unlimited (no limit)
  badge?: string;
  popular?: boolean;
  requiresOptions?: boolean;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  pageCount?: number;
  rotation?: number;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  errorMessage?: string;
}

export interface PDFPageItem {
  pageNumber: number;
  originalIndex: number;
  dataUrl?: string;
  rotation: number;
  isDeleted: boolean;
  isSelected?: boolean;
}

export interface ProcessResultFile {
  id: string;
  name: string;
  size: number;
  originalSize?: number;
  blob: Blob;
  downloadUrl: string;
  format: string;
  previewUrl?: string;
  summaryText?: string;
}

export interface CompressionOptions {
  level: 'low' | 'medium' | 'high' | 'extreme';
}

export interface SplitOptions {
  mode: 'all' | 'range' | 'selected';
  rangeString: string;
  selectedPages: number[];
}

export interface WatermarkOptions {
  type: 'text' | 'image';
  text: string;
  imageFile?: File;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'diagonal';
  opacity: number;
  fontSize: number;
  color: string;
  rotation: number;
}

export interface PageNumberOptions {
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-center';
  format: 'page' | 'page_of_total' | 'roman' | 'custom';
  startNumber: number;
  fontSize: number;
  color: string;
}

export interface ProtectOptions {
  userPassword: string;
  ownerPassword?: string;
}

export interface SignPdfOptions {
  signatureDataUrl?: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RedactPdfOptions {
  pageNumber: number;
  boxes: { x: number; y: number; width: number; height: number }[];
}

export interface CropPdfOptions {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ImageConvertOptions {
  targetFormat: 'jpg' | 'png' | 'webp' | 'bmp' | 'tiff';
  quality: number;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
}

export interface ImageOptimizeOptions {
  quality: number;
  resizePercent?: number;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  rotateAngle: number;
  format: 'original' | 'jpg' | 'png' | 'webp';
}

export interface ImageToPdfOptions {
  orientation: 'portrait' | 'landscape';
  pageSize: 'a4' | 'letter' | 'fit';
  margin: 'none' | 'small' | 'big';
  mergeIntoSinglePdf: boolean;
}

export interface MergePdfOptions {
  sortBy: 'none' | 'name-asc' | 'name-desc';
}

export interface PdfToJpgOptions {
  mode: 'pages' | 'extract';
  dpi: '150' | '300';
  format: 'jpg' | 'png' | 'webp';
}

export interface RotatePdfOptions {
  angle: 90 | 180 | 270;
  applyTo: 'all' | 'odd' | 'even';
}

export interface OcrPdfOptions {
  language: 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt';
}

export interface PdfToOfficeOptions {
  ocr: boolean;
}

export interface RepairPdfOptions {
  mode: 'deep' | 'standard';
}

export interface PdfToPdfAOptions {
  conformance: 'pdfa-2b' | 'pdfa-1b' | 'pdfa-3b';
}

export interface ConversionHistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  date: string;
  inputFilesCount: number;
  originalSize: number;
  outputSize: number;
  downloadUrl?: string;
  status: 'completed' | 'failed';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'free' | 'pro' | 'enterprise';
  favoriteTools: string[];
  processedCount: number;
  savedStorageBytes: number;
}
