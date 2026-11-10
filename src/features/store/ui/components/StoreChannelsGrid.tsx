'use client';

import React from 'react';
import { LayoutContainer, Text, Title, Button } from '@/shared/ui/components';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa6';
import { ExternalLink } from 'lucide-react';
import { STORE_TEXTS } from '../../constants/store.constants';

interface StoreChannelsGridProps {
  whatsappNumber?: string;
  whatsappLink?: string;
  formattedWhatsapp?: string;
  whatsappDescription?: string;
  hasWhatsapp: boolean;
  instagramUrl?: string;
  instagramHandle?: string;
  instagramDescription?: string;
  hasInstagram: boolean;
}

export const StoreChannelsGrid: React.FC<StoreChannelsGridProps> = ({
  whatsappLink,
  formattedWhatsapp,
  whatsappDescription,
  hasWhatsapp,
  instagramUrl,
  instagramHandle,
  instagramDescription,
  hasInstagram,
}) => {
  if (!hasWhatsapp && !hasInstagram) {
    return null;
  }

  const isSingleCard = (hasWhatsapp && !hasInstagram) || (!hasWhatsapp && hasInstagram);

  return (
    <LayoutContainer
      className={`grid gap-6 ${
        isSingleCard ? 'grid-cols-1 max-w-2xl mx-auto w-full' : 'grid-cols-1 md:grid-cols-2'
      }`}
    >
      {/* WhatsApp Card */}
      {hasWhatsapp && (
        <LayoutContainer className="bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all hover:border-emerald-500/50 shadow-md">
          <LayoutContainer className="flex flex-col gap-4">
            <LayoutContainer className="flex items-center justify-between gap-3">
              <LayoutContainer className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <FaWhatsapp className="w-7 h-7" />
              </LayoutContainer>

              {formattedWhatsapp && (
                <Text
                  as="span"
                  className="text-xs font-mono font-medium text-text-secondary bg-surface-elevated px-2.5 py-1 rounded-lg border border-border"
                >
                  {formattedWhatsapp}
                </Text>
              )}
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-2">
              <Title level="h2" className="text-xl sm:text-2xl font-bold text-text-primary">
                {STORE_TEXTS.WHATSAPP_CARD_TITLE}
              </Title>
              <Text as="p" className="text-sm text-text-secondary leading-relaxed">
                {whatsappDescription || STORE_TEXTS.WHATSAPP_CARD_DESC}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="pt-2">
            {whatsappLink && whatsappLink !== '#' ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block"
              >
                <Button
                  variant="primary"
                  className="w-full font-bold justify-center bg-emerald-600 hover:bg-emerald-500 text-white"
                  leftIcon={<FaWhatsapp className="w-5 h-5" />}
                >
                  {STORE_TEXTS.WHATSAPP_BTN_ACTION}
                </Button>
              </a>
            ) : null}
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Instagram Card */}
      {hasInstagram && (
        <LayoutContainer className="bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all hover:border-pink-500/50 shadow-md">
          <LayoutContainer className="flex flex-col gap-4">
            <LayoutContainer className="flex items-center justify-between gap-3">
              <LayoutContainer className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/15 via-rose-500/15 to-purple-500/15 text-pink-500 flex items-center justify-center shrink-0">
                <FaInstagram className="w-7 h-7" />
              </LayoutContainer>

              {instagramHandle && (
                <Text
                  as="span"
                  className="text-xs font-semibold text-text-secondary bg-surface-elevated px-2.5 py-1 rounded-lg border border-border"
                >
                  {instagramHandle}
                </Text>
              )}
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-2">
              <Title level="h2" className="text-xl sm:text-2xl font-bold text-text-primary">
                {STORE_TEXTS.INSTAGRAM_CARD_TITLE}
              </Title>
              <Text as="p" className="text-sm text-text-secondary leading-relaxed">
                {instagramDescription || STORE_TEXTS.INSTAGRAM_CARD_DESC}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="pt-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-block"
            >
              <Button
                variant="outline"
                className="w-full font-bold justify-center hover:border-pink-500/60"
                rightIcon={<ExternalLink className="w-4 h-4" />}
                leftIcon={<FaInstagram className="w-4 h-4 text-pink-500" />}
              >
                {STORE_TEXTS.INSTAGRAM_BTN_ACTION}
              </Button>
            </a>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
