'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Input,
  Select,
  Option,
  Spinner,
} from '@/shared/ui/components/atoms';
import { Drawer } from '@/shared/ui/components/molecules/Drawer';
import { CropModal } from '@/shared/ui/components/molecules/CropModal';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { Championship } from '../../../types/matches.types';
import { useAdminChampionshipDrawer } from '../../../hooks/useAdminChampionshipDrawer';
import { MATCHES_CONSTANTS } from '../../../constants/matches.constants';

export interface AdminChampionshipDrawerProps {
  isOpen: boolean;
  championship: Championship | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminChampionshipDrawer: React.FC<AdminChampionshipDrawerProps> = ({
  isOpen,
  championship,
  onClose,
  onSuccess,
}) => {
  const { CHAMPIONSHIP_DRAWER } = MATCHES_CONSTANTS.ADMIN;

  const {
    form,
    regulationFields,
    isSaving,
    logoPreviewUrl,
    isCropModalOpen,
    cropSourceImage,
    handleSelectRawFile,
    handleCropSave,
    handleCropCancel,
    handleRemoveLogo,
    handleAddRegulation,
    removeRegulation,
    onSubmit,
  } = useAdminChampionshipDrawer({
    championship,
    onClose,
    onSuccess,
  });

  const {
    register,
    formState: { errors },
  } = form;

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={championship ? CHAMPIONSHIP_DRAWER.EDIT_TITLE : CHAMPIONSHIP_DRAWER.CREATE_TITLE}
    >
      <form onSubmit={onSubmit} className="space-y-6 pb-20">
        {/* Nome da Competição */}
        <LayoutContainer className="space-y-1.5">
          <Text className="text-xs font-semibold uppercase text-text-muted">
            {CHAMPIONSHIP_DRAWER.NAME_LABEL}
          </Text>
          <Input
            {...register('name')}
            placeholder={CHAMPIONSHIP_DRAWER.NAME_PLACEHOLDER}
          />
          {errors.name && (
            <Text className="text-xs text-orange-500">{errors.name.message}</Text>
          )}
        </LayoutContainer>

        {/* Temporada e Categoria */}
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {CHAMPIONSHIP_DRAWER.SEASON_LABEL}
            </Text>
            <Input type="number" {...register('seasonYear')} />
            {errors.seasonYear && (
              <Text className="text-xs text-orange-500">{errors.seasonYear.message}</Text>
            )}
          </LayoutContainer>

          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {CHAMPIONSHIP_DRAWER.CATEGORY_LABEL}
            </Text>
            <Select {...register('category')} className="w-full">
              <Option value="PROFESSIONAL_MEN">Profissional Masculino</Option>
              <Option value="PROFESSIONAL_WOMEN">Profissional Feminino</Option>
              <Option value="YOUTH_U20">Sub-20 (Base)</Option>
              <Option value="YOUTH_U17">Sub-17 (Base)</Option>
              <Option value="YOUTH_U15">Sub-15 (Base)</Option>
            </Select>
          </LayoutContainer>
        </LayoutContainer>

        {/* Logo da Competição */}
        <LayoutContainer className="space-y-1.5">
          <Text className="text-xs font-semibold uppercase text-text-muted">
            {CHAMPIONSHIP_DRAWER.LOGO_LABEL}
          </Text>
          <LayoutContainer className="flex items-center space-x-3">
            <LayoutContainer className="w-14 h-14 rounded-xl bg-surface-hover border border-border/60 flex items-center justify-center p-1 relative">
              {logoPreviewUrl ? (
                <SafeImage
                  src={logoPreviewUrl}
                  alt="Logo Campeonato"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <Text className="text-xs text-text-muted">Sem logo</Text>
              )}
            </LayoutContainer>

            <LayoutContainer className="flex flex-col space-y-1">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelectRawFile(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs"
              >
                Selecionar & Recortar
              </Button>
              {logoPreviewUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveLogo}
                  className="text-xs text-orange-500 hover:text-orange-400 p-0 h-auto justify-start"
                >
                  Remover logo
                </Button>
              )}
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Link Oficial da Tabela de Classificação (FGF/CBF) */}
        <LayoutContainer className="space-y-1.5">
          <Text className="text-xs font-semibold uppercase text-secondary">
            📊 {CHAMPIONSHIP_DRAWER.TABLE_URL_LABEL}
          </Text>
          <Input
            {...register('tableUrl')}
            placeholder={CHAMPIONSHIP_DRAWER.TABLE_URL_PLACEHOLDER}
          />
          <Text className="text-[11px] text-text-muted">
            Insira o link oficial do portal da federação para direcionar o torcedor ao botão &quot;Ver Tabela Completa Oficial ↗&quot;.
          </Text>
        </LayoutContainer>

        {/* Regulamentos Oficiais (Array Dinâmico) */}
        <LayoutContainer className="space-y-3 pt-2 border-t border-border/50">
          <LayoutContainer className="flex items-center justify-between">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              📄 {CHAMPIONSHIP_DRAWER.REGULATIONS_LABEL}
            </Text>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddRegulation}
              className="text-xs text-secondary hover:text-secondary-hover"
            >
              {CHAMPIONSHIP_DRAWER.ADD_REGULATION_BUTTON}
            </Button>
          </LayoutContainer>

          {regulationFields.length === 0 ? (
            <LayoutContainer className="p-3 text-center rounded-xl bg-surface-hover/30 border border-dashed border-border/60">
              <Text className="text-xs text-text-muted">
                Nenhum documento anexado. Clique acima para adicionar REC ou RGC.
              </Text>
            </LayoutContainer>
          ) : (
            <LayoutContainer className="space-y-3">
              {regulationFields.map((field, index) => (
                <LayoutContainer
                  key={field.id}
                  className="p-3 rounded-xl bg-surface-hover/20 border border-border/50 space-y-2 relative"
                >
                  <LayoutContainer className="flex items-center justify-between">
                    <Text className="text-xs font-semibold text-text-primary">
                      Documento #{index + 1}
                    </Text>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRegulation(index)}
                      className="text-xs text-orange-500 hover:text-orange-400 p-0 h-auto"
                    >
                      {CHAMPIONSHIP_DRAWER.REMOVE_REGULATION_BUTTON}
                    </Button>
                  </LayoutContainer>

                  <Input
                    {...register(`regulations.${index}.title` as const)}
                    placeholder={CHAMPIONSHIP_DRAWER.REGULATION_TITLE_PLACEHOLDER}
                    className="text-xs"
                  />
                  <Input
                    {...register(`regulations.${index}.url` as const)}
                    placeholder={CHAMPIONSHIP_DRAWER.REGULATION_URL_PLACEHOLDER}
                    className="text-xs"
                  />
                </LayoutContainer>
              ))}
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Ativo e Ordem */}
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-2">
          <LayoutContainer className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="w-4 h-4 rounded text-secondary focus:ring-secondary/50 accent-[#eab308]"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-text-primary cursor-pointer">
              {CHAMPIONSHIP_DRAWER.ACTIVE_LABEL}
            </label>
          </LayoutContainer>

          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {CHAMPIONSHIP_DRAWER.ORDER_LABEL}
            </Text>
            <Input type="number" {...register('displayOrder')} />
          </LayoutContainer>
        </LayoutContainer>

        {/* Botões de Ação */}
        <LayoutContainer className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
            {CHAMPIONSHIP_DRAWER.CANCEL_BUTTON}
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-6"
          >
            {isSaving ? (
              <LayoutContainer className="flex items-center space-x-2">
                <Spinner size={16} />
                <Text>{CHAMPIONSHIP_DRAWER.SAVING_BUTTON}</Text>
              </LayoutContainer>
            ) : (
              CHAMPIONSHIP_DRAWER.SAVE_BUTTON
            )}
          </Button>
        </LayoutContainer>
      </form>

      {/* Modal de Recorte de Imagem 1:1 */}
      {isCropModalOpen && cropSourceImage && (
        <CropModal
          isOpen={isCropModalOpen}
          imageSrc={cropSourceImage}
          aspect={1}
          onCropSave={handleCropSave}
          onClose={handleCropCancel}
        />
      )}
    </Drawer>
  );
};
