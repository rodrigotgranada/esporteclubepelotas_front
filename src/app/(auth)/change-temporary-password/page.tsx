import { ChangeTemporaryPasswordFeature } from '@/features/auth/ui/pages/ChangeTemporaryPasswordFeature';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar Senha Definitiva | E.C. Pelotas',
  description: 'Defina sua nova senha de acesso ao portal do Esporte Clube Pelotas.',
};

export default function ChangeTemporaryPasswordPage() {
  return <ChangeTemporaryPasswordFeature />;
}

