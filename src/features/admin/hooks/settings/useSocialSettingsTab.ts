import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettingsStore, Settings, SocialLinkItem } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { toast } from 'react-hot-toast';
import { SOCIAL_SETTINGS_TEXTS } from '../../ui/components/settings/social/SocialSettingsTab.constants';
import { useTransactionalSave } from '@/shared/hooks/useTransactionalSave';
import {
  socialSettingsSchema,
  SocialSettingsFormData,
} from '@/features/admin/schemas';

export const useSocialSettingsTab = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { isSaving: isLoading, runTransactionalSave } = useTransactionalSave({
    savingDb: SOCIAL_SETTINGS_TEXTS.SAVING_BUTTON,
  });

  const form = useForm<SocialSettingsFormData>({
    resolver: zodResolver(socialSettingsSchema),
    defaultValues: {
      socialLinks: [],
    },
  });

  const { control, register, handleSubmit, reset, watch, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  useEffect(() => {
    if (settings?.socialLinks && settings.socialLinks.length > 0) {
      reset({ socialLinks: settings.socialLinks });
    } else if (settings?.socialMedia) {
      const migrated: SocialLinkItem[] = [];
      const sm = settings.socialMedia;
      if (Array.isArray(sm.instagram)) {
        sm.instagram.forEach((url, i) => url && migrated.push({
          platform: 'instagram',
          label: i === 0 ? '@ecpelotas (Oficial)' : `@ecpelotas ${i + 1}`,
          url,
        }));
      }
      if (Array.isArray(sm.facebook)) {
        sm.facebook.forEach((url, i) => url && migrated.push({
          platform: 'facebook',
          label: i === 0 ? 'Pelotas Oficial' : `Pelotas ${i + 1}`,
          url,
        }));
      }
      if (Array.isArray(sm.x)) {
        sm.x.forEach((url, i) => url && migrated.push({
          platform: 'x',
          label: i === 0 ? '@ecpelotas' : `@ecpelotas ${i + 1}`,
          url,
        }));
      }
      if (Array.isArray(sm.youtube)) {
        sm.youtube.forEach((url, i) => url && migrated.push({
          platform: 'youtube',
          label: i === 0 ? 'TV Lobo Oficial' : `Pelotas Vídeos ${i + 1}`,
          url,
        }));
      }
      reset({
        socialLinks: migrated.length > 0
          ? migrated
          : [{ platform: 'instagram', label: '@ecpelotas', url: 'https://instagram.com/ecpelotas' }],
      });
    } else {
      reset({
        socialLinks: [
          { platform: 'instagram', label: '@ecpelotas (Oficial)', url: 'https://instagram.com/ecpelotas' },
          { platform: 'facebook', label: 'Esporte Clube Pelotas', url: 'https://facebook.com/ecpelotas' },
          { platform: 'x', label: '@ecpelotas', url: 'https://x.com/ecpelotas' },
          { platform: 'youtube', label: 'TV Lobo Oficial', url: 'https://youtube.com/@ecpelotasoficial' },
        ],
      });
    }
  }, [settings, reset]);

  const onSave = handleSubmit(async (data: SocialSettingsFormData) => {
    const cleanedLinks = data.socialLinks
      .map((item) => ({
        platform: item.platform,
        label: item.label.trim(),
        url: item.url.trim(),
      }))
      .filter((item) => item.url !== '');

    await runTransactionalSave<void, Settings>({
      hasPendingMedia: false,
      saveToDb: async () =>
        settingsApi.updateSettings({
          socialLinks: cleanedLinks,
        }),
      onConfirmed: (updated) => {
        updateSettings({ socialLinks: updated.socialLinks });
        reset({ socialLinks: updated.socialLinks || [] });
        toast.success(SOCIAL_SETTINGS_TEXTS.TOAST_SUCCESS);
      },
      onError: (error: any) => {
        console.error('Error updating social settings:', error);
        toast.error(error?.response?.data?.message || SOCIAL_SETTINGS_TEXTS.TOAST_ERROR);
      },
    });
  });

  const handleAdd = () => {
    append({
      platform: 'instagram',
      label: '',
      url: '',
    });
  };

  return {
    form,
    control,
    register,
    errors,
    fields,
    append,
    remove,
    watch,
    isLoading,
    onSave,
    handleAdd,
  };
};

