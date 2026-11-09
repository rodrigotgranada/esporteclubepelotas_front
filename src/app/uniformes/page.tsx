import { Metadata } from 'next';
import { KitsFeature } from '@/features/kits/ui/pages/KitsFeature';

export const metadata: Metadata = {
  title: 'Mantos Sagrados & Uniformes | Esporte Clube Pelotas',
  description:
    'Conheça o acervo de uniformes oficiais do Esporte Clube Pelotas: mantos da temporada atual e acervo histórico por campeonato.',
  openGraph: {
    title: 'Mantos Sagrados & Uniformes | Esporte Clube Pelotas',
    description:
      'Conheça o acervo de uniformes oficiais do Esporte Clube Pelotas: mantos da temporada atual e acervo histórico por campeonato.',
    images: ['/images/pelotas-logo.png'],
  },
};

export default function UniformesPage() {
  return <KitsFeature />;
}

