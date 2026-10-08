import React from 'react';
import { LayoutContainer, Title, Text, Button, Input, ConfirmModal, IconButton, DateText } from '@/shared/ui/components';
import { User as UserIcon, Edit2, Check, Trash2, Plus, Pencil } from 'lucide-react';
import Image from 'next/image';
import { PROFILE_TEXTS } from '../../../constants';
import { usePersonalData } from '../../../hooks/usePersonalData';
import { formatCPF } from '@/shared/utils/formatters';
import { CropModal } from '@/shared/ui/components/molecules/CropModal';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export const PersonalDataTab = () => {
  const {
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
    cancelEditing,
  } = usePersonalData();

  const [isImageLoading, setIsImageLoading] = useState(false);

  // When a new avatar URL comes in, set image loading to true
  useEffect(() => {
    if (user?.avatarUrl || pendingAvatarPreview) {
      setIsImageLoading(true);
    }
  }, [user?.avatarUrl, pendingAvatarPreview]);

  if (!user) return null;

  return (
    <LayoutContainer className="animate-in fade-in duration-300">
      <LayoutContainer className="flex items-center justify-between mb-8">
        <Title level="h2" className="text-xl font-bold text-text-primary flex items-center gap-2">
          <UserIcon size={24} className="text-primary" />
          {PROFILE_TEXTS.PERSONAL_TITLE}
        </Title>
        {!isEditing ? (
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 size={16} /> {PROFILE_TEXTS.PERSONAL_BUTTON_EDIT}
          </Button>
        ) : (
          <LayoutContainer className="flex gap-2">
            <Button variant="outline" size="sm" onClick={cancelEditing} disabled={loading}>
              {PROFILE_TEXTS.PERSONAL_BUTTON_CANCEL}
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} isLoading={loading}>
              <Check size={16} /> {PROFILE_TEXTS.PERSONAL_BUTTON_SAVE}
            </Button>
          </LayoutContainer>
        )}
      </LayoutContainer>

      <LayoutContainer className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar Area */}
        <LayoutContainer className="flex-shrink-0 flex flex-col items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg, image/webp" 
            className="hidden" 
          />
          <LayoutContainer className={`w-32 h-32 rounded-full bg-surface border-4 border-primary overflow-hidden relative shadow-xl ${isEditing ? 'group' : ''}`}>
            {(loading || isImageLoading) && (
              <LayoutContainer className="absolute inset-0 z-10 bg-black/50 flex flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin mb-1" size={24} />
                <Text as="span" className="text-xs font-bold">{loading ? PROFILE_TEXTS.PERSONAL_LOADING_SAVING : PROFILE_TEXTS.PERSONAL_LOADING_FETCHING}</Text>
              </LayoutContainer>
            )}
            {pendingAvatarPreview || user.avatarUrl ? (
              <>
                <Image 
                  src={pendingAvatarPreview || user.avatarUrl || ''} 
                  alt="Avatar" 
                  fill 
                  sizes="128px" 
                  priority 
                  className="object-cover" 
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />
                {isEditing && (
                  <LayoutContainer className="absolute inset-0 bg-black/60 rounded-full flex flex-row items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-4">
                    <IconButton 
                      icon={<Pencil size={18} />}
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()} 
                      title={PROFILE_TEXTS.PERSONAL_PHOTO_EDIT_TITLE}
                    />
                    <IconButton 
                      icon={<Trash2 size={18} />}
                      variant="danger"
                      onClick={() => setIsConfirmModalOpen(true)} 
                      title={PROFILE_TEXTS.PERSONAL_PHOTO_DELETE_TITLE}
                    />
                  </LayoutContainer>
                )}
              </>
            ) : (
              <LayoutContainer className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/50">
                {isEditing ? (
                  <IconButton 
                    icon={<Plus size={24} />}
                    variant="ghost"
                    size="lg"
                    className="text-primary hover:text-primary/80"
                    onClick={() => fileInputRef.current?.click()} 
                    title={PROFILE_TEXTS.PERSONAL_PHOTO_ADD_TITLE}
                  />
                ) : (
                  <LayoutContainer className="w-full h-full flex items-center justify-center text-primary font-bold text-4xl">
                    {user.firstName[0]}
                  </LayoutContainer>
                )}
              </LayoutContainer>
            )}
          </LayoutContainer>
        </LayoutContainer>

        {/* Data Fields */}
        <LayoutContainer className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {isEditing ? (
            <>
              <Input 
                label={PROFILE_TEXTS.PERSONAL_LABEL_FIRST_NAME} 
                value={formData.firstName} 
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                disabled={!isEditing} 
                className={!isEditing ? 'bg-transparent border-none px-0 text-text-primary shadow-none pointer-events-none' : ''} 
              />
              <Input 
                label={PROFILE_TEXTS.PERSONAL_LABEL_LAST_NAME} 
                value={formData.lastName} 
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                disabled={!isEditing} 
                className={!isEditing ? 'bg-transparent border-none px-0 text-text-primary shadow-none pointer-events-none' : ''} 
              />
            </>
          ) : (
            <LayoutContainer className="col-span-2 md:col-span-1">
              <Text className="text-text-secondary text-sm mb-1">{PROFILE_TEXTS.PERSONAL_LABEL_FULL_NAME}</Text>
              <Text className="text-text-primary font-medium text-lg">{user.firstName} {user.lastName}</Text>
            </LayoutContainer>
          )}

          <LayoutContainer className="col-span-2 md:col-span-1">
            <Text className="text-text-secondary text-sm mb-1">{PROFILE_TEXTS.PERSONAL_LABEL_CPF}</Text>
            <Text className="text-text-primary font-medium text-lg">{formatCPF(user.cpf) || 'Não informado'}</Text>
          </LayoutContainer>

          <LayoutContainer className="col-span-2 md:col-span-1">
            <Text className="text-text-secondary text-sm mb-1">{PROFILE_TEXTS.PERSONAL_LABEL_BIRTH_DATE}</Text>
            <DateText date={user.birthDate} className="text-text-primary font-medium text-lg" />
          </LayoutContainer>

          <LayoutContainer className="col-span-2 md:col-span-1">
            <Text className="text-text-secondary text-sm mb-1">{PROFILE_TEXTS.PERSONAL_LABEL_CREATED_AT}</Text>
            <DateText date={user.createdAt} format="datetime" className="text-text-secondary font-medium text-sm" />
          </LayoutContainer>

          <LayoutContainer className="col-span-2 md:col-span-1">
            <Text className="text-text-secondary text-sm mb-1">{PROFILE_TEXTS.PERSONAL_LABEL_UPDATED_AT}</Text>
            <DateText date={user.updatedAt} format="datetime" className="text-text-secondary font-medium text-sm" />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeletePhoto}
        title={PROFILE_TEXTS.PERSONAL_MODAL_DELETE_PHOTO_TITLE}
        description={PROFILE_TEXTS.PERSONAL_MODAL_DELETE_PHOTO_DESC}
        confirmText={PROFILE_TEXTS.PERSONAL_MODAL_DELETE_PHOTO_CONFIRM}
        cancelText={PROFILE_TEXTS.PERSONAL_MODAL_DELETE_PHOTO_CANCEL}
        variant="danger"
      />

      <CropModal
        isOpen={isCropModalOpen}
        imageSrc={cropModalSrc || ''}
        onClose={handleCropCancel}
        onCropSave={handleCropSave}
        onUseOriginal={handleUseOriginal}
        isLoading={loading}
        texts={{
          title: PROFILE_TEXTS.CROP_MODAL_TITLE,
          zoom: PROFILE_TEXTS.CROP_MODAL_ZOOM,
          useOriginal: PROFILE_TEXTS.CROP_MODAL_USE_ORIGINAL,
          cancel: PROFILE_TEXTS.CROP_MODAL_CANCEL,
          save: PROFILE_TEXTS.CROP_MODAL_SAVE,
        }}
      />
    </LayoutContainer>
  );
};
