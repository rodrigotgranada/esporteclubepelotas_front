'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { adminTimelineService } from '../../services/admin-timeline.service';
import { TimelineCategoryData } from '@/features/timeline/services/timeline.service';
import { ADMIN_TIMELINE_CONSTANTS } from '../../constants/admin-timeline.constants';
import { useTransactionalSave } from '@/shared/hooks/useTransactionalSave';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';
import {
  timelineCategorySchema,
  TimelineCategoryFormData,
} from '../../schemas/timeline/timeline-category.schema';

const defaultCategoryValues: TimelineCategoryFormData = {
  name: '',
  slug: '',
  icon: 'Flag',
  description: '',
  displayOrder: 0,
  isActive: true,
};

export const useAdminTimelineCategories = () => {
  const [categories, setCategories] = useState<TimelineCategoryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { isSaving, runTransactionalSave } = useTransactionalSave({
    savingDb: ADMIN_TIMELINE_CONSTANTS.MODAL_CATEGORY.BTN_SAVING,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<TimelineCategoryData | null>(null);

  // Delete State
  const [categoryToDelete, setCategoryToDelete] = useState<TimelineCategoryData | null>(null);

  const form = useForm<TimelineCategoryFormData>({
    resolver: zodResolver(timelineCategorySchema),
    defaultValues: defaultCategoryValues,
  });

  const loadCategories = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsLoading(true);
    }
    try {
      const data = await adminTimelineService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao carregar categorias da timeline:', err);
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useRealtimeEvents('timeline', () => {
    loadCategories({ silent: true });
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    form.reset({
      ...defaultCategoryValues,
      displayOrder: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: TimelineCategoryData) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      icon: category.icon || 'Flag',
      description: category.description || '',
      displayOrder: category.displayOrder || 0,
      isActive: category.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingCategory(null);
    form.reset(defaultCategoryValues);
  };

  const saveCategory = form.handleSubmit(async (data: TimelineCategoryFormData) => {
    const result = await runTransactionalSave<void, TimelineCategoryData>({
      hasPendingMedia: false,
      saveToDb: async () => {
        if (editingCategory) {
          return adminTimelineService.updateCategory(editingCategory.id || editingCategory._id!, {
            name: data.name.trim(),
            slug: data.slug?.trim() || undefined,
            icon: data.icon.trim(),
            description: data.description?.trim() || undefined,
            displayOrder: Number(data.displayOrder) || 0,
            isActive: Boolean(data.isActive),
          });
        }
        return adminTimelineService.createCategory({
          name: data.name.trim(),
          slug: data.slug?.trim() || undefined,
          icon: data.icon.trim(),
          description: data.description?.trim() || undefined,
          displayOrder: Number(data.displayOrder) || 0,
          isActive: Boolean(data.isActive),
        });
      },
      onConfirmed: () => {
        toast.success(
          editingCategory
            ? ADMIN_TIMELINE_CONSTANTS.TOAST.SUCCESS_CATEGORY_UPDATE
            : ADMIN_TIMELINE_CONSTANTS.TOAST.SUCCESS_CATEGORY_CREATE,
        );
        closeModal();
        loadCategories({ silent: true });
      },
      onError: (err: any) => {
        console.error('Erro ao salvar categoria da timeline:', err);
        toast.error(err?.response?.data?.message || err?.message || ADMIN_TIMELINE_CONSTANTS.TOAST.ERROR_CATEGORY_SAVE);
      },
    });

    return result || null;
  });

  const promptDeleteCategory = (category: TimelineCategoryData) => {
    setCategoryToDelete(category);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      setIsDeleting(true);
      await adminTimelineService.deleteCategory(categoryToDelete.id || categoryToDelete._id!);
      toast.success(ADMIN_TIMELINE_CONSTANTS.TOAST.SUCCESS_CATEGORY_DELETE);
      setCategoryToDelete(null);
      loadCategories({ silent: true });
    } catch (err: any) {
      console.error('Erro ao deletar categoria da timeline:', err);
      toast.error(err?.response?.data?.message || err?.message || ADMIN_TIMELINE_CONSTANTS.TOAST.ERROR_CATEGORY_DELETE);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    form,
    categories,
    isLoading,
    isSaving,
    isDeleting,
    isModalOpen,
    editingCategory,
    categoryToDelete,
    loadCategories,
    openCreateModal,
    openEditModal,
    closeModal,
    saveCategory,
    promptDeleteCategory,
    handleDeleteCategory,
    setCategoryToDelete,
  };
};
