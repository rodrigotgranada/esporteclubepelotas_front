'use client';

import React from 'react';
import {
  Drawer,
  LayoutContainer,
  Input,
  Select,
  Option,
  Button,
  FormField,
  Switch,
  Spinner,
} from '@/shared/ui/components';
import { TransparencyBoardMember } from '@/features/transparency/types/transparency.types';
import { TRANSPARENCY_TEXTS, BOARD_TYPES } from '@/features/transparency/constants/transparency.constants';
import { useAdminTransparencyMemberDrawer } from '@/features/admin/hooks/useAdminTransparencyMemberDrawer';

interface AdminTransparencyMemberDrawerProps {
  member: TransparencyBoardMember | null;
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function AdminTransparencyMemberDrawer({
  member,
  isOpen,
  onSuccess,
  onClose,
}: AdminTransparencyMemberDrawerProps) {
  const {
    name,
    setName,
    roleTitle,
    setRoleTitle,
    boardType,
    setBoardType,
    termPeriod,
    setTermPeriod,
    photoUrl,
    displayOrder,
    setDisplayOrder,
    active,
    setActive,
    selectedPhoto,
    handleSelectPhoto,
    isUploading,
    isSaving,
    handleSubmit,
  } = useAdminTransparencyMemberDrawer({
    member,
    isOpen,
    onSuccess,
    onClose,
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        member
          ? TRANSPARENCY_TEXTS.ADMIN.DRAWER_MEMBER_EDIT_TITLE
          : TRANSPARENCY_TEXTS.ADMIN.DRAWER_MEMBER_CREATE_TITLE
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_MEMBER_NAME} required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo do conselheiro ou diretor"
            disabled={isSaving}
          />
        </FormField>

        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_MEMBER_ROLE} required>
            <Input
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="Ex: Presidente, Vice-Presidente, Relator"
              disabled={isSaving}
            />
          </FormField>

          <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_MEMBER_BOARD} required>
            <Select
              value={boardType}
              onChange={(e) => setBoardType(e.target.value)}
              disabled={isSaving}
            >
              {BOARD_TYPES.map((bt) => (
                <Option key={bt.value} value={bt.value}>
                  {bt.label}
                </Option>
              ))}
            </Select>
          </FormField>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_MEMBER_TERM}>
            <Input
              value={termPeriod}
              onChange={(e) => setTermPeriod(e.target.value)}
              placeholder="Ex: 2025 - 2026"
              disabled={isSaving}
            />
          </FormField>

          <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_MEMBER_ORDER}>
            <Input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              disabled={isSaving}
            />
          </FormField>
        </LayoutContainer>

        <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_MEMBER_PHOTO}>
          <LayoutContainer className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleSelectPhoto(e.target.files[0]);
                }
              }}
              disabled={isSaving || isUploading}
              className="text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-[#0B1B3D] hover:file:bg-amber-300 cursor-pointer"
            />
            {selectedPhoto && (
              <span className="text-xs text-amber-400">
                Foto selecionada: {selectedPhoto.name}
              </span>
            )}
            {!selectedPhoto && photoUrl && (
              <span className="text-xs text-gray-400 truncate">
                Foto atual: {photoUrl}
              </span>
            )}
          </LayoutContainer>
        </FormField>

        <LayoutContainer className="flex items-center justify-between border-t border-gray-800 pt-4">
          <span className="text-sm font-medium text-gray-200">
            {TRANSPARENCY_TEXTS.ADMIN.LABEL_MEMBER_ACTIVE}
          </span>
          <Switch
            checked={active}
            onChange={setActive}
            disabled={isSaving}
          />
        </LayoutContainer>

        <LayoutContainer className="flex justify-end gap-3 pt-6 border-t border-gray-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSaving || isUploading}
            className="bg-amber-400 font-bold text-[#0B1B3D] hover:bg-amber-300"
          >
            {isSaving ? <Spinner size={16} /> : 'Salvar Membro'}
          </Button>
        </LayoutContainer>
      </form>
    </Drawer>
  );
}

