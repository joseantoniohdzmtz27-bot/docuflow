import { create } from 'zustand';
import {
  UploadedFileItem,
  PDFPageItem,
  ProcessResultFile,
  SplitOptions,
  CompressionOptions,
  WatermarkOptions,
  PageNumberOptions,
  ProtectOptions,
  ImageConvertOptions,
  ImageOptimizeOptions,
  ImageToPdfOptions,
  MergePdfOptions,
  PdfToJpgOptions,
  RotatePdfOptions,
  OcrPdfOptions,
} from '@/types';

export type ProcessingStage = 'idle' | 'uploading' | 'processing' | 'ready' | 'error';

interface ToolState {
  // Current active tool
  currentToolId: string;
  files: UploadedFileItem[];
  pages: PDFPageItem[];
  stage: ProcessingStage;
  progressPercent: number;
  stageMessage: string;
  errorMessage: string | null;
  results: ProcessResultFile[];

  // Tool Specific Options
  splitOptions: SplitOptions;
  compressionOptions: CompressionOptions;
  watermarkOptions: WatermarkOptions;
  pageNumberOptions: PageNumberOptions;
  protectOptions: ProtectOptions;
  imageConvertOptions: ImageConvertOptions;
  imageOptimizeOptions: ImageOptimizeOptions;
  imageToPdfOptions: ImageToPdfOptions;
  mergePdfOptions: MergePdfOptions;
  pdfToJpgOptions: PdfToJpgOptions;
  rotatePdfOptions: RotatePdfOptions;
  ocrPdfOptions: OcrPdfOptions;

  // Actions
  setCurrentToolId: (id: string) => void;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  reorderFiles: (newFiles: UploadedFileItem[]) => void;
  clearFiles: () => void;
  setPages: (pages: PDFPageItem[]) => void;
  updatePage: (pageNumber: number, changes: Partial<PDFPageItem>) => void;
  rotatePage: (pageNumber: number) => void;
  deletePage: (pageNumber: number) => void;
  rotateAllPages: (angle: number) => void;

  setStage: (stage: ProcessingStage) => void;
  setProgress: (percent: number, message?: string) => void;
  setError: (msg: string | null) => void;
  setResults: (results: ProcessResultFile[]) => void;
  resetAll: () => void;

  // Options Setters
  setSplitOptions: (options: Partial<SplitOptions>) => void;
  setCompressionOptions: (options: Partial<CompressionOptions>) => void;
  setWatermarkOptions: (options: Partial<WatermarkOptions>) => void;
  setPageNumberOptions: (options: Partial<PageNumberOptions>) => void;
  setProtectOptions: (options: Partial<ProtectOptions>) => void;
  setImageConvertOptions: (options: Partial<ImageConvertOptions>) => void;
  setImageOptimizeOptions: (options: Partial<ImageOptimizeOptions>) => void;
  setImageToPdfOptions: (options: Partial<ImageToPdfOptions>) => void;
  setMergePdfOptions: (options: Partial<MergePdfOptions>) => void;
  setPdfToJpgOptions: (options: Partial<PdfToJpgOptions>) => void;
  setRotatePdfOptions: (options: Partial<RotatePdfOptions>) => void;
  setOcrPdfOptions: (options: Partial<OcrPdfOptions>) => void;
}

