import { Metadata } from 'next';
import { AdminMatchesFeature } from '@/features/matches/ui/pages/admin/AdminMatchesFeature';

export const metadata: Metadata = {
  title: 'Campeonatos & Jogos | Painel Administrativo',
  description: 'Gestão de competições oficiais, partidas do Pelotas, calendário e links de transmissão/tabela.',
};

export default function GestaoJogosPage() {
  return <AdminMatchesFeature />;
}

