import { api } from './api';

export interface ThemePalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  header: string;
  card: string;
  drawer: string;
  table: string;
  buttonSecondary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  error: string;
  warning: string;
}

export interface ThemeDocument {
  _id: string;
  name: string;
  isActive: boolean;
  isDefault: boolean;
  light: ThemePalette;
  dark: ThemePalette;
}

export const themeService = {
  getActiveTheme: async (): Promise<ThemeDocument> => {
    const response = await api.get('/themes/active');
    return response.data;
  },

  getThemes: async (): Promise<ThemeDocument[]> => {
    const response = await api.get('/themes');
    return response.data;
  },

  createTheme: async (data: Partial<ThemeDocument>): Promise<ThemeDocument> => {
    const response = await api.post('/themes', data);
    return response.data;
  },

  updateTheme: async (id: string, data: Partial<ThemeDocument>): Promise<ThemeDocument> => {
    const response = await api.patch(`/themes/${id}`, data);
    return response.data;
  },

  activateTheme: async (id: string): Promise<void> => {
    await api.post(`/themes/${id}/activate`);
  },

  deleteTheme: async (id: string): Promise<void> => {
    await api.delete(`/themes/${id}`);
  }
};
