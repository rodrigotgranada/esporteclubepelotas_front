'use client';

import { useState, useCallback, useEffect } from 'react';
import { adminTimelineService } from '../../services/admin-timeline.service';
import { TimelineCategoryData } from '@/features/timeline/services/timeline.service';
import { ADMIN_TIMELINE_CONSTANTS } from '../../constants/admin-timeline.constants';

export const useAdminTimelineCategories = () => {
  const [categories, setCategories] = useState<TimelineCategoryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<TimelineCategoryData | null>(null);

  // Form Fields
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [icon, setIcon] = useState<string>('Flag');
  const [description, setDescription] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Delete State
  const [categoryToDelete, setCategoryToDelete] = useState<TimelineCategoryData | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminTimelineService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao carregar categorias da timeline:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setIcon('Flag');
    setDescription('');
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (category: TimelineCategoryData) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setIcon(category.icon || 'Flag');
    setDescription(category.description || '');
    setDisplayOrder(category.displayOrder || 0);
    setIsActive(category.isActive ?? true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const saveCategory = async (): Promise<TimelineCategoryData | null> => {
    if (!name.trim()) return null;
    setIsSaving(true);
    try {
      let saved: TimelineCategoryData;
      if (editingCategory) {
        saved = await adminTimelineService.updateCategory(editingCategory.id || editingCategory._id!, {
          name: name.trim(),
          slug: slug.trim() || undefined,
          icon: icon.trim(),
          description: description.trim() || undefined,
          displayOrder,
          isActive,
        });
      } else {
        saved = await adminTimelineService.createCategory({
          name: name.trim(),
          slug: slug.trim() || undefined,
          icon: icon.trim(),
          description: description.trim() || undefined,
          displayOrder,
          isActive,
        });
      }

      await loadCategories();
      closeModal();
      return saved;
    } catch (err) {
      console.error('Erro ao salvar categoria da timeline:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await adminTimelineService.deleteCategory(categoryToDelete.id || categoryToDelete._id!);
      await loadCategories();
      setCategoryToDelete(null);
    } catch (err) {
      console.error('Erro ao excluir categoria da timeline:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    categories,
    isLoading,
    isSaving,
    isDeleting,
    isModalOpen,
    editingCategory,
    name,
    setName,
    slug,
    setSlug,
    icon,
    setIcon,
    description,
    setDescription,
    displayOrder,
    setDisplayOrder,
    isActive,
    setIsActive,
    categoryToDelete,
    setCategoryToDelete,
    openCreateModal,
    openEditModal,
    closeModal,
    saveCategory,
    handleDeleteCategory,
    loadCategories,
  };
};

