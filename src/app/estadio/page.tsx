import React from 'react';
import { Metadata } from 'next';
import { StadiumFeature } from '@/features/stadium/ui/pages/StadiumFeature';
import { ModuleGuard } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: 'Estádio Boca do Lobo | Esporte Clube Pelotas',
  description:
    'Conheça a história centenária do Estádio Boca do Lobo (Parque Barbosa Leão), fundado em 1908. O mais antigo estádio de futebol em atividade contínua do Rio Grande do Sul.',
  openGraph: {
    title: 'Estádio Boca do Lobo | O Templo Sagrado do Lobo',
    description:
      'Uma grande reportagem contando o pioneirismo, as origens, os grandes clássicos e a mística centenária da Boca do Lobo.',
    images: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function EstadioPage() {
  return (
    <ModuleGuard moduleSlug="stadium" moduleName="Estádio Boca do Lobo">
      <StadiumFeature />
    </ModuleGuard>
  );
}
