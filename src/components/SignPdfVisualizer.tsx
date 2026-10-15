'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser, Check, Type, Upload, Sparkles } from 'lucide-react';

interface SignPdfVisualizerProps {
  onSignatureReady: (dataUrl: string) => void;
}

export function SignPdfVisualizer({ onSignatureReady }: SignPdfVisualizerProps) {
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState('cursive');
  const [penColor, setPenColor] = useState('#0F172A');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
  }, [penColor, tab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      onSignatureReady(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleTypedSubmit = () => {
    if (!typedName) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 150;
    const ctx = canvas.getContext('2d')!;
    ctx.font = '40px ' + selectedFont;
    ctx.fillStyle = penColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName, 200, 75);
    onSignatureReady(canvas.toDataURL('image/png'));
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <PenTool className="w-5 h-5 text-brand-500" />
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Crear Firma Digital
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTab('draw')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'draw'
                ? 'bg-brand-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Dibujar
          </button>
          <button
            type="button"
            onClick={() => setTab('type')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'type'
                ? 'bg-brand-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Escribir
          </button>
        </div>
      </div>

      {tab === 'draw' && (
        <div className="space-y-3">
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-44 cursor-crosshair touch-none"
            />
            <div className="absolute bottom-2 left-3 text-[11px] text-slate-400 pointer-events-none">
              Dibuja tu firma con el ratón o pantalla táctil
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Color:</span>
              {['#0F172A', '#2563EB', '#059669'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPenColor(c)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    penColor === c ? 'border-brand-500 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={clearCanvas}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Borrar</span>
            </button>
          </div>
        </div>
      )}

      {tab === 'type' && (
        <div className="space-y-3">
          <input
            type="text"
            value={typedName}
            onChange={(e) => {
              setTypedName(e.target.value);
              handleTypedSubmit();
            }}
            placeholder="Escribe tu nombre completo..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-serif italic"
          />

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center font-serif italic text-2xl text-brand-600 dark:text-brand-400 min-h-16 flex items-center justify-center">
            {typedName || 'Tu firma aparecerá aquí'}
          </div>
        </div>
      )}
    </div>
  );
}
