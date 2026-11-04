'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Calendar,
  Video,
  Send,
  Save,
  Eye,
  Lock,
  Unlock,
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
} from '@/shared/ui/components';
import { ImageCropper } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { useAdminNewsDrawer } from '../../../hooks/news/useAdminNewsDrawer';
import { NewsBlockEditor } from './NewsBlockEditor';
import { QuickCategoryModal } from './QuickCategoryModal';
import { useQuickCategoryModal } from '../../../hooks/news/useQuickCategoryModal';
import { NewsEditorGallerySection } from './NewsEditorGallerySection';
import { NewsArticlePreviewModal } from './NewsArticlePreviewModal';
import { NewsEditorFeaturedSection } from './NewsEditorFeaturedSection';
import { NewsEditorCreditsSection } from './NewsEditorCreditsSection';

export interface NewsEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string | null;
  onSaveSuccess: () => void;
}

export const NewsEditorDrawer: React.FC<NewsEditorDrawerProps> = ({
  isOpen,
  onClose,
  articleId,
  onSaveSuccess,
}) => {
  const { DRAWER: texts, STATUS_MAP } = ADMIN_NEWS_TEXTS;

  const {
    isLoading,
    isSaving,
    categories,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    slug,
    setSlug,
    summary,
    setSummary,
    categoryId,
    setCategoryId,
    tags,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    coverImage,
    coverCaption,
    setCoverCaption,
    handleCropCover,
    handleRemoveCover,
    gallery,
    galleryPreviews,
    galleryCropItem,
    handleSelectGalleryFiles,
    handleOpenGalleryCrop,
    handleCropGallerySave,
    handleCropGalleryCancel,
    handleRemoveExistingGalleryPhoto,
    handleRemoveNewGalleryPhoto,
    content,
    setContent,
    youtubeVideoUrl,
    setYoutubeVideoUrl,
    featuredSlot,
    setFeaturedSlot,
    isPinned,
    setIsPinned,
    reporterName,
    setReporterName,
    photographerName,
    setPhotographerName,
    status,
    setStatus,
    publishedAt,
    setPublishedAt,
    handleCategoryCreated,
    hasRecoverableDraft,
    recoverDraft,
    discardDraft,
    handleSave,
  } = useAdminNewsDrawer(articleId, isOpen, onSaveSuccess);

  const quickCat = useQuickCategoryModal(handleCategoryCreated);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSlugUnlocked, setIsSlugUnlocked] = useState(false);

  React.useEffect(() => {
    setIsSlugUnlocked(false);
  }, [isOpen, articleId]);

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
              Carregando dados da matéria...
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-6 pb-8">
            {/* Aviso de Rascunho Recuperado do LocalStorage */}
            {hasRecoverableDraft && !articleId && (
              <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-primary/40 bg-primary/10 shadow-sm animate-in fade-in duration-300">
                <LayoutContainer className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <Text as="span" className="text-xs font-semibold text-text-primary">
                    {texts.AUTOSAVE_NOTICE}
                  </Text>
                </LayoutContainer>
                <LayoutContainer className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={recoverDraft}
                    className="text-xs font-bold h-7 px-3"
                  >
                    {texts.AUTOSAVE_RECOVER_BTN}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={discardDraft}
                    className="text-xs h-7 px-2 text-text-secondary hover:text-text-primary"
                  >
                    {texts.AUTOSAVE_DISCARD_BTN}
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* 1. Titulo & Subtitulo */}
            <LayoutContainer className="flex flex-col gap-4">
              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  {texts.LABEL_TITLE} *
                </Text>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={texts.PLACEHOLDER_TITLE}
                  required
                />
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  {texts.LABEL_SUBTITLE}
                </Text>
                <Input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder={texts.PLACEHOLDER_SUBTITLE}
                />
              </LayoutContainer>
            </LayoutContainer>

            {/* 2. Categoria & Nova Categoria & Slug */}
            <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categoria */}
              <LayoutContainer className="flex flex-col gap-1.5">
                <LayoutContainer className="flex items-center justify-between">
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
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.map((c) => (
                    <Option key={c._id || c.slug} value={c._id || c.slug}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </LayoutContainer>

              {/* Slug Customizado (Opcional) */}
              <LayoutContainer className="flex flex-col gap-1.5">
                <LayoutContainer className="flex items-center justify-between">
                  <LayoutContainer className="flex items-center gap-1.5">
                    <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                      {texts.LABEL_SLUG}
                    </Text>
                    {isPublishedArticle && (
                      <Badge variant={isSlugLocked ? 'default' : 'warning'} size="sm">
                        {isSlugLocked ? (
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {texts.SLUG_LOCKED_BADGE}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Unlock className="w-3 h-3" />
                            {texts.SLUG_UNLOCKED_BADGE}
                          </span>
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
                          <span className="text-primary">{texts.SLUG_UNLOCK_BTN}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 mr-1 text-text-secondary" />
                          <span>{texts.SLUG_LOCK_BTN}</span>
                        </>
                      )}
                    </Button>
                  )}
                </LayoutContainer>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={texts.PLACEHOLDER_SLUG}
                  disabled={isSlugLocked}
                  className={isSlugLocked ? 'opacity-70 bg-surface-hover cursor-not-allowed' : ''}
                />
                {isSlugLocked ? (
                  <Text as="span" className="text-[11px] text-text-secondary">
                    {texts.SLUG_LOCKED_HINT}
                  </Text>
                ) : isPublishedArticle ? (
                  <Text as="span" className="text-[11px] text-amber-500 font-medium">
                    {texts.SLUG_UNLOCKED_WARNING}
                  </Text>
                ) : (
                  <Text as="span" className="text-[11px] text-text-secondary">
                    {texts.SLUG_HINT}
                  </Text>
                )}
              </LayoutContainer>
            </LayoutContainer>

            {/* 3. Imagem de Capa 16:9 com Crop & Legenda */}
            <LayoutContainer className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface shadow-xs">
              <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                {texts.LABEL_COVER_IMAGE}
              </Text>

              <ImageCropper
                shape="rect"
                aspect={16 / 9}
                initialImage={coverImage}
                onCropSave={handleCropCover}
                onImageRemove={handleRemoveCover}
                placeholderLabel="Clique para carregar e recortar capa em 16:9"
                className="w-full"
              />

              <LayoutContainer className="flex flex-col gap-1.5 mt-2">
                <Text as="span" className="text-xs font-semibold text-text-secondary">
                  {texts.LABEL_COVER_CAPTION}
                </Text>
                <Input
                  value={coverCaption}
                  onChange={(e) => setCoverCaption(e.target.value)}
                  placeholder={texts.PLACEHOLDER_COVER_CAPTION}
                />
              </LayoutContainer>
            </LayoutContainer>

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
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                {texts.LABEL_SUMMARY}
              </Text>
              <Input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={texts.PLACEHOLDER_SUMMARY}
              />
            </LayoutContainer>

            {/* 5. Tiptap Block Editor (Conteúdo) */}
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                {texts.LABEL_CONTENT} *
              </Text>
              <NewsBlockEditor
                content={content}
                onChange={(json) => setContent(json)}
              />
            </LayoutContainer>

            {/* 6. Tags com Enter e chips */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                {texts.LABEL_TAGS}
              </Text>
              <LayoutContainer className="flex items-center gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder={texts.PLACEHOLDER_TAGS}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  {texts.BUTTON_ADD_TAG}
                </Button>
              </LayoutContainer>

              {tags.length > 0 && (
                <LayoutContainer className="flex flex-wrap items-center gap-1.5 pt-1">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-1 pl-2.5 pr-1 py-1"
                    >
                      <span>#{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTag(tag)}
                        className="p-0.5 h-auto hover:bg-black/10 rounded-full"
                        aria-label={`Remover tag ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </LayoutContainer>
              )}
            </LayoutContainer>

            {/* 7. Créditos Editoriais Livres (Repórter / Fotógrafo) */}
            <NewsEditorCreditsSection
              reporterName={reporterName}
              setReporterName={setReporterName}
              photographerName={photographerName}
              setPhotographerName={setPhotographerName}
            />

            {/* 8. Video do YouTube */}
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-4 h-4 text-primary" />
                {texts.LABEL_YOUTUBE}
              </Text>
              <Input
                value={youtubeVideoUrl}
                onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                placeholder={texts.PLACEHOLDER_YOUTUBE}
              />
            </LayoutContainer>

            {/* 9. Vitrine Editorial & Destaques da Capa */}
            <NewsEditorFeaturedSection
              featuredSlot={featuredSlot}
              setFeaturedSlot={setFeaturedSlot}
              isPinned={isPinned}
              setIsPinned={setIsPinned}
            />

            {/* 10. Status & Agendamento */}
            <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-surface">
              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  {texts.LABEL_STATUS}
                </Text>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <Option value="DRAFT">{STATUS_MAP.DRAFT}</Option>
                  <Option value="PUBLISHED">{STATUS_MAP.PUBLISHED}</Option>
                  <Option value="SCHEDULED">{STATUS_MAP.SCHEDULED}</Option>
                  <Option value="ARCHIVED">{STATUS_MAP.ARCHIVED}</Option>
                </Select>
              </LayoutContainer>

              {status === 'SCHEDULED' && (
                <LayoutContainer className="flex flex-col gap-1.5">
                  <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {texts.LABEL_PUBLISHED_AT}
                  </Text>
                  <Input
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    required
                  />
                </LayoutContainer>
              )}
            </LayoutContainer>

            {/* 10. Botoes de Acao do Footer */}
            <LayoutContainer className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSaving}
              >
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
                    {texts.BUTTON_PUBLISH}
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
                    {texts.BUTTON_SAVE_CHANGES}
                  </Button>
                )}
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>
        )}
      </Drawer>

      {/* Modal Quick Category */}
      <QuickCategoryModal
        isOpen={quickCat.isOpen}
        onClose={quickCat.close}
        name={quickCat.name}
        setName={quickCat.setName}
        description={quickCat.description}
        setDescription={quickCat.setDescription}
        isLoading={quickCat.isLoading}
        onSubmit={quickCat.handleSubmit}
      />

      {/* Modal Preview da Matéria (Desktop & Mobile) */}
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
    </>
  );
};
