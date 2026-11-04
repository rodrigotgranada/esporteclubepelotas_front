import { Metadata } from 'next';
import { SquadFeature } from '@/features/football/ui/pages/SquadFeature';

export const metadata: Metadata = {
  title: 'Elenco & Comissões Técnicas | E.C. Pelotas',
  description: 'Conheça o plantel de atletas, categorias de base, futebol feminino e comissão técnica do Esporte Clube Pelotas na Boca do Lobo.',
  openGraph: {
    title: 'Elenco Oficial do Lobo | E.C. Pelotas',
    description: 'Plantel de jogadores da Boca do Lobo por temporada e categoria.',
  },
};

export default function ElencoPage() {
  return <SquadFeature />;
}
