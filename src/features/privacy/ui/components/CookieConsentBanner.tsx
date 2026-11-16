'use client';

import React from 'react';
import { Cookie, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { LayoutContainer, Title, Text, Button, Badge } from '@/shared/ui/components';
import { COOKIE_CONSENT_TEXTS } from '../../constants/cookie-consent.constants';
import { useCookieConsent } from '../../hooks/useCookieConsent';

export function CookieConsentBanner() {
  const {
    isVisible,
    showDetails,
    handleAcceptAll,
    handleEssentialOnly,
    handleToggleDetails,
  } = useCookieConsent();

  if (!isVisible) {
    return null;
  }

  return (
    <LayoutContainer className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <LayoutContainer className="rounded-2xl border border-primary/30 bg-surface/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col gap-3.5">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <LayoutContainer className="flex items-start gap-3">
            <LayoutContainer className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Cookie className="w-5 h-5" />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1">
              <LayoutContainer className="flex items-center gap-2">
                <Badge variant="primary" size="sm" className="text-[10px]">
                  <ShieldCheck className="w-3 h-3" />
                  {COOKIE_CONSENT_TEXTS.BADGE}
                </Badge>
              </LayoutContainer>
              <Title level="h4" className="text-sm font-bold text-text-primary">
                {COOKIE_CONSENT_TEXTS.TITLE}
              </Title>
              <Text className="text-xs text-text-secondary leading-relaxed">
                {COOKIE_CONSENT_TEXTS.DESCRIPTION}
              </Text>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {showDetails && (
          <LayoutContainer className="rounded-xl border border-border bg-background/70 p-3.5 flex flex-col gap-2.5">
            <LayoutContainer className="flex flex-col gap-0.5">
              <Text className="text-xs font-bold text-text-primary">
                {COOKIE_CONSENT_TEXTS.ESSENTIAL_TITLE}
              </Text>
              <Text className="text-[11px] text-text-secondary leading-relaxed">
                {COOKIE_CONSENT_TEXTS.ESSENTIAL_DESC}
              </Text>
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-0.5 border-t border-border/60 pt-2">
              <Text className="text-xs font-bold text-text-primary">
                {COOKIE_CONSENT_TEXTS.OPTIONAL_TITLE}
              </Text>
              <Text className="text-[11px] text-text-secondary leading-relaxed">
                {COOKIE_CONSENT_TEXTS.OPTIONAL_DESC}
              </Text>
            </LayoutContainer>
          </LayoutContainer>
        )}

        <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToggleDetails}
            className="text-xs text-text-secondary hover:text-primary justify-start sm:justify-center px-2"
            rightIcon={showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          >
            {showDetails
              ? COOKIE_CONSENT_TEXTS.BUTTON_HIDE_DETAILS
              : COOKIE_CONSENT_TEXTS.BUTTON_SHOW_DETAILS}
          </Button>

          <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEssentialOnly}
              className="text-xs font-semibold"
            >
              {COOKIE_CONSENT_TEXTS.BUTTON_ESSENTIAL_ONLY}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAcceptAll}
              className="text-xs font-bold"
            >
              {COOKIE_CONSENT_TEXTS.BUTTON_ACCEPT_ALL}
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
}

