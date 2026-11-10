'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { themeService, ThemeDocument, ThemePalette } from '@/services/theme.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

const DEFAULT_DARK_THEME: ThemePalette = {
  primary: '#fbbf24',
  secondary: '#1e3a8a',
  background: '#0b1a32',
  surface: '#112344',
  header: '#0d1e3a',
  card: '#112344',
  drawer: '#0d1e3a',
  table: '#112344',
  buttonSecondary: '#1e3a8a',
  buttonPrimaryText: '#0b1a32',
  buttonSecondaryText: '#ffffff',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#1c2b48',
  success: '#22c55e',
  error: '#ea580c',
  warning: '#f59e0b',
};

const DEFAULT_THEME: ThemeDocument = {
  _id: 'default-pelotas-theme',
  name: 'Tema Oficial Áureo-Cerúleo (Modo Escuro)',
  isActive: true,
  isDefault: true,
  light: DEFAULT_DARK_THEME,
  dark: DEFAULT_DARK_THEME,
};

function getHeaderContrast(headerHex: string) {
  if (!headerHex || !headerHex.startsWith('#')) {
    return {
      text: '#ffffff',
      muted: 'rgba(255, 255, 255, 0.82)',
      border: 'rgba(255, 255, 255, 0.15)',
    };
  }
  const hex = headerHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  if (yiq >= 155) {
    return {
      text: '#0f172a',
      muted: '#475569',
      border: 'rgba(0, 0, 0, 0.1)',
    };
  }
  return {
    text: '#ffffff',
    muted: 'rgba(255, 255, 255, 0.85)',
    border: 'rgba(255, 255, 255, 0.15)',
  };
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTheme, setActiveTheme] = useState<ThemeDocument>(DEFAULT_THEME);

  const applyPalette = useCallback((palette: ThemePalette) => {
    const root = document.documentElement;

    // Modo Escuro Definitivo
    root.classList.remove('light');
    root.classList.add('dark');

    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-secondary', palette.secondary);
    root.style.setProperty('--color-background', palette.background);
    root.style.setProperty('--color-surface', palette.surface);
    root.style.setProperty('--color-header', palette.header);

    const headerContrast = getHeaderContrast(palette.header);
    root.style.setProperty('--color-header-text', headerContrast.text);
    root.style.setProperty('--color-header-text-muted', headerContrast.muted);
    root.style.setProperty('--color-header-border', headerContrast.border);
    root.style.setProperty('--color-card', palette.card);
    root.style.setProperty('--color-drawer', palette.drawer);
    root.style.setProperty('--color-table', palette.table);
    root.style.setProperty('--color-button-secondary', palette.buttonSecondary);

    const buttonPrimaryText = palette.buttonPrimaryText || '#0b1a32';
    const buttonSecondaryText = palette.buttonSecondaryText || '#ffffff';
    root.style.setProperty('--color-button-primary-text', buttonPrimaryText);
    root.style.setProperty('--color-button-secondary-text', buttonSecondaryText);

    root.style.setProperty('--color-text-primary', palette.textPrimary);
    root.style.setProperty('--color-text-secondary', palette.textSecondary);
    root.style.setProperty('--color-border', palette.border);
    root.style.setProperty('--color-success', palette.success);
    root.style.setProperty('--color-error', palette.error);
    root.style.setProperty('--color-warning', palette.warning);
  }, []);

  const fetchActiveTheme = useCallback(async () => {
    try {
      const theme = await themeService.getActiveTheme();
      if (theme) {
        setActiveTheme(theme);
      }
    } catch (err: any) {
      console.warn(
        'Utilizando paleta Áureo-Cerúlea oficial (servidor iniciando ou padrão offline):',
        err?.message || err,
      );
    }
  }, []);

  useEffect(() => {
    fetchActiveTheme();
  }, [fetchActiveTheme]);

  useRealtimeEvents('themes', () => {
    fetchActiveTheme();
  });

  useEffect(() => {
    const palette: ThemePalette = activeTheme.dark || DEFAULT_DARK_THEME;
    applyPalette(palette);
  }, [activeTheme, applyPalette]);

  return <>{children}</>;
};
