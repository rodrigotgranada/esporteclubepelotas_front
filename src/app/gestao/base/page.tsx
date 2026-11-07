import { Metadata } from 'next';
import { AdminYouthFeature } from '@/features/admin/ui/pages/youth/AdminYouthFeature';

export const metadata: Metadata = {
  title: 'Categorias de Base | Gestão E.C. Pelotas',
  description: 'Central administrativa de competições, elencos, atletas, matérias e configurações do portal da Base',
};

export default function Page() {
  return <AdminYouthFeature />;
}

