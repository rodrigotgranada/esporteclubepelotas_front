'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { adminTimelineService } from '../../services/admin-timeline.service';
import { TimelineEventData, TimelineCategory } from '@/features/timeline/services/timeline.service';
import { ADMIN_TIMELINE_CONSTANTS } from '../../constants/admin-timeline.constants';

export const useAdminTimelineDrawer = (onSuccess: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [year, setYear] = useState<number>(1908);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<TimelineCategory>('MILESTONE');
  const [dateFormatted, setDateFormatted] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setYear(new Date().getFullYear());
    setTitle('');
    setDescription('');
    setCategory('MILESTONE');
    setDateFormatted('');
    setDisplayOrder(0);
    setIsHighlighted(false);
    setIsActive(true);
    setPhotoUrl(null);
    setPendingPhotoFile(null);
  };

  const openCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEdit = (event: TimelineEventData) => {
    setEditingId(event.id || event._id || null);
    setYear(event.year);
    setTitle(event.title);
    setDescription(event.description);
    setCategory(event.category);
    setDateFormatted(event.dateFormatted || '');
    setDisplayOrder(event.displayOrder || 0);
    setIsHighlighted(Boolean(event.isHighlighted));
    setIsActive(event.isActive !== false);
    setPhotoUrl(event.imageUrl || null);
    setPendingPhotoFile(null);
    setIsOpen(true);
  };

  const close = () => {
    if (isSaving) return;
    setIsOpen(false);
    resetForm();
  };

  const save = async () => {
    if (!year || isNaN(year)) {
      toast.error('Informe um ano válido para o marco histórico.');
      return;
    }
    if (!title.trim()) {
      toast.error('Informe o título do marco histórico.');
      return;
    }
    if (!description.trim()) {
      toast.error('Informe a descrição do marco histórico.');
      return;
    }

    try {
      setIsSaving(true);
      const payload: any = {
        year: Number(year),
        title: title.trim(),
        description: description.trim(),
        category,
        dateFormatted: dateFormatted.trim() || undefined,
        displayOrder: Number(displayOrder) || 0,
        isHighlighted,
        isActive,
      };

      if (editingId) {
        if (!pendingPhotoFile && photoUrl) {
          payload.imageUrl = photoUrl;
        }
        await adminTimelineService.updateEvent(editingId, payload, pendingPhotoFile || undefined);
        toast.success(ADMIN_TIMELINE_CONSTANTS.DRAWER.TOAST_UPDATE_SUCCESS);
      } else {
        await adminTimelineService.createEvent(payload, pendingPhotoFile || undefined);
        toast.success(ADMIN_TIMELINE_CONSTANTS.DRAWER.TOAST_CREATE_SUCCESS);
      }

      setIsOpen(false);
      resetForm();
      onSuccess();
    } catch (err: any) {
      console.error('Erro ao salvar marco histórico:', err);
      toast.error(err.response?.data?.message || ADMIN_TIMELINE_CONSTANTS.DRAWER.TOAST_ERROR_GENERIC);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isOpen,
    isSaving,
    isEditing: Boolean(editingId),
    year,
    setYear,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    dateFormatted,
    setDateFormatted,
    displayOrder,
    setDisplayOrder,
    isHighlighted,
    setIsHighlighted,
    isActive,
    setIsActive,
    photoUrl,
    setPhotoUrl,
    pendingPhotoFile,
    setPendingPhotoFile,
    openCreate,
    openEdit,
    close,
    save,
  };
};
