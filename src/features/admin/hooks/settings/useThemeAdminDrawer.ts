import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { themeService, ThemeDocument, ThemePalette } from '@/services/theme.service';
import { generateCampaignPalettes } from '@/shared/utils/colorPaletteGenerator';
import toast from 'react-hot-toast';
import { SETTINGS_TEXTS } from '../../constants/settings.constants';
import { useTransactionalSave } from '@/shared/hooks/useTransactionalSave';
import {
  themeAdminSchema,
  ThemeAdminFormData,
} from '../../schemas/settings/theme.schema';

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

const defaultPalette: ThemePalette = {
  primary: '#fbbf24',
  secondary: '#1e3a8a',
  buttonSecondary: '#1e3a8a',
  background: '#fefdf0',
  surface: '#ffffff',
  header: '#1e3a8a',
  card: '#ffffff',
  drawer: '#ffffff',
  table: '#ffffff',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  border: '#fef08a',
  success: '#22c55e',
  error: '#ea580c',
  warning: '#f59e0b',
};

const defaultDarkPalette: ThemePalette = {
  primary: '#fbbf24',
  secondary: '#1e3a8a',
  buttonSecondary: '#1e3a8a',
  background: '#0b1a32',
  surface: '#112344',
  header: '#0d1e3a',
  card: '#112344',
  drawer: '#0d1e3a',
  table: '#112344',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#1c355f',
  success: '#22c55e',
  error: '#ea580c',
  warning: '#f59e0b',
};

const defaultThemeValues: ThemeAdminFormData = {
  name: '',
  isCampaign: false,
  campaignColor: '#ec4899',
  startDate: '',
  endDate: '',
  light: defaultPalette,
  dark: defaultDarkPalette,
};

const resolveThemeId = (theme?: ThemeDocument): string | undefined => {
  if (!theme) return undefined;
  const raw = theme._id || (theme as any).id;
  if (!raw) return undefined;
  return typeof raw === 'string' ? raw : raw.$oid;
};

export const useThemeAdminDrawer = (
  theme?: ThemeDocument,
  onSuccess?: () => void,
  _onClose?: () => void,
) => {
  const { isSaving, runTransactionalSave } = useTransactionalSave();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isLoading = isSaving || isDeleting;

  const form = useForm<ThemeAdminFormData>({
    resolver: zodResolver(themeAdminSchema),
    defaultValues: defaultThemeValues,
  });

  useEffect(() => {
    if (theme) {
      const isCamp = Boolean(theme.isCampaign);
      const campColor = theme.campaignColor || theme.light?.primary || '#ec4899';

      let start = '';
      if (theme.startDate) {
        const d = new Date(theme.startDate);
        start = !isNaN(d.getTime()) ? d.toISOString().substring(0, 10) : '';
      }

      let end = '';
      if (theme.endDate) {
        const d = new Date(theme.endDate);
        end = !isNaN(d.getTime()) ? d.toISOString().substring(0, 10) : '';
      }

      form.reset({
        name: theme.name || '',
        isCampaign: isCamp,
        campaignColor: campColor,
        startDate: start,
        endDate: end,
        light: theme.light || defaultPalette,
        dark: theme.dark || defaultDarkPalette,
      });

      setShowAdvanced(!isCamp);
    } else {
      form.reset(defaultThemeValues);
      setShowAdvanced(true);
    }
  }, [theme, form]);

  const handleCampaignColorChange = (newColor: string) => {
    form.setValue('campaignColor', newColor);
    const { light, dark } = generateCampaignPalettes(newColor);
    form.setValue('light', light);
    form.setValue('dark', dark);
  };

  const handleSelectPreset = (preset: CampaignPreset) => {
    form.setValue('isCampaign', true);
    form.setValue('campaignColor', preset.color);
    const currentYear = new Date().getFullYear();
    const monthPadded = String(preset.month).padStart(2, '0');
    const lastDay = new Date(currentYear, preset.month, 0).getDate();

    form.setValue('startDate', `${currentYear}-${monthPadded}-01`);
    form.setValue('endDate', `${currentYear}-${monthPadded}-${lastDay}`);

    const { light, dark } = generateCampaignPalettes(preset.color);
    const currentName = form.getValues('name');
    if (!currentName) {
      form.setValue('name', preset.name);
    }
    form.setValue('light', light);
    form.setValue('dark', dark);
  };

  const handleToggleMode = (campaignMode: boolean) => {
    form.setValue('isCampaign', campaignMode);
    if (campaignMode) {
      const color = form.getValues('campaignColor') || '#ec4899';
      const { light, dark } = generateCampaignPalettes(color);
      form.setValue('light', light);
      form.setValue('dark', dark);
    } else {
      setShowAdvanced(true);
    }
  };

  const handleChange = (field: string, value: any, mode?: 'light' | 'dark') => {
    if (mode) {
      form.setValue(`${mode}.${field}` as any, value);
    } else {
      form.setValue(field as any, value);
    }
  };

  const handleSave = form.handleSubmit(async (data: ThemeAdminFormData) => {
    const themeId = resolveThemeId(theme);
    const payload: Partial<ThemeDocument> = {
      name: data.name.trim(),
      isCampaign: data.isCampaign,
      campaignColor: data.isCampaign ? data.campaignColor : undefined,
      startDate:
        data.isCampaign && data.startDate
          ? new Date(`${data.startDate}T00:00:00.000Z`)
          : undefined,
      endDate:
        data.isCampaign && data.endDate
          ? new Date(`${data.endDate}T23:59:59.999Z`)
          : undefined,
      light: data.light,
      dark: data.dark,
    };

    await runTransactionalSave<void, ThemeDocument>({
      hasPendingMedia: false,
      saveToDb: async () => {
        if (themeId) {
          return themeService.updateTheme(themeId, payload);
        }
        return themeService.createTheme(payload);
      },
      onConfirmed: () => {
        toast.success(SETTINGS_TEXTS.THEMES.SUCCESS_SAVE);
        if (onSuccess) onSuccess();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || SETTINGS_TEXTS.THEMES.ERROR_SAVE);
      },
    });
  });

  const handleDelete = async () => {
    const themeId = resolveThemeId(theme);
    if (!themeId || isLoading) return;
    try {
      setIsDeleting(true);
      await themeService.deleteTheme(themeId);
      toast.success(SETTINGS_TEXTS.THEMES.SUCCESS_DELETE);
      setIsDeleteModalOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || SETTINGS_TEXTS.THEMES.ERROR_DELETE);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    form,
    isLoading,
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
