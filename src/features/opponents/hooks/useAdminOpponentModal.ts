'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { OpponentClub, OpponentClubFormData } from '../types/opponents.types';
import { OPPONENTS_CONSTANTS, DEFAULT_CLUB_BADGE } from '../constants/opponents.constants';
import { opponentClubSchema, OpponentClubSchemaType } from '../schemas/opponents.schema';
import { opponentsService } from '../services/opponents.service';

export interface UseAdminOpponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  opponent?: OpponentClub | null;
  initialName?: string;
  onSuccess?: (savedClub?: OpponentClub) => void;
}

export const useAdminOpponentModal = ({
  isOpen,
  onClose,
  opponent,
  initialName,
  onSuccess,
}: UseAdminOpponentModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingBadge, setIsUploadingBadge] = useState(false);

  // Estados de Recorte do Distintivo (CropModal 1:1)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string | null>(null);
  const [pendingBadgeBlob, setPendingBadgeBlob] = useState<Blob | null>(null);
  const [previewBadgeUrl, setPreviewBadgeUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OpponentClubSchemaType>({
    resolver: zodResolver(opponentClubSchema),
    defaultValues: {
      name: '',
      shortName: '',
      city: '',
      stadiumName: '',
      badgeUrl: '',
      isActive: true,
      displayOrder: 0,
    },
  });

  const isActive = watch('isActive');

  // Inicializar formulário ao abrir ou trocar de oponente
  useEffect(() => {
    if (isOpen) {
      if (opponent) {
        reset({
          name: opponent.name,
          shortName: opponent.shortName || '',
          city: opponent.city || '',
          stadiumName: opponent.stadiumName || '',
          badgeUrl: opponent.badgeUrl || '',
          isActive: opponent.isActive,
          displayOrder: opponent.displayOrder ?? 0,
        });
        setPreviewBadgeUrl(opponent.badgeUrl || null);
      } else {
        reset({
          name: initialName?.trim() || '',
          shortName: '',
          city: '',
          stadiumName: '',
          badgeUrl: '',
          isActive: true,
          displayOrder: 0,
        });
        setPreviewBadgeUrl(null);
      }
      setPendingBadgeBlob(null);
      setCropSourceImage(null);
      setIsCropModalOpen(false);
    }
  }, [isOpen, opponent, initialName, reset]);

  // Disparar seleção de arquivo
  const handleSelectBadgeClick = () => {
    fileInputRef.current?.click();
  };

  const handleBadgeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropSourceImage(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    // Resetar input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  // Salvar recorte do CropModal
  const handleCropSave = (croppedBlob: Blob) => {
    setPendingBadgeBlob(croppedBlob);
    const objectUrl = URL.createObjectURL(croppedBlob);
    setPreviewBadgeUrl(objectUrl);
    setIsCropModalOpen(false);
  };

  const handleCropCancel = () => {
    setIsCropModalOpen(false);
    setCropSourceImage(null);
  };

  const onSubmit = async (data: OpponentClubSchemaType) => {
    try {
      setIsSaving(true);
      let finalBadgeUrl = data.badgeUrl || '';

      // Fase 1: Se houver imagem pendente recortada, fazer upload antes de persistir
      if (pendingBadgeBlob) {
        setIsUploadingBadge(true);
        try {
          finalBadgeUrl = await opponentsService.adminUploadBadge(pendingBadgeBlob);
        } catch {
          toast.error('Erro ao enviar o distintivo. Tente novamente.');
          setIsSaving(false);
          setIsUploadingBadge(false);
          return;
        } finally {
          setIsUploadingBadge(false);
        }
      }

      if (!finalBadgeUrl || !finalBadgeUrl.trim() || finalBadgeUrl === '/images/pelotas-logo.png') {
        finalBadgeUrl = DEFAULT_CLUB_BADGE;
      }

      const payload: OpponentClubFormData = {
        name: data.name.trim(),
        shortName: data.shortName.trim(),
        city: data.city.trim(),
        stadiumName: data.stadiumName.trim(),
        badgeUrl: finalBadgeUrl,
        isActive: data.isActive,
        displayOrder: data.displayOrder ?? 0,
      };

      let savedClub: OpponentClub;
      if (opponent) {
        savedClub = await opponentsService.adminUpdateOpponent(opponent.id, payload);
      } else {
        savedClub = await opponentsService.adminCreateOpponent(payload);
      }

      toast.success(OPPONENTS_CONSTANTS.TOASTS.SAVED);
      onSuccess?.(savedClub);
      onClose();
    } catch {
      toast.error(OPPONENTS_CONSTANTS.TOASTS.SAVE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isActive,
    isSaving,
    isUploadingBadge,
    // Imagem / Crop
    fileInputRef,
    previewBadgeUrl,
    isCropModalOpen,
    cropSourceImage,
    handleSelectBadgeClick,
    handleBadgeFileChange,
    handleCropSave,
    handleCropCancel,
  };
};

