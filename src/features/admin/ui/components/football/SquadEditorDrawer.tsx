'use client';

import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import {
  Drawer,
  LayoutContainer,
  Title,
  Text,
  Input,
  Select,
  Option,
  Button,
  Checkbox,
  Spinner,
  FormField,
} from '@/shared/ui/components';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../../constants/admin-football.constants';
import { FOOTBALL_CONSTANTS } from '@/features/football/constants/football.constants';
import { SquadCategory } from '@/features/football/services/football.service';
import { SquadFormData } from '../../../schemas/football/squad.schema';

export interface SquadEditorDrawerProps {
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  form: UseFormReturn<SquadFormData, any, any>;
  newStaffRole: string;
  setNewStaffRole: (v: string) => void;
  newStaffName: string;
  setNewStaffName: (v: string) => void;
  onAddStaff: () => void;
  onRemoveStaff: (index: number) => void;
  existingCompetitions?: string[];
  allowedCategories?: SquadCategory[];
}

export const SquadEditorDrawer: React.FC<SquadEditorDrawerProps> = ({
  isOpen,
  isEditing,
  onClose,
  onSave,
  isSaving,
  form,
  newStaffRole,
  setNewStaffRole,
  newStaffName,
  setNewStaffName,
  onAddStaff,
  onRemoveStaff,
  existingCompetitions = [],
  allowedCategories,
}) => {
  const texts = ADMIN_FOOTBALL_CONSTANTS.DRAWER_SQUAD;
  const categoriesTexts = FOOTBALL_CONSTANTS.CATEGORIES;
  const { register, control, watch, setValue, formState: { errors } } = form;

  const currentCategory = watch('category');
  const currentSeasonName = watch('seasonName');
  const staff = watch('staff') || [];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? texts.TITLE_EDIT : texts.TITLE_CREATE}
      size="md"
    >
      <LayoutContainer className="flex flex-col gap-6 p-6">
        {/* Ano & Categoria */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={`${texts.FIELD_YEAR} *`} error={errors.year?.message}>
            <Input
              type="number"
              {...register('year')}
            />
          </FormField>

          <FormField
            control={control}
            name="category"
            label={`${texts.FIELD_CATEGORY} *`}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value as SquadCategory)}
                className="w-full"
              >
                {(!allowedCategories || allowedCategories.includes('PROFESSIONAL') || currentCategory === 'PROFESSIONAL') && (
                  <Option value="PROFESSIONAL">{categoriesTexts.PROFESSIONAL_FULL}</Option>
                )}
                {(!allowedCategories || allowedCategories.includes('FEMININE') || currentCategory === 'FEMININE') && (
                  <Option value="FEMININE">{categoriesTexts.FEMININE_FULL}</Option>
                )}
                {(!allowedCategories || allowedCategories.includes('SUB_20') || currentCategory === 'SUB_20') && (
                  <Option value="SUB_20">{categoriesTexts.SUB_20_FULL}</Option>
                )}
                {(!allowedCategories || allowedCategories.includes('SUB_17') || currentCategory === 'SUB_17') && (
                  <Option value="SUB_17">{categoriesTexts.SUB_17_FULL}</Option>
                )}
                {(!allowedCategories || allowedCategories.includes('SUB_15') || currentCategory === 'SUB_15') && (
                  <Option value="SUB_15">{categoriesTexts.SUB_15_FULL}</Option>
                )}
              </Select>
            )}
          />
        </LayoutContainer>

        {/* Nome da Temporada / Competição */}
        <LayoutContainer className="flex flex-col gap-1.5">
          <FormField label={`${texts.FIELD_SEASON_NAME} *`} error={errors.seasonName?.message}>
            <Input
              {...register('seasonName')}
              placeholder={texts.FIELD_SEASON_NAME_PLACEHOLDER}
            />
          </FormField>

          {existingCompetitions.length > 0 && (
            <LayoutContainer className="flex flex-col gap-1.5 pt-1">
              <Text as="span" className="text-[11px] text-text-secondary">
                {texts.EXISTING_COMPETITIONS_HINT}
              </Text>
              <LayoutContainer className="flex flex-wrap gap-1.5">
                {existingCompetitions.slice(0, 8).map((comp) => {
                  const isSelected = (currentSeasonName || '').trim().toLowerCase() === comp.toLowerCase();
                  return (
                    <Button
                      key={comp}
                      type="button"
                      size="sm"
                      variant={isSelected ? 'primary' : 'outline'}
                      onClick={() => setValue('seasonName', comp)}
                      className="text-[11px] py-1 px-2.5 h-auto rounded-full font-bold"
                    >
                      {comp}
                    </Button>
                  );
                })}
              </LayoutContainer>
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Treinador Principal */}
        <FormField label={texts.FIELD_COACH} error={errors.coachName?.message}>
          <Input
            {...register('coachName')}
            placeholder={texts.FIELD_COACH_PLACEHOLDER}
          />
        </FormField>

        {/* Marcar como Elenco Atual Checkbox */}
        <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border">
          <Controller
            control={control}
            name="isCurrent"
            render={({ field }) => (
              <Checkbox
                label={texts.FIELD_IS_CURRENT}
                description={texts.FIELD_IS_CURRENT_DESC}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </LayoutContainer>

        {/* Comissão Técnica & Profissionais de Apoio */}
        <LayoutContainer className="flex flex-col gap-3 pt-2 border-t border-border">
          <Title level="h4" className="text-sm font-bold text-text-primary">
            {texts.STAFF_TITLE}
          </Title>

          {/* Adicionar Membro da Comissão */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <LayoutContainer className="sm:col-span-5">
              <Input
                placeholder={texts.STAFF_ROLE_PLACEHOLDER}
                value={newStaffRole}
                onChange={(e) => setNewStaffRole(e.target.value)}
                className="text-xs"
              />
            </LayoutContainer>
            <LayoutContainer className="sm:col-span-5">
              <Input
                placeholder={texts.STAFF_NAME_PLACEHOLDER}
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="text-xs"
              />
            </LayoutContainer>
            <LayoutContainer className="sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAddStaff}
                className="w-full text-xs font-bold h-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                {texts.BTN_ADD_STAFF}
              </Button>
            </LayoutContainer>
          </LayoutContainer>

          {/* Lista de Membros da Comissão */}
          {staff.length > 0 && (
            <LayoutContainer className="flex flex-col gap-2 mt-2">
              {staff.map((st, idx) => (
                <LayoutContainer
                  key={idx}
                  className="p-3 rounded-xl bg-background border border-border flex items-center justify-between text-xs"
                >
                  <LayoutContainer className="flex items-center gap-2">
                    <Text as="span" className="font-bold text-primary">
                      {st.role}:
                    </Text>
                    <Text as="span" className="text-text-primary">
                      {st.name}
                    </Text>
                  </LayoutContainer>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveStaff(idx)}
                    className="p-1 text-text-muted hover:bg-[#ea580c]/10"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#ea580c]" />
                  </Button>
                </LayoutContainer>
              ))}
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Drawer Actions */}
        <LayoutContainer className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
            {texts.BTN_CANCEL}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSave}
            disabled={isSaving}
            className="font-bold min-w-[120px]"
          >
            {isSaving ? (
              <LayoutContainer className="flex items-center gap-2">
                <Spinner size={16} />
                <Text as="span">{texts.BTN_SAVING}</Text>
              </LayoutContainer>
            ) : (
              texts.BTN_SAVE
            )}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Drawer>
  );
};
