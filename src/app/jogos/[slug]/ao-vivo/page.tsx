import { Metadata } from 'next';
import { PublicMatchLiveFeature } from '@/features/matches/ui/pages/PublicMatchLiveFeature';
import { fetchPublicServerJson } from '@/shared/utils/seo-fetch';
import type { Match } from '@/features/matches';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const match = await fetchPublicServerJson<Match>(`/matches/public/by-slug/${encodeURIComponent(slug)}`, 15);

  if (!match) {
    return {
      title: 'Cobertura Lance a Lance Ao Vivo | E.C. Pelotas',
      description: 'Acompanhe o minuto a minuto ao vivo da partida do Esporte Clube Pelotas em tempo real.',
    };
  }

  const matchup =
    match.homeAway === 'HOME'
      ? `Pelotas x ${match.opponentName}`
      : `${match.opponentName} x Pelotas`;
  const title = `${matchup} — Tempo Real | E.C. Pelotas`;
  const description = `Acompanhe lance a lance: ${matchup}${match.championshipName ? ` (${match.championshipName})` : ''} no Portal Oficial do Lobo.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function MatchLivePage({ params }: Props) {
  const { slug } = await params;
  return <PublicMatchLiveFeature slugOrId={slug} />;
}
