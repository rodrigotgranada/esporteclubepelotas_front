import { Metadata } from 'next';
import { TransparencyPublicPage } from '@/features/transparency';
import { TRANSPARENCY_TEXTS } from '@/features/transparency/constants/transparency.constants';

export const metadata: Metadata = {
  title: `${TRANSPARENCY_TEXTS.PAGE_TITLE} | Esporte Clube Pelotas`,
  description: TRANSPARENCY_TEXTS.PAGE_SUBTITLE,
};

export default function TransparenciaPage() {
  return <TransparencyPublicPage />;
}

