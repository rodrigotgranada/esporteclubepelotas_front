import { Metadata } from 'next';
import { AdminFemaleFeature } from '@/features/admin/ui/pages/female/AdminFemaleFeature';

export const metadata: Metadata = {
  title: 'Futebol Feminino (As Lobas) | Gestão E.C. Pelotas',
  description: 'Central administrativa de competições, elencos, jogadoras, matérias e informações do Futebol Feminino',
};

export default function Page() {
  return <AdminFemaleFeature />;
}
