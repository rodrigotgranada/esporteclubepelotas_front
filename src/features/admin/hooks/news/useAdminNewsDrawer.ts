'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  useTransactionalSave,
  stripBlobUrl,
  sanitizeMediaUrlList,
  verifyUploadedUrl,
} from '@/shared/hooks';
import {
  adminNewsService,
  NewsArticleData,
  NewsCategoryData,
  NewsStatusType,
} from '../../services/admin-news.service';
import { ADMIN_NEWS_TEXTS } from '../../constants/admin-news.constants';
import { newsArticleSchema, NewsArticleFormData } from '../../schemas/news/news.schema';

const AUTOSAVE_KEY = 'ecp_news_draft_autosave';

const defaultNewsValues: NewsArticleFormData = {
  title: '',
  subtitle: '',
  slug: '',
  summary: '',
  categoryId: '',
  tags: [],
  coverImage: null,
  coverCaption: '',
  gallery: [],
  content: {},
  youtubeVideoUrl: '',
  isFeatured: false,
  featuredSlot: 'NONE',
  isPinned: false,
  isYouth: false,
  isFemale: false,
  showOnHomepage: true,
  reporterName: '',
  photographerName: '',
  allowReactions: true,
  allowComments: true,
  status: 'DRAFT',
  publishedAt: '',
};

