'use client';

import React from 'react';
import Image from 'next/image';
import {
  X,
  Plus,
  Sparkles,
  Calendar,
  Video,
  Send,
  Save,
  Images,
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
    handleSelectGalleryFiles,
    handleRemoveExistingGalleryPhoto,
    handleRemoveNewGalleryPhoto,
    content,
    setContent,
    youtubeVideoUrl,
    setYoutubeVideoUrl,
    isFeatured,
    setIsFeatured,
    status,
    setStatus,
    publishedAt,
    setPublishedAt,
    handleCategoryCreated,
    handleSave,
  } = useAdminNewsDrawer(articleId, isOpen, onSaveSuccess);

  const quickCat = useQuickCategoryModal(handleCategoryCreated);

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
                <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  {texts.LABEL_SLUG}
                </Text>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={texts.PLACEHOLDER_SLUG}
                />
                <Text as="span" className="text-[11px] text-text-secondary">
                  {texts.SLUG_HINT}
                </Text>
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
            <LayoutContainer className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface shadow-xs">
              <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <LayoutContainer className="flex flex-col">
                  <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Images className="w-4 h-4 text-primary" />
                    {texts.LABEL_GALLERY}
                    {(gallery.length > 0 || galleryPreviews.length > 0) && (
                      <Badge variant="default" size="sm" className="text-[10px] py-0 px-1.5 font-bold">
                        {gallery.length + galleryPreviews.length}
                      </Badge>
                    )}
                  </Text>
                  <Text as="span" className="text-[11px] text-text-secondary">
                    {texts.LABEL_GALLERY_HINT}
                  </Text>
                </LayoutContainer>

                <label className="cursor-pointer self-start sm:self-auto">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleSelectGalleryFiles(e.target.files);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="text-xs pointer-events-none"
                  >
                    {texts.BUTTON_ADD_GALLERY_PHOTOS}
                  </Button>
                </label>
              </LayoutContainer>

              {/* Gallery Photos Grid (Saved + Previews) */}
              {gallery.length > 0 || galleryPreviews.length > 0 ? (
                <LayoutContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {/* Salvas no banco */}
                  {gallery.map((url, idx) => (
                    <LayoutContainer
                      key={`exist-${idx}`}
                      className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-drawer"
                    >
                      <Image
                        src={url}
                        alt={`Foto galeria ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingGalleryPhoto(url)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-error text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                        title="Remover foto da galeria"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </LayoutContainer>
                  ))}

                  {/* Novas fotos na fila */}
                  {galleryPreviews.map((previewUrl, idx) => (
                    <LayoutContainer
                      key={`preview-${idx}`}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/50 group bg-drawer shadow-xs"
                    >
                      <Image
                        src={previewUrl}
                        alt={`Nova foto ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover"
                      />
                      <Badge
                        variant="primary"
                        size="sm"
                        className="absolute bottom-1.5 left-1.5 text-[9px] py-0 px-1 font-bold shadow-xs"
                      >
                        Novo
                      </Badge>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewGalleryPhoto(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-error text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                        title="Remover foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </LayoutContainer>
                  ))}
                </LayoutContainer>
              ) : (
                <LayoutContainer className="p-4 border border-dashed border-border rounded-xl text-center bg-background/40 flex flex-col items-center justify-center gap-1.5">
                  <Images className="w-6 h-6 text-text-secondary/40" />
                  <Text className="text-xs text-text-secondary">
                    Nenhuma foto adicionada à galeria ainda.
                  </Text>
                </LayoutContainer>
              )}
            </LayoutContainer>

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

            {/* 7. Video do YouTube */}
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-4 h-4 text-error" />
                {texts.LABEL_YOUTUBE}
              </Text>
              <Input
                value={youtubeVideoUrl}
                onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                placeholder={texts.PLACEHOLDER_YOUTUBE}
              />
            </LayoutContainer>

            {/* 8. Destacar como Manchetão */}
            <LayoutContainer className="p-4 rounded-xl border border-primary/30 bg-primary/5">
              <Checkbox
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                label={
                  <span className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {texts.LABEL_FEATURED}
                  </span>
                }
                description={texts.LABEL_FEATURED_HINT}
              />
            </LayoutContainer>

            {/* 9. Status & Agendamento */}
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
    </>
  );
};
