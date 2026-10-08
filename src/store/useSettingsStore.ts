import { create } from 'zustand';

export interface Settings {
  clubLogoUrl: string | null;
  clubLogoGallery?: string[];
  clubName: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    x?: string;
    youtube?: string;
  };
}

interface SettingsState {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
  updateSettings: (partial: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
  updateSettings: (partial) => set((state) => ({ 
    settings: state.settings ? { ...state.settings, ...partial } : { clubLogoUrl: null, clubName: 'Esporte Clube Pelotas', ...partial } 
  })),
}));
