'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Sparkles,
  Search,
  Moon,
  Sun,
  Layers,
  Scissors,
  Minimize2,
  Lock,
  ArrowRightLeft,
  Bot,
  User,
  History,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Wrench,
  ScanText,
  ImagePlus,
  FileType2,
  Table,
  Sliders,
  Code,
  FileImage,
  Presentation,
  Sheet,
  ShieldCheck,
  RotateCw,
  Hash,
  Stamp,
  Crop,
  Edit3,
  FormInput,
  Unlock,
  PenTool,
  EyeOff,
  Columns,
  Languages,
  FileCode2,
  Camera,
} from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useUserStore } from '@/store/useUserStore';
import { CommandPalette } from './CommandPalette';
import { AuthModal } from './AuthModal';
import { HistoryDrawer } from './HistoryDrawer';

export function Navbar() {
  const pathname = usePathname();
  const { isDark, toggleTheme, setTheme } = useThemeStore();
  const { user, isAuthenticated, logout } = useUserStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('docuflow_theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme(true);
    }
  }, [setTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-purpleBrand-500 to-accentCyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-brand-600 to-purpleBrand-600 dark:from-white dark:via-brand-400 dark:to-accentCyan-400 bg-clip-text text-transparent">
                DocuPulse<span className="text-brand-500 dark:text-accentCyan-400 text-[10px] ml-1 px-1.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/50 dark:border-brand-800/50 font-semibold uppercase">PRO</span>
              </span>
            </div>
          </Link>

          {/* Quick Header Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/merge-pdf"
              className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
            >
              Merge PDF
            </Link>
            <Link
              href="/split-pdf"
              className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
            >
              Split PDF
            </Link>
            <Link
              href="/compress-pdf"
              className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
            >
              Compress PDF
            </Link>
            <Link
              href="/pdf-to-word"
              className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
            >
              PDF to Word
            </Link>

            {/* ALL PDF TOOLS MEGA MENU */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  isMegaMenuOpen
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100'
                }`}
              >
                <span>All PDF Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </nav>

          {/* Action Tools & Utilities */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buscar herramienta...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                Ctrl K
              </kbd>
            </button>

            {/* History */}
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              title="Historial de archivos"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <History className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title="Cambiar tema"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className="hidden md:flex p-2 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>

            {/* User Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-purpleBrand-500 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {isProfileMenuOpen && (
                  <div
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 animate-in fade-in duration-100"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg mt-1"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard & Métricas
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg mt-1"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-purpleBrand-600 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Cuenta</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* EXACT 7-COLUMN MEGA MENU MATCHING SCREENSHOT */}
        {/* ======================================================== */}
        {isMegaMenuOpen && (
          <div
            onMouseLeave={() => setIsMegaMenuOpen(false)}
            className="hidden lg:block absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 shadow-2xl z-50 py-8 px-6 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-7 gap-6">
              {/* 1. ORGANIZE PDF */}
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  Organize PDF
                </div>
                <div className="space-y-1">
                  <Link
                    href="/merge-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Layers className="w-3.5 h-3.5 text-red-500" />
                    <span>Merge PDF</span>
                  </Link>
                  <Link
                    href="/split-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Scissors className="w-3.5 h-3.5 text-orange-500" />
                    <span>Split PDF</span>
                  </Link>
                  <Link
                    href="/remove-pages"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <X className="w-3.5 h-3.5 text-red-600" />
                    <span>Remove pages</span>
                  </Link>
                  <Link
                    href="/extract-pages"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-pink-500" />
                    <span>Extract pages</span>
                  </Link>
                  <Link
                    href="/organize-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-purpleBrand-500" />
                    <span>Organize PDF</span>
                  </Link>
                  <Link
                    href="/scan-to-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Camera className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Scan to PDF</span>
                  </Link>
                </div>
              </div>

              {/* 2. OPTIMIZE PDF */}
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  Optimize PDF
                </div>
                <div className="space-y-1">
                  <Link
                    href="/compress-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Minimize2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Compress PDF</span>
                  </Link>
                  <Link
                    href="/repair-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Wrench className="w-3.5 h-3.5 text-lime-500" />
                    <span>Repair PDF</span>
                  </Link>
                  <Link
                    href="/ocr-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <ScanText className="w-3.5 h-3.5 text-teal-500" />
                    <span>OCR PDF</span>
                  </Link>
                </div>
              </div>

              {/* 3. CONVERT TO PDF */}
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  Convert to PDF
                </div>
                <div className="space-y-1">
                  <Link
                    href="/jpg-to-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <ImagePlus className="w-3.5 h-3.5 text-amber-500" />
                    <span>JPG to PDF</span>
                  </Link>
                  <Link
                    href="/word-to-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <FileType2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>WORD to PDF</span>
                  </Link>
                  <Link
                    href="/powerpoint-to-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Sliders className="w-3.5 h-3.5 text-orange-500" />
                    <span>POWERPOINT to PDF</span>
                  </Link>
                  <Link
                    href="/excel-to-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Table className="w-3.5 h-3.5 text-green-500" />
                    <span>EXCEL to PDF</span>
                  </Link>
                  <Link
                    href="/html-to-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Code className="w-3.5 h-3.5 text-yellow-500" />
                    <span>HTML to PDF</span>
                  </Link>
                </div>
              </div>

              {/* 4. CONVERT FROM PDF */}
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  Convert from PDF
                </div>
                <div className="space-y-1">
                  <Link
                    href="/pdf-to-jpg"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <FileImage className="w-3.5 h-3.5 text-rose-500" />
                    <span>PDF to JPG</span>
                  </Link>
                  <Link
                    href="/pdf-to-word"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>PDF to WORD</span>
                  </Link>
                  <Link
                    href="/pdf-to-powerpoint"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Presentation className="w-3.5 h-3.5 text-orange-500" />
                    <span>PDF to POWERPOINT</span>
                  </Link>
                  <Link
                    href="/pdf-to-excel"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Sheet className="w-3.5 h-3.5 text-green-500" />
                    <span>PDF to EXCEL</span>
                  </Link>
                  <Link
                    href="/pdf-to-pdfa"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                    <span>PDF to PDF/A</span>
                  </Link>
                </div>
              </div>

              {/* 5. EDIT PDF */}
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  Edit PDF
                </div>
                <div className="space-y-1">
                  <Link
                    href="/rotate-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-purple-500" />
                    <span>Rotate PDF</span>
                  </Link>
                  <Link
                    href="/add-page-numbers"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Hash className="w-3.5 h-3.5 text-lime-500" />
                    <span>Add page numbers</span>
                  </Link>
                  <Link
                    href="/add-watermark"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Stamp className="w-3.5 h-3.5 text-pink-500" />
                    <span>Add watermark</span>
                  </Link>
                  <Link
                    href="/crop-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Crop className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Crop PDF</span>
                  </Link>
                  <Link
                    href="/edit-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Edit PDF</span>
                  </Link>
                  <Link
                    href="/pdf-forms"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <FormInput className="w-3.5 h-3.5 text-violet-500" />
                    <span>PDF Forms</span>
                  </Link>
                </div>
              </div>

              {/* 6. PDF SECURITY */}
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  PDF Security
                </div>
                <div className="space-y-1">
                  <Link
                    href="/unlock-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Unlock className="w-3.5 h-3.5 text-teal-500" />
                    <span>Unlock PDF</span>
                  </Link>
                  <Link
                    href="/protect-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Lock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Protect PDF</span>
                  </Link>
                  <Link
                    href="/sign-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <PenTool className="w-3.5 h-3.5 text-blue-500" />
                    <span>Sign PDF</span>
                  </Link>
                  <Link
                    href="/redact-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                    <span>Redact PDF</span>
                  </Link>
                  <Link
                    href="/compare-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Columns className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Compare PDF</span>
                  </Link>
                </div>
              </div>

              {/* 7. PDF INTELLIGENCE */}
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  PDF Intelligence
                </div>
                <div className="space-y-1">
                  <Link
                    href="/ai-summarizer"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Bot className="w-3.5 h-3.5 text-purpleBrand-500" />
                    <span>AI Summarizer</span>
                  </Link>
                  <Link
                    href="/translate-pdf"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <Languages className="w-3.5 h-3.5 text-purple-500" />
                    <span>Translate PDF</span>
                  </Link>
                  <Link
                    href="/pdf-to-markdown"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-cyan-500" />
                    <span>PDF to Markdown</span>
                  </Link>
                  <Link
                    href="/ai-chat"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 py-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accentCyan-500" />
                    <span>Chat con PDF (IA)</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              Catálogo Completo
            </Link>
            <Link
              href="/merge-pdf"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              Merge PDF (Unir)
            </Link>
            <Link
              href="/compress-pdf"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              Compress PDF (Comprimir)
            </Link>
            <Link
              href="/ai-chat"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-brand-600 dark:text-brand-400"
            >
              Document IA Suite
            </Link>
          </div>
        )}
      </header>

      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </>
  );
}
