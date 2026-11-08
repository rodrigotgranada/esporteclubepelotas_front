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
import { StadiumGalleryEditModal } from './StadiumGalleryEditModal';
import { StadiumGalleryDeleteModal } from './StadiumGalleryDeleteModal';
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
  ChevronLeft,
  ChevronRight,
  GripVertical,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StadiumGalleryManagerProps {
  gallery: StadiumGalleryImage[];
  onAddImage: (file: File | Blob, caption: string) => Promise<void>;
  onUpdateImage: (index: number, updated: Partial<StadiumGalleryImage>) => Promise<void> | void;
  onRemoveImage: (index: number) => Promise<void> | void;
  onReorderImages?: (newGallery: StadiumGalleryImage[]) => Promise<void> | void;
}

type CropTarget =
  | { type: 'new'; file: File }
  | { type: 'existing'; index: number; currentUrl: string; file?: File };

export const StadiumGalleryManager: React.FC<StadiumGalleryManagerProps> = ({
  gallery,
  onAddImage,
  onUpdateImage,
  onRemoveImage,
  onReorderImages,
}) => {
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Estados de Reordenação e Drag-and-Drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const handleMovePhoto = async (currentIndex: number, direction: 'left' | 'right') => {
    if (!onReorderImages) return;
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const reordered = [...gallery];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const updated = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
    try {
      setIsReordering(true);
      await onReorderImages(updated);
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!onReorderImages || draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...gallery];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    const updated = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
    setDraggedIndex(null);
    setDragOverIndex(null);

    try {
      setIsReordering(true);
      await onReorderImages(updated);
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Estados do CropModal oficial
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');
  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);

  // Estados de Edição da Foto / Legenda
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState<string>('');
  const [isSavingCaption, setIsSavingCaption] = useState(false);

  // Estados de Exclusão com Confirmação
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        file,
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
        await onUpdateImage(cropTarget.index, { url: uploadRes.url });
      }
      setIsCropModalOpen(false);
      setCropSourceImage('');
      setCropTarget(null);
      if (editingIndex !== null) {
        setEditingIndex(null);
      }
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
      } else if (cropTarget.file) {
        const uploadRes = await stadiumService.uploadGalleryImage(cropTarget.file);
        await onUpdateImage(cropTarget.index, { url: uploadRes.url });
      }
      setIsCropModalOpen(false);
      setCropSourceImage('');
      setCropTarget(null);
      if (editingIndex !== null) {
        setEditingIndex(null);
      }
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

  const handleSaveEditCaption = async () => {
    if (editingIndex === null) return;
    try {
      setIsSavingCaption(true);
      await onUpdateImage(editingIndex, { caption: editCaption.trim() });
      setEditingIndex(null);
      setEditCaption('');
    } finally {
      setIsSavingCaption(false);
    }
  };

  // Executa exclusão confirmada
  const handleConfirmDelete = async () => {
    if (deletingIndex === null) return;
    try {
      setIsDeleting(true);
      await onRemoveImage(deletingIndex);
      setDeletingIndex(null);
    } finally {
      setIsDeleting(false);
    }
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
          {gallery.map((photo, index) => {
            const isDragging = draggedIndex === index;
            const isDragTarget = dragOverIndex === index;
            const canMoveLeft = index > 0;
            const canMoveRight = index < gallery.length - 1;

            return (
              <LayoutContainer
                key={photo.url || index}
                draggable={!isReordering && Boolean(onReorderImages)}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative h-56 rounded-2xl overflow-hidden border bg-background flex flex-col justify-end p-3 shadow-xs transition-all select-none ${
                  isDragging
                    ? 'opacity-40 border-dashed border-primary ring-2 ring-primary'
                    : isDragTarget
                    ? 'border-primary ring-2 ring-primary/40 scale-[1.02]'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <SafeImage
                  src={photo.url}
                  alt={photo.caption || 'Foto do Acervo Histórico'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                />

                <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Controles de Reordenação no Canto Superior Esquerdo */}
                {onReorderImages && (
                  <LayoutContainer className="absolute top-2.5 left-2.5 flex items-center gap-1 z-20">
                    <LayoutContainer
                      className="w-7 h-7 rounded-full bg-slate-950/85 text-white/80 hover:text-primary flex items-center justify-center border border-white/20 shadow-md cursor-grab active:cursor-grabbing"
                      title={ADMIN_STADIUM_TEXTS.GALLERY.DRAG_HINT}
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </LayoutContainer>

                    {/* Mover para Esquerda */}
                    <Button
                      type="button"
                      size="none"
                      variant="custom"
                      disabled={!canMoveLeft || isReordering}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMovePhoto(index, 'left');
                      }}
                      className="w-7 h-7 rounded-full bg-slate-950/85 hover:bg-primary text-white hover:text-black disabled:opacity-30 disabled:hover:bg-slate-950/85 disabled:hover:text-white border border-white/20 shadow-md flex items-center justify-center transition-all cursor-pointer"
                      title={ADMIN_STADIUM_TEXTS.GALLERY.MOVE_LEFT_TOOLTIP}
                      aria-label={ADMIN_STADIUM_TEXTS.GALLERY.MOVE_LEFT_TOOLTIP}
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-current" />
                    </Button>

                    {/* Mover para Direita */}
                    <Button
                      type="button"
                      size="none"
                      variant="custom"
                      disabled={!canMoveRight || isReordering}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMovePhoto(index, 'right');
                      }}
                      className="w-7 h-7 rounded-full bg-slate-950/85 hover:bg-primary text-white hover:text-black disabled:opacity-30 disabled:hover:bg-slate-950/85 disabled:hover:text-white border border-white/20 shadow-md flex items-center justify-center transition-all cursor-pointer"
                      title={ADMIN_STADIUM_TEXTS.GALLERY.MOVE_RIGHT_TOOLTIP}
                      aria-label={ADMIN_STADIUM_TEXTS.GALLERY.MOVE_RIGHT_TOOLTIP}
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-current" />
                    </Button>
                  </LayoutContainer>
                )}

                {/* Botões de Ação Flutuantes com Alto Contraste no Canto Superior Direito */}
                <LayoutContainer className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
                  {/* Botão de Recortar / Cortar Imagem */}
                  <Button
                    type="button"
                    size="none"
                    variant="custom"
                    onClick={() => handleOpenRecrop(index)}
                    className="w-8 h-8 rounded-full bg-slate-950/85 hover:bg-primary text-white hover:text-black border border-white/20 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                    title="Recortar foto"
                    aria-label="Recortar foto"
                  >
                    <CropIcon className="w-4 h-4 text-current" />
                  </Button>

                  {/* Botão de Editar Legenda & Imagem */}
                  <Button
                    type="button"
                    size="none"
                    variant="custom"
                    onClick={() => handleOpenEdit(index)}
                    className="w-8 h-8 rounded-full bg-slate-950/85 hover:bg-primary text-white hover:text-black border border-white/20 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                    title={ADMIN_STADIUM_TEXTS.GALLERY.EDIT_PHOTO_TOOLTIP}
                    aria-label={ADMIN_STADIUM_TEXTS.GALLERY.EDIT_PHOTO_TOOLTIP}
                  >
                    <Edit3 className="w-4 h-4 text-current" />
                  </Button>

                  {/* Botão de Excluir Foto */}
                  <Button
                    type="button"
                    size="none"
                    variant="custom"
                    onClick={() => setDeletingIndex(index)}
                    className="w-8 h-8 rounded-full bg-slate-950/85 hover:bg-[#ea580c] text-white border border-white/20 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                    title={ADMIN_STADIUM_TEXTS.GALLERY.DELETE_PHOTO_TOOLTIP}
                    aria-label={ADMIN_STADIUM_TEXTS.GALLERY.DELETE_PHOTO_TOOLTIP}
                  >
                    <Trash2 className="w-4 h-4 text-current" />
                  </Button>
                </LayoutContainer>

                {/* Legenda na base do card */}
                <LayoutContainer className="relative z-10 flex flex-col gap-0.5 pointer-events-none">
                  <Text as="p" className="text-xs text-white font-medium line-clamp-2 leading-snug">
                    {photo.caption || 'Sem legenda'}
                  </Text>
                </LayoutContainer>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      )}

      {/* Modal de Edição de Foto e Legenda */}
      <StadiumGalleryEditModal
        isOpen={editingIndex !== null}
        photo={photoBeingEdited}
        caption={editCaption}
        isSaving={isSavingCaption}
        onClose={() => setEditingIndex(null)}
        onCaptionChange={setEditCaption}
        onSave={handleSaveEditCaption}
        onOpenRecrop={() => {
          if (editingIndex !== null) {
            handleOpenRecrop(editingIndex);
          }
        }}
        onSelectReplaceFile={handleSelectReplaceFile}
      />

      {/* Modal de Confirmação de Exclusão de Foto */}
      <StadiumGalleryDeleteModal
        isOpen={deletingIndex !== null}
        photo={photoBeingDeleted}
        isDeleting={isDeleting}
        onClose={() => setDeletingIndex(null)}
        onConfirm={handleConfirmDelete}
      />

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
