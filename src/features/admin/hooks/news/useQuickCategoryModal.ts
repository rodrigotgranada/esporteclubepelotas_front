'use client';

import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { adminNewsService, NewsCategoryData } from '../../services/admin-news.service';
import { ADMIN_NEWS_TEXTS } from '../../constants/admin-news.constants';
import {
  quickCategorySchema,
  QuickCategoryFormData,
} from '../../schemas/news/quick-category.schema';

const defaultQuickCategoryValues: QuickCategoryFormData = {
  name: '',
  description: '',
};

export const useQuickCategoryModal = (onCategoryCreated?: (category: NewsCategoryData) => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<QuickCategoryFormData>({
    resolver: zodResolver(quickCategorySchema),
    defaultValues: defaultQuickCategoryValues,
  });

  const open = () => {
    form.reset(defaultQuickCategoryValues);
    setIsOpen(true);
  };

  const close = () => {
    form.reset(defaultQuickCategoryValues);
    setIsOpen(false);
  };

  const handleSubmit = form.handleSubmit(async (data: QuickCategoryFormData) => {
    try {
      setIsLoading(true);
      const created = await adminNewsService.createCategory({
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
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
  });

  return {
    form,
    isOpen,
    isLoading,
    open,
    close,
    handleSubmit,
  };
};
