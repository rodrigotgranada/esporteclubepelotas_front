import { Metadata } from 'next';
import { FemaleHubFeature } from '@/features/female/ui/pages/FemaleHubFeature';

export const metadata: Metadata = {
  title: 'Futebol Feminino (As Lobas) | E.C. Pelotas',
  description: 'Portal Oficial do Futebol Feminino do Esporte Clube Pelotas - As Lobas da Boca do Lobo',
};

export default function FemininoPage() {
  return <FemaleHubFeature />;
}

