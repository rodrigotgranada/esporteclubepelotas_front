import React from 'react';
import { LayoutContainer, Spinner } from '@/shared/ui/components';

export default function NoticiasLoading() {
  return (
    <LayoutContainer className="min-h-[60vh] flex items-center justify-center p-8">
      <Spinner size={36} />
    </LayoutContainer>
  );
}

