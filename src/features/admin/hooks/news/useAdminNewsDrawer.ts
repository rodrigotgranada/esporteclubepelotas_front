'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  adminNewsService,
  NewsArticleData,
  NewsCategoryData,
  NewsStatusType,
} from '../../services/admin-news.service';
import { ADMIN_NEWS_TEXTS } from '../../constants/admin-news.constants';

export const useAdminNewsDrawer = (
  articleId: string | null,
  isOpen: boolean,
  onSuccess: () => void,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<NewsCategoryData[]>([]);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<Blob | null>(null);
  const [coverCaption, setCoverCaption] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryCropItem, setGalleryCropItem] = useState<{
    type: 'new' | 'existing';
    index: number;
    src: string;
  } | null>(null);
  const [content, setContent] = useState<Record<string, any>>({});
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredSlot, setFeaturedSlot] = useState<'MAIN' | 'SECONDARY' | 'NONE'>('NONE');
  const [replaceMainModalOpen, setReplaceMainModalOpen] = useState(false);
  const [existingMainTitle, setExistingMainTitle] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isYouth, setIsYouth] = useState(false);
  const [showOnHomepage, setShowOnHomepage] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [photographerName, setPhotographerName] = useState('');
  const [allowReactions, setAllowReactions] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [status, setStatus] = useState<NewsStatusType>('DRAFT');
  const [publishedAt, setPublishedAt] = useState('');
  const [hasRecoverableDraft, setHasRecoverableDraft] = useState(false);
  const AUTOSAVE_KEY = 'ecp_news_draft_autosave';

  // Quick category modal inside drawer
  const [quickCategoryOpen, setQuickCategoryOpen] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await adminNewsService.getCategories();
      setCategories(data);
      if (data.length > 0 && !categoryId) {
        setCategoryId(data[0]._id || data[0].slug);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  // Verifica se há rascunho recuperável no localStorage ao abrir para criar nova matéria
  useEffect(() => {
    if (isOpen && !articleId && typeof window !== 'undefined') {
      try {
        const savedStr = localStorage.getItem(AUTOSAVE_KEY);
        if (savedStr) {
          const parsed = JSON.parse(savedStr);
          if (parsed && (parsed.title || (parsed.content && Object.keys(parsed.content).length > 0))) {
            setHasRecoverableDraft(true);
          }
        }
      } catch (err) {
        console.error('Error checking autosave draft', err);
      }
    } else {
      setHasRecoverableDraft(false);
    }
  }, [isOpen, articleId]);

  // Autosave contínuo para localStorage durante a digitação
  useEffect(() => {
    if (!isOpen || articleId || typeof window === 'undefined') return;

    if (!title && (!content || Object.keys(content).length === 0)) return;

    const timeout = setTimeout(() => {
      try {
        const draftData = {
          title,
          subtitle,
          slug,
          summary,
          categoryId,
          tags,
          content,
          reporterName,
          photographerName,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draftData));
      } catch (err) {
        console.error('Error saving draft locally', err);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [title, subtitle, slug, summary, categoryId, tags, content, reporterName, photographerName, isOpen, articleId]);

  const recoverDraft = () => {
    if (typeof window === 'undefined') return;
    try {
      const savedStr = localStorage.getItem(AUTOSAVE_KEY);
      if (savedStr) {
        const d = JSON.parse(savedStr);
        if (d.title) setTitle(d.title);
        if (d.subtitle) setSubtitle(d.subtitle);
        if (d.slug) setSlug(d.slug);
        if (d.summary) setSummary(d.summary);
        if (d.categoryId) setCategoryId(d.categoryId);
        if (d.tags) setTags(d.tags);
        if (d.content) setContent(d.content);
        if (d.reporterName) setReporterName(d.reporterName);
        if (d.photographerName) setPhotographerName(d.photographerName);
        if (typeof d.isYouth === "boolean") setIsYouth(d.isYouth);
        setHasRecoverableDraft(false);
        toast.success('Rascunho recuperado com sucesso!');
      }
    } catch (err) {
      console.error('Failed to recover draft', err);
    }
  };

  const discardDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTOSAVE_KEY);
    }
    setHasRecoverableDraft(false);
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setSlug('');
    setSummary('');
    setCategoryId(categories[0]?._id || '');
    setTags([]);
    setTagInput('');
    setCoverImage(null);
    setCoverFile(null);
    setCoverCaption('');
    setGallery([]);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setGalleryCropItem(null);
    setContent({});
    setYoutubeVideoUrl('');
    setIsFeatured(false);
    setFeaturedSlot('NONE');
    setIsPinned(false);
    setIsYouth(false);
    setShowOnHomepage(true);
    setReporterName('');
    setPhotographerName('');
    setAllowReactions(true);
    setAllowComments(true);
    setStatus('DRAFT');
    setPublishedAt('');
  };

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (articleId) {
        // Load existing article
        setIsLoading(true);
        adminNewsService
          .getNewsById(articleId)
          .then((art) => {
            setTitle(art.title || '');
            setSubtitle(art.subtitle || '');
            setSlug(art.slug || '');
            setSummary(art.summary || '');
            const catId = typeof art.category === 'object' && art.category ? art.category._id : art.category;
            setCategoryId(catId || '');
            setTags(art.tags || []);
            setCoverImage(art.coverImage || null);
            setCoverFile(null);
            setCoverCaption(art.coverCaption || '');
            setGallery(art.gallery || []);
            setGalleryFiles([]);
            setGalleryPreviews([]);
            setContent(art.content || {});
            setYoutubeVideoUrl(art.youtubeVideoUrl || '');
            setIsFeatured(!!art.isFeatured);
            setFeaturedSlot(art.featuredSlot || (art.isFeatured ? 'MAIN' : 'NONE'));
            setIsPinned(Boolean(art.isPinned));
            setIsYouth(Boolean(art.isYouth));
            setShowOnHomepage(art.showOnHomepage ?? true);
            setReporterName(art.reporterName || '');
            setPhotographerName(art.photographerName || '');
            setAllowReactions(art.allowReactions ?? true);
            setAllowComments(art.allowComments ?? true);
            setStatus(art.status || 'DRAFT');
            if (art.publishedAt) {
              // format to datetime-local input YYYY-MM-DDTHH:mm
              const d = new Date(art.publishedAt);
              setPublishedAt(d.toISOString().slice(0, 16));
            } else {
              setPublishedAt('');
            }
          })
          .catch((err) => {
            console.error('Failed to load article', err);
            toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        resetForm();
      }
    }
  }, [isOpen, articleId]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCropCover = (croppedBlob: Blob) => {
    setCoverFile(croppedBlob);
    setCoverImage(URL.createObjectURL(croppedBlob));
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverImage(null);
  };

  const handleSelectGalleryFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    const newPreviews = fileArray.map((f) => URL.createObjectURL(f));
    const startIndex = galleryFiles.length;
    setGalleryFiles((prev) => [...prev, ...fileArray]);
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);

    // If 1 photo is selected, open crop modal immediately for precision editing
    if (fileArray.length === 1) {
      setGalleryCropItem({
        type: 'new',
        index: startIndex,
        src: newPreviews[0],
      });
    }
  };

  const handleOpenGalleryCrop = (type: 'new' | 'existing', index: number, src: string) => {
    setGalleryCropItem({ type, index, src });
  };

  const handleCropGallerySave = (croppedBlob: Blob) => {
    if (!galleryCropItem) return;

    const newUrl = URL.createObjectURL(croppedBlob);
    const fileName = `gallery-${Date.now()}.png`;
    const newFile = new File([croppedBlob], fileName, {
      type: croppedBlob.type || 'image/png',
    });

    if (galleryCropItem.type === 'new') {
      const idx = galleryCropItem.index;
      setGalleryFiles((prev) => {
        const updated = [...prev];
        updated[idx] = newFile;
        return updated;
      });
      setGalleryPreviews((prev) => {
        const updated = [...prev];
        if (updated[idx]) URL.revokeObjectURL(updated[idx]);
        updated[idx] = newUrl;
        return updated;
      });
    } else {
      // Existing photo: remove from saved URLs and add to new files queue ready to upload
      const idx = galleryCropItem.index;
      setGallery((prev) => prev.filter((_, i) => i !== idx));
      setGalleryFiles((prev) => [...prev, newFile]);
      setGalleryPreviews((prev) => [...prev, newUrl]);
    }

    setGalleryCropItem(null);
    toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_GALLERY_PHOTO_CROPPED);
  };

  const handleCropGalleryCancel = () => {
    setGalleryCropItem(null);
  };

  const handleRemoveExistingGalleryPhoto = (urlToRemove: string) => {
    setGallery((prev) => prev.filter((u) => u !== urlToRemove));
  };

  const handleRemoveNewGalleryPhoto = (indexToRemove: number) => {
    setGalleryFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setGalleryPreviews((prev) => {
      const targetUrl = prev[indexToRemove];
      if (targetUrl) URL.revokeObjectURL(targetUrl);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const handleCategoryCreated = (newCat: NewsCategoryData) => {
    setCategories((prev) => [...prev, newCat]);
    setCategoryId(newCat._id || newCat.slug);
  };

  const handleSave = async (overrideStatus?: NewsStatusType) => {
    const chosenStatus = overrideStatus || status;

    if (!title.trim()) {
      toast.error('Informe o título da matéria.');
      return;
    }
    if (!categoryId) {
      toast.error('Selecione uma categoria.');
      return;
    }
    if (!content || Object.keys(content).length === 0) {
      toast.error('O conteúdo da notícia não pode estar vazio.');
      return;
    }

    try {
      setIsSaving(true);
      const payload: Partial<NewsArticleData> = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        slug: slug.trim() || undefined,
        summary: summary.trim() || undefined,
        category: categoryId,
        tags,
        coverImage: coverImage || '',
        coverCaption: coverCaption.trim() || undefined,
        gallery,
        content,
        youtubeVideoUrl: youtubeVideoUrl.trim() || undefined,
        isFeatured: featuredSlot !== 'NONE',
        featuredSlot,
        isPinned,
        showOnHomepage,
        reporterName: reporterName.trim() || undefined,
        photographerName: photographerName.trim() || undefined,
        allowReactions,
        allowComments,
        status: chosenStatus,
        publishedAt:
          chosenStatus === 'SCHEDULED' && publishedAt
            ? new Date(publishedAt).toISOString()
            : chosenStatus === 'PUBLISHED'
            ? new Date().toISOString()
            : undefined,
      };

      let savedArticleId = articleId;

      if (articleId) {
        await adminNewsService.updateNews(articleId, payload);
        toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_UPDATE);
      } else {
        const created = await adminNewsService.createNews(payload);
        savedArticleId = created._id || created.id || '';
        toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_CREATE);
      }

      // If user uploaded a new cover image binary, upload it to the dedicated endpoint
      if (coverFile && savedArticleId) {
        try {
          const fileToUpload = new File(
            [coverFile],
            `cover-${Date.now()}.png`,
            { type: coverFile.type || 'image/png' }
          );
          await adminNewsService.uploadCover(savedArticleId, fileToUpload);
        } catch (uploadErr) {
          console.error('Failed to upload cover file', uploadErr);
        }
      }

      // If user uploaded new gallery photos, upload them
      if (galleryFiles.length > 0 && savedArticleId) {
        try {
          await adminNewsService.uploadGallery(savedArticleId, galleryFiles);
          toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_GALLERY_UPLOADED);
        } catch (galleryErr) {
          console.error('Failed to upload gallery photos', galleryErr);
        }
      }

      discardDraft();
      onSuccess();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC;
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectFeaturedSlot = async (slot: 'MAIN' | 'SECONDARY' | 'NONE') => {
    if (slot === 'MAIN' && featuredSlot !== 'MAIN') {
      try {
        const currentMain = await adminNewsService.getCurrentMain();
        if (currentMain && currentMain._id !== articleId && currentMain.id !== articleId) {
          setExistingMainTitle(currentMain.title);
          setReplaceMainModalOpen(true);
          return;
        }
      } catch (err) {
        console.error('Failed to check current main article', err);
      }
    }
    setFeaturedSlot(slot);
    setIsFeatured(slot !== 'NONE');
  };

  const confirmReplaceMain = () => {
    setFeaturedSlot('MAIN');
    setIsFeatured(true);
    setReplaceMainModalOpen(false);
  };

  const cancelReplaceMain = () => {
    setReplaceMainModalOpen(false);
  };

  return {
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
    isFeatured,
    setIsFeatured,
    featuredSlot,
    setFeaturedSlot,
    handleSelectFeaturedSlot,
    replaceMainModalOpen,
    existingMainTitle,
    confirmReplaceMain,
    cancelReplaceMain,
    isPinned,
    setIsPinned,
    isYouth,
    setIsYouth,
    showOnHomepage,
    setShowOnHomepage,
    reporterName,
    setReporterName,
    photographerName,
    setPhotographerName,
    allowReactions,
    setAllowReactions,
    allowComments,
    setAllowComments,
    status,
    setStatus,
    publishedAt,
    setPublishedAt,
    quickCategoryOpen,
    setQuickCategoryOpen,
    handleCategoryCreated,
    hasRecoverableDraft,
    recoverDraft,
    discardDraft,
    handleSave,
  };
};

