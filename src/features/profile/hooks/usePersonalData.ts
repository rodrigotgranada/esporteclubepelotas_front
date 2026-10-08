import { useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { updateProfile, updateAvatar } from '@/services/profile.service';

export const usePersonalData = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });

  const [cropModalSrc, setCropModalSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      setLoading(true);

      let finalAvatarUrl = user?.avatarUrl;

      // Se tiver uma foto pendente para upload, subimos primeiro
      if (pendingAvatarFile) {
        const { url } = await updateAvatar(pendingAvatarFile);
        finalAvatarUrl = url;
      }

      const updatedUser = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(finalAvatarUrl !== user?.avatarUrl && { avatarUrl: finalAvatarUrl }),
      });
      
      updateUser(updatedUser);
      setIsEditing(false);
      setPendingAvatarFile(null);
      setPendingAvatarPreview(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropModalSrc(reader.result?.toString() || null);
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
    const url = URL.createObjectURL(croppedBlob);
    
    setPendingAvatarFile(file);
    setPendingAvatarPreview(url);
    setIsCropModalOpen(false);
    setCropModalSrc(null);
    setIsEditing(true); // Força edição ativada se mudar a foto
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUseOriginal = () => {
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
      const file = fileInputRef.current.files[0];
      const url = URL.createObjectURL(file);
      
      setPendingAvatarFile(file);
      setPendingAvatarPreview(url);
      setIsCropModalOpen(false);
      setCropModalSrc(null);
      setIsEditing(true); // Força edição ativada
      fileInputRef.current.value = '';
    }
  };

  const handleCropCancel = () => {
    setIsCropModalOpen(false);
    setCropModalSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmDeletePhoto = async () => {
    try {
      setLoading(true);
      await updateProfile({ avatarUrl: '' });
      updateUser({ avatarUrl: '' });
      setPendingAvatarFile(null);
      setPendingAvatarPreview(null);
    } catch (error) {
      console.error('Failed to delete avatar:', error);
    } finally {
      setLoading(false);
      setIsConfirmModalOpen(false);
    }
  };

  return {
    user,
    isEditing,
    setIsEditing,
    loading,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    formData,
    setFormData,
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
      setIsEditing(false);
      setPendingAvatarFile(null);
      setPendingAvatarPreview(null);
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
      });
    }
  };
};
