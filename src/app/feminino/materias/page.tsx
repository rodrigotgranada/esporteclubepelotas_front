import { Metadata } from 'next';
import { FemaleArticlesFeature } from '@/features/female/ui/pages/FemaleArticlesFeature';

export const metadata: Metadata = {
  title: 'Matérias das Lobas | Futebol Feminino E.C. Pelotas',
  description: 'Acompanhe as notícias e os bastidores do futebol feminino do Esporte Clube Pelotas',
};

export default function FemininoMateriasPage() {
  return <FemaleArticlesFeature />;
}

