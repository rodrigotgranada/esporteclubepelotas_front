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

  const handleDeactivate = async (id: string) => {
    try {
      await themeService.deactivateTheme(id);
      toast.success(SETTINGS_TEXTS.THEMES.SUCCESS_DEACTIVATE);
      await fetchThemes();
      setTimeout(() => {
        window.location.href = window.location.pathname;
      }, 1000);
    } catch (error: any) {
      toast.error(SETTINGS_TEXTS.THEMES.ERROR_DEACTIVATE);
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

  const getThemeStatus = (theme: ThemeDocument) => {
    if (!theme.isCampaign) {
      return {
        label: theme.isActive
          ? SETTINGS_TEXTS.THEMES.BADGE_ACTIVE
          : SETTINGS_TEXTS.THEMES.BADGE_INACTIVE,
        variant: theme.isActive ? ('success' as const) : ('default' as const),
        isCampaignActive: false,
      };
    }

    if (!theme.isActive) {
      return {
        label: SETTINGS_TEXTS.THEMES.BADGE_INACTIVE,
        variant: 'default' as const,
        isCampaignActive: false,
      };
    }

    const now = new Date();
    const start = theme.startDate ? new Date(theme.startDate) : null;
    const end = theme.endDate ? new Date(theme.endDate) : null;

    if (start && !isNaN(start.getTime()) && now < start) {
      return {
        label: `${SETTINGS_TEXTS.THEMES.BADGE_SCHEDULED} (${start.toLocaleDateString('pt-BR')})`,
        variant: 'primary' as const,
        isCampaignActive: false,
      };
    }

    if (end && !isNaN(end.getTime()) && now > end) {
      return {
        label: SETTINGS_TEXTS.THEMES.BADGE_EXPIRED,
        variant: 'danger' as const,
        isCampaignActive: false,
      };
    }

    return {
      label: SETTINGS_TEXTS.THEMES.BADGE_CAMPAIGN_ACTIVE,
      variant: 'success' as const,
      isCampaignActive: true,
    };
  };

  return {
    themes,
    isLoading,
    isDrawerOpen,
    themeToEdit,
    previewTheme,
    setPreviewTheme,
    handleActivate,
    handleDeactivate,
    handleOpenDrawer,
    handleCloseDrawer,
    handleSaveSuccess,
    getThemeStatus,
  };
};
