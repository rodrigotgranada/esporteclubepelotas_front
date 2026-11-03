import { Metadata } from 'next';
import { AdminNewsFeature } from '@/features/admin/ui/pages/news/AdminNewsFeature';

export const metadata: Metadata = {
  title: 'Gestão de Matérias | E.C. Pelotas',
  description: 'Gerenciamento de matérias e publicações do portal',
};

export default function Page() {
  return <AdminNewsFeature />;
}
