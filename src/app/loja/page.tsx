import { Metadata } from 'next';
import { StoreFeature } from '@/features/store/ui/pages/StoreFeature';
import { STORE_TEXTS } from '@/features/store/constants/store.constants';
import { ModuleGuard } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: STORE_TEXTS.PAGE_TITLE,
  description: STORE_TEXTS.PAGE_DESCRIPTION,
  openGraph: {
    title: STORE_TEXTS.PAGE_TITLE,
    description: STORE_TEXTS.PAGE_DESCRIPTION,
    images: ['/images/pelotas-logo.png'],
  },
};

export default function LojaPage() {
  return (
    <ModuleGuard moduleSlug="store" moduleName="Loja Alcateia">
      <StoreFeature />
    </ModuleGuard>
  );
}
