import { Suspense } from 'react';
import { LoginFeature } from '@/features/auth/ui';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginFeature />
    </Suspense>
  );
}
