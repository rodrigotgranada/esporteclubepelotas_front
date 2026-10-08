import { Suspense } from 'react';
import { RegisterFeature } from '@/features/auth/ui';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterFeature />
    </Suspense>
  );
}
