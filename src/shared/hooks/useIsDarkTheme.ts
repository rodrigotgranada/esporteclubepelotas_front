'use client';

import { useState, useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

/**
 * Hook utilitário para detectar de forma segura e reativa se o tema ativo é escuro.
 * Suporta os modos 'light', 'dark' e 'system' (com listener de prefers-color-scheme).
 */
export const useIsDarkTheme = (): boolean => {
  const { mode } = useThemeStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const computeDark = () => {
      if (mode === 'dark') return true;
      if (mode === 'light') return false;
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    setIsDark(computeDark());

    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (mode === 'system') {
        setIsDark(media.matches);
      }
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [mode]);

  return isDark;
};