export const useAdminNewsDrawer = (
  articleId: string | null,
  isOpen: boolean,
  onSuccess: () => void,
  defaultIsYouth: boolean = false,
  defaultIsFemale: boolean = false,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<NewsCategoryData[]>([]);

  const { isSaving, savingStage, savingLabel, runTransactionalSave } = useTransactionalSave({
    uploadingMedia: ADMIN_NEWS_TEXTS.DRAWER.BUTTON_UPLOADING_MEDIA,
    savingDb: ADMIN_NEWS_TEXTS.DRAWER.BUTTON_SAVING_DB,
  });

  const form = useForm<NewsArticleFormData>({
    resolver: zodResolver(newsArticleSchema),
    defaultValues: {
      ...defaultNewsValues,
      isYouth: defaultIsYouth,
      isFemale: defaultIsFemale,
      showOnHomepage: !(defaultIsYouth || defaultIsFemale),
    },
  });

  // Media & aux states
  const [tagInput, setTagInput] = useState('');
  const [coverFile, setCoverFile] = useState<Blob | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryCropItem, setGalleryCropItem] = useState<{
    type: 'new' | 'existing';
    index: number;
    src: string;
  } | null>(null);

  // Modals & draft alerts
  const [replaceMainModalOpen, setReplaceMainModalOpen] = useState(false);
  const [existingMainTitle, setExistingMainTitle] = useState('');
  const [hasRecoverableDraft, setHasRecoverableDraft] = useState(false);
  const [quickCategoryOpen, setQuickCategoryOpen] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const data = await adminNewsService.getCategories();
      setCategories(data);
      if (data.length > 0 && !form.getValues('categoryId')) {
        form.setValue('categoryId', data[0]._id || data[0].slug);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  }, [form]);

  // LocalStorage autosave check
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

  // LocalStorage autosave timer
  useEffect(() => {
    if (!isOpen || articleId || typeof window === 'undefined') return;

    const subscription = form.watch((values) => {
      if (!values.title && (!values.content || Object.keys(values.content).length === 0)) return;

      const timeout = setTimeout(() => {
        try {
          localStorage.setItem(
            AUTOSAVE_KEY,
            JSON.stringify({
              ...values,
              savedAt: new Date().toISOString(),
            }),
          );
        } catch (err) {
          console.error('Error saving draft locally', err);
        }
      }, 2000);

      return () => clearTimeout(timeout);
    });

    return () => subscription.unsubscribe();
  }, [isOpen, articleId, form]);

  const recoverDraft = () => {
    if (typeof window === 'undefined') return;
    try {
      const savedStr = localStorage.getItem(AUTOSAVE_KEY);
      if (!savedStr) return;
      const d = JSON.parse(savedStr);
      form.reset({
        ...defaultNewsValues,
        ...d,
      });
      setHasRecoverableDraft(false);
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

  const resetForm = useCallback(() => {
    form.reset({
      ...defaultNewsValues,
      isYouth: defaultIsYouth,
      isFemale: defaultIsFemale,
      showOnHomepage: !(defaultIsYouth || defaultIsFemale),
      categoryId: categories[0]?._id || '',
    });
    setCoverFile(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setGalleryCropItem(null);
    setTagInput('');
  }, [form, defaultIsYouth, defaultIsFemale, categories]);

  useEffect(() => {
    if (!isOpen) return;
    loadCategories();
    if (!articleId) {
      resetForm();
      return;
    }

    setIsLoading(true);
    adminNewsService
      .getNewsById(articleId)
      .then((art) => {
        const catId = typeof art.category === 'object' && art.category ? art.category._id : art.category;
        form.reset({
          title: art.title || '',
          subtitle: art.subtitle || '',
          slug: art.slug || '',
          summary: art.summary || '',
          categoryId: catId || '',
          tags: art.tags || [],
          coverImage: art.coverImage || null,
          coverCaption: art.coverCaption || '',
          gallery: art.gallery || [],
          content: art.content || {},
          youtubeVideoUrl: art.youtubeVideoUrl || '',
          isFeatured: !!art.isFeatured,
          featuredSlot: art.featuredSlot || (art.isFeatured ? 'MAIN' : 'NONE'),
          isPinned: Boolean(art.isPinned),
          isYouth: Boolean(art.isYouth),
          isFemale: Boolean(art.isFemale),
          showOnHomepage: art.showOnHomepage ?? true,
          reporterName: art.reporterName || '',
          photographerName: art.photographerName || '',
          allowReactions: art.allowReactions ?? true,
          allowComments: art.allowComments ?? true,
          status: art.status || 'DRAFT',
          publishedAt: art.publishedAt ? new Date(art.publishedAt).toISOString().slice(0, 16) : '',
        });
        setCoverFile(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
      })
      .catch((err) => {
        console.error('Failed to load article', err);
        toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, articleId, defaultIsYouth, defaultIsFemale, form, loadCategories, resetForm]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    const currentTags = form.getValues('tags') || [];
    if (trimmed && !currentTags.includes(trimmed)) {
      form.setValue('tags', [...currentTags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue(
      'tags',
      currentTags.filter((t) => t !== tagToRemove),
    );
  };

  const handleCropCover = (croppedBlob: Blob) => {
    setCoverFile(croppedBlob);
    form.setValue('coverImage', URL.createObjectURL(croppedBlob));
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    form.setValue('coverImage', null);
  };

  const handleSelectGalleryFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    const newPreviews = fileArray.map((f) => URL.createObjectURL(f));
    const startIndex = galleryFiles.length;
    setGalleryFiles((prev) => [...prev, ...fileArray]);
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);

    if (fileArray.length === 1) {
      setGalleryCropItem({ type: 'new', index: startIndex, src: newPreviews[0] });
    }
  };

  const handleOpenGalleryCrop = (type: 'new' | 'existing', index: number, src: string) => {
    setGalleryCropItem({ type, index, src });
  };

  const handleCropGallerySave = (croppedBlob: Blob) => {
    if (!galleryCropItem) return;
    const newUrl = URL.createObjectURL(croppedBlob);
    const newFile = new File([croppedBlob], `gallery-${Date.now()}.png`, {
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
      const idx = galleryCropItem.index;
      const currentGallery = form.getValues('gallery') || [];
      form.setValue(
        'gallery',
        currentGallery.filter((_, i) => i !== idx),
      );
      setGalleryFiles((prev) => [...prev, newFile]);
      setGalleryPreviews((prev) => [...prev, newUrl]);
    }

    setGalleryCropItem(null);
    toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_GALLERY_PHOTO_CROPPED);
  };

  const handleCropGalleryCancel = () => setGalleryCropItem(null);

  const handleRemoveExistingGalleryPhoto = (urlToRemove: string) => {
    const current = form.getValues('gallery') || [];
    form.setValue(
      'gallery',
      current.filter((u) => u !== urlToRemove),
    );
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
    form.setValue('categoryId', newCat._id || newCat.slug);
  };

  const handleSelectFeaturedSlot = async (slot: 'MAIN' | 'SECONDARY' | 'NONE') => {
    if (slot === 'MAIN') {
      try {
        const existingMain = await adminNewsService.getCurrentMain();
        if (existingMain && (existingMain._id !== articleId && existingMain.id !== articleId)) {
          setExistingMainTitle(existingMain.title);
          setReplaceMainModalOpen(true);
          return;
        }
      } catch (err) {
        console.error('Error verifying existing main featured article', err);
      }
    }
    form.setValue('featuredSlot', slot);
    form.setValue('isFeatured', slot !== 'NONE');
  };

  const confirmReplaceMain = () => {
    form.setValue('featuredSlot', 'MAIN');
    form.setValue('isFeatured', true);
    setReplaceMainModalOpen(false);
  };

  const cancelReplaceMain = () => {
    setReplaceMainModalOpen(false);
  };

  const handleSave = async (overrideStatus?: NewsStatusType) => {
    if (isSaving) return;

    if (overrideStatus) {
      form.setValue('status', overrideStatus);
    }

    return form.handleSubmit(async (data: NewsArticleFormData) => {
      const chosenStatus = overrideStatus || data.status;

      if (!data.content || Object.keys(data.content).length === 0) {
        toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_CONTENT_REQUIRED);
        return;
      }
      if (chosenStatus === 'SCHEDULED' && !data.publishedAt) {
        toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_SCHEDULE_DATE_REQUIRED);
        return;
      }

      const folderId =
        articleId ||
        (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : String(Date.now()));

      await runTransactionalSave({
        hasPendingMedia: Boolean(coverFile) || galleryFiles.length > 0,
        uploadMedia: async () => {
          let finalCoverUrl = stripBlobUrl(data.coverImage, '');
          if (coverFile) {
            const fileToUpload =
              coverFile instanceof File
                ? coverFile
                : new File([coverFile], `cover-${Date.now()}.png`, {
                    type: coverFile.type || 'image/png',
                  });
            const uploadRes = await adminNewsService.uploadCoverMedia(fileToUpload, folderId);
            finalCoverUrl = verifyUploadedUrl(uploadRes?.url, ADMIN_NEWS_TEXTS.TOAST.ERROR_COVER_UPLOAD);
            form.setValue('coverImage', finalCoverUrl);
            setCoverFile(null);
          }

          let finalGalleryUrls = sanitizeMediaUrlList(data.gallery);
          if (galleryFiles.length > 0) {
            const galleryRes = await adminNewsService.uploadGalleryMedia(galleryFiles, folderId);
            const validUploaded = sanitizeMediaUrlList(galleryRes?.urls);
            if (validUploaded.length !== galleryFiles.length) {
              throw new Error(ADMIN_NEWS_TEXTS.TOAST.ERROR_GALLERY_UPLOAD);
            }
            finalGalleryUrls = [...finalGalleryUrls, ...validUploaded];
            form.setValue('gallery', finalGalleryUrls);
            galleryPreviews.forEach((previewUrl) => {
              if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
            });
            setGalleryFiles([]);
            setGalleryPreviews([]);
          }

          return { finalCoverUrl, finalGalleryUrls };
        },
        saveToDb: async (uploaded) => {
          const finalCoverUrl = uploaded ? uploaded.finalCoverUrl : stripBlobUrl(data.coverImage, '');
          const finalGalleryUrls = uploaded ? uploaded.finalGalleryUrls : sanitizeMediaUrlList(data.gallery);

          const payload: Partial<NewsArticleData> = {
            title: data.title.trim(),
            subtitle: data.subtitle?.trim() || undefined,
            slug: data.slug?.trim() || undefined,
            summary: data.summary?.trim() || undefined,
            category: data.categoryId,
            tags: data.tags || [],
            coverImage: finalCoverUrl,
            coverCaption: data.coverCaption?.trim() || undefined,
            gallery: finalGalleryUrls,
            content: data.content,
            youtubeVideoUrl: data.youtubeVideoUrl?.trim() || undefined,
            isFeatured: data.featuredSlot !== 'NONE',
            featuredSlot: data.featuredSlot,
            isPinned: data.isPinned,
            isYouth: data.isYouth,
            isFemale: data.isFemale,
            showOnHomepage: (data.isYouth || data.isFemale) ? data.showOnHomepage : true,
            reporterName: data.reporterName?.trim() || undefined,
            photographerName: data.photographerName?.trim() || undefined,
            allowReactions: data.allowReactions,
            allowComments: data.allowComments,
            status: chosenStatus,
            publishedAt:
              chosenStatus === 'SCHEDULED' && data.publishedAt
                ? new Date(data.publishedAt).toISOString()
                : chosenStatus === 'PUBLISHED'
                  ? data.publishedAt
                    ? new Date(data.publishedAt).toISOString()
                    : new Date().toISOString()
                  : undefined,
          };

          const saved = articleId
            ? await adminNewsService.updateNews(articleId, payload)
            : await adminNewsService.createNews(payload);

          if (!saved || (!saved._id && !saved.id)) {
            throw new Error(ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC);
          }
          return saved;
        },
        onConfirmed: () => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTOSAVE_KEY);
          }
          const successMsg =
            chosenStatus === 'PUBLISHED'
              ? ADMIN_NEWS_TEXTS.TOAST.SUCCESS_PUBLISH
              : chosenStatus === 'SCHEDULED'
                ? ADMIN_NEWS_TEXTS.TOAST.SUCCESS_SCHEDULE
                : articleId
                  ? ADMIN_NEWS_TEXTS.TOAST.SUCCESS_UPDATE
                  : ADMIN_NEWS_TEXTS.TOAST.SUCCESS_CREATE;

          toast.success(successMsg);
          onSuccess();
        },
        onError: (err: any) => {
          console.error('Failed to save article', err);
          toast.error(err?.response?.data?.message || err?.message || ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC);
        },
      });
    })();
  };

  return {
    form,
    isLoading,
    isSaving,
    savingStage,
    savingLabel,
    categories,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    coverFile,
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
    quickCategoryOpen,
    setQuickCategoryOpen,
    handleCategoryCreated,
    handleSave,
  };
};