export const useToolStore = create<ToolState>((set, get) => ({
  currentToolId: 'merge-pdf',
  files: [],
  pages: [],
  stage: 'idle',
  progressPercent: 0,
  stageMessage: 'Listo para procesar',
  errorMessage: null,
  results: [],

  splitOptions: {
    mode: 'all',
    rangeString: '1-5',
    selectedPages: [],
  },

  compressionOptions: {
    level: 'medium',
  },

  watermarkOptions: {
    type: 'text',
    text: 'CONFIDENCIAL',
    position: 'diagonal',
    opacity: 0.35,
    fontSize: 48,
    color: '#6366F1',
    rotation: 45,
  },

  pageNumberOptions: {
    position: 'bottom-right',
    format: 'page_of_total',
    startNumber: 1,
    fontSize: 10,
    color: '#334155',
  },

  protectOptions: {
    userPassword: '',
  },

  imageConvertOptions: {
    targetFormat: 'png',
    quality: 0.9,
    maintainAspectRatio: true,
  },

  imageOptimizeOptions: {
    quality: 0.85,
    resizePercent: 100,
    maintainAspectRatio: true,
    rotateAngle: 0,
    format: 'original',
  },

  imageToPdfOptions: {
    orientation: 'portrait',
    pageSize: 'a4',
    margin: 'none',
    mergeIntoSinglePdf: true,
  },

  mergePdfOptions: {
    sortBy: 'none',
  },

  pdfToJpgOptions: {
    mode: 'pages',
    dpi: '150',
    format: 'jpg',
  },

  rotatePdfOptions: {
    angle: 90,
    applyTo: 'all',
  },

  ocrPdfOptions: {
    language: 'es',
  },

  setCurrentToolId: (id) => set({ currentToolId: id }),

  addFiles: (newFiles) => {
    const currentFiles = get().files;
    const items: UploadedFileItem[] = newFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'idle',
    }));

    set({
      files: [...currentFiles, ...items],
      stage: 'idle',
      errorMessage: null,
      results: [],
    });
  },

  removeFile: (id) => {
    const updated = get().files.filter((f) => f.id !== id);
    set({ files: updated });
  },

  reorderFiles: (newFiles) => set({ files: newFiles }),

  clearFiles: () => set({ files: [], pages: [], results: [], stage: 'idle', errorMessage: null }),

  setPages: (pages) => set({ pages }),

  updatePage: (pageNumber, changes) => {
    set({
      pages: get().pages.map((p) => (p.pageNumber === pageNumber ? { ...p, ...changes } : p)),
    });
  },

  rotatePage: (pageNumber) => {
    set({
      pages: get().pages.map((p) =>
        p.pageNumber === pageNumber ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      ),
    });
  },

  deletePage: (pageNumber) => {
    set({
      pages: get().pages.map((p) =>
        p.pageNumber === pageNumber ? { ...p, isDeleted: !p.isDeleted } : p
      ),
    });
  },

  rotateAllPages: (angle) => {
    set({
      pages: get().pages.map((p) => ({ ...p, rotation: (p.rotation + angle) % 360 })),
    });
  },

  setStage: (stage) => set({ stage }),

  setProgress: (percent, message) =>
    set((state) => ({
      progressPercent: percent,
      stageMessage: message || state.stageMessage,
    })),

  setError: (errorMessage) => set({ errorMessage, stage: errorMessage ? 'error' : 'idle' }),

  setResults: (results) => set({ results, stage: 'ready', progressPercent: 100 }),

  resetAll: () =>
    set({
      files: [],
      pages: [],
      stage: 'idle',
      progressPercent: 0,
      stageMessage: 'Listo para procesar',
      errorMessage: null,
      results: [],
    }),

  setSplitOptions: (opts) => set((s) => ({ splitOptions: { ...s.splitOptions, ...opts } })),
  setCompressionOptions: (opts) =>
    set((s) => ({ compressionOptions: { ...s.compressionOptions, ...opts } })),
  setWatermarkOptions: (opts) =>
    set((s) => ({ watermarkOptions: { ...s.watermarkOptions, ...opts } })),
  setPageNumberOptions: (opts) =>
    set((s) => ({ pageNumberOptions: { ...s.pageNumberOptions, ...opts } })),
  setProtectOptions: (opts) =>
    set((s) => ({ protectOptions: { ...s.protectOptions, ...opts } })),
  setImageConvertOptions: (opts) =>
    set((s) => ({ imageConvertOptions: { ...s.imageConvertOptions, ...opts } })),
  setImageOptimizeOptions: (opts) =>
    set((s) => ({ imageOptimizeOptions: { ...s.imageOptimizeOptions, ...opts } })),
  setImageToPdfOptions: (opts) =>
    set((s) => ({ imageToPdfOptions: { ...s.imageToPdfOptions, ...opts } })),
  setMergePdfOptions: (opts) =>
    set((s) => ({ mergePdfOptions: { ...s.mergePdfOptions, ...opts } })),
  setPdfToJpgOptions: (opts) =>
    set((s) => ({ pdfToJpgOptions: { ...s.pdfToJpgOptions, ...opts } })),
  setRotatePdfOptions: (opts) =>
    set((s) => ({ rotatePdfOptions: { ...s.rotatePdfOptions, ...opts } })),
  setOcrPdfOptions: (opts) =>
    set((s) => ({ ocrPdfOptions: { ...s.ocrPdfOptions, ...opts } })),
}));
