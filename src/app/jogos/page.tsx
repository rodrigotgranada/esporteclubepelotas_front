import { Metadata } from 'next';
import { MatchesFeature } from '@/features/matches/ui/pages/MatchesFeature';

export const metadata: Metadata = {
  title: 'Calendário de Jogos & Tabela | Esporte Clube Pelotas',
  description:
    'Confira o calendário oficial de partidas do Esporte Clube Pelotas: próximos confrontos, resultados anteriores, links de ingressos e tabela oficial da federação.',
  openGraph: {
    title: 'Calendário de Jogos & Tabela | Esporte Clube Pelotas',
    description:
      'Confira o calendário oficial de partidas do Esporte Clube Pelotas: próximos confrontos, resultados anteriores, links de ingressos e tabela oficial da federação.',
    images: ['/images/pelotas-logo.png'],
  },
};

export default function JogosPage() {
  return <MatchesFeature />;
}

