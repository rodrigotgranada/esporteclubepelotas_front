import { Metadata } from 'next';
import { AdminAnthemFeature } from '@/features/admin/ui/pages/anthem/AdminAnthemFeature';

export const metadata: Metadata = {
  title: 'Hino Oficial & Versões | Painel Administrativo',
  description: 'Gestão da letra oficial, áudios, vídeos e histórico das composições do Esporte Clube Pelotas.',
};

export default function GestaoHinoPage() {
  return <AdminAnthemFeature />;
}

