import { Metadata } from 'next';
import { AdminIdolsFeature } from '@/features/admin/ui/pages/idols/AdminIdolsFeature';

export const metadata: Metadata = {
  title: 'Gestão de Ídolos | E.C. Pelotas',
  description: 'Gerenciamento do Memorial e Hall da Fama da Boca do Lobo',
};

export default function Page() {
  return <AdminIdolsFeature />;
}
