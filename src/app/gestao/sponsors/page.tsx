import React from 'react';
import { Metadata } from 'next';
import { AdminSponsorsFeature } from '@/features/admin/ui/pages/sponsors/AdminSponsorsFeature';

export const metadata: Metadata = {
  title: 'Patrocinadores & Parceiros | Painel Administrativo',
  description: 'Gerenciamento de marcas parceiras, contratos, ticker e métricas do Esporte Clube Pelotas.',
};

export default function AdminSponsorsPage() {
  return <AdminSponsorsFeature />;
}

