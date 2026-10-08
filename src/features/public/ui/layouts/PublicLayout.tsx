'use client';

import React, { useEffect } from 'react';
import { PublicHeader } from '../components/PublicHeader';
import { LayoutContainer } from '@/shared/ui/components';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.status === 'PENDING') {
      router.push('/verify-email');
    }
  }, [user, router]);

  return (
    <LayoutContainer className="min-h-screen bg-background text-text-primary flex flex-col">
      <PublicHeader />
      <LayoutContainer as="main" className="flex-1">
        {children}
      </LayoutContainer>
    </LayoutContainer>
  );
};
