'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Layers,
  Scissors,
  LayoutGrid,
  Minimize2,
  RotateCw,
  Trash2,
  FileOutput,
  Stamp,
  Hash,
  Lock,
  Unlock,
  FileImage,
  Image as ImageIcon,
  FileCode2,
  FileText,
  Sheet,
  Presentation,
  AlignLeft,
  ImagePlus,
  FileType2,
  Table,
  Sliders,
  Maximize2,
  Bot,
  MessageSquareText,
  Cpu,
  Languages,
  Star,
  Search,
  ArrowRight,
} from 'lucide-react';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/constants';
import { useUserStore } from '@/store/useUserStore';

// Map icon names to Lucide icons
const ICON_MAP: Record<string, any> = {
  Sparkles,
  Layers,
  Scissors,
  LayoutGrid,
  Minimize2,
  RotateCw,
  Trash2,
  FileOutput,
  Stamp,
  Hash,
  Lock,
  Unlock,
  FileImage,
  Image: ImageIcon,
  FileCode2,
  FileText,
  Sheet,
  Presentation,
  AlignLeft,
  ImagePlus,
  FileType2,
  Table,
  Sliders,
  Maximize2,
  Bot,
  MessageSquareText,
  Cpu,
  Languages,
};

export function ToolGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, toggleFavorite } = useUserStore();

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'favorites'
        ? favorites.includes(tool.id)
        : tool.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.shortName.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="herramientas" className="py-12 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Catálogo de Herramientas
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Selecciona una herramienta para comenzar a transformar tus documentos
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por nombre..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {TOOL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setSelectedCategory('favorites')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'favorites'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Favoritos ({favorites.length})</span>
          </button>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Sparkles className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No se encontraron herramientas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Prueba cambiando los términos de búsqueda o de categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredTools.map((tool) => {
              const Icon = ICON_MAP[tool.iconName] || Sparkles;
              const isFav = favorites.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  className="group relative bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-xl hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    {/* Top Row: Icon + Badge + Fav */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: tool.color }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {tool.badge && (
                          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {tool.badge}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isFav
                              ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                              : 'text-slate-300 dark:text-slate-600 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {tool.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  {/* Bottom Action Link */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      {tool.category.replace('-', ' ')}
                    </span>
                    <Link
                      href={`/${tool.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Usar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
