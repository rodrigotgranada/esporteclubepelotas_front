import { Metadata } from 'next';
import { TransparencyPublicPage } from '@/features/transparency';
import { TRANSPARENCY_TEXTS } from '@/features/transparency/constants/transparency.constants';
import { ModuleGuard } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: `${TRANSPARENCY_TEXTS.PAGE_TITLE} | Esporte Clube Pelotas`,
  description: TRANSPARENCY_TEXTS.PAGE_SUBTITLE,
};

export default function TransparenciaPage() {
  return (
    <ModuleGuard moduleSlug="transparency" moduleName="Transparência & Governança">
      <TransparencyPublicPage />
    </ModuleGuard>
  );
}

