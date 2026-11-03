'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { adminNewsService, NewsCategoryData } from '../../services/admin-news.service';
import { ADMIN_NEWS_TEXTS } from '../../constants/admin-news.constants';

export const useQuickCategoryModal = (onCategoryCreated?: (category: NewsCategoryData) => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const open = () => {
    setName('');
    setDescription('');
    setIsOpen(true);
  };

  const close = () => {
    setName('');
    setDescription('');
    setIsOpen(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!name.trim()) {
      toast.error('Informe o nome da categoria.');
      return;
    }

    try {
      setIsLoading(true);
      const created = await adminNewsService.createCategory({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_CATEGORY_CREATED);
      if (onCategoryCreated) {
        onCategoryCreated(created);
      }
      close();
    } catch (error: any) {
      const msg = error?.response?.data?.message || ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC;
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    name,
    setName,
    description,
    setDescription,
    isLoading,
    open,
    close,
    handleSubmit,
  };
};

