'use client';

import React from 'react';
import { LayoutContainer, Text, Title, Badge, Button } from '@/shared/ui/components';
import { Globe, ExternalLink, Clock } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { STORE_TEXTS } from '../../constants/store.constants';

interface StoreOnlineCardProps {
  isOnlineActive: boolean;
  externalUrl?: string;
  whatsappLink?: string;
}

export const StoreOnlineCard: React.FC<StoreOnlineCardProps> = ({
  isOnlineActive,
  externalUrl,
  whatsappLink,
}) => {
  return (
    <LayoutContainer className="bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 relative overflow-hidden transition-all hover:border-primary/50 shadow-md">
      <LayoutContainer className="flex flex-col gap-4">
        <LayoutContainer className="flex items-center justify-between gap-3">
          <LayoutContainer className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6" />
          </LayoutContainer>

          <Badge variant={isOnlineActive ? 'success' : 'default'} className="font-semibold text-xs">
            {isOnlineActive ? STORE_TEXTS.ONLINE_BADGE_ACTIVE : STORE_TEXTS.ONLINE_BADGE_SOON}
          </Badge>
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-2">
          <Title level="h2" className="text-xl sm:text-2xl font-bold text-text-primary">
            {STORE_TEXTS.ONLINE_CARD_TITLE}
          </Title>
          <Text as="p" className="text-sm text-text-secondary leading-relaxed">
            {isOnlineActive
              ? STORE_TEXTS.ONLINE_CARD_ACTIVE_DESC
              : STORE_TEXTS.ONLINE_CARD_SOON_DESC}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="pt-2">
        {isOnlineActive && externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-block"
          >
            <Button
              variant="primary"
              className="w-full font-bold justify-center"
              rightIcon={<ExternalLink className="w-4 h-4" />}
            >
              {STORE_TEXTS.ONLINE_BTN_ACCESS}
            </Button>
          </a>
        ) : whatsappLink && whatsappLink !== '#' ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-block"
          >
            <Button
              variant="outline"
              className="w-full font-medium justify-center"
              leftIcon={<FaWhatsapp className="w-4 h-4 text-emerald-500" />}
            >
              {STORE_TEXTS.WHATSAPP_BTN_ACTION}
            </Button>
          </a>
        ) : (
          <Button
            variant="outline"
            disabled
            className="w-full font-medium justify-center opacity-70"
            leftIcon={<Clock className="w-4 h-4" />}
          >
            {STORE_TEXTS.ONLINE_BTN_SOON}
          </Button>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
