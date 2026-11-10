import { Metadata } from 'next';
import { PublicMatchLiveFeature } from '@/features/matches/ui/pages/PublicMatchLiveFeature';

export const metadata: Metadata = {
  title: 'Cobertura Lance a Lance Ao Vivo | E.C. Pelotas',
  description: 'Acompanhe o minuto a minuto ao vivo da partida do Esporte Clube Pelotas em tempo real.',
};

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MatchLivePage({ params }: Props) {
  const { slug } = await params;
  return <PublicMatchLiveFeature slugOrId={slug} />;
}
