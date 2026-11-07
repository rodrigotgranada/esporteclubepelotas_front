'use client';

import { useRef, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { adminTimelineService } from '../../services/admin-timeline.service';
import { TimelineEventData } from '@/features/timeline/services/timeline.service';
import { ADMIN_TIMELINE_CONSTANTS } from '../../constants/admin-timeline.constants';
import {
  stripBlobUrl,
  useTransactionalSave,
  verifyUploadedUrl,
} from '@/shared/hooks/useTransactionalSave';
import {
  timelineEventSchema,
  TimelineEventFormData,
} from '../../schemas/timeline/timeline.schema';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const formatPtBrDate = (dateIsoString: string): string => {
  if (!dateIsoString) return '';
  const parts = dateIsoString.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[2], 10);
    const monthIdx = parseInt(parts[1], 10) - 1;
    const year = parts[0];
    if (!isNaN(day) && monthIdx >= 0 && monthIdx < 12) {
      return `${day} de ${MONTH_NAMES[monthIdx]} de ${year}`;
    }
  }
  return dateIsoString;
};

const generateDraftFolderId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `timeline-${Date.now()}`;
};

const defaultEventValues: TimelineEventFormData = {
  year: new Date().getFullYear(),
  title: '',
  description: '',
  categoryId: '',
  category: 'fundacao',
  eventDate: '',
  dateFormatted: '',
  displayOrder: 0,
  isHighlighted: false,
  isActive: true,
  imageUrl: null,
};

export const useAdminTimelineDrawer = (onSuccess: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const draftFolderIdRef = useRef<string>(generateDraftFolderId());
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);

  const { isSaving, savingLabel, runTransactionalSave } = useTransactionalSave({
    uploadingMedia: ADMIN_TIMELINE_CONSTANTS.DRAWER.BTN_UPLOADING_PHOTO,
    savingDb: ADMIN_TIMELINE_CONSTANTS.DRAWER.BTN_SAVING,
  });

  const form = useForm<TimelineEventFormData>({
    resolver: zodResolver(timelineEventSchema),
    defaultValues: defaultEventValues,
  });

  const resetForm = () => {
    setEditingId(null);
    draftFolderIdRef.current = generateDraftFolderId();
    form.reset(defaultEventValues);
    setPendingPhotoFile(null);
  };

  const handleEventDateChange = (val: string) => {
    form.setValue('eventDate', val);
    if (val && val.includes('-')) {
      const parts = val.split('-');
      const y = parseInt(parts[0], 10);
      if (!isNaN(y)) {
        form.setValue('year', y);
      }
      form.setValue('dateFormatted', formatPtBrDate(val));
    }
  };

  const openCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEdit = (event: TimelineEventData) => {
    const id = event.id || event._id || null;
    setEditingId(id);
    draftFolderIdRef.current = id || generateDraftFolderId();
    form.reset({
      year: event.year,
      title: event.title,
      description: event.description,
      categoryId: event.categoryId || '',
      category: event.category || 'fundacao',
      eventDate: event.eventDate || '',
      dateFormatted: event.dateFormatted || (event.eventDate ? formatPtBrDate(event.eventDate) : ''),
      displayOrder: event.displayOrder || 0,
      isHighlighted: Boolean(event.isHighlighted),
      isActive: event.isActive !== false,
      imageUrl: event.imageUrl || null,
    });
    setPendingPhotoFile(null);
    setIsOpen(true);
  };

  const close = () => {
    if (isSaving) return;
    setIsOpen(false);
    resetForm();
  };

  const save = form.handleSubmit(async (data: TimelineEventFormData) => {
    await runTransactionalSave<string | undefined, TimelineEventData>({
      hasPendingMedia: Boolean(pendingPhotoFile),
      uploadMedia: async () => {
        const uploadedUrl = await adminTimelineService.uploadPhotoMedia(
          pendingPhotoFile!,
          editingId || draftFolderIdRef.current,
        );
        return verifyUploadedUrl(uploadedUrl);
      },
      saveToDb: async (uploadedPhotoUrl) => {
        const resolvedPhotoUrl = uploadedPhotoUrl
          ? uploadedPhotoUrl
          : stripBlobUrl(data.imageUrl, '');

        const payload: any = {
          year: Number(data.year),
          title: data.title.trim(),
          description: data.description.trim(),
          category: data.category,
          categoryId: data.categoryId?.trim() || undefined,
          eventDate: data.eventDate?.trim() || undefined,
          dateFormatted: data.dateFormatted?.trim() || undefined,
          displayOrder: Number(data.displayOrder) || 0,
          isHighlighted: Boolean(data.isHighlighted),
          isActive: Boolean(data.isActive),
          imageUrl: resolvedPhotoUrl || undefined,
        };

        if (editingId) {
          return adminTimelineService.updateEvent(editingId, payload);
        }
        return adminTimelineService.createEvent(payload);
      },
      onConfirmed: () => {
        toast.success(
          editingId
            ? ADMIN_TIMELINE_CONSTANTS.TOAST.SUCCESS_UPDATE
            : ADMIN_TIMELINE_CONSTANTS.TOAST.SUCCESS_CREATE,
        );
        close();
        onSuccess();
      },
      onError: (err: any) => {
        console.error('Erro ao salvar marco histórico da timeline:', err);
        toast.error(err?.response?.data?.message || err?.message || ADMIN_TIMELINE_CONSTANTS.TOAST.ERROR_SAVE);
      },
    });
  });

  return {
    form,
    isOpen,
    editingId,
    isEditing: Boolean(editingId),
    isSaving,
    savingLabel,
    pendingPhotoFile,
    setPendingPhotoFile,
    handleEventDateChange,
    openCreate,
    openEdit,
    close,
    save,
  };
};
