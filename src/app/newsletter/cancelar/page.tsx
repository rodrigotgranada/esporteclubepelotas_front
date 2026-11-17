import React, { Suspense } from 'react';
import { Metadata } from 'next';
import {
  NEWSLETTER_TEXTS,
  NewsletterUnsubscribeFeature,
} from '@/features/newsletter';
import { LayoutContainer, Spinner } from '@/shared/ui/components';

export const metadata: Metadata = {
  title: NEWSLETTER_TEXTS.UNSUBSCRIBE.PAGE_TITLE,
  description: NEWSLETTER_TEXTS.UNSUBSCRIBE.PAGE_DESCRIPTION,
};

export default function NewsletterCancelarPage() {
  return (
    <Suspense
      fallback={
        <LayoutContainer className="min-h-[60vh] flex items-center justify-center">
          <Spinner size={32} />
        </LayoutContainer>
      }
    >
      <NewsletterUnsubscribeFeature />
    </Suspense>
  );
}

