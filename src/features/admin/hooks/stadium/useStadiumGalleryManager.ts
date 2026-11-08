'use client';

import { useState, useRef } from 'react';
import { StadiumGalleryImage } from '@/features/stadium/types/stadium.types';
import { stadiumService } from '@/features/stadium/services/stadium.service';
import { toast } from 'react-hot-toast';

export type CropTarget =
  | { type: 'new'; file: File }
  | { type: 'existing'; index: number; currentUrl: string; file?: File };

export interface UseStadiumGalleryManagerProps {
  gallery: StadiumGalleryImage[];
  onAddImage: (file: File | Blob, caption: string) => Promise<void>;
  onUpdateImage: (index: number, updated: Partial<StadiumGalleryImage>) => Promise<void> | void;
  onRemoveImage: (index: number) => Promise<void> | void;
  onReorderImages?: (newGallery: StadiumGalleryImage[]) => Promise<void> | void;
}

export function useStadiumGalleryManager({
  gallery,
  onAddImage,
  onUpdateImage,
  onRemoveImage,
  onReorderImages,
}: UseStadiumGalleryManagerProps) {
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

  const handleCloseCropModal = () => {
    setIsCropModalOpen(false);
    setCropSourceImage('');
    setCropTarget(null);
  };

  // Abre o modal de edição de legenda e foto
  const handleOpenEdit = (index: number) => {
    const photo = gallery[index];
    if (!photo) return;
    setEditingIndex(index);
    setEditCaption(photo.caption || '');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditCaption('');
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

  return {
    caption,
    setCaption,
    isUploading,
    fileInputRef,
    replaceFileInputRef,
    draggedIndex,
    dragOverIndex,
    isReordering,
    isCropModalOpen,
    cropSourceImage,
    editingIndex,
    editCaption,
    setEditCaption,
    isSavingCaption,
    deletingIndex,
    setDeletingIndex,
    isDeleting,
    photoBeingEdited,
    photoBeingDeleted,
    handleMovePhoto,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleSelectNewFile,
    handleSelectReplaceFile,
    handleOpenRecrop,
    handleCropSave,
    handleUseOriginal,
    handleCloseCropModal,
    handleOpenEdit,
    handleCancelEdit,
    handleSaveEditCaption,
    handleConfirmDelete,
  };
}

export type UseStadiumGalleryManagerReturn = ReturnType<typeof useStadiumGalleryManager>;

