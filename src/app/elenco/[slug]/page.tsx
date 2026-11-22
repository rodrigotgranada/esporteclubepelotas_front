import { Metadata } from 'next';
import { AthleteDetailFeature } from '@/features/football/ui/pages/AthleteDetailFeature';
import { fetchPublicServerJson } from '@/shared/utils/seo-fetch';
import type { AthleteData } from '@/features/football/services/football.service';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const athlete = await fetchPublicServerJson<AthleteData>(`/athletes/${encodeURIComponent(slug)}`);

  if (!athlete) {
    return {
      title: 'Perfil do Atleta | E.C. Pelotas',
      description: 'Ficha técnica, biografia, características e histórico de temporadas do atleta no Pelotas.',
    };
  }

  const displayName = athlete.nickname ? `${athlete.nickname} (${athlete.name})` : athlete.name;
  const roleLabel = athlete.athleteType === 'STAFF' ? athlete.staffRole || 'Comissão Técnica' : athlete.primaryPosition;
  const description =
    athlete.biography?.slice(0, 160) ||
    `Ficha técnica de ${displayName} (${roleLabel}) no Esporte Clube Pelotas.`;

  return {
    title: `${displayName} — ${roleLabel} | E.C. Pelotas`,
    description,
    openGraph: {
      title: `${displayName} | Elenco E.C. Pelotas`,
      description,
      images: athlete.photoUrl ? [{ url: athlete.photoUrl, alt: displayName }] : undefined,
    },
  };
}

export default function AthletePage() {
  return <AthleteDetailFeature />;
}
