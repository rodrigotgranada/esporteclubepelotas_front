import { useState, useEffect, useCallback } from 'react';
import { themeService, ThemeDocument } from '@/services/theme.service';
import toast from 'react-hot-toast';
import { SETTINGS_TEXTS } from '../../constants/settings.constants';

export const useThemesSettingsTab = () => {
  const [themes, setThemes] = useState<ThemeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [themeToEdit, setThemeToEdit] = useState<ThemeDocument | undefined>();
  const [previewTheme, setPreviewTheme] = useState<ThemeDocument | undefined>();

  const fetchThemes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await themeService.getThemes();
      setThemes(data);
      if (data.length > 0 && !previewTheme) {
        setPreviewTheme(data.find((t: any) => t.isActive) || data[0]);
      }
    } catch (error: any) {
      toast.error(SETTINGS_TEXTS.THEMES.ERROR_FETCH);
    } finally {
      setIsLoading(false);
    }
  }, [previewTheme]);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const handleActivate = async (id: string) => {
    try {
      await themeService.activateTheme(id);
      toast.success(SETTINGS_TEXTS.THEMES.SUCCESS_ACTIVATE);
      await fetchThemes();
      setTimeout(() => {
        window.location.href = window.location.pathname;
      }, 1000);
    } catch (error: any) {
      toast.error(SETTINGS_TEXTS.THEMES.ERROR_ACTIVATE);
    }
  };

  const handleOpenDrawer = (theme?: ThemeDocument) => {
    setThemeToEdit(theme);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setThemeToEdit(undefined);
    setIsDrawerOpen(false);
  };

  const handleSaveSuccess = () => {
    fetchThemes();
    handleCloseDrawer();
  };

  return {
    themes,
    isLoading,
    isDrawerOpen,
    themeToEdit,
    previewTheme,
    setPreviewTheme,
    handleActivate,
    handleOpenDrawer,
    handleCloseDrawer,
    handleSaveSuccess,
  };
};
