import { Metadata } from 'next';
import { PublicLayout } from '@/features/public/ui/layouts/PublicLayout';

export const metadata: Metadata = {
  title: 'Meu Perfil - E.C. Pelotas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
