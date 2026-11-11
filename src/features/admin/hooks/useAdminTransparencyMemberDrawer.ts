'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { uploadMedia } from '@/shared/services/media-upload.service';
import { transparencyService } from '@/features/transparency/services/transparency.service';
import { TransparencyBoardMember } from '@/features/transparency/types/transparency.types';
import { TRANSPARENCY_TEXTS } from '@/features/transparency/constants/transparency.constants';

interface UseAdminTransparencyMemberDrawerProps {
  member: TransparencyBoardMember | null;
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function useAdminTransparencyMemberDrawer({
  member,
  isOpen,
  onSuccess,
  onClose,
}: UseAdminTransparencyMemberDrawerProps) {
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [boardType, setBoardType] = useState('DIRETORIA_EXECUTIVA');
  const [termPeriod, setTermPeriod] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [active, setActive] = useState(true);

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setRoleTitle(member.roleTitle || '');
      setBoardType(member.boardType || 'DIRETORIA_EXECUTIVA');
      setTermPeriod(member.termPeriod || '');
      setPhotoUrl(member.photoUrl || '');
      setDisplayOrder(member.displayOrder ?? 0);
      setActive(member.active ?? true);
    } else {
      setName('');
      setRoleTitle('');
      setBoardType('DIRETORIA_EXECUTIVA');
      setTermPeriod('');
      setPhotoUrl('');
      setDisplayOrder(0);
      setActive(true);
    }
    setSelectedPhoto(null);
  }, [member, isOpen]);

  const handleSelectPhoto = (file: File) => {
    setSelectedPhoto(file);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      toast.error('Informe o nome do membro.');
      return;
    }
    if (!roleTitle.trim()) {
      toast.error('Informe o cargo ou função do membro.');
      return;
    }

    try {
      setIsSaving(true);
      let targetPhotoUrl = photoUrl;

      // Fase 1: Upload prévio da foto caso tenha arquivo selecionado
      if (selectedPhoto) {
        setIsUploading(true);
        const uploadResult = await uploadMedia(selectedPhoto, {
          folder: 'board-members',
        });
        if (uploadResult?.url) {
          targetPhotoUrl = uploadResult.url;
        }
        setIsUploading(false);
      }

      // Fase 2: Persistência no banco
      if (member) {
        await transparencyService.updateBoardMember(member.id, {
          name: name.trim(),
          roleTitle: roleTitle.trim(),
          boardType,
          termPeriod: termPeriod.trim() || undefined,
          photoUrl: targetPhotoUrl.trim() || undefined,
          displayOrder,
          active,
        });
      } else {
        await transparencyService.createBoardMember({
          name: name.trim(),
          roleTitle: roleTitle.trim(),
          boardType,
          termPeriod: termPeriod.trim() || undefined,
          photoUrl: targetPhotoUrl.trim() || undefined,
          displayOrder,
          active,
        });
      }

      toast.success(TRANSPARENCY_TEXTS.ADMIN.MEMBER_SAVE_SUCCESS);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Erro ao salvar membro de conselho:', err);
      const msg = err instanceof Error ? err.message : 'Falha ao salvar membro.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  return {
    name,
    setName,
    roleTitle,
    setRoleTitle,
    boardType,
    setBoardType,
    termPeriod,
    setTermPeriod,
    photoUrl,
    setPhotoUrl,
    displayOrder,
    setDisplayOrder,
    active,
    setActive,
    selectedPhoto,
    handleSelectPhoto,
    isUploading,
    isSaving,
    handleSubmit,
  };
}

