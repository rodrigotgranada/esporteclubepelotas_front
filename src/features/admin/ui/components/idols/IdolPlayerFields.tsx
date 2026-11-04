'use client';

import React from 'react';
import { LayoutContainer, Text, Title, Input, Select, Option, Textarea } from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';

export interface IdolPlayerFieldsProps {
  position: string;
  setPosition: (val: string) => void;
  preferredFoot: string;
  setPreferredFoot: (val: string) => void;
  historicJerseyNumber: number | '';
  setHistoricJerseyNumber: (val: number | '') => void;
  matchesCount: number | '';
  setMatchesCount: (val: number | '') => void;
  goalsCount: number | '';
  setGoalsCount: (val: number | '') => void;
  titlesText: string;
  setTitlesText: (val: string) => void;
  memorableMatch: string;
  setMemorableMatch: (val: string) => void;
}

export const IdolPlayerFields: React.FC<IdolPlayerFieldsProps> = ({
  position,
  setPosition,
  preferredFoot,
  setPreferredFoot,
  historicJerseyNumber,
  setHistoricJerseyNumber,
  matchesCount,
  setMatchesCount,
  goalsCount,
  setGoalsCount,
  titlesText,
  setTitlesText,
  memorableMatch,
  setMemorableMatch,
}) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface/50 border border-border shadow-xs animate-in fade-in duration-200">
      <Title level="h4" className="text-sm font-black text-primary uppercase tracking-wider">
        {texts.SECTION_PLAYER}
      </Title>

      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_POSITION}
          </Text>
          <Input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder={texts.PLACEHOLDER_POSITION}
          />
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_PREFERRED_FOOT}
          </Text>
          <Select
            value={preferredFoot}
            onChange={(e) => setPreferredFoot(e.target.value)}
          >
            <Option value="Destro">Destro</Option>
            <Option value="Canhoto">Canhoto</Option>
            <Option value="Ambidestro">Ambidestro</Option>
          </Select>
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_JERSEY}
          </Text>
          <Input
            type="number"
            value={historicJerseyNumber}
            onChange={(e) => setHistoricJerseyNumber(e.target.value ? Number(e.target.value) : '')}
            placeholder={texts.PLACEHOLDER_JERSEY}
          />
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_MATCHES}
          </Text>
          <Input
            type="number"
            value={matchesCount}
            onChange={(e) => setMatchesCount(e.target.value ? Number(e.target.value) : '')}
            placeholder={texts.PLACEHOLDER_MATCHES}
          />
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_GOALS}
          </Text>
          <Input
            type="number"
            value={goalsCount}
            onChange={(e) => setGoalsCount(e.target.value ? Number(e.target.value) : '')}
            placeholder={texts.PLACEHOLDER_GOALS}
          />
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="flex flex-col gap-1.5">
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LABEL_MEMORABLE_MATCH}
        </Text>
        <Input
          value={memorableMatch}
          onChange={(e) => setMemorableMatch(e.target.value)}
          placeholder={texts.PLACEHOLDER_MEMORABLE_MATCH}
        />
      </LayoutContainer>

      <LayoutContainer className="flex flex-col gap-1.5">
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LABEL_TITLES}
        </Text>
        <Textarea
          value={titlesText}
          onChange={(e) => setTitlesText(e.target.value)}
          placeholder={texts.PLACEHOLDER_TITLES}
          rows={3}
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
