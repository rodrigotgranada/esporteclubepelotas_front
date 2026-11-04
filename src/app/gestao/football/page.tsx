import { Metadata } from 'next';
import { AdminFootballFeature } from '@/features/admin/ui/pages/football/AdminFootballFeature';

export const metadata: Metadata = {
  title: 'Gestão de Futebol & Plantel | E.C. Pelotas',
  description: 'Gerenciamento do banco de atletas e montagem de elencos por temporada',
};

export default function Page() {
  return <AdminFootballFeature />;
}
