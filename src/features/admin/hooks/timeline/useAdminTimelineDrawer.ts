'use client';

import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { adminTimelineService } from '../../services/admin-timeline.service';
import { TimelineEventData, TimelineCategoryData } from '@/features/timeline/services/timeline.service';
import { ADMIN_TIMELINE_CONSTANTS } from '../../constants/admin-timeline.constants';
import {
  isBlobUrl,
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
  return `timeline-draft-${Math.random().toString(36).substring(2, 9)}`;
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
  galleryUrls: [],
};

export const useAdminTimelineDrawer = (onSuccess: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const draftFolderIdRef = useRef<string>(generateDraftFolderId());

  // Foto Principal
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);

  // Mini-Galeria de Fotos Complementares
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [selectedGalleryFile, setSelectedGalleryFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const { isSaving, savingLabel, runTransactionalSave } = useTransactionalSave({
    uploadingMedia: ADMIN_TIMELINE_CONSTANTS.DRAWER.BTN_UPLOADING_PHOTO,
    savingDb: ADMIN_TIMELINE_CONSTANTS.DRAWER.BTN_SAVING,
  });

  const form = useForm<TimelineEventFormData>({
    resolver: zodResolver(timelineEventSchema),
    defaultValues: defaultEventValues,
  });

  const photoUrl = form.watch('imageUrl');
  const galleryUrls = form.watch('galleryUrls') || [];

  // Revoga URL temporária em desmontagem
  useEffect(() => {
    return () => {
      if (photoUrl && isBlobUrl(photoUrl)) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  const resetForm = () => {
    setEditingId(null);
    draftFolderIdRef.current = generateDraftFolderId();
    form.reset(defaultEventValues);
    setPendingPhotoFile(null);
    setSelectedGalleryFile(null);
    setCropSourceImage('');
    setIsCropModalOpen(false);
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

  const handleCategorySelect = (selectedSlugOrId: string, categories: TimelineCategoryData[]) => {
    form.setValue('category', selectedSlugOrId);
    const found = categories.find(
      (c) => c.slug === selectedSlugOrId || c.id === selectedSlugOrId || c._id === selectedSlugOrId,
    );
    if (found) {
      form.setValue('categoryId', found.id || found._id || '');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photoUrl && isBlobUrl(photoUrl)) {
        URL.revokeObjectURL(photoUrl);
      }
      setPendingPhotoFile(file);
      form.setValue('imageUrl', URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    if (photoUrl && isBlobUrl(photoUrl)) {
      URL.revokeObjectURL(photoUrl);
    }
    setPendingPhotoFile(null);
    form.setValue('imageUrl', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectGalleryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedGalleryFile(file);
      setCropSourceImage(URL.createObjectURL(file));
      setIsCropModalOpen(true);
      e.target.value = '';
    }
  };

  const handleGalleryCropSave = async (blob: Blob) => {
    try {
      setIsUploadingGallery(true);
      const fileToUpload = new File([blob], `timeline-gallery-${Math.random().toString(36).substring(2, 9)}.png`, { type: 'image/png' });
      const uploadedUrl = await adminTimelineService.uploadPhotoMedia(fileToUpload);
      form.setValue('galleryUrls', [...galleryUrls, uploadedUrl]);
      setIsCropModalOpen(false);
      setCropSourceImage('');
      setSelectedGalleryFile(null);
      toast.success('Foto complementar adicionada!');
    } catch (err: unknown) {
      console.error('Erro ao enviar foto complementar:', err);
      toast.error('Erro ao enviar foto para galeria.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleGalleryUseOriginal = async () => {
    if (!selectedGalleryFile) return;
    try {
      setIsUploadingGallery(true);
      const uploadedUrl = await adminTimelineService.uploadPhotoMedia(selectedGalleryFile);
      form.setValue('galleryUrls', [...galleryUrls, uploadedUrl]);
      setIsCropModalOpen(false);
      setCropSourceImage('');
      setSelectedGalleryFile(null);
      toast.success('Foto complementar adicionada!');
    } catch (err: unknown) {
      console.error('Erro ao enviar foto original:', err);
      toast.error('Erro ao enviar foto para galeria.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    form.setValue(
      'galleryUrls',
      galleryUrls.filter((_, idx) => idx !== index)
    );
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
      galleryUrls: event.galleryUrls || [],
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

        const payload = {
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
          galleryUrls: data.galleryUrls || [],
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
      onError: (err: unknown) => {
        console.error('Erro ao salvar marco histórico da timeline:', err);
        const errMsg =
          err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string'
            ? (err as { message: string }).message
            : ADMIN_TIMELINE_CONSTANTS.TOAST.ERROR_SAVE;
        toast.error(errMsg);
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
    fileInputRef,
    galleryInputRef,
    pendingPhotoFile,
    selectedGalleryFile,
    setSelectedGalleryFile,
    isCropModalOpen,
    setIsCropModalOpen,
    cropSourceImage,
    setCropSourceImage,
    isUploadingGallery,
    handleFileChange,
    handleRemovePhoto,
    handleCategorySelect,
    handleSelectGalleryFile,
    handleGalleryCropSave,
    handleGalleryUseOriginal,
    handleRemoveGalleryPhoto,
    handleEventDateChange,
    openCreate,
    openEdit,
    close,
    save,
  };
};
