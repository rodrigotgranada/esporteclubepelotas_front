'use client';

import React from 'react';
import { MailX, CheckCircle2, AlertTriangle, Home } from 'lucide-react';
import { LayoutContainer, Title, Text, Button, Radio } from '@/shared/ui/components';
import { NEWSLETTER_TEXTS } from '../../constants/newsletter.constants';
import { useNewsletterUnsubscribe } from '../../hooks/useNewsletterUnsubscribe';

export function NewsletterUnsubscribeFeature() {
  const texts = NEWSLETTER_TEXTS.UNSUBSCRIBE;
  const {
    hasToken,
    selectedReason,
    handleSelectReason,
    status,
    errorMessage,
    handleConfirmUnsubscribe,
    handleGoHome,
  } = useNewsletterUnsubscribe();

  return (
    <LayoutContainer className="min-h-[65vh] flex items-center justify-center px-4 py-12">
      <LayoutContainer className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xl flex flex-col items-center text-center gap-5">
        {!hasToken ? (
          <>
            <LayoutContainer className="w-14 h-14 rounded-2xl bg-error/15 border border-error/30 text-error flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col gap-2">
              <Title level="h1" className="text-xl font-black text-text-primary">
                {texts.INVALID_TOKEN_TITLE}
              </Title>
              <Text as="p" className="text-sm text-text-secondary leading-relaxed">
                {texts.INVALID_TOKEN_DESC}
              </Text>
            </LayoutContainer>
            <Button
              type="button"
              variant="primary"
              onClick={handleGoHome}
              leftIcon={<Home className="w-4 h-4" />}
              className="mt-2 font-bold"
            >
              {texts.BUTTON_HOME}
            </Button>
          </>
        ) : status === 'success' ? (
          <>
            <LayoutContainer className="w-14 h-14 rounded-2xl bg-success/15 border border-success/30 text-success flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col gap-2">
              <Title level="h1" className="text-xl font-black text-text-primary">
                {texts.SUCCESS_TITLE}
              </Title>
              <Text as="p" className="text-sm text-text-secondary leading-relaxed">
                {texts.SUCCESS_DESC}
              </Text>
            </LayoutContainer>
            <Button
              type="button"
              variant="primary"
              onClick={handleGoHome}
              leftIcon={<Home className="w-4 h-4" />}
              className="mt-2 font-bold"
            >
              {texts.BUTTON_HOME}
            </Button>
          </>
        ) : (
          <>
            <LayoutContainer className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center">
              <MailX className="w-7 h-7" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col gap-2">
              <Title level="h1" className="text-xl font-black text-text-primary">
                {texts.TITLE}
              </Title>
              <Text as="p" className="text-sm text-text-secondary leading-relaxed">
                {texts.DESCRIPTION}
              </Text>
            </LayoutContainer>

            <LayoutContainer className="w-full flex flex-col gap-2 text-left pt-1">
              <Text as="span" className="text-xs font-bold text-text-primary">
                {texts.REASON_LABEL}
              </Text>
              <LayoutContainer className="flex flex-col gap-2">
                {texts.REASONS.map((reason) => (
                  <Radio
                    key={reason}
                    name="unsubscribe-reason"
                    value={reason}
                    label={reason}
                    card
                    checked={selectedReason === reason}
                    disabled={status === 'loading'}
                    onChange={() => handleSelectReason(reason)}
                  />
                ))}
              </LayoutContainer>
            </LayoutContainer>

            {status === 'error' && errorMessage && (
              <LayoutContainer className="w-full p-3 rounded-xl bg-error/10 border border-error/30 text-error text-xs font-semibold">
                {errorMessage}
              </LayoutContainer>
            )}

            <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoHome}
                disabled={status === 'loading'}
              >
                {texts.BUTTON_HOME}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmUnsubscribe}
                isLoading={status === 'loading'}
                className="font-bold"
              >
                {status === 'loading' ? texts.BUTTON_PROCESSING : texts.BUTTON_CONFIRM}
              </Button>
            </LayoutContainer>
          </>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
}
