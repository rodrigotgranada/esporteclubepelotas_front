'use client';

import React from 'react';
import {
  Sparkles,
  Video,
  Send,
  Save,
  Eye,
} from 'lucide-react';
import {
  Drawer,
  LayoutContainer,
  Text,
  Input,
  Button,
  Spinner,
  ConfirmModal,
  FormField,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { useAdminNewsDrawer } from '../../../hooks/news/useAdminNewsDrawer';
import { NewsBlockEditor } from './NewsBlockEditor';
import { QuickCategoryModal } from './QuickCategoryModal';
import { useQuickCategoryModal } from '../../../hooks/news/useQuickCategoryModal';
import { NewsEditorGallerySection } from './NewsEditorGallerySection';
import { NewsArticlePreviewModal } from './NewsArticlePreviewModal';
import { NewsEditorFeaturedSection } from './NewsEditorFeaturedSection';
import { NewsEditorCreditsSection } from './NewsEditorCreditsSection';
import { NewsEditorInteractivitySection } from './NewsEditorInteractivitySection';
import { NewsEditorCoverSection } from './NewsEditorCoverSection';
import { NewsEditorTagsSection } from './NewsEditorTagsSection';
import { NewsClassificationSection } from './NewsClassificationSection';
import { NewsCategorySlugSection, NewsScheduleSection } from './NewsCategorySlugSection';

export interface NewsEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string | null;
  onSaveSuccess: () => void;
  defaultIsYouth?: boolean;
  defaultIsFemale?: boolean;
}

