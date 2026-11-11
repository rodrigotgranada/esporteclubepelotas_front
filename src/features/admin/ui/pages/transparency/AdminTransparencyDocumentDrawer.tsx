'use client';

import React from 'react';
import {
  Drawer,
  LayoutContainer,
  Input,
  Textarea,
  Select,
  Option,
  Button,
  FormField,
  Switch,
  Spinner,
} from '@/shared/ui/components';
import { TransparencyDocument } from '@/features/transparency/types/transparency.types';
import { TRANSPARENCY_TEXTS, TRANSPARENCY_CATEGORIES } from '@/features/transparency/constants/transparency.constants';
import { useAdminTransparencyDocumentDrawer } from '@/features/admin/hooks/useAdminTransparencyDocumentDrawer';

interface AdminTransparencyDocumentDrawerProps {
  document: TransparencyDocument | null;
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function AdminTransparencyDocumentDrawer({
  document,
  isOpen,
  onSuccess,
  onClose,
}: AdminTransparencyDocumentDrawerProps) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    year,
    setYear,
    fileUrl,
    fileSize,
    published,
    setPublished,
    selectedFile,
    handleSelectFile,
    isUploading,
    isSaving,
    handleSubmit,
  } = useAdminTransparencyDocumentDrawer({
    document,
    isOpen,
    onSuccess,
    onClose,
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        document
          ? TRANSPARENCY_TEXTS.ADMIN.DRAWER_DOC_EDIT_TITLE
          : TRANSPARENCY_TEXTS.ADMIN.DRAWER_DOC_CREATE_TITLE
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_TITLE} required>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Balanço Patrimonial Exercício 2025"
            disabled={isSaving}
          />
        </FormField>

        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_CATEGORY} required>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSaving}
            >
              {TRANSPARENCY_CATEGORIES.map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
          </FormField>

          <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_YEAR} required>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              disabled={isSaving}
            />
          </FormField>
        </LayoutContainer>

        <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_DESCRIPTION}>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Resumo das principais deliberações ou notas explicativas do documento..."
            rows={3}
            disabled={isSaving}
          />
        </FormField>

        <FormField label={TRANSPARENCY_TEXTS.ADMIN.LABEL_FILE} required>
          <LayoutContainer className="flex flex-col gap-2">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleSelectFile(e.target.files[0]);
                }
              }}
              disabled={isSaving || isUploading}
              className="text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-[#0B1B3D] hover:file:bg-amber-300 cursor-pointer"
            />
            {selectedFile && (
              <span className="text-xs text-amber-400">
                Arquivo selecionado: {selectedFile.name} ({fileSize})
              </span>
            )}
            {!selectedFile && fileUrl && (
              <span className="text-xs text-gray-400 truncate">
                Arquivo atual: {fileUrl}
              </span>
            )}
          </LayoutContainer>
        </FormField>

        <LayoutContainer className="flex items-center justify-between border-t border-gray-800 pt-4">
          <span className="text-sm font-medium text-gray-200">
            {TRANSPARENCY_TEXTS.ADMIN.LABEL_PUBLISHED}
          </span>
          <Switch
            checked={published}
            onChange={setPublished}
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
            {isSaving ? <Spinner size={16} /> : 'Salvar Documento'}
          </Button>
        </LayoutContainer>
      </form>
    </Drawer>
  );
}

