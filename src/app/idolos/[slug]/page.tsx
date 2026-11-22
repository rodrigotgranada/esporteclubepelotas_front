import { Metadata } from 'next';
import { IdolDetailFeature } from '@/features/idols/ui/pages/IdolDetailFeature';
import { fetchPublicServerJson } from '@/shared/utils/seo-fetch';
import type { IdolData } from '@/features/idols/services/idols.service';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const idol = await fetchPublicServerJson<IdolData>(`/idols/${encodeURIComponent(slug)}`);

  if (!idol) {
    return {
      title: 'Ídolo da Boca do Lobo | E.C. Pelotas',
      description: 'Conheça a história e conquistas no Memorial do Esporte Clube Pelotas.',
    };
  }

  const displayName = idol.nickname ? `${idol.nickname} (${idol.name})` : idol.name;
  const description =
    idol.quote ||
    idol.biography?.slice(0, 160) ||
    `Conheça a história e conquistas de ${displayName} no Memorial do Esporte Clube Pelotas.`;

  return {
    title: `${displayName} | Memorial E.C. Pelotas`,
    description,
    openGraph: {
      title: `${displayName} | Memorial E.C. Pelotas`,
      description,
      images: idol.photoUrl ? [{ url: idol.photoUrl, alt: displayName }] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <IdolDetailFeature slug={slug} />;
}
