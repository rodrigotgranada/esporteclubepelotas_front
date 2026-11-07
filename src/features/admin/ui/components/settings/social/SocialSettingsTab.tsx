'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import {
  LayoutContainer,
  Text,
  Title,
  Button,
  IconButton,
  Input,
  Select,
  Option,
  FormField,
} from '@/shared/ui/components';
import { SocialPlatform } from '@/store/useSettingsStore';
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaThreads,
  FaYoutube,
  FaTiktok,
  FaLinkedinIn,
} from 'react-icons/fa6';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { SOCIAL_SETTINGS_TEXTS } from './SocialSettingsTab.constants';
import { useSocialSettingsTab } from '@/features/admin/hooks/settings/useSocialSettingsTab';

const PLATFORM_CONFIG: Record<
  SocialPlatform,
  { name: string; icon: React.ElementType; color: string; defaultUrlPrefix: string }
> = {
  instagram: {
    name: SOCIAL_SETTINGS_TEXTS.PLATFORMS.INSTAGRAM,
    icon: FaInstagram,
    color: '#E1306C',
    defaultUrlPrefix: 'https://instagram.com/',
  },
  facebook: {
    name: SOCIAL_SETTINGS_TEXTS.PLATFORMS.FACEBOOK,
    icon: FaFacebookF,
    color: '#1877F2',
    defaultUrlPrefix: 'https://facebook.com/',
  },
  x: {
    name: SOCIAL_SETTINGS_TEXTS.PLATFORMS.X,
    icon: FaXTwitter,
    color: '#000000',
    defaultUrlPrefix: 'https://x.com/',
  },
  threads: {
    name: SOCIAL_SETTINGS_TEXTS.PLATFORMS.THREADS,
    icon: FaThreads,
    color: '#101010',
    defaultUrlPrefix: 'https://threads.net/@',
  },
  youtube: {
    name: SOCIAL_SETTINGS_TEXTS.PLATFORMS.YOUTUBE,
    icon: FaYoutube,
    color: '#ea580c',
    defaultUrlPrefix: 'https://youtube.com/@',
  },
  tiktok: {
    name: SOCIAL_SETTINGS_TEXTS.PLATFORMS.TIKTOK,
    icon: FaTiktok,
    color: '#00f2fe',
    defaultUrlPrefix: 'https://tiktok.com/@',
  },
  linkedin: {
    name: SOCIAL_SETTINGS_TEXTS.PLATFORMS.LINKEDIN,
    icon: FaLinkedinIn,
    color: '#0A66C2',
    defaultUrlPrefix: 'https://linkedin.com/company/',
  },
};

export const SocialSettingsTab = () => {
  const {
    control,
    register,
    errors,
    fields,
    remove,
    watch,
    isLoading,
    onSave,
    handleAdd,
  } = useSocialSettingsTab();

  const watchedLinks = watch('socialLinks') || [];

  return (
    <LayoutContainer className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <LayoutContainer>
          <Title level="h2" className="text-xl font-bold text-text-primary">
            {SOCIAL_SETTINGS_TEXTS.TITLE}
          </Title>
          <Text className="text-sm text-text-secondary mt-1">
            {SOCIAL_SETTINGS_TEXTS.DESCRIPTION}
          </Text>
        </LayoutContainer>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAdd}
          className="shrink-0 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {SOCIAL_SETTINGS_TEXTS.ADD_BUTTON}
        </Button>
      </LayoutContainer>

      {/* List of Social Links */}
      {fields.length === 0 ? (
        <LayoutContainer className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-surface/30">
          <Text className="text-text-secondary text-sm">
            {SOCIAL_SETTINGS_TEXTS.EMPTY_STATE}
          </Text>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAdd}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            {SOCIAL_SETTINGS_TEXTS.ADD_BUTTON}
          </Button>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="space-y-3">
          {fields.map((fieldItem, index) => {
            const currentPlatform = (watchedLinks[index]?.platform ||
              'instagram') as SocialPlatform;
            const platformConfig =
              PLATFORM_CONFIG[currentPlatform] || PLATFORM_CONFIG.instagram;
            const Icon = platformConfig.icon;
            const linkError = errors.socialLinks?.[index];

            return (
              <LayoutContainer
                key={fieldItem.id}
                className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3.5 bg-surface rounded-xl border border-border shadow-xs hover:border-primary/40 transition-colors"
              >
                {/* Platform Selector with Icon */}
                <LayoutContainer className="w-full md:w-56 shrink-0">
                  <Controller
                    control={control}
                    name={`socialLinks.${index}.platform` as const}
                    render={({ field }) => (
                      <LayoutContainer className="relative flex items-center">
                        <LayoutContainer
                          className="absolute left-3 z-10 w-6 h-6 rounded-md flex items-center justify-center text-white text-xs shadow-xs pointer-events-none"
                          style={{ backgroundColor: platformConfig.color }}
                        >
                          <Icon />
                        </LayoutContainer>
                        <Select
                          value={field.value}
                          onChange={(val) => field.onChange(val as SocialPlatform)}
                          className="pl-11"
                        >
                          {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => (
                            <Option key={key} value={key}>
                              {cfg.name}
                            </Option>
                          ))}
                        </Select>
                      </LayoutContainer>
                    )}
                  />
                </LayoutContainer>

                {/* Profile Label */}
                <LayoutContainer className="flex-1">
                  <FormField error={linkError?.label?.message}>
                    <Input
                      {...register(`socialLinks.${index}.label` as const)}
                      placeholder={SOCIAL_SETTINGS_TEXTS.LABEL_PLACEHOLDER}
                    />
                  </FormField>
                </LayoutContainer>

                {/* URL */}
                <LayoutContainer className="flex-1 md:flex-[1.5]">
                  <FormField error={linkError?.url?.message}>
                    <Input
                      {...register(`socialLinks.${index}.url` as const)}
                      placeholder={platformConfig.defaultUrlPrefix}
                    />
                  </FormField>
                </LayoutContainer>

                {/* Actions */}
                <LayoutContainer className="flex items-center gap-1 shrink-0 self-end md:self-center">
                  {watchedLinks[index]?.url && (
                    <IconButton
                      icon={<ExternalLink className="w-4 h-4" />}
                      variant="ghost"
                      onClick={() => window.open(watchedLinks[index].url, '_blank')}
                      title="Abrir link"
                      className="text-text-secondary hover:text-primary"
                    />
                  )}

                  <IconButton
                    icon={<Trash2 className="w-4 h-4" />}
                    variant="ghost"
                    onClick={() => remove(index)}
                    title={SOCIAL_SETTINGS_TEXTS.REMOVE_TOOLTIP}
                    className="text-text-secondary hover:text-[#ea580c]"
                  />
                </LayoutContainer>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      )}

      {/* Footer Save Button */}
      {fields.length > 0 && (
        <LayoutContainer className="flex justify-end pt-4 border-t border-border">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onSave}
            isLoading={isLoading}
            className="w-full sm:w-auto font-semibold px-8"
          >
            {isLoading
              ? SOCIAL_SETTINGS_TEXTS.SAVING_BUTTON
              : SOCIAL_SETTINGS_TEXTS.SAVE_BUTTON}
          </Button>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
