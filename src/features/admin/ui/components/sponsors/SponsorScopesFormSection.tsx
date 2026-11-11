'use client';

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  LayoutContainer,
  Text,
  Title,
  Switch,
  Badge,
} from '@/shared/ui/components';
import { Layers, Shield, Sprout, Crown } from 'lucide-react';
import { ADMIN_SPONSORS_TEXTS } from '../../../constants/admin-sponsors.constants';
import { SponsorFormData } from '../../../schemas/sponsor.schema';

export interface SponsorScopesFormSectionProps {
  control: Control<SponsorFormData>;
  errors: FieldErrors<SponsorFormData>;
}

export const SponsorScopesFormSection: React.FC<SponsorScopesFormSectionProps> = ({
  control,
  errors,
}) => {
  const texts = ADMIN_SPONSORS_TEXTS.DRAWER;

  return (
    <LayoutContainer className="flex flex-col gap-4">
      <LayoutContainer className="flex items-center gap-2 border-b border-border pb-2">
        <Layers size={18} className="text-primary" />
        <Title level="h3" className="text-base font-bold text-text-primary">
          {texts.SECTION_SCOPES}
        </Title>
      </LayoutContainer>

      <Text as="p" className="text-xs text-text-secondary leading-relaxed">
        {texts.DESC_SCOPES}
      </Text>

      <LayoutContainer className="flex flex-col gap-3">
        {/* Switch Escopo 1: Portal Principal & Profissional Masculino */}
        <Controller
          name="showOnMain"
          control={control}
          render={({ field }) => {
            const isChecked = Boolean(field.value);
            return (
              <LayoutContainer className="flex items-center justify-between p-4 rounded-xl bg-surface/60 border border-border hover:border-primary/40 transition-all shadow-xs">
                <LayoutContainer className="flex flex-col gap-1 pr-4">
                  <LayoutContainer className="flex items-center gap-2">
                    <Shield
                      className={`w-4 h-4 shrink-0 ${isChecked ? 'text-primary' : 'text-text-secondary'}`}
                    />
                    <Text as="span" className="font-bold text-sm text-text-primary">
                      {texts.LABEL_SCOPE_MAIN}
                    </Text>
                    <Badge variant={isChecked ? 'primary' : 'default'} size="sm" className="font-bold">
                      {isChecked ? 'Ativo na Home' : 'Oculto na Home'}
                    </Badge>
                  </LayoutContainer>
                  <Text as="p" className="text-xs text-text-secondary leading-relaxed">
                    {texts.DESC_SCOPE_MAIN}
                  </Text>
                </LayoutContainer>
                <Switch
                  checked={isChecked}
                  onChange={(checked) => field.onChange(checked)}
                  id="sponsor-show-on-main-switch"
                  label=""
                />
              </LayoutContainer>
            );
          }}
        />

        {/* Switch Escopo 2: Categorias de Base */}
        <Controller
          name="showOnYouth"
          control={control}
          render={({ field }) => {
            const isChecked = Boolean(field.value);
            return (
              <LayoutContainer className="flex items-center justify-between p-4 rounded-xl bg-surface/60 border border-border hover:border-primary/40 transition-all shadow-xs">
                <LayoutContainer className="flex flex-col gap-1 pr-4">
                  <LayoutContainer className="flex items-center gap-2">
                    <Sprout
                      className={`w-4 h-4 shrink-0 ${isChecked ? 'text-emerald-500' : 'text-text-secondary'}`}
                    />
                    <Text as="span" className="font-bold text-sm text-text-primary">
                      {texts.LABEL_SCOPE_YOUTH}
                    </Text>
                    <Badge variant={isChecked ? 'success' : 'default'} size="sm" className="font-bold">
                      {isChecked ? 'Ativo na Base' : 'Oculto na Base'}
                    </Badge>
                  </LayoutContainer>
                  <Text as="p" className="text-xs text-text-secondary leading-relaxed">
                    {texts.DESC_SCOPE_YOUTH}
                  </Text>
                </LayoutContainer>
                <Switch
                  checked={isChecked}
                  onChange={(checked) => field.onChange(checked)}
                  id="sponsor-show-on-youth-switch"
                  label=""
                />
              </LayoutContainer>
            );
          }}
        />

        {/* Switch Escopo 3: Futebol Feminino */}
        <Controller
          name="showOnFemale"
          control={control}
          render={({ field }) => {
            const isChecked = Boolean(field.value);
            return (
              <LayoutContainer className="flex items-center justify-between p-4 rounded-xl bg-surface/60 border border-border hover:border-primary/40 transition-all shadow-xs">
                <LayoutContainer className="flex flex-col gap-1 pr-4">
                  <LayoutContainer className="flex items-center gap-2">
                    <Crown
                      className={`w-4 h-4 shrink-0 ${isChecked ? 'text-amber-500' : 'text-text-secondary'}`}
                    />
                    <Text as="span" className="font-bold text-sm text-text-primary">
                      {texts.LABEL_SCOPE_FEMALE}
                    </Text>
                    <Badge variant={isChecked ? 'primary' : 'default'} size="sm" className="font-bold">
                      {isChecked ? 'Ativo no Feminino' : 'Oculto no Feminino'}
                    </Badge>
                  </LayoutContainer>
                  <Text as="p" className="text-xs text-text-secondary leading-relaxed">
                    {texts.DESC_SCOPE_FEMALE}
                  </Text>
                </LayoutContainer>
                <Switch
                  checked={isChecked}
                  onChange={(checked) => field.onChange(checked)}
                  id="sponsor-show-on-female-switch"
                  label=""
                />
              </LayoutContainer>
            );
          }}
        />
      </LayoutContainer>

      {errors.showOnMain && (
        <Text as="span" className="text-xs text-[#ea580c] font-semibold mt-1">
          {errors.showOnMain.message}
        </Text>
      )}
    </LayoutContainer>
  );
};

