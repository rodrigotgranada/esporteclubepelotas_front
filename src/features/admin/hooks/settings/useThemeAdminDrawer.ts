import { useState, useEffect } from 'react';
import { themeService, ThemeDocument, ThemePalette } from '@/services/theme.service';
import toast from 'react-hot-toast';
import { SETTINGS_TEXTS } from '../../constants/settings.constants';


export const useThemeAdminDrawer = (theme?: ThemeDocument, onSuccess?: () => void, onClose?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const defaultPalette: ThemePalette = {
    primary: '#fbbf24',
    secondary: '#1e3a8a',
    background: '#ffffff',
    surface: '#f3f4f6',
    textPrimary: '#171717',
    textSecondary: '#4b5563',
    border: '#e5e7eb',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
  };

  const defaultDarkPalette: ThemePalette = {
    primary: '#fbbf24',
    secondary: '#1e3a8a',
    background: '#0a0a0a',
    surface: '#171717',
    textPrimary: '#ffffff',
    textSecondary: '#9ca3af',
    border: '#374151',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
  };

  const [formData, setFormData] = useState<Partial<ThemeDocument>>({
    name: '',
    light: defaultPalette,
    dark: defaultDarkPalette,
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (theme) {
      setFormData(theme);
    } else {
      setFormData({
        name: '',
        light: defaultPalette,
        dark: defaultDarkPalette,
      });
    }
  }, [theme]);

  const handleChange = (field: string, value: any, mode?: 'light' | 'dark') => {
    setFormData((prev: any) => {
      if (mode) {
        return {
          ...prev,
          [mode]: {
            ...prev[mode],
            [field]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error(SETTINGS_TEXTS.THEMES.VALIDATION_NAME);
      return;
    }

    try {
      setIsLoading(true);
      if (theme?._id) {
        const idToUpdate = typeof theme._id === 'string' ? theme._id : (theme._id as any).$oid;
        await themeService.updateTheme(idToUpdate, formData);
        toast.success(SETTINGS_TEXTS.THEMES.SUCCESS_SAVE);
      } else {
        await themeService.createTheme(formData);
        toast.success(SETTINGS_TEXTS.THEMES.SUCCESS_SAVE);
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || SETTINGS_TEXTS.THEMES.ERROR_SAVE);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!theme?._id) return;
    try {
      setIsLoading(true);
      const idToDelete = typeof theme._id === 'string' ? theme._id : (theme._id as any).$oid;
      await themeService.deleteTheme(idToDelete);
      toast.success(SETTINGS_TEXTS.THEMES.SUCCESS_DELETE);
      setIsDeleteModalOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || SETTINGS_TEXTS.THEMES.ERROR_DELETE);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleChange,
    handleSave,
    handleDelete,
  };
};
