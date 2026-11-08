import React from 'react';
import { Metadata } from 'next';
import { AdminMembershipFeature } from '@/features/admin/ui/pages/membership/AdminMembershipFeature';

export const metadata: Metadata = {
  title: 'Quadro Social & Sócios | Painel Administrativo',
  description: 'Gerenciamento de planos de sócio, vantagens e torcedores interessados do Esporte Clube Pelotas.',
};

export default function AdminMembershipPage() {
  return <AdminMembershipFeature />;
}

