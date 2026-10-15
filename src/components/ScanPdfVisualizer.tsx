'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Plus, Check, Trash2, Sparkles } from 'lucide-react';
import { useToolStore } from '@/store/useToolStore';

export function ScanPdfVisualizer() {
  const [streamActive, setStreamActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addFiles } = useToolStore();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('No se pudo acceder a la cámara. Puedes subir fotos o archivos directamente.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(videoRef.current, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImages((prev) => [...prev, dataUrl]);

    // Convert data URL to File and add to store
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `escaneo_pagina_${capturedImages.length + 1}.jpg`, {
          type: 'image/jpeg',
        });
        addFiles([file]);
      }
    }, 'image/jpeg');
  };

  const removeCaptured = (index: number) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-accentCyan-500" />
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Escanear Documento con Cámara
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {capturedImages.length} página(s) capturada(s)
        </span>
      </div>

      {!streamActive ? (
        <div className="p-10 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center">
          <Camera className="w-12 h-12 text-accentCyan-500 mb-3 animate-pulse" />
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Inicia tu cámara web o sensor móvil
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Toma fotos de tus documentos físicos y organízalos en un PDF nítido.
          </p>
          <button
            type="button"
            onClick={startCamera}
            className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accentCyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/25"
          >
            Activar Cámara
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black max-h-80 flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4 text-brand-600" />
                <span>Capturar Hoja #{capturedImages.length + 1}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Captured Pages Strip */}
      {capturedImages.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Hojas Escaneadas Listas para PDF
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {capturedImages.map((img, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
                <img src={img} alt={`Página ${i + 1}`} className="w-full h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => removeCaptured(i)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-black/60 text-white">
                  Pág. {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
