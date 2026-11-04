import { Metadata } from 'next';
import { ComingSoonFeature } from '@/features/public/ui/pages/ComingSoonFeature';

export const metadata: Metadata = {
  title: 'Ingressos & Jogos | E.C. Pelotas',
  description: 'Bilheteria e ingressos para os jogos do Esporte Clube Pelotas no Estádio Boca do Lobo.',
};

export default function IngressosPage() {
  return <ComingSoonFeature variant="ingressos" />;
}

