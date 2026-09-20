import { Suspense } from 'react';
import { ResetPasswordFeature } from '@/features/auth/ui/pages/ResetPasswordFeature';
import { LayoutContainer  } from '@/shared/ui/components';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <LayoutContainer className="min-h-screen w-full flex bg-[#111111] items-center justify-center text-white">
        Carregando...
      </LayoutContainer>
    }>
      <ResetPasswordFeature />
    </Suspense>
  );
}
