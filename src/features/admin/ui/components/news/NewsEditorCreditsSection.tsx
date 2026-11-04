'use client';

import React from 'react';
import { UserCheck, Camera, Feather } from 'lucide-react';
import { LayoutContainer, Text, Input } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsEditorCreditsSectionProps {
  reporterName: string;
  setReporterName: (val: string) => void;
  photographerName: string;
  setPhotographerName: (val: string) => void;
}

export const NewsEditorCreditsSection: React.FC<NewsEditorCreditsSectionProps> = ({
  reporterName,
  setReporterName,
  photographerName,
  setPhotographerName,
}) => {
  const { DRAWER: texts } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs">
      <LayoutContainer className="flex flex-col gap-1">
        <LayoutContainer className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-primary" />
          <Text as="span" className="text-xs font-bold text-text-primary uppercase tracking-wider">
            {texts.LABEL_CREDITS_SECTION}
          </Text>
        </LayoutContainer>
        <Text as="span" className="text-[11px] text-text-secondary">
          {texts.LABEL_CREDITS_HINT}
        </Text>
      </LayoutContainer>

      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Repórter / Autor do Texto */}
        <LayoutContainer className="flex flex-col gap-1.5">
          <LayoutContainer className="flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5 text-text-secondary" />
            <Text as="span" className="text-xs font-semibold text-text-primary">
              {texts.LABEL_REPORTER}
            </Text>
          </LayoutContainer>
          <Input
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            placeholder={texts.PLACEHOLDER_REPORTER}
            className="text-xs"
          />
        </LayoutContainer>

        {/* Fotógrafo / Agência */}
        <LayoutContainer className="flex flex-col gap-1.5">
          <LayoutContainer className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-text-secondary" />
            <Text as="span" className="text-xs font-semibold text-text-primary">
              {texts.LABEL_PHOTOGRAPHER}
            </Text>
          </LayoutContainer>
          <Input
            value={photographerName}
            onChange={(e) => setPhotographerName(e.target.value)}
            placeholder={texts.PLACEHOLDER_PHOTOGRAPHER}
            className="text-xs"
          />
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

