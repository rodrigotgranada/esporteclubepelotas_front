'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  adminNewsService,
  NewsArticleData,
} from '../../services/admin-news.service';
import { ADMIN_NEWS_TEXTS } from '../../constants/admin-news.constants';
import { useTransactionalSave } from '@/shared/hooks/useTransactionalSave';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export type SlotType = 'main' | 'sec1' | 'sec2' | 'pool';

export const useAdminShowcase = () => {
  const [mainSlot, setMainSlot] = useState<NewsArticleData | null>(null);
  const [secSlot1, setSecSlot1] = useState<NewsArticleData | null>(null);
  const [secSlot2, setSecSlot2] = useState<NewsArticleData | null>(null);
  const [availableArticles, setAvailableArticles] = useState<NewsArticleData[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasUnsavedRef = useRef(false);

  const { isSaving, runTransactionalSave } = useTransactionalSave();

  // Drag & Drop State
  const [draggedArticle, setDraggedArticle] = useState<NewsArticleData | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<SlotType | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<SlotType | null>(null);

  const texts = ADMIN_NEWS_TEXTS.SHOWCASE;

  const markDirty = (dirty: boolean) => {
    hasUnsavedRef.current = dirty;
    setHasUnsavedChanges(dirty);
  };

  const loadShowcase = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      const res = await adminNewsService.getShowcase();
      setMainSlot(res.main);
      setSecSlot1(res.secondary[0] || null);
      setSecSlot2(res.secondary[1] || null);
      setAvailableArticles(res.available || []);
      markDirty(false);
    } catch (err) {
      console.error('Failed to load showcase data', err);
      if (!options?.silent) {
        toast.error('Erro ao carregar vitrine da capa');
      }
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadShowcase();
  }, [loadShowcase]);

  useRealtimeEvents('news', () => {
    if (!hasUnsavedRef.current) {
      loadShowcase({ silent: true });
    }
  });

  const removeFromPool = (id: string | undefined, pool: NewsArticleData[]) => {
    if (!id) return pool;
    return pool.filter((a) => (a._id || a.id) !== id);
  };

  const addToPool = (article: NewsArticleData | null, pool: NewsArticleData[]) => {
    if (!article) return pool;
    const exists = pool.some((a) => (a._id || a.id) === (article._id || article.id));
    if (exists) return pool;
    return [article, ...pool];
  };

  const handleDragStart = (article: NewsArticleData, from: SlotType) => {
    setDraggedArticle(article);
    setDraggedFrom(from);
  };

  const handleDragEnd = () => {
    setDraggedArticle(null);
    setDraggedFrom(null);
    setDragOverSlot(null);
  };

  const handleDragOver = (e: React.DragEvent, slot: SlotType) => {
    e.preventDefault();
    if (dragOverSlot !== slot) {
      setDragOverSlot(slot);
    }
  };

  const handleDragLeave = (slot: SlotType) => {
    if (dragOverSlot === slot) {
      setDragOverSlot(null);
    }
  };

  const handleDrop = (targetSlot: SlotType) => {
    if (!draggedArticle || !draggedFrom || draggedFrom === targetSlot) {
      handleDragEnd();
      return;
    }

    const currentArticle = draggedArticle;
    const currentFrom = draggedFrom;
    const currentId = currentArticle._id || currentArticle.id;

    let newMain = mainSlot;
    let newSec1 = secSlot1;
    let newSec2 = secSlot2;
    let newPool = availableArticles;

    const getAtSlot = (slot: SlotType) => {
      if (slot === 'main') return mainSlot;
      if (slot === 'sec1') return secSlot1;
      if (slot === 'sec2') return secSlot2;
      return null;
    };

    const setAtSlot = (slot: SlotType, art: NewsArticleData | null) => {
      if (slot === 'main') newMain = art;
      if (slot === 'sec1') newSec1 = art;
      if (slot === 'sec2') newSec2 = art;
    };

    const targetExisting = getAtSlot(targetSlot);

    if (targetSlot === 'pool') {
      setAtSlot(currentFrom, null);
      newPool = addToPool(currentArticle, newPool);
    } else if (currentFrom === 'pool') {
      newPool = removeFromPool(currentId, newPool);
      if (targetExisting) {
        newPool = addToPool(targetExisting, newPool);
      }
      setAtSlot(targetSlot, currentArticle);
    } else {
      setAtSlot(targetSlot, currentArticle);
      setAtSlot(currentFrom, targetExisting);
    }

    setMainSlot(newMain);
    setSecSlot1(newSec1);
    setSecSlot2(newSec2);
    setAvailableArticles(newPool);
    markDirty(true);

    handleDragEnd();
  };

  const handleSetMain = (article: NewsArticleData) => {
    const id = article._id || article.id;
    let newPool = removeFromPool(id, availableArticles);
    if (mainSlot) {
      newPool = addToPool(mainSlot, newPool);
    }
    if (secSlot1 && (secSlot1._id || secSlot1.id) === id) setSecSlot1(null);
    if (secSlot2 && (secSlot2._id || secSlot2.id) === id) setSecSlot2(null);

    setMainSlot(article);
    setAvailableArticles(newPool);
    markDirty(true);
  };

  const handleSetSec1 = (article: NewsArticleData) => {
    const id = article._id || article.id;
    let newPool = removeFromPool(id, availableArticles);
    if (secSlot1) {
      newPool = addToPool(secSlot1, newPool);
    }
    if (mainSlot && (mainSlot._id || mainSlot.id) === id) setMainSlot(null);
    if (secSlot2 && (secSlot2._id || secSlot2.id) === id) setSecSlot2(null);

    setSecSlot1(article);
    setAvailableArticles(newPool);
    markDirty(true);
  };

  const handleSetSec2 = (article: NewsArticleData) => {
    const id = article._id || article.id;
    let newPool = removeFromPool(id, availableArticles);
    if (secSlot2) {
      newPool = addToPool(secSlot2, newPool);
    }
    if (mainSlot && (mainSlot._id || mainSlot.id) === id) setMainSlot(null);
    if (secSlot1 && (secSlot1._id || secSlot1.id) === id) setSecSlot1(null);

    setSecSlot2(article);
    setAvailableArticles(newPool);
    markDirty(true);
  };

  const handleClearMain = () => {
    if (!mainSlot) return;
    setAvailableArticles((prev) => addToPool(mainSlot, prev));
    setMainSlot(null);
    markDirty(true);
  };

  const handleClearSec1 = () => {
    if (!secSlot1) return;
    setAvailableArticles((prev) => addToPool(secSlot1, prev));
    setSecSlot1(null);
    markDirty(true);
  };

  const handleClearSec2 = () => {
    if (!secSlot2) return;
    setAvailableArticles((prev) => addToPool(secSlot2, prev));
    setSecSlot2(null);
    markDirty(true);
  };

  const handleSave = async () => {
    const mainId = mainSlot ? mainSlot._id || mainSlot.id || null : null;
    const secondaryIds: string[] = [];
    if (secSlot1) secondaryIds.push(secSlot1._id || secSlot1.id || '');
    if (secSlot2) secondaryIds.push(secSlot2._id || secSlot2.id || '');

    await runTransactionalSave({
      hasPendingMedia: false,
      saveToDb: async () =>
        adminNewsService.updateShowcase({
          mainId,
          secondaryIds: secondaryIds.filter(Boolean),
        }),
      onConfirmed: async () => {
        toast.success(texts.TOAST_SUCCESS);
        markDirty(false);
        await loadShowcase({ silent: true });
      },
      onError: (err: unknown) => {
        console.error('Failed to update showcase', err);
        const apiErr = err as { response?: { data?: { message?: string } } };
        toast.error(apiErr?.response?.data?.message || texts.TOAST_ERROR);
      },
    });
  };

  const filteredAvailable = availableArticles.filter((a) => {
    if (!search.trim()) return true;
    return a.title?.toLowerCase().includes(search.toLowerCase().trim());
  });

  return {
    mainSlot,
    secSlot1,
    secSlot2,
    availableArticles: filteredAvailable,
    rawAvailableCount: availableArticles.length,
    search,
    setSearch,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    draggedArticle,
    draggedFrom,
    dragOverSlot,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSetMain,
    handleSetSec1,
    handleSetSec2,
    handleClearMain,
    handleClearSec1,
    handleClearSec2,
    handleSave,
    refresh: loadShowcase,
  };
};
