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
  const [content, setContent] = useState<Record<string, any>>({});
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<NewsStatusType>('DRAFT');
  const [publishedAt, setPublishedAt] = useState('');

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
    setContent({});
    setYoutubeVideoUrl('');
    setIsFeatured(false);
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
            setContent(art.content || {});
            setYoutubeVideoUrl(art.youtubeVideoUrl || '');
            setIsFeatured(!!art.isFeatured);
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
        content,
        youtubeVideoUrl: youtubeVideoUrl.trim() || undefined,
        isFeatured,
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

      onSuccess();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC;
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
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
    quickCategoryOpen,
    setQuickCategoryOpen,
    handleCategoryCreated,
    handleSave,
  };
};

