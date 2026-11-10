import { Metadata } from 'next';
import { AdminMatchNarratorFeature } from '@/features/matches/ui/pages/AdminMatchNarratorFeature';

export const metadata: Metadata = {
  title: 'Painel do Narrador | Gestão E.C. Pelotas',
  description: 'Transmissão e cobertura de lances ao vivo do Esporte Clube Pelotas.',
};

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminMatchNarratorPage({ params }: Props) {
  const { id } = await params;
  return <AdminMatchNarratorFeature matchId={id} />;
}