export const NewsEditorDrawer: React.FC<NewsEditorDrawerProps> = ({
  isOpen,
  onClose,
  articleId,
  onSaveSuccess,
  defaultIsYouth = false,
  defaultIsFemale = false,
}) => {
  const { DRAWER: texts, MODAL_REPLACE_MAIN: replaceMainTexts } = ADMIN_NEWS_TEXTS;

  const {
    form,
    isLoading,
    isSaving,
    savingLabel,
    categories,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleCropCover,
    handleRemoveCover,
    galleryFiles,
    galleryPreviews,
    galleryCropItem,
    handleSelectGalleryFiles,
    handleOpenGalleryCrop,
    handleCropGallerySave,
    handleCropGalleryCancel,
    handleRemoveExistingGalleryPhoto,
    handleRemoveNewGalleryPhoto,
    handleSelectFeaturedSlot,
    replaceMainModalOpen,
    existingMainTitle,
    confirmReplaceMain,
    cancelReplaceMain,
    hasRecoverableDraft,
    recoverDraft,
    discardDraft,
    handleCategoryCreated,
    newsletterSentAt,
    isPreviewOpen,
    setIsPreviewOpen,
    isSlugUnlocked,
    toggleSlugLock,
    handleSave,
  } = useAdminNewsDrawer(articleId, isOpen, onSaveSuccess, defaultIsYouth, defaultIsFemale);

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const quickCat = useQuickCategoryModal(handleCategoryCreated);

  const values = watch();
  const title = values.title;
  const subtitle = values.subtitle;
  const slug = values.slug;
  const summary = values.summary;
  const categoryId = values.categoryId;
  const tags = values.tags || [];
  const coverImage = values.coverImage;
  const coverCaption = values.coverCaption || '';
  const gallery = values.gallery || [];
  const content = values.content || {};
  const youtubeVideoUrl = values.youtubeVideoUrl || '';
  const featuredSlot = values.featuredSlot;
  const isPinned = values.isPinned;
  const isYouth = Boolean(values.isYouth);
  const isFemale = Boolean(values.isFemale);
  const reporterName = values.reporterName || '';
  const photographerName = values.photographerName || '';
  const allowReactions = values.allowReactions;
  const allowComments = values.allowComments;
  const sendNewsletter = values.sendNewsletter ?? false;
  const status = values.status;
  const publishedAt = values.publishedAt || '';

  const isPublishedArticle = Boolean(articleId && status === 'PUBLISHED');
  const isSlugLocked = isPublishedArticle && !isSlugUnlocked;
  const selectedCategory = categories.find((c) => c._id === categoryId || c.slug === categoryId);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={articleId ? texts.TITLE_EDIT : texts.TITLE_CREATE}
        size="3xl"
      >
        {isLoading ? (
          <LayoutContainer className="flex flex-col items-center justify-center p-16">
            <Spinner className="w-8 h-8 text-primary mb-3" />
            <Text as="p" className="text-text-secondary font-medium">
              {texts.LOADING_ARTICLE}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-6 pb-8">
            {hasRecoverableDraft && !articleId && (
              <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-primary/40 bg-primary/10 shadow-sm animate-in fade-in duration-300">
                <LayoutContainer className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <Text as="span" className="text-xs font-semibold text-text-primary">
                    {texts.AUTOSAVE_NOTICE}
                  </Text>
                </LayoutContainer>
                <LayoutContainer className="flex items-center gap-2 shrink-0">
                  <Button type="button" size="sm" variant="primary" onClick={recoverDraft} className="text-xs font-bold h-7 px-3">
                    {texts.AUTOSAVE_RECOVER_BTN}
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={discardDraft} className="text-xs h-7 px-2 text-text-secondary hover:text-text-primary">
                    {texts.AUTOSAVE_DISCARD_BTN}
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            )}

            <LayoutContainer className="flex flex-col gap-4">
              <FormField label={`${texts.LABEL_TITLE} *`} error={errors.title?.message}>
                <Input {...register('title')} placeholder={texts.PLACEHOLDER_TITLE} />
              </FormField>

              <FormField label={texts.LABEL_SUBTITLE} error={errors.subtitle?.message}>
                <Input {...register('subtitle')} placeholder={texts.PLACEHOLDER_SUBTITLE} />
              </FormField>
            </LayoutContainer>

            <NewsClassificationSection
              control={control}
              setValue={setValue}
              isYouth={isYouth}
              isFemale={isFemale}
            />

            <NewsCategorySlugSection
              control={control}
              register={register}
              errors={errors}
              categories={categories}
              onOpenQuickCategory={quickCat.open}
              isPublishedArticle={isPublishedArticle}
              isSlugLocked={isSlugLocked}
              onToggleSlugLock={toggleSlugLock}
            />

            <NewsEditorCoverSection
              coverImage={coverImage || null}
              coverCaption={coverCaption}
              setCoverCaption={(val) => setValue('coverCaption', val)}
              onCropSave={handleCropCover}
              onImageRemove={handleRemoveCover}
            />

            <NewsEditorGallerySection
              gallery={gallery}
              galleryPreviews={galleryPreviews}
              galleryCropItem={galleryCropItem}
              onSelectFiles={handleSelectGalleryFiles}
              onOpenCrop={handleOpenGalleryCrop}
              onCropSave={handleCropGallerySave}
              onCropCancel={handleCropGalleryCancel}
              onRemoveExisting={handleRemoveExistingGalleryPhoto}
              onRemoveNew={handleRemoveNewGalleryPhoto}
            />

            <FormField label={texts.LABEL_SUMMARY} error={errors.summary?.message}>
              <Input {...register('summary')} placeholder={texts.PLACEHOLDER_SUMMARY} />
            </FormField>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                {texts.LABEL_CONTENT} *
              </Text>
              <NewsBlockEditor
                content={content}
                onChange={(json) => setValue('content', json)}
              />
            </LayoutContainer>

            <NewsEditorTagsSection
              tags={tags}
              tagInput={tagInput}
              setTagInput={setTagInput}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />

            <NewsEditorCreditsSection
              reporterName={reporterName}
              setReporterName={(val) => setValue('reporterName', val)}
              photographerName={photographerName}
              setPhotographerName={(val) => setValue('photographerName', val)}
            />

            <FormField
              label={
                <Text as="span" className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-primary" />
                  {texts.LABEL_YOUTUBE}
                </Text>
              }
              error={errors.youtubeVideoUrl?.message}
            >
              <Input {...register('youtubeVideoUrl')} placeholder={texts.PLACEHOLDER_YOUTUBE} />
            </FormField>

            <NewsEditorFeaturedSection
              featuredSlot={featuredSlot}
              setFeaturedSlot={handleSelectFeaturedSlot}
              isPinned={isPinned}
              setIsPinned={(val) => setValue('isPinned', val)}
            />

            <NewsEditorInteractivitySection
              allowReactions={allowReactions}
              setAllowReactions={(val) => setValue('allowReactions', val)}
              allowComments={allowComments}
              setAllowComments={(val) => setValue('allowComments', val)}
              sendNewsletter={sendNewsletter}
              setSendNewsletter={(val) => setValue('sendNewsletter', val)}
              newsletterSentAt={newsletterSentAt}
            />

            <NewsScheduleSection
              control={control}
              register={register}
              errors={errors}
              status={status}
            />

            <LayoutContainer className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border mt-4">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                {texts.BUTTON_CANCEL}
              </Button>

              <LayoutContainer className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPreviewOpen(true)}
                  disabled={isSaving}
                  leftIcon={<Eye className="w-4 h-4 text-primary" />}
                  className="font-bold border-border hover:border-primary"
                >
                  {texts.BUTTON_PREVIEW}
                </Button>

                {status !== 'PUBLISHED' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSave('DRAFT')}
                    disabled={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    {texts.BUTTON_SAVE_DRAFT}
                  </Button>
                )}

                {status === 'DRAFT' ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleSave('PUBLISHED')}
                    isLoading={isSaving}
                    leftIcon={<Send className="w-4 h-4" />}
                    className="font-bold"
                  >
                    {isSaving && savingLabel ? savingLabel : texts.BUTTON_PUBLISH}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleSave()}
                    isLoading={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                    className="font-bold"
                  >
                    {isSaving && savingLabel ? savingLabel : texts.BUTTON_SAVE_CHANGES}
                  </Button>
                )}
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>
        )}
      </Drawer>

      <QuickCategoryModal
        isOpen={quickCat.isOpen}
        onClose={quickCat.close}
        form={quickCat.form}
        isLoading={quickCat.isLoading}
        onSubmit={quickCat.handleSubmit}
      />

      <NewsArticlePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        subtitle={subtitle}
        summary={summary}
        slug={slug}
        categoryName={selectedCategory?.name}
        publishedAt={publishedAt}
        reporterName={reporterName}
        photographerName={photographerName}
        coverImage={coverImage}
        coverCaption={coverCaption}
        content={content}
        gallery={gallery}
        galleryPreviews={galleryPreviews}
        youtubeVideoUrl={youtubeVideoUrl}
        tags={tags}
      />

      <ConfirmModal
        isOpen={replaceMainModalOpen}
        onClose={cancelReplaceMain}
        onConfirm={confirmReplaceMain}
        title={replaceMainTexts.TITLE}
        description={replaceMainTexts.DESC(existingMainTitle)}
        confirmText={replaceMainTexts.BUTTON_CONFIRM}
        cancelText={replaceMainTexts.BUTTON_CANCEL}
        variant="warning"
      />
    </>
  );
};
