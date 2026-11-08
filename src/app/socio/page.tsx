import { Metadata } from 'next';
import { MembershipFeature } from '@/features/membership/ui/pages/MembershipFeature';

export const metadata: Metadata = {
  title: 'Quadro Social | Planos de Sócio | Esporte Clube Pelotas',
  description:
    'Seja sócio do Esporte Clube Pelotas. Conheça nossos planos oficiais, garanta seu acesso aos jogos na Boca do Lobo e apoie o eterno Lobo da Boca do Lobo.',
  openGraph: {
    title: 'Quadro Social | Planos de Sócio | Esporte Clube Pelotas',
    description:
      'Jogue junto com o Lobo dentro e fora de campo. Escolha seu plano e torne-se sócio do Esporte Clube Pelotas.',
  },
};

export default function SocioPage() {
  return <MembershipFeature />;
}
