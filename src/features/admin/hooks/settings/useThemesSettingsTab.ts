import { useState, useEffect, useCallback, useRef } from 'react';
import { themeService, ThemeDocument } from '@/services/theme.service';
import toast from 'react-hot-toast';
import { SETTINGS_TEXTS } from '../../constants/settings.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useThemesSettingsTab = () => {
  const [themes, setThemes] = useState<ThemeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [themeToEdit, setThemeToEdit] = useState<ThemeDocument | undefined>();
  const [previewTheme, setPreviewTheme] = useState<ThemeDocument | undefined>();
  const mutatingRef = useRef(false);

  const fetchThemes = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      const data = await themeService.getThemes();
      // Filtrar para exibir estritamente as Campanhas Sazonais (oculta o tema padrão inalterável do clube)
      const campaignThemes = data.filter((t: any) => !t.isDefault);
      setThemes(campaignThemes);

      if (campaignThemes.length > 0) {
        setPreviewTheme((prev) => {
          if (prev && campaignThemes.some((c: any) => c._id === prev._id)) {
            return prev;
          }
          return campaignThemes.find((t: any) => t.isActive) || campaignThemes[0];
        });
      } else {
        setPreviewTheme(undefined);
      }
    } catch {
      if (!options?.silent) {
        toast.error(SETTINGS_TEXTS.THEMES.ERROR_FETCH);
      }
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  useRealtimeEvents('themes', () => {
    fetchThemes({ silent: true });
  });

  const handleActivate = async (id: string) => {
    if (mutatingRef.current) return;
    mutatingRef.current = true;
    try {
      await themeService.activateTheme(id);
      toast.success(SETTINGS_TEXTS.THEMES.SUCCESS_ACTIVATE);
      await fetchThemes({ silent: true });
    } catch {
      toast.error(SETTINGS_TEXTS.THEMES.ERROR_ACTIVATE);
    } finally {
      mutatingRef.current = false;
    }
  };

  const handleDeactivate = async (id: string) => {
    if (mutatingRef.current) return;
    mutatingRef.current = true;
    try {
      await themeService.deactivateTheme(id);
      toast.success(SETTINGS_TEXTS.THEMES.SUCCESS_DEACTIVATE);
      await fetchThemes({ silent: true });
    } catch {
      toast.error(SETTINGS_TEXTS.THEMES.ERROR_DEACTIVATE);
    } finally {
      mutatingRef.current = false;
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
    fetchThemes({ silent: true });
    handleCloseDrawer();
  };

  const getThemeStatus = (theme: ThemeDocument) => {
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
