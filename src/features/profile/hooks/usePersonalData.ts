import { useState, useRef, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore, User } from '@/store/useAuthStore';
import { updateProfile, updateAvatar } from '@/services/profile.service';
import { toast } from 'react-hot-toast';
import { PROFILE_TEXTS } from '../constants';
import {
  isBlobUrl,
  useTransactionalSave,
  verifyUploadedUrl,
} from '@/shared/hooks/useTransactionalSave';
import {
  personalDataSchema,
  PersonalDataFormData,
} from '../schemas/personal-data.schema';

export const usePersonalData = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [cropModalSrc, setCropModalSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState<string | null>(null);
  const selectedRawFileRef = useRef<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isSaving, savingLabel, runTransactionalSave } = useTransactionalSave({
    savingDb: PROFILE_TEXTS.PERSONAL_LOADING_SAVING,
  });

  const loading = isSaving || isDeletingPhoto;

  const form = useForm<PersonalDataFormData>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user, form]);

  useEffect(() => {
    return () => {
      if (isBlobUrl(pendingAvatarPreview)) {
        URL.revokeObjectURL(pendingAvatarPreview!);
      }
    };
  }, [pendingAvatarPreview]);

  const handleSave = form.handleSubmit(async (data: PersonalDataFormData) => {
    await runTransactionalSave<string | undefined, User>({
      hasPendingMedia: Boolean(pendingAvatarFile),
      uploadMedia: async () => {
        const res = await updateAvatar(pendingAvatarFile!);
        return verifyUploadedUrl(res?.url);
      },
      saveToDb: async (uploadedAvatarUrl) => {
        const finalAvatarUrl = uploadedAvatarUrl || user?.avatarUrl;
        return updateProfile({
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          ...(finalAvatarUrl !== user?.avatarUrl && { avatarUrl: finalAvatarUrl }),
        });
      },
      onConfirmed: (updatedUser) => {
        updateUser(updatedUser);
        setIsEditing(false);
        setPendingAvatarFile(null);
        setPendingAvatarPreview(null);
        toast.success(PROFILE_TEXTS.TOAST_PERSONAL_SAVE_SUCCESS);
      },
      onError: (error: any) => {
        console.error('Failed to update profile:', error);
        toast.error(error?.response?.data?.message || error?.message || PROFILE_TEXTS.TOAST_PERSONAL_SAVE_ERROR);
      },
    });
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      selectedRawFileRef.current = file;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropModalSrc(reader.result?.toString() || null);
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (croppedBlob: Blob) => {
    if (isBlobUrl(pendingAvatarPreview)) {
      URL.revokeObjectURL(pendingAvatarPreview!);
    }
    const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
    const url = URL.createObjectURL(croppedBlob);

    setPendingAvatarFile(file);
    setPendingAvatarPreview(url);
    setIsCropModalOpen(false);
    setCropModalSrc(null);
    setIsEditing(true);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUseOriginal = () => {
    const file = selectedRawFileRef.current || fileInputRef.current?.files?.[0];
    if (file) {
      if (isBlobUrl(pendingAvatarPreview)) {
        URL.revokeObjectURL(pendingAvatarPreview!);
      }
      const url = URL.createObjectURL(file);

      setPendingAvatarFile(file);
      setPendingAvatarPreview(url);
      setIsCropModalOpen(false);
      setCropModalSrc(null);
      setIsEditing(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCropCancel = () => {
    setIsCropModalOpen(false);
    setCropModalSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmDeletePhoto = async () => {
    if (loading) return;
    try {
      setIsDeletingPhoto(true);
      const updatedUser = await updateProfile({ avatarUrl: '' });
      updateUser(updatedUser || { avatarUrl: '' });
      setPendingAvatarFile(null);
      setPendingAvatarPreview(null);
      setIsConfirmModalOpen(false);
      toast.success(PROFILE_TEXTS.TOAST_PERSONAL_PHOTO_DELETE_SUCCESS);
    } catch (error: any) {
      console.error('Failed to delete avatar:', error);
      toast.error(error?.response?.data?.message || PROFILE_TEXTS.TOAST_PERSONAL_SAVE_ERROR);
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  return {
    user,
    form,
    isEditing,
    setIsEditing,
    loading,
    savingLabel,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    fileInputRef,
    handleSave,
    handleFileChange,
    confirmDeletePhoto,
    cropModalSrc,
    isCropModalOpen,
    handleCropSave,
    handleUseOriginal,
    handleCropCancel,
    pendingAvatarPreview,
    cancelEditing: () => {
      if (loading) return;
      setIsEditing(false);
      setPendingAvatarFile(null);
      setPendingAvatarPreview(null);
      form.reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
      });
    },
  };
};
