'use client';

import React from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { LayoutContainer, Title, Text, Input, Button, Spinner } from '@/shared/ui/components';
import { useSettingsStore } from '@/store/useSettingsStore';
import { NEWSLETTER_TEXTS } from '../../constants/newsletter.constants';
import { useNewsletterSubscribe } from '../../hooks/useNewsletterSubscribe';

export function NewsletterSection() {
  const { settings } = useSettingsStore();
  const { email, setEmail, name, setName, isSubmitting, isSuccess, handleSubmit } = useNewsletterSubscribe();

  // REGRA: Se a newsletter estiver desativada pelo Admin, não renderiza
  if (settings && settings.newsletterIsActive === false) {
    return null;
  }

  return (
    <LayoutContainer className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-r from-[#071126] via-[#0B1B3D] to-[#071126] p-8 md:p-12 shadow-xl my-8">
      <LayoutContainer className="mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-8">
        <LayoutContainer className="flex-1">
          <LayoutContainer className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <Mail size={14} />
            <Text as="span">COMUNICADOS OFICIAIS</Text>
          </LayoutContainer>

          <Title level="h2" className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
            {NEWSLETTER_TEXTS.TITLE}
          </Title>

          <Text className="text-sm md:text-base text-gray-300 leading-relaxed">
            {NEWSLETTER_TEXTS.SUBTITLE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="w-full md:w-96 flex-shrink-0">
          {isSuccess ? (
            <LayoutContainer className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
              <CheckCircle2 size={24} className="flex-shrink-0" />
              <Text className="text-sm font-semibold">
                {NEWSLETTER_TEXTS.SUCCESS_MESSAGE}
              </Text>
            </LayoutContainer>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={NEWSLETTER_TEXTS.NAME_PLACEHOLDER}
                disabled={isSubmitting}
                className="bg-[#040A18]/80 border-gray-700 text-sm"
              />

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={NEWSLETTER_TEXTS.EMAIL_PLACEHOLDER}
                required
                disabled={isSubmitting}
                className="bg-[#040A18]/80 border-gray-700 text-sm"
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-400 font-bold text-[#0B1B3D] hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size={16} />
                    <span>{NEWSLETTER_TEXTS.SUBMITTING_BUTTON}</span>
                  </>
                ) : (
                  <span>{NEWSLETTER_TEXTS.SUBMIT_BUTTON}</span>
                )}
              </Button>

              <Text className="text-[11px] text-gray-400 text-center">
                {NEWSLETTER_TEXTS.PRIVACY_NOTE}
              </Text>
            </form>
          )}
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
}

