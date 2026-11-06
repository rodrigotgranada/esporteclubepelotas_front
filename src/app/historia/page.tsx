import React from 'react';
import { Metadata } from 'next';
import { TimelineFeature } from '@/features/timeline/ui/pages/TimelineFeature';

export const metadata: Metadata = {
  title: 'História & Linha do Tempo | Esporte Clube Pelotas',
  description:
    'Conheça a história centenária do Esporte Clube Pelotas, fundado em 1908. Fatos marcantes, títulos históricos e a trajetória do eterno Lobo da Boca do Lobo.',
  openGraph: {
    title: 'História & Linha do Tempo | Esporte Clube Pelotas',
    description:
      'Uma trajetória centenária de paixão, glórias e tradição gravada na alma do futebol gaúcho.',
    images: ['/pelotas-logo.png'],
  },
};

export default function HistoriaPage() {
  return <TimelineFeature />;
}
