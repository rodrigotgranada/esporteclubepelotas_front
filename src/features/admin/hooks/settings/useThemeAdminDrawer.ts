import { useState, useEffect } from 'react';
import { themeService, ThemeDocument, ThemePalette } from '@/services/theme.service';
import { generateCampaignPalettes } from '@/shared/utils/colorPaletteGenerator';
import toast from 'react-hot-toast';
import { SETTINGS_TEXTS } from '../../constants/settings.constants';

export interface CampaignPreset {
  name: string;
  color: string;
  month: number;
  icon: string;
}

export const CAMPAIGN_PRESETS: CampaignPreset[] = [
  { name: 'Outubro Rosa', color: '#ec4899', month: 10, icon: '🎀' },
  { name: 'Novembro Azul', color: '#3b82f6', month: 11, icon: '🎗️' },
  { name: 'Setembro Amarelo', color: '#eab308', month: 9, icon: '💛' },
  { name: 'Fevereiro Roxo', color: '#8b5cf6', month: 2, icon: '💜' },
  { name: 'Julho Verde', color: '#10b981', month: 7, icon: '💚' },
  { name: 'Dezembro Laranja', color: '#ea580c', month: 12, icon: '🎗️' },
];

export const useThemeAdminDrawer = (
  theme?: ThemeDocument,
  onSuccess?: () => void,
  _onClose?: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCampaign, setIsCampaign] = useState(false);
  const [campaignColor, setCampaignColor] = useState('#ec4899');
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const defaultPalette: ThemePalette = {
    primary: '#fbbf24',
    secondary: '#1e3a8a',
    buttonSecondary: '#e5e7eb',
    background: '#ffffff',
    surface: '#f3f4f6',
    header: '#ffffff',
    card: '#ffffff',
    drawer: '#ffffff',
    table: '#ffffff',
    textPrimary: '#171717',
    textSecondary: '#4b5563',
    border: '#e5e7eb',
    success: '#22c55e',
    error: '#ea580c',
    warning: '#f59e0b',
  };

  const defaultDarkPalette: ThemePalette = {
    primary: '#fbbf24',
    secondary: '#1e3a8a',
    buttonSecondary: '#374151',
    background: '#0a0a0a',
    surface: '#171717',
    header: '#0a0a0a',
    card: '#171717',
    drawer: '#171717',
    table: '#171717',
    textPrimary: '#ffffff',
    textSecondary: '#9ca3af',
    border: '#374151',
    success: '#22c55e',
    error: '#ea580c',
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
      const campaign = !!theme.isCampaign;
      setIsCampaign(campaign);
      const color = theme.campaignColor || theme.light?.primary || '#ec4899';
      setCampaignColor(color);

      if (theme.startDate) {
        const d = new Date(theme.startDate);
        setStartDateStr(!isNaN(d.getTime()) ? d.toISOString().substring(0, 10) : '');
      } else {
        setStartDateStr('');
      }

      if (theme.endDate) {
        const d = new Date(theme.endDate);
        setEndDateStr(!isNaN(d.getTime()) ? d.toISOString().substring(0, 10) : '');
      } else {
        setEndDateStr('');
      }
      setShowAdvanced(!campaign);
    } else {
      setFormData({
        name: '',
        light: defaultPalette,
        dark: defaultDarkPalette,
      });
      setIsCampaign(false);
      setCampaignColor('#ec4899');
      setStartDateStr('');
      setEndDateStr('');
      setShowAdvanced(true);
    }
  }, [theme]);

  const handleChange = (field: string, value: any, mode?: 'light' | 'dark') => {
    setFormData((prev: any) => {
      if (mode) {
        return {
          ...prev,
          [mode]: {
            ...prev[mode],
            [field]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleCampaignColorChange = (newColor: string) => {
    setCampaignColor(newColor);
    const { light, dark } = generateCampaignPalettes(newColor);
    setFormData((prev) => ({
      ...prev,
      light,
      dark,
    }));
  };

  const handleSelectPreset = (preset: CampaignPreset) => {
    setIsCampaign(true);
    setCampaignColor(preset.color);
    const currentYear = new Date().getFullYear();
    const monthPadded = String(preset.month).padStart(2, '0');
    const lastDay = new Date(currentYear, preset.month, 0).getDate();

    setStartDateStr(`${currentYear}-${monthPadded}-01`);
    setEndDateStr(`${currentYear}-${monthPadded}-${lastDay}`);

    const { light, dark } = generateCampaignPalettes(preset.color);
    setFormData((prev) => ({
      ...prev,
      name: prev.name ? prev.name : preset.name,
      light,
      dark,
    }));
  };

  const handleToggleMode = (campaignMode: boolean) => {
    setIsCampaign(campaignMode);
    if (campaignMode) {
      const { light, dark } = generateCampaignPalettes(campaignColor);
      setFormData((prev) => ({
        ...prev,
        light,
        dark,
      }));
    } else {
      setShowAdvanced(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      toast.error(SETTINGS_TEXTS.THEMES.VALIDATION_NAME);
      return;
    }

    try {
      setIsLoading(true);

      const payload: Partial<ThemeDocument> = {
        ...formData,
        name: formData.name.trim(),
        isCampaign,
        campaignColor: isCampaign ? campaignColor : undefined,
        startDate:
          isCampaign && startDateStr
            ? new Date(`${startDateStr}T00:00:00.000Z`)
            : undefined,
        endDate:
          isCampaign && endDateStr
            ? new Date(`${endDateStr}T23:59:59.999Z`)
            : undefined,
      };

      if (theme?._id) {
        const idToUpdate =
          typeof theme._id === 'string' ? theme._id : (theme._id as any).$oid;
        await themeService.updateTheme(idToUpdate, payload);
        toast.success(SETTINGS_TEXTS.THEMES.SUCCESS_SAVE);
      } else {
        await themeService.createTheme(payload);
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
      const idToDelete =
        typeof theme._id === 'string' ? theme._id : (theme._id as any).$oid;
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
    isCampaign,
    campaignColor,
    startDateStr,
    setStartDateStr,
    endDateStr,
    setEndDateStr,
    showAdvanced,
    setShowAdvanced,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleChange,
    handleCampaignColorChange,
    handleSelectPreset,
    handleToggleMode,
    handleSave,
    handleDelete,
  };
};
