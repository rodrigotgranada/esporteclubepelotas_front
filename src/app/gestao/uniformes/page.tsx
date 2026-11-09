import { Metadata } from 'next';
import { AdminKitsFeature } from '@/features/kits/ui/pages/kits/AdminKitsFeature';

export const metadata: Metadata = {
  title: 'Mantos & Uniformes | Painel Administrativo',
  description: 'Gestão dos uniformes da temporada atual e acervo histórico de mantos por competição.',
};

export default function GestaoUniformesPage() {
  return <AdminKitsFeature />;
}

