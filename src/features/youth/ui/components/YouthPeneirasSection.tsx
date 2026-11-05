'use client';

import React from 'react';
import { ClipboardCheck, Mail, MapPin, Info } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
} from '@/shared/ui/components';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';

export const YouthPeneirasSection: React.FC = () => {
  const texts = YOUTH_CONSTANTS.PENEIRAS;

  return (
    <LayoutContainer className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-surface to-surface-secondary border border-border flex flex-col gap-8 my-10 shadow-xs">
      {/* Header */}
      <LayoutContainer className="max-w-2xl flex flex-col gap-1.5">
        <LayoutContainer className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-secondary" />
          <Title level="h2" className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            {texts.SECTION_TITLE}
          </Title>
        </LayoutContainer>
        <Text as="p" className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {texts.SECTION_SUBTITLE}
        </Text>
      </LayoutContainer>

      <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Card: Documentos e Critérios Obrigatórios */}
        <LayoutContainer className="lg:col-span-7 p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4">
          <Title level="h3" className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <Text as="span">{texts.CARD_TITLE}</Text>
          </Title>

          <LayoutContainer className="flex flex-col gap-2.5">
            {texts.CRITERIA.map((criterion, idx) => (
              <LayoutContainer key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                <Text as="span" className="text-primary font-black mt-0.5">•</Text>
                <Text as="span">{criterion}</Text>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        </LayoutContainer>

        {/* Card: Contato & Atendimento da Coordenação */}
        <LayoutContainer className="lg:col-span-5 p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col justify-between gap-4">
          <LayoutContainer className="flex flex-col gap-2">
            <Badge variant="primary" className="self-start text-[10px] font-bold uppercase tracking-wider">
              {texts.CONTACT_BOX_TITLE}
            </Badge>
            <Text as="p" className="text-xs text-text-secondary leading-relaxed mt-1">
              {texts.CONTACT_BOX_DESC}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-3 pt-4 border-t border-primary/20">
            <LayoutContainer className="flex items-center gap-2.5 text-xs text-text-primary">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <LayoutContainer className="flex flex-col">
                <Text as="span" className="text-[10px] text-text-muted font-bold">
                  {texts.CONTACT_EMAIL_LABEL}
                </Text>
                <Text as="span" className="font-semibold select-all">
                  {texts.CONTACT_EMAIL}
                </Text>
              </LayoutContainer>
            </LayoutContainer>

            <LayoutContainer className="flex items-center gap-2.5 text-xs text-text-primary">
              <MapPin className="w-4 h-4 text-secondary shrink-0" />
              <LayoutContainer className="flex flex-col">
                <Text as="span" className="text-[10px] text-text-muted font-bold">
                  {texts.CONTACT_LOCAL_LABEL}
                </Text>
                <Text as="span" className="font-semibold">
                  {texts.CONTACT_LOCAL}
                </Text>
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
