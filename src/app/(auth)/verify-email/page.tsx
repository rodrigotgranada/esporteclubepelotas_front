import { Metadata } from 'next';
import { VerifyEmailFeature } from '@/features/auth/ui/pages/VerifyEmailFeature';

export const metadata: Metadata = {
  title: 'Verificação de E-mail - Esporte Clube Pelotas',
  description: 'Verifique seu e-mail para acessar o portal.',
};

export default function VerifyEmailPage() {
  return <VerifyEmailFeature />;
}
