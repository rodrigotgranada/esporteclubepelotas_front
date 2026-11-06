'use client';

import React from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Target,
  ClipboardCheck,
  Mail,
  Save,
} from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  IconButton,
  Input,
  Textarea,
  Spinner,
} from '@/shared/ui/components';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../../constants/admin-football.constants';
import {
  useAdminYouthPortalTab,
  MAX_YOUTH_PILLARS,
  MAX_PILLAR_TITLE_CHARS,
  MAX_PILLAR_DESC_CHARS,
  MAX_CONTACT_DESC_CHARS,
} from '../../../hooks/football/useAdminYouthPortalTab';

export const YouthPortalSettingsTab: React.FC = () => {
  const texts = ADMIN_FOOTBALL_CONSTANTS.YOUTH_PORTAL_TAB;
  const {
    isLoading,
    isSaving,
    pillars,
    addPillar,
    updatePillar,
    removePillar,
    movePillar,
    criteria,
    newCriterion,
    setNewCriterion,
    addCriterion,
    updateCriterion,
    removeCriterion,
    moveCriterion,
    contactTitle,
    setContactTitle,
    contactDescription,
    setContactDescription,
    contactEmail,
    setContactEmail,
    contactPhone,
    setContactPhone,
    save,
  } = useAdminYouthPortalTab();

  if (isLoading) {
    return (
      <LayoutContainer className="py-20 flex flex-col items-center justify-center gap-3">
        <Spinner size={32} />
        <Text as="span" className="text-sm font-medium text-text-secondary">
          {texts.LOADING}
        </Text>
      </LayoutContainer>
    );
  }

  const isMaxPillars = pillars.length >= MAX_YOUTH_PILLARS;

  return (
    <LayoutContainer className="flex flex-col gap-8">
      {/* 1. Seção: Pilares do Futebol de Base (0 a 4 cards) */}
      <LayoutContainer className="p-6 sm:p-8 rounded-3xl bg-surface border border-border flex flex-col gap-6 shadow-xs">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <LayoutContainer className="flex flex-col gap-1 max-w-2xl">
            <LayoutContainer className="flex items-center gap-2.5 flex-wrap">
              <Target className="w-5 h-5 text-primary" />
              <Title level="h2" className="text-lg sm:text-xl font-bold text-text-primary">
                {texts.PILLARS_TITLE}
              </Title>
              <Badge variant="primary" size="sm" className="text-xs font-bold">
                {pillars.length} {texts.PILLARS_COUNT_SUFFIX}
              </Badge>
            </LayoutContainer>
            <Text as="p" className="text-xs sm:text-sm text-text-secondary">
              {texts.PILLARS_SUBTITLE}
            </Text>
          </LayoutContainer>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPillar}
            disabled={isMaxPillars}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-bold text-xs shrink-0"
          >
            {isMaxPillars ? texts.MAX_PILLARS_REACHED : texts.BTN_ADD_PILLAR}
          </Button>
        </LayoutContainer>

        {pillars.length === 0 ? (
          <LayoutContainer className="p-8 rounded-2xl bg-background/60 border border-dashed border-border text-center">
            <Text as="p" className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto">
              {texts.EMPTY_PILLARS}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pillars.map((pillar, idx) => (
              <LayoutContainer
                key={idx}
                className="p-5 rounded-2xl bg-background/70 border border-border flex flex-col gap-4"
              >
                <LayoutContainer className="flex items-center justify-between gap-2">
                  <Badge variant="default" size="sm" className="font-bold text-xs">
                    {texts.PILLAR_CARD_LABEL} {idx + 1}
                  </Badge>

                  <LayoutContainer className="flex items-center gap-1">
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={idx === 0}
                      aria-label={texts.MOVE_UP_ARIA}
                      onClick={() => movePillar(idx, 'up')}
                      className="text-text-secondary hover:text-text-primary"
                      icon={<ArrowUp className="w-3.5 h-3.5" />}
                    />
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={idx === pillars.length - 1}
                      aria-label={texts.MOVE_DOWN_ARIA}
                      onClick={() => movePillar(idx, 'down')}
                      className="text-text-secondary hover:text-text-primary"
                      icon={<ArrowDown className="w-3.5 h-3.5" />}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePillar(idx)}
                      className="text-[#ea580c] hover:bg-[#ea580c]/10 text-xs font-bold px-2 py-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1 text-[#ea580c]" />
                      {texts.BTN_REMOVE_PILLAR}
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Título do Card com contador de caracteres */}
                <LayoutContainer className="flex flex-col gap-1">
                  <LayoutContainer className="flex items-center justify-between">
                    <Text as="span" className="text-xs font-bold text-text-primary">
                      {texts.PILLAR_TITLE_LABEL} *
                    </Text>
                    <Text as="span" className="text-[11px] font-semibold text-text-secondary">
                      {pillar.title.length}/{MAX_PILLAR_TITLE_CHARS}
                    </Text>
                  </LayoutContainer>
                  <Input
                    value={pillar.title}
                    maxLength={MAX_PILLAR_TITLE_CHARS}
                    onChange={(e) => updatePillar(idx, 'title', e.target.value)}
                    placeholder={texts.PILLAR_TITLE_PLACEHOLDER}
                    className="text-xs sm:text-sm"
                  />
                </LayoutContainer>

                {/* Texto do Card com contador de caracteres */}
                <LayoutContainer className="flex flex-col gap-1">
                  <LayoutContainer className="flex items-center justify-between">
                    <Text as="span" className="text-xs font-bold text-text-primary">
                      {texts.PILLAR_DESC_LABEL} *
                    </Text>
                    <Text as="span" className="text-[11px] font-semibold text-text-secondary">
                      {pillar.description.length}/{MAX_PILLAR_DESC_CHARS}
                    </Text>
                  </LayoutContainer>
                  <Textarea
                    rows={3}
                    value={pillar.description}
                    maxLength={MAX_PILLAR_DESC_CHARS}
                    onChange={(e) => updatePillar(idx, 'description', e.target.value)}
                    placeholder={texts.PILLAR_DESC_PLACEHOLDER}
                    className="text-xs sm:text-sm resize-none"
                  />
                </LayoutContainer>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* 2. Seção: Peneiras & Captação • Lista de Critérios e Documentos Obrigatórios */}
      <LayoutContainer className="p-6 sm:p-8 rounded-3xl bg-surface border border-border flex flex-col gap-6 shadow-xs">
        <LayoutContainer className="flex flex-col gap-1 border-b border-border pb-4">
          <LayoutContainer className="flex items-center gap-2.5">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            <Title level="h2" className="text-lg sm:text-xl font-bold text-text-primary">
              {texts.CRITERIA_TITLE}
            </Title>
          </LayoutContainer>
          <Text as="p" className="text-xs sm:text-sm text-text-secondary">
            {texts.CRITERIA_SUBTITLE}
          </Text>
        </LayoutContainer>

        {/* Adicionar Novo Critério */}
        <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <LayoutContainer className="flex-1">
            <Input
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCriterion();
                }
              }}
              placeholder={texts.CRITERIA_INPUT_PLACEHOLDER}
              className="text-xs sm:text-sm"
            />
          </LayoutContainer>
          <Button
            type="button"
            variant="outline"
            onClick={addCriterion}
            disabled={!newCriterion.trim()}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-bold text-xs shrink-0"
          >
            {texts.BTN_ADD_CRITERION}
          </Button>
        </LayoutContainer>

        {/* Lista Editável de Critérios */}
        {criteria.length === 0 ? (
          <LayoutContainer className="p-6 rounded-2xl bg-background/60 border border-dashed border-border text-center">
            <Text as="p" className="text-xs sm:text-sm text-text-secondary">
              {texts.EMPTY_CRITERIA}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-2.5">
            {criteria.map((item, idx) => (
              <LayoutContainer
                key={idx}
                className="p-3 rounded-2xl bg-background/70 border border-border flex items-center gap-2.5"
              >
                <Text as="span" className="text-primary font-black px-1 shrink-0">
                  •
                </Text>
                <LayoutContainer className="flex-1">
                  <Input
                    value={item}
                    onChange={(e) => updateCriterion(idx, e.target.value)}
                    className="text-xs sm:text-sm py-1.5"
                  />
                </LayoutContainer>
                <LayoutContainer className="flex items-center gap-1 shrink-0">
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={idx === 0}
                    aria-label={texts.MOVE_UP_ARIA}
                    onClick={() => moveCriterion(idx, 'up')}
                    className="text-text-secondary hover:text-text-primary"
                    icon={<ArrowUp className="w-3.5 h-3.5" />}
                  />
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={idx === criteria.length - 1}
                    aria-label={texts.MOVE_DOWN_ARIA}
                    onClick={() => moveCriterion(idx, 'down')}
                    className="text-text-secondary hover:text-text-primary"
                    icon={<ArrowDown className="w-3.5 h-3.5" />}
                  />
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={texts.REMOVE_CRITERION_ARIA}
                    onClick={() => removeCriterion(idx)}
                    className="text-[#ea580c] hover:bg-[#ea580c]/10"
                    icon={<Trash2 className="w-4 h-4 text-[#ea580c]" />}
                  />
                </LayoutContainer>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* 3. Seção: Contato Oficial do Departamento de Futebol de Base */}
      <LayoutContainer className="p-6 sm:p-8 rounded-3xl bg-surface border border-border flex flex-col gap-6 shadow-xs">
        <LayoutContainer className="flex flex-col gap-1 border-b border-border pb-4">
          <LayoutContainer className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-primary" />
            <Title level="h2" className="text-lg sm:text-xl font-bold text-text-primary">
              {texts.CONTACT_TITLE}
            </Title>
          </LayoutContainer>
          <Text as="p" className="text-xs sm:text-sm text-text-secondary">
            {texts.CONTACT_SUBTITLE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_CONTACT_EMAIL}
            </Text>
            <Input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder={texts.FIELD_CONTACT_EMAIL_PLACEHOLDER}
              className="text-xs sm:text-sm"
            />
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_CONTACT_PHONE}
            </Text>
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder={texts.FIELD_CONTACT_PHONE_PLACEHOLDER}
              className="text-xs sm:text-sm"
            />
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_CONTACT_BADGE}
            </Text>
            <Input
              value={contactTitle}
              onChange={(e) => setContactTitle(e.target.value)}
              placeholder={texts.FIELD_CONTACT_BADGE_PLACEHOLDER}
              className="text-xs sm:text-sm"
            />
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-1.5 md:col-span-2">
            <LayoutContainer className="flex items-center justify-between">
              <Text as="span" className="text-xs font-bold text-text-primary">
                {texts.FIELD_CONTACT_DESC}
              </Text>
              <Text as="span" className="text-[11px] font-semibold text-text-secondary">
                {contactDescription.length}/{MAX_CONTACT_DESC_CHARS}
              </Text>
            </LayoutContainer>
            <Textarea
              rows={3}
              value={contactDescription}
              maxLength={MAX_CONTACT_DESC_CHARS}
              onChange={(e) => setContactDescription(e.target.value)}
              placeholder={texts.FIELD_CONTACT_DESC_PLACEHOLDER}
              className="text-xs sm:text-sm resize-none"
            />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Barra de Salvamento */}
      <LayoutContainer className="flex items-center justify-end pb-4">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={save}
          disabled={isSaving}
          leftIcon={isSaving ? <Spinner size={18} /> : <Save className="w-4 h-4" />}
          className="font-extrabold shadow-md shadow-primary/20"
        >
          {isSaving ? texts.BTN_SAVING : texts.BTN_SAVE}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
