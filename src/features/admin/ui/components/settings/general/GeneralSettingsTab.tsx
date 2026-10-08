import React, { useRef } from 'react';
import { LayoutContainer, Title, Text, Button, Input, IconButton, Spinner } from '@/shared/ui/components';
import { Pencil, Plus } from 'lucide-react';
import Image from 'next/image';
import { CropModal } from '@/shared/ui/components/molecules/CropModal';
import { GENERAL_SETTINGS_TEXTS } from './GeneralSettingsTab.constants';
import { useGeneralSettingsTab } from '@/features/admin/hooks/settings/useGeneralSettingsTab';

export const GeneralSettingsTab = () => {
  const {
    isSaving,
    isFetching,
    clubName,
    setClubName,
    previewLogo,
    gallery,
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
        <Title level="h2" className="text-xl font-bold text-text-primary">{GENERAL_SETTINGS_TEXTS.TITLE}</Title>
        <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving}>
          {GENERAL_SETTINGS_TEXTS.BUTTON_SAVE}
        </Button>
      </LayoutContainer>

      <LayoutContainer className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar Area */}
        <LayoutContainer className="flex-shrink-0 flex flex-col items-center max-w-[200px]">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            className="hidden"
          />
          <LayoutContainer className="w-32 h-32 rounded-full bg-surface border-4 border-primary overflow-hidden relative shadow-xl group">
            {previewLogo ? (
              <>
                <Image
                  src={previewLogo}
                  alt="Club Logo"
                  fill
                  sizes="128px"
                  className="object-contain p-2"
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
          <Text className="text-text-secondary text-xs mt-3 text-center mb-6">{GENERAL_SETTINGS_TEXTS.LABEL_AVATAR}<br />{GENERAL_SETTINGS_TEXTS.AVATAR_FORMATS}</Text>

          {/* Gallery */}
          {gallery.length > 0 && (
            <LayoutContainer className="w-full border-t border-border pt-4 mt-2 flex flex-col items-center">
              <Text className="text-xs font-bold text-text-secondary mb-3">{GENERAL_SETTINGS_TEXTS.GALLERY_TITLE}</Text>
              <LayoutContainer className="flex flex-wrap gap-2 justify-center">
                {gallery.map((url, idx) => (
                  <LayoutContainer key={idx} className="relative group">
                    <LayoutContainer
                      className={`relative w-12 h-12 rounded-lg border-2 ${previewLogo === url ? 'border-primary' : 'border-border'} overflow-hidden cursor-pointer bg-surface transition-transform hover:scale-105`}
                      onClick={() => handleSelectFromGallery(url)}
                    >
                      <Image src={url} alt={`Gallery Logo ${idx}`} fill sizes="48px" className="object-contain p-1" />
                    </LayoutContainer>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveFromGallery(url); }}
                      className="absolute -top-2 -right-2 bg-error text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-error/90 z-10"
                      title={GENERAL_SETTINGS_TEXTS.GALLERY_REMOVE_TITLE}
                    >
                      &times;
                    </button>
                  </LayoutContainer>
                ))}
              </LayoutContainer>
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Data Fields */}
        <LayoutContainer className="flex-1 grid grid-cols-1 gap-6 w-full max-w-md">
          <Input
            label={GENERAL_SETTINGS_TEXTS.LABEL_CLUB_NAME}
            value={clubName || ''}
            onChange={(e) => setClubName(e.target.value)}
          />
        </LayoutContainer>
      </LayoutContainer>

      {cropImageSrc && (
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
