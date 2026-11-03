import { create } from 'zustand';

export type SocialPlatform = 'instagram' | 'facebook' | 'x' | 'threads' | 'youtube' | 'tiktok' | 'linkedin';

export interface SocialLinkItem {
  platform: SocialPlatform;
  label: string;
  url: string;
}

export interface ContactPhoneItem {
  label: string;
  number: string;
  isWhatsapp?: boolean;
}

export interface ContactEmailItem {
  label: string;
  email: string;
}

export interface Settings {
  clubLogoUrl: string | null;
  clubLogoGallery?: string[];
  clubName: string;
  socialMedia?: {
    instagram?: string[];
    facebook?: string[];
    x?: string[];
    youtube?: string[];
  };
  socialLinks?: SocialLinkItem[];
  contactPhones?: ContactPhoneItem[];
  contactEmails?: ContactEmailItem[];
  stadiumName?: string;
  stadiumAddress?: string;
  googleMapsEmbedUrl?: string;
  copyrightText?: string;
}

interface SettingsState {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
  updateSettings: (partial: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
  updateSettings: (partial) =>
    set((state) => ({
      settings: state.settings
        ? { ...state.settings, ...partial }
        : {
            clubLogoUrl: null,
            clubName: 'Esporte Clube Pelotas',
            ...partial,
          },
    })),
}));
