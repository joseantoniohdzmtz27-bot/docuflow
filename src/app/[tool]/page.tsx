import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { TOOLS } from '@/lib/constants';
import { ToolWorkspace } from '@/components/ToolWorkspace';

interface PageProps {
  params: Promise<{ tool: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    tool: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    return {
      title: 'Herramienta no encontrada - DocuPulse Pro',
    };
  }

  return {
    title: `${tool.name} - Procesamiento Online Rápido y Seguro | DocuPulse Pro`,
    description: tool.longDescription,
    openGraph: {
      title: `${tool.name} Online Gratis | DocuPulse Pro`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { tool: slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  return <ToolWorkspace tool={tool} />;
}
