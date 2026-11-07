'use client';

import React, { useState, useRef } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  FormField,
  Input,
  SafeImage,
  Modal,
  CropModal,
} from '@/shared/ui/components';
import { StadiumGalleryImage } from '@/features/stadium/types/stadium.types';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import { stadiumService } from '@/features/stadium/services/stadium.service';
import {
  Plus,
  Trash2,
  Camera,
  Upload,
  Loader2,
  Edit3,
  Crop as CropIcon,
  AlertTriangle,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StadiumGalleryManagerProps {
  gallery: StadiumGalleryImage[];
  onAddImage: (file: File | Blob, caption: string) => Promise<void>;
  onUpdateImage: (index: number, updated: Partial<StadiumGalleryImage>) => void;
  onRemoveImage: (index: number) => void;
}

type CropTarget =
  | { type: 'new'; file: File }
  | { type: 'existing'; index: number; currentUrl: string };

export const StadiumGalleryManager: React.FC<StadiumGalleryManagerProps> = ({
  gallery,
  onAddImage,
  onUpdateImage,
  onRemoveImage,
}) => {
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Estados do CropModal oficial
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');
  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);

  // Estados de Edição da Foto / Legenda
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState<string>('');

  // Estados de Exclusão com Confirmação
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  // Ao selecionar um arquivo novo do computador para upload
  const handleSelectNewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setCropSourceImage(previewUrl);
      setCropTarget({ type: 'new', file });
      setIsCropModalOpen(true);
      e.target.value = '';
    }
  };

  // Ao selecionar um novo arquivo para substituir foto existente
  const handleSelectReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingIndex !== null) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      const existingPhoto = gallery[editingIndex];
      setCropSourceImage(previewUrl);
      setCropTarget({
        type: 'existing',
        index: editingIndex,
        currentUrl: existingPhoto?.url || '',
      });
      setIsCropModalOpen(true);
      e.target.value = '';
    }
  };

  // Abre o CropModal diretamente para re-recortar uma foto existente
  const handleOpenRecrop = (index: number) => {
    const photo = gallery[index];
    if (!photo) return;
    setCropSourceImage(photo.url);
    setCropTarget({
      type: 'existing',
      index,
      currentUrl: photo.url,
    });
    setIsCropModalOpen(true);
  };

  // Callback de salvamento do CropModal (com recorte ou remoção de fundo por IA)
  const handleCropSave = async (croppedBlob: Blob) => {
    if (!cropTarget) return;

    try {
      setIsUploading(true);
      if (cropTarget.type === 'new') {
        await onAddImage(croppedBlob, caption);
        setCaption('');
      } else {
        const uploadRes = await stadiumService.uploadGalleryImage(croppedBlob);
        onUpdateImage(cropTarget.index, { url: uploadRes.url });
      }
      setIsCropModalOpen(false);
      setCropSourceImage('');
      setCropTarget(null);
    } catch (err) {
      console.error('Erro ao processar imagem recortada:', err);
      toast.error('Erro ao salvar imagem recortada');
    } finally {
      setIsUploading(false);
    }
  };

  // Se o usuário optar por usar a imagem original sem recortar
  const handleUseOriginal = async () => {
    if (!cropTarget) return;

    try {
      setIsUploading(true);
      if (cropTarget.type === 'new') {
        await onAddImage(cropTarget.file, caption);
        setCaption('');
      }
      setIsCropModalOpen(false);
      setCropSourceImage('');
      setCropTarget(null);
    } catch (err) {
      console.error('Erro ao salvar imagem original:', err);
      toast.error('Erro ao salvar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  // Abre o modal de edição de legenda e foto
  const handleOpenEdit = (index: number) => {
    const photo = gallery[index];
    if (!photo) return;
    setEditingIndex(index);
    setEditCaption(photo.caption || '');
  };

  const handleSaveEditCaption = () => {
    if (editingIndex === null) return;
    onUpdateImage(editingIndex, { caption: editCaption.trim() });
    setEditingIndex(null);
    setEditCaption('');
  };

  // Executa exclusão confirmada
  const handleConfirmDelete = () => {
    if (deletingIndex === null) return;
    onRemoveImage(deletingIndex);
    setDeletingIndex(null);
  };

  const photoBeingEdited = editingIndex !== null ? gallery[editingIndex] : null;
  const photoBeingDeleted = deletingIndex !== null ? gallery[deletingIndex] : null;

  return (
    <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-6">
      {/* Cabeçalho da Seção */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <LayoutContainer className="flex flex-col">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {ADMIN_STADIUM_TEXTS.GALLERY.TITLE}
          </Title>
          <Text className="text-xs text-text-secondary">
            {ADMIN_STADIUM_TEXTS.GALLERY.SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Box de Adicionar Nova Foto com CropModal Oficial */}
      <LayoutContainer className="p-5 rounded-2xl bg-background border border-border flex flex-col gap-4">
        <Title level="h4" className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          {ADMIN_STADIUM_TEXTS.GALLERY.UPLOAD_MODAL_TITLE}
        </Title>

        <LayoutContainer className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Campo de Legenda Opcional */}
          <LayoutContainer className="md:col-span-8">
            <FormField label={ADMIN_STADIUM_TEXTS.GALLERY.CAPTION_LABEL}>
              <Input
                placeholder={ADMIN_STADIUM_TEXTS.GALLERY.CAPTION_PLACEHOLDER}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </FormField>
          </LayoutContainer>

          {/* Botão de Selecionar Imagem e Abrir CropModal */}
          <LayoutContainer className="md:col-span-4">
            <Button
              type="button"
              variant="primary"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer h-10 shadow-sm"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <Text as="span">{ADMIN_STADIUM_TEXTS.GALLERY.ADD_PHOTO_BUTTON}</Text>
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSelectNewFile}
            />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Grid de Fotos Existentes com Ações Completas */}
      {gallery.length === 0 ? (
        <LayoutContainer className="py-12 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
          <Camera className="w-8 h-8 text-text-secondary mb-2" />
          <Text className="text-sm text-text-secondary">
            {ADMIN_STADIUM_TEXTS.GALLERY.EMPTY}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((photo, index) => (
            <LayoutContainer
              key={index}
              className="group relative h-56 rounded-2xl overflow-hidden border border-border bg-background flex flex-col justify-end p-3 shadow-xs hover:border-primary/50 transition-all"
            >
              <SafeImage
                src={photo.url}
                alt={photo.caption || 'Foto do Acervo Histórico'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Botões de Ação Flutuantes */}
              <LayoutContainer className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
                {/* Botão de Recortar / Cortar Imagem */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenRecrop(index)}
                  className="w-7 h-7 p-0 rounded-full bg-black/75 hover:bg-primary text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  title="Recortar / Ajustar imagem"
                >
                  <CropIcon className="w-3.5 h-3.5" />
                </Button>

                {/* Botão de Editar Legenda & Imagem */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(index)}
                  className="w-7 h-7 p-0 rounded-full bg-black/75 hover:bg-primary text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  title={ADMIN_STADIUM_TEXTS.GALLERY.EDIT_PHOTO_TOOLTIP}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </Button>

                {/* Botão de Excluir Foto */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingIndex(index)}
                  className="w-7 h-7 p-0 rounded-full bg-black/75 hover:bg-[#ea580c] text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  title={ADMIN_STADIUM_TEXTS.GALLERY.DELETE_PHOTO_TOOLTIP}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </LayoutContainer>

              {/* Legenda na base do card */}
              <LayoutContainer className="relative z-10 flex flex-col gap-0.5">
                <Text as="p" className="text-xs text-white font-medium line-clamp-2 leading-snug">
                  {photo.caption || 'Sem legenda'}
                </Text>
              </LayoutContainer>
            </LayoutContainer>
          ))}
        </LayoutContainer>
      )}

      {/* Modal de Edição de Foto e Legenda */}
      <Modal
        isOpen={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        size="md"
      >
        <LayoutContainer className="flex flex-col gap-5 p-2">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {ADMIN_STADIUM_TEXTS.GALLERY.EDIT_MODAL_TITLE}
          </Title>
          {photoBeingEdited && (
            <LayoutContainer className="relative w-full h-48 rounded-xl overflow-hidden bg-background border border-border">
              <SafeImage
                src={photoBeingEdited.url}
                alt="Foto em edição"
                fill
                sizes="500px"
                className="object-cover"
              />
              <LayoutContainer className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => replaceFileInputRef.current?.click()}
                  className="flex items-center gap-2 cursor-pointer font-bold shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  <Text as="span">{ADMIN_STADIUM_TEXTS.GALLERY.REPLACE_IMAGE_BUTTON}</Text>
                </Button>
                <Input
                  ref={replaceFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSelectReplaceFile}
                />
              </LayoutContainer>
            </LayoutContainer>
          )}

          <FormField label={ADMIN_STADIUM_TEXTS.GALLERY.CAPTION_LABEL}>
            <Input
              value={editCaption}
              placeholder={ADMIN_STADIUM_TEXTS.GALLERY.CAPTION_PLACEHOLDER}
              onChange={(e) => setEditCaption(e.target.value)}
            />
          </FormField>

          <LayoutContainer className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingIndex(null)}
              className="cursor-pointer"
            >
              <Text as="span">{ADMIN_STADIUM_TEXTS.GALLERY.CANCEL_BUTTON}</Text>
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveEditCaption}
              className="cursor-pointer font-bold shadow-sm"
            >
              <Check className="w-4 h-4 mr-1.5" />
              <Text as="span">{ADMIN_STADIUM_TEXTS.GALLERY.UPDATE_CAPTION_BUTTON}</Text>
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </Modal>

      {/* Modal de Confirmação de Exclusão de Foto */}
      <Modal
        isOpen={deletingIndex !== null}
        onClose={() => setDeletingIndex(null)}
        size="md"
      >
        <LayoutContainer className="flex flex-col gap-5 p-2">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {ADMIN_STADIUM_TEXTS.GALLERY.DELETE_CONFIRM_TITLE}
          </Title>
          <LayoutContainer className="flex items-start gap-3">
            <LayoutContainer className="w-10 h-10 rounded-full bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col gap-1">
              <Text className="text-sm text-text-primary font-medium">
                {ADMIN_STADIUM_TEXTS.GALLERY.DELETE_CONFIRM_DESC}
              </Text>
              {photoBeingDeleted && photoBeingDeleted.caption && (
                <Text className="text-xs text-text-secondary italic mt-1">
                  &quot;{photoBeingDeleted.caption}&quot;
                </Text>
              )}
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeletingIndex(null)}
              className="cursor-pointer"
            >
              <Text as="span">{ADMIN_STADIUM_TEXTS.GALLERY.CANCEL_BUTTON}</Text>
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold cursor-pointer transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              <Text as="span">{ADMIN_STADIUM_TEXTS.GALLERY.CONFIRM_DELETE_BUTTON}</Text>
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </Modal>

      {/* CropModal Padrão do Sistema (Proporções, Zoom, Corte e Remoção de Fundo por IA) */}
      {isCropModalOpen && cropSourceImage && (
        <CropModal
          isOpen={isCropModalOpen}
          imageSrc={cropSourceImage}
          onClose={() => {
            setIsCropModalOpen(false);
            setCropSourceImage('');
            setCropTarget(null);
          }}
          onCropSave={handleCropSave}
          onUseOriginal={handleUseOriginal}
          isLoading={isUploading}
          aspectOptions={[
            { label: 'Livre', value: undefined },
            { label: '16:9 Panorâmico', value: 16 / 9 },
            { label: '4:3 Clássico', value: 4 / 3 },
            { label: '1:1 Quadrado', value: 1 },
          ]}
          texts={{
            title: ADMIN_STADIUM_TEXTS.GALLERY.CROP_MODAL_TITLE,
          }}
        />
      )}
    </LayoutContainer>
  );
};
