'use client';

import React from 'react';
import { ClipboardCheck, Mail, Phone, Info } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Spinner,
} from '@/shared/ui/components';
import { YouthPortalConfig } from '@/features/football/services/football.service';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';

export interface YouthPeneirasSectionProps {
  config: YouthPortalConfig | null;
  isLoading?: boolean;
}

export const YouthPeneirasSection: React.FC<YouthPeneirasSectionProps> = ({
  config,
  isLoading = false,
}) => {
  const texts = YOUTH_CONSTANTS.PENEIRAS;

  if (isLoading) {
    return (
      <LayoutContainer className="p-8 sm:p-10 rounded-3xl bg-surface border border-border flex flex-col items-center justify-center gap-3 my-10 shadow-xs">
        <Spinner size={28} />
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LOADING}
        </Text>
      </LayoutContainer>
    );
  }

  const criteria = config?.peneirasCriteria || [];
  const contactTitle = config?.contactTitle?.trim() || texts.DEFAULT_CONTACT_TITLE;
  const contactDescription = config?.contactDescription?.trim() || '';
  const contactEmail = config?.contactEmail?.trim() || '';
  const contactPhone = config?.contactPhone?.trim() || '';

  const hasCriteria = criteria.length > 0;
  const hasContactCard = Boolean(contactDescription || contactEmail || contactPhone);

  if (!hasCriteria && !hasContactCard) {
    return null;
  }

  return (
    <LayoutContainer className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-surface to-background border border-border flex flex-col gap-8 my-10 shadow-xs">
      {/* Header */}
      <LayoutContainer className="max-w-2xl flex flex-col gap-1.5">
        <LayoutContainer className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
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
        {hasCriteria && (
          <LayoutContainer
            className={`${
              hasContactCard ? 'lg:col-span-7' : 'lg:col-span-12'
            } p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4`}
          >
            <Title level="h3" className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Info className="w-4 h-4 text-primary shrink-0" />
              <Text as="span">{texts.CARD_TITLE}</Text>
            </Title>

            <LayoutContainer className="flex flex-col gap-2.5">
              {criteria.map((criterion, idx) => (
                <LayoutContainer
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed"
                >
                  <Text as="span" className="text-primary font-black mt-0.5">
                    •
                  </Text>
                  <Text as="span">{criterion}</Text>
                </LayoutContainer>
              ))}
            </LayoutContainer>
          </LayoutContainer>
        )}

        {/* Card: Contato da Coordenação do Departamento de Futebol de Base (sem Local de Treinamento) */}
        {hasContactCard && (
          <LayoutContainer
            className={`${
              hasCriteria ? 'lg:col-span-5' : 'lg:col-span-12'
            } p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col justify-between gap-4`}
          >
            <LayoutContainer className="flex flex-col gap-2">
              <Badge variant="primary" className="self-start text-[10px] font-bold uppercase tracking-wider">
                {contactTitle}
              </Badge>
              {contactDescription && (
                <Text as="p" className="text-xs text-text-secondary leading-relaxed mt-1">
                  {contactDescription}
                </Text>
              )}
            </LayoutContainer>

            {(contactEmail || contactPhone) && (
              <LayoutContainer className="flex flex-col gap-3 pt-4 border-t border-primary/20">
                {contactEmail && (
                  <LayoutContainer className="flex items-center gap-2.5 text-xs text-text-primary">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <LayoutContainer className="flex flex-col">
                      <Text as="span" className="text-[10px] text-text-secondary font-bold">
                        {texts.CONTACT_EMAIL_LABEL}
                      </Text>
                      <Text as="span" className="font-semibold select-all">
                        {contactEmail}
                      </Text>
                    </LayoutContainer>
                  </LayoutContainer>
                )}

                {contactPhone && (
                  <LayoutContainer className="flex items-center gap-2.5 text-xs text-text-primary">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <LayoutContainer className="flex flex-col">
                      <Text as="span" className="text-[10px] text-text-secondary font-bold">
                        {texts.CONTACT_PHONE_LABEL}
                      </Text>
                      <Text as="span" className="font-semibold select-all">
                        {contactPhone}
                      </Text>
                    </LayoutContainer>
                  </LayoutContainer>
                )}
              </LayoutContainer>
            )}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
