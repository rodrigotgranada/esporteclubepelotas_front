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
  FormField,
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
    form,
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
    save,
  } = useAdminYouthPortalTab();

  const { register, watch, formState: { errors } } = form;
  const contactDescription = watch('contactDescription') || '';

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
            <LayoutContainer className="flex items-center gap-2.5">
              <Target className="w-5 h-5 text-primary" />
              <Title level="h2" className="text-lg sm:text-xl font-bold text-text-primary">
                {texts.PILLARS_TITLE}
              </Title>
              <Badge variant="primary" size="sm">
                {pillars.length}/{MAX_YOUTH_PILLARS}
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
            className="font-bold text-xs shrink-0 self-start sm:self-auto"
          >
            {texts.BTN_ADD_PILLAR}
          </Button>
        </LayoutContainer>

        {pillars.length === 0 ? (
          <LayoutContainer className="py-12 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-6 gap-2">
            <Text as="p" className="text-xs text-text-secondary max-w-md">
              {texts.EMPTY_PILLARS}
            </Text>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={addPillar}
              leftIcon={<Plus className="w-4 h-4" />}
              className="mt-3 font-bold text-xs"
            >
              {texts.BTN_ADD_PILLAR}
            </Button>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillars.map((pillar, index) => (
              <LayoutContainer
                key={index}
                className="p-5 rounded-2xl bg-surface-secondary border border-border flex flex-col gap-3 relative shadow-xs"
              >
                <LayoutContainer className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                  <LayoutContainer className="flex items-center gap-2">
                    <Badge variant="primary" size="sm" className="font-mono text-xs font-bold">
                      #{index + 1}
                    </Badge>
                    <Text as="span" className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      {texts.PILLAR_CARD_LABEL} {index + 1}
                    </Text>
                  </LayoutContainer>

                  <LayoutContainer className="flex items-center gap-1">
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<ArrowUp className="w-3.5 h-3.5" />}
                      aria-label={texts.MOVE_UP_ARIA}
                      disabled={index === 0}
                      onClick={() => movePillar(index, 'up')}
                      className="p-1 text-text-secondary hover:text-text-primary"
                    />
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<ArrowDown className="w-3.5 h-3.5" />}
                      aria-label={texts.MOVE_DOWN_ARIA}
                      disabled={index === pillars.length - 1}
                      onClick={() => movePillar(index, 'down')}
                      className="p-1 text-text-secondary hover:text-text-primary"
                    />
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-3.5 h-3.5 text-[#ea580c]" />}
                      aria-label={texts.BTN_REMOVE_PILLAR}
                      onClick={() => removePillar(index)}
                      className="p-1 text-[#ea580c] hover:bg-[#ea580c]/10"
                    />
                  </LayoutContainer>
                </LayoutContainer>

                <LayoutContainer className="flex flex-col gap-1.5">
                  <LayoutContainer className="flex items-center justify-between">
                    <Text as="span" className="text-xs font-bold text-text-primary">
                      {texts.PILLAR_TITLE_LABEL} *
                    </Text>
                    <Text as="span" className="text-[10px] text-text-secondary">
                      {pillar.title.length}/{MAX_PILLAR_TITLE_CHARS}
                    </Text>
                  </LayoutContainer>
                  <Input
                    value={pillar.title}
                    maxLength={MAX_PILLAR_TITLE_CHARS}
                    onChange={(e) => updatePillar(index, 'title', e.target.value)}
                    placeholder={texts.PILLAR_TITLE_PLACEHOLDER}
                    className="text-xs sm:text-sm font-semibold"
                  />
                </LayoutContainer>

                <LayoutContainer className="flex flex-col gap-1.5">
                  <LayoutContainer className="flex items-center justify-between">
                    <Text as="span" className="text-xs font-bold text-text-primary">
                      {texts.PILLAR_DESC_LABEL} *
                    </Text>
                    <Text as="span" className="text-[10px] text-text-secondary">
                      {pillar.description.length}/{MAX_PILLAR_DESC_CHARS}
                    </Text>
                  </LayoutContainer>
                  <Textarea
                    rows={3}
                    value={pillar.description}
                    maxLength={MAX_PILLAR_DESC_CHARS}
                    onChange={(e) => updatePillar(index, 'description', e.target.value)}
                    placeholder={texts.PILLAR_DESC_PLACEHOLDER}
                    className="text-xs sm:text-sm resize-none"
                  />
                </LayoutContainer>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* 2. Seção: Critérios & Documentação para Testes / Peneiras */}
      <LayoutContainer className="p-6 sm:p-8 rounded-3xl bg-surface border border-border flex flex-col gap-6 shadow-xs">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <LayoutContainer className="flex flex-col gap-1 max-w-2xl">
            <LayoutContainer className="flex items-center gap-2.5">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              <Title level="h2" className="text-lg sm:text-xl font-bold text-text-primary">
                {texts.CRITERIA_TITLE}
              </Title>
              <Badge variant="primary" size="sm">
                {criteria.length} item(ns)
              </Badge>
            </LayoutContainer>
            <Text as="p" className="text-xs sm:text-sm text-text-secondary">
              {texts.CRITERIA_SUBTITLE}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex flex-col sm:flex-row gap-2">
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
            className="flex-1 text-xs sm:text-sm"
          />
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

        {criteria.length === 0 ? (
          <LayoutContainer className="py-8 border border-dashed border-border rounded-2xl flex items-center justify-center text-center p-4">
            <Text as="p" className="text-xs text-text-secondary">
              {texts.EMPTY_CRITERIA}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-2">
            {criteria.map((item, index) => (
              <LayoutContainer
                key={index}
                className="p-3 sm:p-4 rounded-xl bg-surface-secondary border border-border flex items-center justify-between gap-3 shadow-xs"
              >
                <LayoutContainer className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Badge variant="primary" size="sm" className="font-mono text-xs shrink-0">
                    {index + 1}
                  </Badge>
                  <Input
                    value={item}
                    onChange={(e) => updateCriterion(index, e.target.value)}
                    className="flex-1 text-xs sm:text-sm bg-surface border-border/80"
                  />
                </LayoutContainer>

                <LayoutContainer className="flex items-center gap-1 shrink-0">
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<ArrowUp className="w-3.5 h-3.5" />}
                    aria-label={texts.MOVE_UP_ARIA}
                    disabled={index === 0}
                    onClick={() => moveCriterion(index, 'up')}
                    className="p-1 text-text-secondary hover:text-text-primary"
                  />
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<ArrowDown className="w-3.5 h-3.5" />}
                    aria-label={texts.MOVE_DOWN_ARIA}
                    disabled={index === criteria.length - 1}
                    onClick={() => moveCriterion(index, 'down')}
                    className="p-1 text-text-secondary hover:text-text-primary"
                  />
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-3.5 h-3.5 text-[#ea580c]" />}
                    aria-label={texts.REMOVE_CRITERION_ARIA}
                    onClick={() => removeCriterion(index)}
                    className="p-1 text-[#ea580c] hover:bg-[#ea580c]/10"
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
          <FormField label={texts.FIELD_CONTACT_EMAIL} error={errors.contactEmail?.message}>
            <Input
              {...register('contactEmail')}
              placeholder={texts.FIELD_CONTACT_EMAIL_PLACEHOLDER}
              className="text-xs sm:text-sm"
            />
          </FormField>

          <FormField label={texts.FIELD_CONTACT_PHONE} error={errors.contactPhone?.message}>
            <Input
              {...register('contactPhone')}
              placeholder={texts.FIELD_CONTACT_PHONE_PLACEHOLDER}
              className="text-xs sm:text-sm"
            />
          </FormField>

          <FormField label={texts.FIELD_CONTACT_BADGE} error={errors.contactTitle?.message}>
            <Input
              {...register('contactTitle')}
              placeholder={texts.FIELD_CONTACT_BADGE_PLACEHOLDER}
              className="text-xs sm:text-sm"
            />
          </FormField>

          <LayoutContainer className="md:col-span-2">
            <FormField
              label={
                <LayoutContainer className="flex items-center justify-between w-full">
                  <Text as="span">{texts.FIELD_CONTACT_DESC}</Text>
                  <Text as="span" className="text-[11px] font-semibold text-text-secondary">
                    {contactDescription.length}/{MAX_CONTACT_DESC_CHARS}
                  </Text>
                </LayoutContainer>
              }
              error={errors.contactDescription?.message}
            >
              <Textarea
                rows={3}
                {...register('contactDescription')}
                maxLength={MAX_CONTACT_DESC_CHARS}
                placeholder={texts.FIELD_CONTACT_DESC_PLACEHOLDER}
                className="text-xs sm:text-sm resize-none"
              />
            </FormField>
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
