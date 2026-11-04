'use client';

import React from 'react';
import { LayoutContainer, Text, Title, Input, Textarea } from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';

export interface IdolCoachFieldsProps {
  coachMatches: number | '';
  setCoachMatches: (val: number | '') => void;
  coachWins: number | '';
  setCoachWins: (val: number | '') => void;
  coachDraws: number | '';
  setCoachDraws: (val: number | '') => void;
  coachLosses: number | '';
  setCoachLosses: (val: number | '') => void;
  coachTitlesText: string;
  setCoachTitlesText: (val: string) => void;
  tacticalStyle: string;
  setTacticalStyle: (val: string) => void;
}

export const IdolCoachFields: React.FC<IdolCoachFieldsProps> = ({
  coachMatches,
  setCoachMatches,
  coachWins,
  setCoachWins,
  coachDraws,
  setCoachDraws,
  coachLosses,
  setCoachLosses,
  coachTitlesText,
  setCoachTitlesText,
  tacticalStyle,
  setTacticalStyle,
}) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface/50 border border-border shadow-xs animate-in fade-in duration-200">
      <Title level="h4" className="text-sm font-black text-primary uppercase tracking-wider">
        {texts.SECTION_COACH}
      </Title>

      <LayoutContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_COACH_MATCHES}
          </Text>
          <Input
            type="number"
            value={coachMatches}
            onChange={(e) => setCoachMatches(e.target.value ? Number(e.target.value) : '')}
            placeholder="0"
          />
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_COACH_WINS}
          </Text>
          <Input
            type="number"
            value={coachWins}
            onChange={(e) => setCoachWins(e.target.value ? Number(e.target.value) : '')}
            placeholder="0"
          />
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_COACH_DRAWS}
          </Text>
          <Input
            type="number"
            value={coachDraws}
            onChange={(e) => setCoachDraws(e.target.value ? Number(e.target.value) : '')}
            placeholder="0"
          />
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_COACH_LOSSES}
          </Text>
          <Input
            type="number"
            value={coachLosses}
            onChange={(e) => setCoachLosses(e.target.value ? Number(e.target.value) : '')}
            placeholder="0"
          />
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="flex flex-col gap-1.5">
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LABEL_TACTICAL_STYLE}
        </Text>
        <Input
          value={tacticalStyle}
          onChange={(e) => setTacticalStyle(e.target.value)}
          placeholder={texts.PLACEHOLDER_TACTICAL_STYLE}
        />
      </LayoutContainer>

      <LayoutContainer className="flex flex-col gap-1.5">
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LABEL_TITLES}
        </Text>
        <Textarea
          value={coachTitlesText}
          onChange={(e) => setCoachTitlesText(e.target.value)}
          placeholder={texts.PLACEHOLDER_TITLES}
          rows={3}
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
