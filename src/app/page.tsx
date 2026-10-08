import { PublicLayout } from '@/features/public/ui/layouts/PublicLayout';
import { HomeFeature } from '@/features/public/ui/pages/HomeFeature';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Esporte Clube Pelotas - O Maior do Sul',
  description: 'Seja sócio, compre ingressos e acompanhe o Lobo.',
};

export default function Home() {
  return (
    <PublicLayout>
      <HomeFeature />
    </PublicLayout>
  );
}
