import React, { useRef } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Input,
  IconButton,
  Spinner,
  SafeImage,
  FormField,
  Switch,
  Badge,
} from '@/shared/ui/components';
import { Pencil, Plus, X, Lock } from 'lucide-react';
import { CropModal } from '@/shared/ui/components/molecules/CropModal';
import { GENERAL_SETTINGS_TEXTS } from './GeneralSettingsTab.constants';
import { useGeneralSettingsTab } from '@/features/admin/hooks/settings/useGeneralSettingsTab';

export const GeneralSettingsTab = () => {
  const {
    form,
    isOwner,
    isSaving,
    isFetching,
    previewLogo,
    gallery,
    newsletterIsActive,
    setNewsletterIsActive,
    developerCreditEnabled,
    setDeveloperCreditEnabled,
    developerCreditName,
    developerCreditUrl,
    isCropModalOpen,
    setIsCropModalOpen,
    cropImageSrc,
    handleFileChange,
    handleCropSave,
    handleUseOriginal,
    handleSelectFromGallery,
    handleRemoveFromGallery,
    handleSave,
  } = useGeneralSettingsTab();

  const {
    register,
    formState: { errors },
  } = form;

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isFetching) {
    return (
      <LayoutContainer className="animate-in fade-in duration-300 p-8 flex items-center justify-center">
        <Spinner text="Carregando configurações..." />
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="animate-in fade-in duration-300">
      <LayoutContainer className="flex items-center justify-between mb-8">
        <Title level="h2" className="text-xl font-bold text-text-primary">
          {GENERAL_SETTINGS_TEXTS.TITLE}
        </Title>
        <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving}>
          {GENERAL_SETTINGS_TEXTS.BUTTON_SAVE}
        </Button>
      </LayoutContainer>

      <LayoutContainer className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar Area */}
        <LayoutContainer className="flex-shrink-0 flex flex-col items-center max-w-[200px]">
          <LayoutContainer className="hidden">
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
            />
          </LayoutContainer>
          <LayoutContainer className="w-32 h-32 rounded-full bg-surface border-4 border-primary overflow-hidden relative shadow-xl group">
            {previewLogo ? (
              <>
                <SafeImage
                  src={previewLogo}
                  alt="Club Logo"
                  fill
                  sizes="128px"
                  className="object-contain p-2"
                  fallbackSrc="/images/pelotas-logo.png"
                />
                <LayoutContainer className="absolute inset-0 bg-black/60 rounded-full flex flex-row items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-4">
                  <IconButton
                    icon={<Pencil size={18} />}
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    title={GENERAL_SETTINGS_TEXTS.BUTTON_EDIT_LOGO}
                  />
                </LayoutContainer>
              </>
            ) : (
              <LayoutContainer className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/50">
                <IconButton
                  icon={<Plus size={24} />}
                  variant="ghost"
                  size="lg"
                  className="text-primary hover:text-primary/80"
                  onClick={() => fileInputRef.current?.click()}
                  title={GENERAL_SETTINGS_TEXTS.BUTTON_ADD_LOGO}
                />
              </LayoutContainer>
            )}
          </LayoutContainer>
          <Text className="text-text-secondary text-xs mt-3 text-center mb-6">
            {GENERAL_SETTINGS_TEXTS.LABEL_AVATAR}
            <br />
            {GENERAL_SETTINGS_TEXTS.AVATAR_FORMATS}
          </Text>

          {/* Gallery */}
          {gallery.length > 0 && (
            <LayoutContainer className="w-full border-t border-border pt-4 mt-2 flex flex-col items-center">
              <Text className="text-xs font-bold text-text-secondary mb-3">
                {GENERAL_SETTINGS_TEXTS.GALLERY_TITLE}
              </Text>
              <LayoutContainer className="flex flex-wrap gap-2 justify-center">
                {gallery.map((url, idx) => (
                  <LayoutContainer key={idx} className="relative group">
                    <LayoutContainer
                      className={`relative w-12 h-12 rounded-lg border-2 ${previewLogo === url ? 'border-primary' : 'border-border'} overflow-hidden cursor-pointer bg-surface transition-transform hover:scale-105`}
                      onClick={() => handleSelectFromGallery(url)}
                    >
                      <SafeImage
                        src={url}
                        alt={`Escudo Histórico ${idx + 1}`}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </LayoutContainer>
                    <IconButton
                      icon={<X size={12} />}
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 bg-surface border border-border rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-[#ea580c] shadow-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromGallery(url);
                      }}
                      title={GENERAL_SETTINGS_TEXTS.BUTTON_REMOVE_LOGO}
                    />
                  </LayoutContainer>
                ))}
              </LayoutContainer>
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Inputs Area */}
        <LayoutContainer className="flex-1 w-full space-y-4">
          <FormField
            label={GENERAL_SETTINGS_TEXTS.LABEL_CLUB_NAME}
            error={errors.clubName?.message}
          >
            <Input
              {...register('clubName')}
              placeholder={GENERAL_SETTINGS_TEXTS.PLACEHOLDER_CLUB_NAME}
            />
          </FormField>

          <LayoutContainer className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface/50 mt-4">
            <LayoutContainer className="flex flex-col">
              <Text className="text-sm font-semibold text-text-primary">
                {GENERAL_SETTINGS_TEXTS.LABEL_NEWSLETTER_ACTIVE}
              </Text>
              <Text className="text-xs text-text-secondary">
                {GENERAL_SETTINGS_TEXTS.DESCRIPTION_NEWSLETTER_ACTIVE}
              </Text>
            </LayoutContainer>
            <Switch
              checked={newsletterIsActive ?? true}
              onChange={setNewsletterIsActive}
              disabled={isSaving}
            />
          </LayoutContainer>

          {isOwner && (
            <LayoutContainer className="p-4 sm:p-5 rounded-xl border border-primary/30 bg-surface/50 space-y-4 mt-4">
              <LayoutContainer className="flex flex-wrap items-center justify-between gap-2">
                <LayoutContainer className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary shrink-0" />
                  <Text className="text-sm font-bold text-text-primary">
                    {GENERAL_SETTINGS_TEXTS.DEVELOPER_CREDIT_SECTION_TITLE}
                  </Text>
                </LayoutContainer>
                <Badge variant="primary" size="sm">
                  {GENERAL_SETTINGS_TEXTS.DEVELOPER_CREDIT_OWNER_BADGE}
                </Badge>
              </LayoutContainer>

              <LayoutContainer className="flex items-center justify-between gap-4 pt-1">
                <LayoutContainer className="flex flex-col">
                  <Text className="text-sm font-semibold text-text-primary">
                    {GENERAL_SETTINGS_TEXTS.LABEL_DEVELOPER_CREDIT_ENABLED}
                  </Text>
                  <Text className="text-xs text-text-secondary">
                    {GENERAL_SETTINGS_TEXTS.DESCRIPTION_DEVELOPER_CREDIT_ENABLED}
                  </Text>
                </LayoutContainer>
                <Switch
                  checked={Boolean(developerCreditEnabled)}
                  onChange={setDeveloperCreditEnabled}
                  disabled={isSaving}
                />
              </LayoutContainer>

              <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                <FormField
                  label={GENERAL_SETTINGS_TEXTS.LABEL_DEVELOPER_CREDIT_NAME}
                  error={errors.developerCreditName?.message}
                >
                  <Input
                    {...register('developerCreditName')}
                    placeholder={GENERAL_SETTINGS_TEXTS.PLACEHOLDER_DEVELOPER_CREDIT_NAME}
                    disabled={isSaving}
                  />
                </FormField>

                <FormField
                  label={GENERAL_SETTINGS_TEXTS.LABEL_DEVELOPER_CREDIT_URL}
                  error={errors.developerCreditUrl?.message}
                >
                  <Input
                    {...register('developerCreditUrl')}
                    placeholder={GENERAL_SETTINGS_TEXTS.PLACEHOLDER_DEVELOPER_CREDIT_URL}
                    disabled={isSaving}
                  />
                </FormField>
              </LayoutContainer>

              {developerCreditEnabled && developerCreditName.trim() && (
                <LayoutContainer className="text-xs text-text-secondary bg-background/60 border border-border/60 rounded-lg px-3 py-2 flex flex-wrap items-center gap-1.5">
                  <Text as="span">{GENERAL_SETTINGS_TEXTS.DEVELOPER_CREDIT_PREVIEW_LABEL}</Text>
                  <Text as="span" className="font-semibold text-text-primary">
                    {GENERAL_SETTINGS_TEXTS.DEVELOPER_CREDIT_PREFIX} {developerCreditName.trim()}
                  </Text>
                  {developerCreditUrl.trim() && (
                    <Text as="span" className="text-primary truncate max-w-full">
                      ({developerCreditUrl.trim()})
                    </Text>
                  )}
                </LayoutContainer>
              )}
            </LayoutContainer>
          )}
        </LayoutContainer>
      </LayoutContainer>

      {/* Crop Modal */}
      {isCropModalOpen && cropImageSrc && (
        <CropModal
          isOpen={isCropModalOpen}
          imageSrc={cropImageSrc}
          onClose={() => setIsCropModalOpen(false)}
          onCropSave={handleCropSave}
          onUseOriginal={handleUseOriginal}
        />
      )}
    </LayoutContainer>
  );
};
