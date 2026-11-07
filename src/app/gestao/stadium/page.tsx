import React from 'react';
import { Metadata } from 'next';
import { AdminStadiumFeature } from '@/features/admin/ui/pages/stadium/AdminStadiumFeature';

export const metadata: Metadata = {
  title: 'Gestão da Boca do Lobo | Painel Administrativo',
  description: 'Gerenciamento do memorial, matéria da história e acervo fotográfico do Estádio Boca do Lobo.',
};

export default function AdminStadiumPage() {
  return <AdminStadiumFeature />;
}

