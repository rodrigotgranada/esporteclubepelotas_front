import { Metadata } from 'next';
import { SymbolsFeature } from '@/features/symbols/ui/pages/SymbolsFeature';
import { ModuleGuard } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: 'Símbolos Oficiais & Mascote | Esporte Clube Pelotas',
  description:
    'Conheça a história do Mascote Lobo da Boca do Lobo, a evolução centenária dos escudos, o pavilhão e o significado das cores áureo-cerúleas.',
  openGraph: {
    title: 'Símbolos Oficiais & Mascote | Esporte Clube Pelotas',
    description:
      'Conheça a história do Mascote Lobo da Boca do Lobo, a evolução centenária dos escudos, o pavilhão e o significado das cores áureo-cerúleas.',
    images: ['/images/pelotas-logo.png'],
  },
};

export default function SimbolosPage() {
  return (
    <ModuleGuard moduleSlug="symbols" moduleName="Símbolos & Mascote">
      <SymbolsFeature />
    </ModuleGuard>
  );
}
