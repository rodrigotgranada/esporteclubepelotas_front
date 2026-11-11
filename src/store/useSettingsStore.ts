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

export interface FooterNavigationItem {
  label: string;
  url: string;
  isVisible?: boolean;
  isExternal?: boolean;
}

export interface OpeningHourItem {
  department: string;
  schedule: string;
}

export const DEFAULT_CLUB_LOGO = '/images/pelotas-logo.png';
export const DEFAULT_CLUB_NAME = 'Esporte Clube Pelotas';

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
  footerNavigationLinks?: FooterNavigationItem[];
  openingHours?: OpeningHourItem[];
  stadiumName?: string;
  stadiumAddress?: string;
  googleMapsEmbedUrl?: string;
  copyrightText?: string;
  membershipSystemProvider?: 'ELEVENTICKETS' | 'NATIVE';
  membershipExternalUrl?: string;
  storeName?: string;
  storeDescription?: string;
  storeFacadeUrl?: string | null;
  storeExternalUrl?: string;
  storeIsOnlineActive?: boolean;
  storeInstagramUrl?: string;
  storeInstagramDescription?: string;
  storeWhatsappNumber?: string;
  storeWhatsappDescription?: string;
  storeWhatsappMessage?: string;
  storeOpeningHours?: string;
  storeAddress?: string;
  storeHasMemberDiscount?: boolean;
  storeMemberDiscountText?: string;
  newsletterIsActive?: boolean;
}

interface SettingsState {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
  updateSettings: (partial: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    clubLogoUrl: DEFAULT_CLUB_LOGO,
    clubName: DEFAULT_CLUB_NAME,
    clubLogoGallery: [],
    newsletterIsActive: true,
  },
  setSettings: (newSettings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
        clubLogoUrl: newSettings.clubLogoUrl || DEFAULT_CLUB_LOGO,
        clubName: newSettings.clubName || DEFAULT_CLUB_NAME,
      },
    })),
  updateSettings: (partial) =>
    set((state) => ({
      settings: state.settings
        ? {
            ...state.settings,
            ...partial,
            clubLogoUrl:
              partial.clubLogoUrl !== undefined
                ? partial.clubLogoUrl || DEFAULT_CLUB_LOGO
                : state.settings.clubLogoUrl || DEFAULT_CLUB_LOGO,
            clubName:
              partial.clubName !== undefined
                ? partial.clubName || DEFAULT_CLUB_NAME
                : state.settings.clubName || DEFAULT_CLUB_NAME,
          }
        : {
            clubLogoUrl: partial.clubLogoUrl || DEFAULT_CLUB_LOGO,
            clubName: partial.clubName || DEFAULT_CLUB_NAME,
            ...partial,
          },
    })),
}));
