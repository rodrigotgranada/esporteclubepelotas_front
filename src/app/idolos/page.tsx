import { Metadata } from 'next';
import { IdolsFeature } from '@/features/idols/ui/pages/IdolsFeature';

export const metadata: Metadata = {
  title: 'Ídolos & Memorial da Boca do Lobo | E.C. Pelotas',
  description: 'Conheça os grandes atletas, treinadores e personagens que marcaram os 118 anos de história do Esporte Clube Pelotas.',
  openGraph: {
    title: 'Memorial Áureo-Cerúleo | E.C. Pelotas',
    description: 'Hall da Fama dos ídolos históricos do Pelotas na Boca do Lobo.',
  },
};

export default function Page() {
  return <IdolsFeature />;
}
