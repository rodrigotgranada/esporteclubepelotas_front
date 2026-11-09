import React, { useRef } from 'react';
import {
  Drawer,
  LayoutContainer,
  Text,
  Input,
  Textarea,
  Checkbox,
  Button,
  SafeImage,
} from '@/shared/ui/components';
import { Upload, Music, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { ClubAnthem } from '@/features/anthem/types/anthem.types';
import { ANTHEM_TEXTS } from '@/features/anthem/constants/anthem.constants';
import { useAdminAnthemDrawer } from '@/features/anthem/hooks/useAdminAnthemDrawer';

export interface AdminAnthemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  anthem: ClubAnthem | null;
  onSuccess: () => void;
}

export const AdminAnthemDrawer: React.FC<AdminAnthemDrawerProps> = ({
  isOpen,
  onClose,
  anthem,
  onSuccess,
}) => {
  const {
    form,
    isSaving,
    pendingAudioName,
    coverPreviewUrl,
    handleSelectAudioFile,
    handleSelectCoverFile,
    handleRemoveCover,
    handleSubmit,
  } = useAdminAnthemDrawer({
    anthem,
    onClose,
    onSuccess,
  });

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const currentAudioUrl = watch('audioUrl');
  const drawerTitle = anthem
    ? `${ANTHEM_TEXTS.DRAWER_TITLE_EDIT}${anthem.compositionYear ? ` (${anthem.compositionYear})` : ''}`
    : ANTHEM_TEXTS.DRAWER_TITLE_NEW;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={drawerTitle} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
        <LayoutContainer className="flex flex-col gap-6 p-6 overflow-y-auto">
          {/* 1. Letra do Hino (Estrofes) */}
          <LayoutContainer className="flex flex-col gap-1.5">
            <LayoutContainer className="flex items-center justify-between">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {ANTHEM_TEXTS.FIELD_LYRICS} *
              </Text>
              <Text className="text-[11px] text-text-secondary">
                Separe as estrofes com uma linha em branco
              </Text>
            </LayoutContainer>
            <Textarea
              rows={8}
              placeholder={ANTHEM_TEXTS.FIELD_LYRICS_PLACEHOLDER}
              {...register('lyrics')}
              error={errors.lyrics?.message}
              className="font-serif leading-relaxed text-sm"
            />
          </LayoutContainer>

          {/* 2. Autores e Ano */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {ANTHEM_TEXTS.FIELD_AUTHOR_LYRICS}
              </Text>
              <Input
                type="text"
                placeholder={ANTHEM_TEXTS.FIELD_AUTHOR_LYRICS_PLACEHOLDER}
                {...register('authorLyrics')}
                className="text-sm py-2.5"
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {ANTHEM_TEXTS.FIELD_AUTHOR_MUSIC}
              </Text>
              <Input
                type="text"
                placeholder={ANTHEM_TEXTS.FIELD_AUTHOR_MUSIC_PLACEHOLDER}
                {...register('authorMusic')}
                className="text-sm py-2.5"
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {ANTHEM_TEXTS.FIELD_YEAR}
              </Text>
              <Input
                type="number"
                placeholder={ANTHEM_TEXTS.FIELD_YEAR_PLACEHOLDER}
                {...register('compositionYear')}
                className="text-sm py-2.5"
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* 3. Arquivo de Áudio */}
          <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-3">
            <Text as="span" className="text-xs font-bold text-text-primary flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              {ANTHEM_TEXTS.FIELD_AUDIO_FILE}
            </Text>

            <input
              type="file"
              ref={audioInputRef}
              accept="audio/*,.mp3,.wav,.ogg,.m4a"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSelectAudioFile(file);
              }}
            />

            <LayoutContainer className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => audioInputRef.current?.click()}
                leftIcon={<Upload className="w-4 h-4" />}
                className="font-bold text-xs"
              >
                Selecionar Arquivo de Áudio
              </Button>

              {pendingAudioName ? (
                <Text className="text-xs text-primary font-bold truncate max-w-xs">
                  Pronto para envio: {pendingAudioName}
                </Text>
              ) : currentAudioUrl ? (
                <Text className="text-xs text-text-secondary font-mono truncate max-w-xs">
                  Áudio atual: {currentAudioUrl.substring(currentAudioUrl.lastIndexOf('/') + 1)}
                </Text>
              ) : (
                <Text className="text-xs text-text-secondary italic">
                  Nenhum áudio selecionado
                </Text>
              )}
            </LayoutContainer>

            <LayoutContainer className="pt-2 border-t border-border/60">
              <Input
                type="url"
                placeholder={ANTHEM_TEXTS.FIELD_AUDIO_URL_PLACEHOLDER}
                {...register('audioUrl')}
                className="text-xs py-2"
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* 4. Vídeo no YouTube (Opcional) */}
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-secondary">
              {ANTHEM_TEXTS.FIELD_VIDEO_URL}
            </Text>
            <Input
              type="url"
              placeholder={ANTHEM_TEXTS.FIELD_VIDEO_URL_PLACEHOLDER}
              {...register('videoUrl')}
              className="text-sm py-2.5"
            />
          </LayoutContainer>

          {/* 5. Imagem de Capa (Opcional) */}
          <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-3">
            <Text as="span" className="text-xs font-bold text-text-primary flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              {ANTHEM_TEXTS.FIELD_COVER_IMAGE}
            </Text>

            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSelectCoverFile(file);
              }}
            />

            <LayoutContainer className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => coverInputRef.current?.click()}
                leftIcon={<Upload className="w-4 h-4" />}
                className="font-bold text-xs"
              >
                Selecionar Imagem
              </Button>

              {coverPreviewUrl && (
                <LayoutContainer className="flex items-center gap-2">
                  <LayoutContainer className="relative w-12 h-12 rounded-lg border border-border overflow-hidden bg-background">
                    <SafeImage
                      src={coverPreviewUrl}
                      alt="Capa"
                      fill
                      sizes="48px"
                      className="object-contain"
                      fallbackSrc="/images/pelotas-logo.png"
                    />
                  </LayoutContainer>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCover}
                    className="p-1 text-[#ea580c] hover:bg-[#ea580c]/10"
                    title="Remover capa"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </LayoutContainer>
              )}
            </LayoutContainer>
          </LayoutContainer>

          {/* 6. Opções: Oficial, Ativo, Ordem */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <LayoutContainer className="p-3 rounded-xl bg-surface border border-border">
              <Checkbox
                label="Versão Oficial"
                description="Toca como principal no portal"
                {...register('isOfficial')}
              />
            </LayoutContainer>

            <LayoutContainer className="p-3 rounded-xl bg-surface border border-border">
              <Checkbox
                label="Versão Ativa"
                description="Visível para os torcedores"
                {...register('isActive')}
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {ANTHEM_TEXTS.FIELD_DISPLAY_ORDER}
              </Text>
              <Input
                type="number"
                {...register('displayOrder')}
                className="text-sm py-2"
              />
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Rodapé com Ações */}
        <LayoutContainer className="p-4 sm:p-6 border-t border-border bg-surface/90 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
            className="font-bold text-xs"
          >
            {ANTHEM_TEXTS.BTN_CANCEL}
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="font-bold text-xs px-6 py-2.5 min-w-[120px]"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </span>
            ) : (
              ANTHEM_TEXTS.BTN_SAVE
            )}
          </Button>
        </LayoutContainer>
      </form>
    </Drawer>
  );
};
