import { Metadata } from 'next';
import { AthleteDetailFeature } from '@/features/football/ui/pages/AthleteDetailFeature';

export const metadata: Metadata = {
  title: 'Perfil do Atleta | E.C. Pelotas',
  description: 'Ficha técnica, biografia, características e histórico de temporadas do atleta no Pelotas.',
};

export default function AthletePage() {
  return <AthleteDetailFeature />;
}
