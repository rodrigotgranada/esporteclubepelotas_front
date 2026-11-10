'use client';

import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  Sparkles,
  Calendar,
  Video,
  Send,
  Save,
  Eye,
  Lock,
  Unlock,
  Globe,
} from 'lucide-react';
import {
  Drawer,
  LayoutContainer,
  Text,
  Input,
  Select,
  Option,
  Button,
  Checkbox,
  Badge,
  Spinner,
  ConfirmModal,
  Switch,
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
  const { DRAWER: texts, STATUS_MAP, MODAL_REPLACE_MAIN: replaceMainTexts } = ADMIN_NEWS_TEXTS;

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSlugUnlocked, setIsSlugUnlocked] = useState(false);

  React.useEffect(() => {
    setIsSlugUnlocked(false);
  }, [isOpen, articleId]);

  const title = watch('title');
  const subtitle = watch('subtitle');
  const slug = watch('slug');
  const summary = watch('summary');
  const categoryId = watch('categoryId');
  const tags = watch('tags') || [];
  const coverImage = watch('coverImage');
  const coverCaption = watch('coverCaption') || '';
  const gallery = watch('gallery') || [];
  const content = watch('content') || {};
  const youtubeVideoUrl = watch('youtubeVideoUrl') || '';
  const featuredSlot = watch('featuredSlot');
  const isPinned = watch('isPinned');
  const isYouth = watch('isYouth');
  const isFemale = watch('isFemale');
  const showOnHomepage = watch('showOnHomepage');
  const reporterName = watch('reporterName') || '';
  const photographerName = watch('photographerName') || '';
  const allowReactions = watch('allowReactions');
  const allowComments = watch('allowComments');
  const status = watch('status');
  const publishedAt = watch('publishedAt') || '';

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

            {/* 1. Titulo & Subtitulo */}
            <LayoutContainer className="flex flex-col gap-4">
              <FormField
                label={`${texts.LABEL_TITLE} *`}
                error={errors.title?.message}
              >
                <Input
                  {...register('title')}
                  placeholder={texts.PLACEHOLDER_TITLE}
                />
              </FormField>

              <FormField
                label={texts.LABEL_SUBTITLE}
                error={errors.subtitle?.message}
              >
                <Input
                  {...register('subtitle')}
                  placeholder={texts.PLACEHOLDER_SUBTITLE}
                />
              </FormField>
            </LayoutContainer>

            {/* Classificação: Matéria da Categoria de Base */}
            <LayoutContainer
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-2 ${
                isYouth ? 'bg-primary/10 border-primary/40 shadow-xs' : 'bg-surface border-border'
              }`}
            >
              <LayoutContainer className="flex items-center justify-between">
                <LayoutContainer className="flex items-center gap-2">
                  <Text as="span" className="text-sm font-bold text-text-primary">
                    {texts.SWITCH_IS_YOUTH_LABEL}
                  </Text>
                  <Badge variant={isYouth ? 'primary' : 'default'} size="sm" className="font-extrabold text-[10px] uppercase">
                    {isYouth ? `🌱 ${texts.BADGE_YOUTH_ACTIVE}` : texts.BADGE_PRO_ACTIVE}
                  </Badge>
                </LayoutContainer>

                <Controller
                  control={control}
                  name="isYouth"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          setValue('isFemale', false);
                        }
                      }}
                      aria-label={texts.SWITCH_IS_YOUTH_LABEL}
                    />
                  )}
                />
              </LayoutContainer>

              <Text as="p" className="text-xs text-text-muted leading-relaxed">
                {texts.SWITCH_IS_YOUTH_DESC}
              </Text>
            </LayoutContainer>

            {/* Classificação: Matéria do Futebol Feminino (As Lobas) */}
            <LayoutContainer
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-2 ${
                isFemale ? 'bg-primary/10 border-primary/40 shadow-xs' : 'bg-surface border-border'
              }`}
            >
              <LayoutContainer className="flex items-center justify-between">
                <LayoutContainer className="flex items-center gap-2">
                  <Text as="span" className="text-sm font-bold text-text-primary">
                    {texts.SWITCH_IS_FEMALE_LABEL}
                  </Text>
                  <Badge variant={isFemale ? 'primary' : 'default'} size="sm" className="font-extrabold text-[10px] uppercase">
                    {isFemale ? `👑 ${texts.BADGE_FEMALE_ACTIVE}` : texts.BADGE_PRO_ACTIVE}
                  </Badge>
                </LayoutContainer>

                <Controller
                  control={control}
                  name="isFemale"
                  render={({ field }) => (
                    <Switch
                      checked={Boolean(field.value)}
                      onChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          setValue('isYouth', false);
                        }
                      }}
                      aria-label={texts.SWITCH_IS_FEMALE_LABEL}
                    />
                  )}
                />
              </LayoutContainer>

              <Text as="p" className="text-xs text-text-muted leading-relaxed">
                {texts.SWITCH_IS_FEMALE_DESC}
              </Text>
            </LayoutContainer>

            {/* 2. Categoria & Slug */}
            <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LayoutContainer className="flex flex-col">
                <LayoutContainer className="flex items-center justify-between mb-1">
                  <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                    {texts.LABEL_CATEGORY} *
                  </Text>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={quickCat.open}
                    className="text-xs h-6 px-1.5 text-primary hover:text-primary/80 font-bold"
                  >
                    {texts.BUTTON_QUICK_CATEGORY}
                  </Button>
                </LayoutContainer>
                <FormField
                  name="categoryId"
                  control={control}
                  error={errors.categoryId?.message}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                    >
                      {categories.map((c) => (
                        <Option key={c._id || c.slug} value={c._id || c.slug}>
                          {c.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </LayoutContainer>

              <LayoutContainer className="flex flex-col">
                <LayoutContainer className="flex items-center justify-between mb-1">
                  <LayoutContainer className="flex items-center gap-1.5">
                    <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                      {texts.LABEL_SLUG}
                    </Text>
                    {isPublishedArticle && (
                      <Badge variant={isSlugLocked ? 'default' : 'warning'} size="sm">
                        {isSlugLocked ? (
                          <Text as="span" className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {texts.SLUG_LOCKED_BADGE}
                          </Text>
                        ) : (
                          <Text as="span" className="flex items-center gap-1">
                            <Unlock className="w-3 h-3" />
                            {texts.SLUG_UNLOCKED_BADGE}
                          </Text>
                        )}
                      </Badge>
                    )}
                  </LayoutContainer>
                  {isPublishedArticle && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSlugUnlocked(!isSlugUnlocked)}
                      className="text-xs h-7 px-2"
                    >
                      {isSlugLocked ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 mr-1 text-primary" />
                          <Text as="span" className="text-primary">{texts.SLUG_UNLOCK_BTN}</Text>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 mr-1 text-text-secondary" />
                          <Text as="span">{texts.SLUG_LOCK_BTN}</Text>
                        </>
                      )}
                    </Button>
                  )}
                </LayoutContainer>
                <FormField
                  error={errors.slug?.message}
                  description={
                    isSlugLocked
                      ? texts.SLUG_LOCKED_HINT
                      : isPublishedArticle
                        ? texts.SLUG_UNLOCKED_WARNING
                        : texts.SLUG_HINT
                  }
                >
                  <Input
                    {...register('slug')}
                    placeholder={texts.PLACEHOLDER_SLUG}
                    disabled={isSlugLocked}
                    className={isSlugLocked ? 'opacity-70 bg-surface-hover cursor-not-allowed' : ''}
                  />
                </FormField>
              </LayoutContainer>
            </LayoutContainer>

            {/* 3. Imagem de Capa 16:9 com Crop & Legenda */}
            <NewsEditorCoverSection
              coverImage={coverImage || null}
              coverCaption={coverCaption}
              setCoverCaption={(val) => setValue('coverCaption', val)}
              onCropSave={handleCropCover}
              onImageRemove={handleRemoveCover}
            />

            {/* 4. Galeria de Fotos da Matéria */}
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

            {/* 5. Resumo / SEO Preview */}
            <FormField
              label={texts.LABEL_SUMMARY}
              error={errors.summary?.message}
            >
              <Input
                {...register('summary')}
                placeholder={texts.PLACEHOLDER_SUMMARY}
              />
            </FormField>

            {/* 6. Tiptap Block Editor (Conteúdo) */}
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                {texts.LABEL_CONTENT} *
              </Text>
              <NewsBlockEditor
                content={content}
                onChange={(json) => setValue('content', json)}
              />
            </LayoutContainer>

            {/* 7. Tags */}
            <NewsEditorTagsSection
              tags={tags}
              tagInput={tagInput}
              setTagInput={setTagInput}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />

            {/* 8. Créditos Editoriais */}
            <NewsEditorCreditsSection
              reporterName={reporterName}
              setReporterName={(val) => setValue('reporterName', val)}
              photographerName={photographerName}
              setPhotographerName={(val) => setValue('photographerName', val)}
            />

            {/* 9. Video do YouTube */}
            <FormField
              label={
                <Text as="span" className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-primary" />
                  {texts.LABEL_YOUTUBE}
                </Text>
              }
              error={errors.youtubeVideoUrl?.message}
            >
              <Input
                {...register('youtubeVideoUrl')}
                placeholder={texts.PLACEHOLDER_YOUTUBE}
              />
            </FormField>

            {/* 10. Vitrine Editorial & Destaques da Capa */}
            <NewsEditorFeaturedSection
              featuredSlot={featuredSlot}
              setFeaturedSlot={handleSelectFeaturedSlot}
              isPinned={isPinned}
              setIsPinned={(val) => setValue('isPinned', val)}
            />

            {/* Distribuição & Exibição da Matéria (Categoria de Base ou Futebol Feminino) */}
            {(isYouth || isFemale) && (
              <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-3 animate-in fade-in duration-200">
                <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-primary" />
                  {texts.LABEL_DISTRIBUTION_SECTION}
                </Text>

                <Controller
                  control={control}
                  name="showOnHomepage"
                  render={({ field }) => (
                    <Checkbox
                      label={texts.LABEL_SHOW_ON_HOMEPAGE}
                      description={texts.SHOW_ON_HOMEPAGE_HINT}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />

                <LayoutContainer className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-text-secondary mt-1">
                  {isYouth ? texts.YOUTH_CATEGORY_NOTICE : texts.FEMALE_CATEGORY_NOTICE}
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* 11. Interatividade com a Torcida */}
            <NewsEditorInteractivitySection
              allowReactions={allowReactions}
              setAllowReactions={(val) => setValue('allowReactions', val)}
              allowComments={allowComments}
              setAllowComments={(val) => setValue('allowComments', val)}
            />

            {/* 12. Status & Agendamento */}
            <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-surface">
              <FormField
                label={texts.LABEL_STATUS}
                name="status"
                control={control}
                error={errors.status?.message}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value as any)}
                    className="w-full"
                  >
                    <Option value="DRAFT">{STATUS_MAP.DRAFT}</Option>
                    <Option value="PUBLISHED">{STATUS_MAP.PUBLISHED}</Option>
                    <Option value="SCHEDULED">{STATUS_MAP.SCHEDULED}</Option>
                    <Option value="ARCHIVED">{STATUS_MAP.ARCHIVED}</Option>
                  </Select>
                )}
              />

              {status === 'SCHEDULED' && (
                <FormField
                  label={
                    <Text as="span" className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {texts.LABEL_PUBLISHED_AT}
                    </Text>
                  }
                  error={errors.publishedAt?.message}
                >
                  <Input
                    type="datetime-local"
                    {...register('publishedAt')}
                  />
                </FormField>
              )}
            </LayoutContainer>

            {/* 13. Botoes de Acao do Footer */}
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
