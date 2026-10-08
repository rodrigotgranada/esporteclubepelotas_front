'use client';

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { themeService, ThemeDocument, ThemePalette } from '@/services/theme.service';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useThemeStore();
  const [activeTheme, setActiveTheme] = useState<ThemeDocument | null>(null);

  useEffect(() => {
    // Fetch active theme from backend
    themeService.getActiveTheme()
      .then(theme => {
        if (theme) setActiveTheme(theme);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeTheme) return;

    const root = document.documentElement;
    let resolvedMode = mode;

    if (mode === 'system') {
      resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    const palette: ThemePalette = resolvedMode === 'dark' ? activeTheme.dark : activeTheme.light;

    // Remove old classes and add current mode
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedMode);

    // Inject CSS variables
    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-secondary', palette.secondary);
    root.style.setProperty('--color-background', palette.background);
    root.style.setProperty('--color-surface', palette.surface);
    root.style.setProperty('--color-header', palette.header);
    root.style.setProperty('--color-card', palette.card);
    root.style.setProperty('--color-drawer', palette.drawer);
    root.style.setProperty('--color-table', palette.table);
    root.style.setProperty('--color-button-secondary', palette.buttonSecondary);
    root.style.setProperty('--color-text-primary', palette.textPrimary);
    root.style.setProperty('--color-text-secondary', palette.textSecondary);
    root.style.setProperty('--color-border', palette.border);
    root.style.setProperty('--color-success', palette.success);
    root.style.setProperty('--color-error', palette.error);
    root.style.setProperty('--color-warning', palette.warning);

  }, [mode, activeTheme]);

  // Listen to system preferences changes if 'system' is selected
  useEffect(() => {
    if (mode !== 'system' || !activeTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      const resolvedMode = e.matches ? 'dark' : 'light';
      const palette: ThemePalette = resolvedMode === 'dark' ? activeTheme.dark : activeTheme.light;

      root.classList.remove('light', 'dark');
      root.classList.add(resolvedMode);

      root.style.setProperty('--color-primary', palette.primary);
      root.style.setProperty('--color-secondary', palette.secondary);
      root.style.setProperty('--color-background', palette.background);
      root.style.setProperty('--color-surface', palette.surface);
      root.style.setProperty('--color-text-primary', palette.textPrimary);
      root.style.setProperty('--color-text-secondary', palette.textSecondary);
      root.style.setProperty('--color-border', palette.border);
      root.style.setProperty('--color-success', palette.success);
      root.style.setProperty('--color-error', palette.error);
      root.style.setProperty('--color-warning', palette.warning);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, activeTheme]);

  return <>{children}</>;
};
