import { Metadata } from 'next';
import { FemaleSquadsFeature } from '@/features/female/ui/pages/FemaleSquadsFeature';
import { ModuleGuard } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: 'Elencos das Lobas | Futebol Feminino E.C. Pelotas',
  description: 'Confira as atletas e a comissão técnica do futebol feminino do Esporte Clube Pelotas',
};

export default function FemininoElencosPage() {
  return (
    <ModuleGuard moduleSlug="female" moduleName="Futebol Feminino">
      <FemaleSquadsFeature />
    </ModuleGuard>
  );
}

