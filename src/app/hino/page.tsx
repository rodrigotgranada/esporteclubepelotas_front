import { Metadata } from 'next';
import { AnthemFeature } from '@/features/anthem/ui/pages/AnthemFeature';
import { ModuleGuard } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: 'Hino Oficial | Esporte Clube Pelotas',
  description:
    'Ouça o hino oficial do Lobo, confira a letra completa de Valmúrio e conheça a história da composição áureo-cerúlea.',
  openGraph: {
    title: 'Hino Oficial | Esporte Clube Pelotas',
    description:
      'Ouça o hino oficial do Lobo, confira a letra completa de Valmúrio e conheça a história da composição áureo-cerúlea.',
    images: ['/images/pelotas-logo.png'],
  },
};

export default function HinoPage() {
  return (
    <ModuleGuard moduleSlug="anthem" moduleName="Hino Oficial">
      <AnthemFeature />
    </ModuleGuard>
  );
}
