import React from 'react';
import { Metadata } from 'next';
import { DashboardView } from '@/components/DashboardView';

export const metadata: Metadata = {
  title: 'Dashboard de Rendimiento & Estadísticas | DocuPulse Pro',
  description: 'Consulta métricas de uso de herramientas, espacio optimizado y conversiones en tiempo real.',
};

export default function DashboardPage() {
  return <DashboardView />;
}
