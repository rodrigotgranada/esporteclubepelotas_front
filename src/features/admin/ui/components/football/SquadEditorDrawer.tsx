'use client';

import React from 'react';
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
} from '@/shared/ui/components';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../../constants/admin-football.constants';
import { SquadCategory, SquadStaffData } from '@/features/football/services/football.service';

export interface SquadEditorDrawerProps {
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  errors: Record<string, string>;
  year: number;
  setYear: (v: number) => void;
  category: SquadCategory;
  setCategory: (v: SquadCategory) => void;
  seasonName: string;
  setSeasonName: (v: string) => void;
  coachName: string;
  setCoachName: (v: string) => void;
  isCurrent: boolean;
  setIsCurrent: (v: boolean) => void;
  staff: SquadStaffData[];
  newStaffRole: string;
  setNewStaffRole: (v: string) => void;
  newStaffName: string;
  setNewStaffName: (v: string) => void;
  onAddStaff: () => void;
  onRemoveStaff: (index: number) => void;
}

export const SquadEditorDrawer: React.FC<SquadEditorDrawerProps> = ({
  isOpen,
  isEditing,
  onClose,
  onSave,
  isSaving,
  errors,
  year,
  setYear,
  category,
  setCategory,
  seasonName,
  setSeasonName,
  coachName,
  setCoachName,
  isCurrent,
  setIsCurrent,
  staff,
  newStaffRole,
  setNewStaffRole,
  newStaffName,
  setNewStaffName,
  onAddStaff,
  onRemoveStaff,
}) => {
  const texts = ADMIN_FOOTBALL_CONSTANTS.DRAWER_SQUAD;

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
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_YEAR} *
            </Text>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={errors.year ? 'border-[#ea580c]' : ''}
            />
            {errors.year && (
              <Text as="span" className="text-[11px] text-[#ea580c] font-medium">
                {errors.year}
              </Text>
            )}
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_CATEGORY} *
            </Text>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as SquadCategory)}
              className="w-full"
            >
              <Option value="PROFESSIONAL">Profissional Masculino</Option>
              <Option value="FEMININE">Futebol Feminino</Option>
              <Option value="SUB_20">Sub-20 (Juniores)</Option>
              <Option value="SUB_17">Sub-17 (Juvenil)</Option>
              <Option value="SUB_15">Sub-15 (Infantil)</Option>
            </Select>
          </LayoutContainer>
        </LayoutContainer>

        {/* Nome da Temporada / Competição */}
        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-bold text-text-primary">
            {texts.FIELD_SEASON_NAME} *
          </Text>
          <Input
            value={seasonName}
            onChange={(e) => setSeasonName(e.target.value)}
            placeholder={texts.FIELD_SEASON_NAME_PLACEHOLDER}
            className={errors.seasonName ? 'border-[#ea580c]' : ''}
          />
          {errors.seasonName && (
            <Text as="span" className="text-[11px] text-[#ea580c] font-medium">
              {errors.seasonName}
            </Text>
          )}
        </LayoutContainer>

        {/* Treinador Principal */}
        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-bold text-text-primary">
            {texts.FIELD_COACH}
          </Text>
          <Input
            value={coachName}
            onChange={(e) => setCoachName(e.target.value)}
            placeholder={texts.FIELD_COACH_PLACEHOLDER}
          />
        </LayoutContainer>

        {/* Marcar como Elenco Atual Checkbox */}
        <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border">
          <Checkbox
            label={texts.FIELD_IS_CURRENT}
            description={texts.FIELD_IS_CURRENT_DESC}
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
          />
        </LayoutContainer>

        {/* Comissão Técnica & Profissionais de Apoio */}
        <LayoutContainer className="flex flex-col gap-3 pt-2 border-t border-border">
          <Title level="h4" className="text-sm font-bold text-text-primary">
            Comissão Técnica
          </Title>

          {/* Adicionar Membro da Comissão */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <LayoutContainer className="sm:col-span-5">
              <Input
                placeholder="Cargo (ex: Preparador Físico)"
                value={newStaffRole}
                onChange={(e) => setNewStaffRole(e.target.value)}
                className="text-xs"
              />
            </LayoutContainer>
            <LayoutContainer className="sm:col-span-5">
              <Input
                placeholder="Nome do profissional"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="text-xs"
              />
            </LayoutContainer>
            <LayoutContainer className="sm:col-span-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onAddStaff}
                className="w-full text-xs font-bold h-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
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
                    <Text as="span" className="font-bold text-primary">{st.role}:</Text>
                    <Text as="span" className="text-text-primary">{st.name}</Text>
                  </LayoutContainer>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveStaff(idx)}
                    className="p-1 text-text-muted hover:text-primary"
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
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
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
