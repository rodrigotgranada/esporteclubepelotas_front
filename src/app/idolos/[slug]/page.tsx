import { Metadata } from 'next';
import { IdolDetailFeature } from '@/features/idols/ui/pages/IdolDetailFeature';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Ídolo da Boca do Lobo | E.C. Pelotas`,
    description: `Conheça a história e conquistas no Memorial do Esporte Clube Pelotas.`,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <IdolDetailFeature slug={slug} />;
}

