'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';
import { LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import { ADMIN_ERROR_PAGE_TEXTS } from './error.constants';

export default function GestaoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled admin error:', error);
  }, [error]);

  return (
    <LayoutContainer className="min-h-[70vh] bg-background flex items-center justify-center p-4">
      <LayoutContainer className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 text-center shadow-xl animate-in fade-in zoom-in-95 duration-300">
        <LayoutContainer className="w-16 h-16 rounded-2xl bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </LayoutContainer>

        <Title level="h1" className="text-2xl font-black text-text-primary mb-3">
          {ADMIN_ERROR_PAGE_TEXTS.TITLE}
        </Title>

        <Text className="text-sm text-text-secondary leading-relaxed mb-6">
          {ADMIN_ERROR_PAGE_TEXTS.DESCRIPTION}
        </Text>

        <LayoutContainer className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => reset()}
            leftIcon={<RefreshCw size={16} />}
            className="w-full sm:w-auto"
          >
            {ADMIN_ERROR_PAGE_TEXTS.BUTTON_RETRY}
          </Button>

          <Link href="/gestao" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="md"
              leftIcon={<LayoutDashboard size={16} />}
              className="w-full sm:w-auto"
            >
              {ADMIN_ERROR_PAGE_TEXTS.BUTTON_DASHBOARD}
            </Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
}

