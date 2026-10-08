import { Metadata } from 'next';
import { VerifyEmailFeature } from '@/features/auth/ui/pages/VerifyEmailFeature';

export const metadata: Metadata = {
  title: 'Verificação de E-mail - Esporte Clube Pelotas',
  description: 'Verifique seu e-mail para acessar o portal.',
};

import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyEmailFeature />
    </Suspense>
  );
}
