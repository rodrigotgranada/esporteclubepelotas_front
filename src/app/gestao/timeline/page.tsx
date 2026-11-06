import React from 'react';
import { Metadata } from 'next';
import { AdminTimelineFeature } from '@/features/admin/ui/pages/timeline/AdminTimelineFeature';

export const metadata: Metadata = {
  title: 'Gestão da História & Linha do Tempo | Painel Administrativo',
  description: 'Gerenciamento dos marcos históricos e linha do tempo do Esporte Clube Pelotas.',
};

export default function AdminTimelinePage() {
  return <AdminTimelineFeature />;
}

