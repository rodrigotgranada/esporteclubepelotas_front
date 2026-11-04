import { Metadata } from 'next';
import { ComingSoonFeature } from '@/features/public/ui/pages/ComingSoonFeature';

export const metadata: Metadata = {
  title: 'Quadro Social | E.C. Pelotas',
  description: 'Seja sócio do Esporte Clube Pelotas. Conheça nossos planos e apoie o Lobo da Boca do Lobo.',
};

export default function SocioPage() {
  return <ComingSoonFeature variant="socio" />;
}
