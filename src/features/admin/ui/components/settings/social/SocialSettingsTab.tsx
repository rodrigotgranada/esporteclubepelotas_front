'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutContainer,
  Text,
  Title,
  Button,
  Input,
  Select,
  Option,
} from '@/shared/ui/components';
import { useSettingsStore, SocialPlatform, SocialLinkItem } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { toast } from 'react-hot-toast';
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
  const { settings, updateSettings } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState<SocialLinkItem[]>([]);

  useEffect(() => {
    if (settings?.socialLinks && settings.socialLinks.length > 0) {
      setLinks(settings.socialLinks);
    } else if (settings?.socialMedia) {
      // Migrate from old structure if present
      const migrated: SocialLinkItem[] = [];
      const sm = settings.socialMedia;
      if (Array.isArray(sm.instagram)) {
        sm.instagram.forEach((url, i) =>
          url && migrated.push({ platform: 'instagram', label: i === 0 ? '@ecpelotas (Oficial)' : `@ecpelotas ${i + 1}`, url })
        );
      }
      if (Array.isArray(sm.facebook)) {
        sm.facebook.forEach((url, i) =>
          url && migrated.push({ platform: 'facebook', label: i === 0 ? 'Pelotas Oficial' : `Pelotas ${i + 1}`, url })
        );
      }
      if (Array.isArray(sm.x)) {
        sm.x.forEach((url, i) =>
          url && migrated.push({ platform: 'x', label: i === 0 ? '@ecpelotas' : `@ecpelotas ${i + 1}`, url })
        );
      }
      if (Array.isArray(sm.youtube)) {
        sm.youtube.forEach((url, i) =>
          url && migrated.push({ platform: 'youtube', label: i === 0 ? 'TV Lobo Oficial' : `Pelotas Vídeos ${i + 1}`, url })
        );
      }
      setLinks(migrated.length > 0 ? migrated : [{ platform: 'instagram', label: '@ecpelotas', url: 'https://instagram.com/ecpelotas' }]);
    } else {
      setLinks([
        { platform: 'instagram', label: '@ecpelotas (Oficial)', url: 'https://instagram.com/ecpelotas' },
        { platform: 'facebook', label: 'Esporte Clube Pelotas', url: 'https://facebook.com/ecpelotas' },
        { platform: 'x', label: '@ecpelotas', url: 'https://x.com/ecpelotas' },
        { platform: 'youtube', label: 'TV Lobo Oficial', url: 'https://youtube.com/@ecpelotasoficial' },
      ]);
    }
  }, [settings]);

  const handleFieldChange = (index: number, field: keyof SocialLinkItem, value: string) => {
    setLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddLink = () => {
    setLinks((prev) => [
      ...prev,
      {
        platform: 'instagram',
        label: '',
        url: '',
      },
    ]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const cleanedLinks = links
        .map((item) => ({
          platform: item.platform,
          label: item.label.trim(),
          url: item.url.trim(),
        }))
        .filter((item) => item.url !== '');

      const payload = {
        socialLinks: cleanedLinks,
      };

      const updated = await settingsApi.updateSettings(payload);
      updateSettings({ socialLinks: updated.socialLinks });
      setLinks(updated.socialLinks || []);
      toast.success(SOCIAL_SETTINGS_TEXTS.TOAST_SUCCESS);
    } catch (error) {
      console.error('Error updating social settings:', error);
      toast.error(SOCIAL_SETTINGS_TEXTS.TOAST_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutContainer className="max-w-4xl bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <LayoutContainer>
          <Title level="h2" className="text-xl font-bold text-text-primary">
            {SOCIAL_SETTINGS_TEXTS.TITLE}
          </Title>
          <Text className="text-sm text-text-secondary mt-1">
            {SOCIAL_SETTINGS_TEXTS.DESCRIPTION}
          </Text>
        </LayoutContainer>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddLink}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shrink-0"
        >
          {SOCIAL_SETTINGS_TEXTS.ADD_BUTTON}
        </Button>
      </LayoutContainer>

      {links.length === 0 ? (
        <LayoutContainer className="p-8 text-center border-2 border-dashed border-border rounded-xl">
          <Text className="text-text-secondary text-sm">
            {SOCIAL_SETTINGS_TEXTS.EMPTY_STATE}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="flex flex-col gap-4">
          {links.map((link, index) => {
            const platformConfig = PLATFORM_CONFIG[link.platform] || PLATFORM_CONFIG.instagram;
            const IconComponent = platformConfig.icon;

            return (
              <LayoutContainer
                key={index}
                className="bg-background border border-border rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:border-primary/40"
              >
                {/* Platform Badge with Icon */}
                <LayoutContainer className="flex items-center gap-3 md:w-56 shrink-0">
                  <LayoutContainer
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: `${platformConfig.color}18`, color: platformConfig.color }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </LayoutContainer>

                  <LayoutContainer className="flex-1">
                    <Select
                      value={link.platform}
                      onChange={(e) =>
                        handleFieldChange(index, 'platform', e.target.value as SocialPlatform)
                      }
                      className="w-full text-xs font-semibold"
                    >
                      {Object.keys(PLATFORM_CONFIG).map((platKey) => (
                        <Option key={platKey} value={platKey}>
                          {PLATFORM_CONFIG[platKey as SocialPlatform].name}
                        </Option>
                      ))}
                    </Select>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Label input */}
                <LayoutContainer className="flex-1 md:w-1/3">
                  <Input
                    placeholder={SOCIAL_SETTINGS_TEXTS.FIELD_LABEL_PLACEHOLDER}
                    value={link.label}
                    onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                    className="text-sm"
                  />
                </LayoutContainer>

                {/* URL input */}
                <LayoutContainer className="flex-1 md:w-1/2">
                  <Input
                    placeholder={platformConfig.defaultUrlPrefix || SOCIAL_SETTINGS_TEXTS.FIELD_URL_PLACEHOLDER}
                    value={link.url}
                    onChange={(e) => handleFieldChange(index, 'url', e.target.value)}
                    className="text-sm"
                  />
                </LayoutContainer>

                {/* Actions */}
                <LayoutContainer className="flex items-center gap-2 justify-end shrink-0">
                  {link.url && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-text-secondary hover:text-primary transition-colors"
                      title={link.url}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error hover:bg-error/10 p-2 h-auto"
                    onClick={() => handleRemoveLink(index)}
                    title={SOCIAL_SETTINGS_TEXTS.BTN_REMOVE}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      )}

      {/* Footer Actions */}
      <LayoutContainer className="pt-4 border-t border-border flex justify-end gap-3">
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={isLoading}
          className="min-w-[180px]"
        >
          {isLoading ? SOCIAL_SETTINGS_TEXTS.SAVING_BUTTON : SOCIAL_SETTINGS_TEXTS.SAVE_BUTTON}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
