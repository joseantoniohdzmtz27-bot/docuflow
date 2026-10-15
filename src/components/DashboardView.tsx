'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Files,
  HardDrive,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Layers,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { formatBytes } from '@/lib/utils';
import Link from 'next/link';

export function DashboardView() {
  const { user, history, totalConversions, totalSavedBytes } = useUserStore();

  const mockDailyData = [
    { day: 'Lun', count: 18, savedMb: 120 },
    { day: 'Mar', count: 32, savedMb: 240 },
    { day: 'Mie', count: 24, savedMb: 190 },
    { day: 'Jue', count: 48, savedMb: 380 },
    { day: 'Vie', count: 42, savedMb: 310 },
    { day: 'Sab', count: 15, savedMb: 95 },
    { day: 'Dom', count: 28, savedMb: 220 },
  ];

  const maxDaily = Math.max(...mockDailyData.map((d) => d.count));

  const topTools = [
    { name: 'Unir PDF', count: 54, percentage: 38, color: '#6366F1' },
    { name: 'Comprimir PDF', count: 42, percentage: 29, color: '#10B981' },
    { name: 'PDF a Word', count: 28, percentage: 19, color: '#3B82F6' },
    { name: 'Chat con PDF IA', count: 18, percentage: 14, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 text-white border border-brand-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panel de Rendimiento SaaS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hola, {user?.name || 'Administrador'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitorea el uso de herramientas, almacenamiento optimizado y estadísticas de procesamiento en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Link
            href="/merge-pdf"
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-md"
          >
            Nuevo Procesamiento
          </Link>
        </div>

        <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Files className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Archivos</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {totalConversions}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +18% este mes
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Espacio Ahorrado</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatBytes(totalSavedBytes)}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Eficiencia 64%
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purpleBrand-500 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Tiempo Promedio</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">1.2s</div>
            <div className="text-[11px] text-brand-600 font-bold">WebAssembly Core</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-accentCyan-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Tasa de Éxito</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">99.98%</div>
            <div className="text-[11px] text-emerald-600 font-bold">0 Fallos reportados</div>
          </div>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Processing Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Actividad Semanal de Procesamiento
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Últimos 7 días</span>
          </div>

          {/* Bar Chart Bars */}
          <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2">
            {mockDailyData.map((d, i) => {
              const heightPercent = Math.round((d.count / maxDaily) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count} docs
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl h-full flex items-end overflow-hidden p-1">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-brand-600 to-purpleBrand-500 group-hover:from-brand-500 group-hover:to-accentCyan-400 transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Tools Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Herramientas Más Usadas
            </h3>
          </div>

          <div className="space-y-4">
            {topTools.map((tool, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{tool.name}</span>
                  <span className="text-slate-400">{tool.percentage}% ({tool.count})</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${tool.percentage}%`,
                      backgroundColor: tool.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Conversions Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Registro de Conversiones Recientes
          </h3>
          <span className="text-xs text-slate-400">Total {history.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Herramienta</th>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Archivos</th>
                <th className="py-3 px-4">Tamaño Final</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {history.slice(0, 8).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-500" />
                    <span>{item.toolName}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{item.date}</td>
                  <td className="py-3.5 px-4">{item.inputFilesCount} doc(s)</td>
                  <td className="py-3.5 px-4 font-medium">{formatBytes(item.outputSize)}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase">
                      Completado
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/${item.toolId}`}
                      className="text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                    >
                      Ejecutar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
