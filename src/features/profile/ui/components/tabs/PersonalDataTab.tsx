import React, { useState, useEffect } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  FormField,
  Form,
  ConfirmModal,
  IconButton,
  DateText,
  isUnoptimizedImageUrl,
} from '@/shared/ui/components';
import { User as UserIcon, Edit2, Check, Trash2, Plus, Pencil, Loader2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { PROFILE_TEXTS } from '../../../constants';
import { usePersonalData } from '../../../hooks/usePersonalData';
import { formatCPF } from '@/shared/utils/formatters';
import { CropModal } from '@/shared/ui/components/molecules/CropModal';

export const PersonalDataTab = () => {
  const {
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
    cancelEditing,
  } = usePersonalData();

  const [isImageLoading, setIsImageLoading] = useState(false);

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
              <Check size={16} /> {loading ? (savingLabel || PROFILE_TEXTS.PERSONAL_LOADING_SAVING) : PROFILE_TEXTS.PERSONAL_BUTTON_SAVE}
            </Button>
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Card Institucional de Sócio Oficial da Boca do Lobo */}
      {user.isSocio && (
        <LayoutContainer className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-primary/20 via-surface to-surface border-2 border-primary/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <LayoutContainer className="flex items-center gap-3.5">
            <LayoutContainer className="p-3 rounded-2xl bg-primary/20 text-primary shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col">
              <LayoutContainer className="flex items-center gap-2">
                <Badge variant="primary" size="sm" className="font-black text-[10px] uppercase">
                  Sócio Oficial da Boca do Lobo
                </Badge>
              </LayoutContainer>
              <Title level="h3" className="text-base font-black text-text-primary mt-0.5">
                {user.socioPlanName || 'Plano de Sócios'}
              </Title>
              {user.eleventicketsId && (
                <Text as="span" className="text-xs text-text-secondary">
                  Matrícula ElevenTickets: <strong className="font-mono text-text-primary">{user.eleventicketsId}</strong>
                </Text>
              )}
            </LayoutContainer>
          </LayoutContainer>

          <Badge variant="primary" size="md" className="font-black text-xs uppercase px-3 py-1">
            Status: Ativo
          </Badge>
        </LayoutContainer>
      )}

      <Form onSubmit={handleSave}>
        <LayoutContainer className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Area */}
          <LayoutContainer className="flex-shrink-0 flex flex-col items-center">
            <LayoutContainer className="hidden">
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
              />
            </LayoutContainer>
            <LayoutContainer className={`w-32 h-32 rounded-full bg-surface border-4 border-primary overflow-hidden relative shadow-xl ${isEditing ? 'group' : ''}`}>
              {(loading || isImageLoading) && (
                <LayoutContainer className="absolute inset-0 z-10 bg-black/50 flex flex-col items-center justify-center text-white px-2 text-center">
                  <Loader2 className="animate-spin mb-1" size={24} />
                  <Text as="span" className="text-xs font-bold">
                    {loading ? (savingLabel || PROFILE_TEXTS.PERSONAL_LOADING_SAVING) : PROFILE_TEXTS.PERSONAL_LOADING_FETCHING}
                  </Text>
                </LayoutContainer>
              )}
              {pendingAvatarPreview || user.avatarUrl ? (
                <>
                  <Image
                    src={pendingAvatarPreview || user.avatarUrl || ''}
                    alt={PROFILE_TEXTS.PERSONAL_TITLE}
                    fill
                    sizes="128px"
                    priority
                    className="object-cover"
                    unoptimized={isUnoptimizedImageUrl(pendingAvatarPreview || user.avatarUrl)}
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                  {isEditing && !loading && (
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
                      disabled={loading}
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
                <FormField
                  name="firstName"
                  control={form.control}
                  label={PROFILE_TEXTS.PERSONAL_LABEL_FIRST_NAME}
                  render={({ field }) => (
                    <Input
                      {...field}
                      disabled={loading}
                    />
                  )}
                />
                <FormField
                  name="lastName"
                  control={form.control}
                  label={PROFILE_TEXTS.PERSONAL_LABEL_LAST_NAME}
                  render={({ field }) => (
                    <Input
                      {...field}
                      disabled={loading}
                    />
                  )}
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
      </Form>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          if (!loading) setIsConfirmModalOpen(false);
        }}
        onConfirm={confirmDeletePhoto}
        title={PROFILE_TEXTS.PERSONAL_MODAL_DELETE_PHOTO_TITLE}
        description={PROFILE_TEXTS.PERSONAL_MODAL_DELETE_PHOTO_DESC}
        confirmText={PROFILE_TEXTS.PERSONAL_MODAL_DELETE_PHOTO_CONFIRM}
        cancelText={PROFILE_TEXTS.PERSONAL_MODAL_DELETE_PHOTO_CANCEL}
        variant="danger"
        isLoading={loading}
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
