import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DocuPulse Pro - Suite SaaS Profesional de Procesamiento de PDF e Imágenes',
  description:
    'Une, divide, convierte, comprime, protege y optimiza documentos PDF e imágenes con inteligencia artificial y procesamiento de alta velocidad.',
  keywords: [
    'iLovePDF',
    'Unir PDF',
    'Dividir PDF',
    'Comprimir PDF',
    'PDF a Word',
    'Chat con PDF',
    'IA PDF',
    'Convertir Imagen',
    'JPG a PDF',
    'Organizar PDF',
  ],
  authors: [{ name: 'DocuPulse Team' }],
  openGraph: {
    title: 'DocuPulse Pro - Plataforma SaaS de Documentos e Imágenes',
    description: 'La suite web más moderna y rápida para procesar PDFs e imágenes en segundos.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
