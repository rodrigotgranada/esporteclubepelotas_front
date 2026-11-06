'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { LayoutContainer } from '../atoms/LayoutContainer';

export interface ThemeToggleProps {
  variant?: 'dropdown' | 'expanded';
}

export const ThemeToggle = ({ variant = 'dropdown' }: ThemeToggleProps) => {
  const { mode, setMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark =
    mode === 'dark' ||
    (mode === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleToggle = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <LayoutContainer className="w-10 h-10 rounded-full bg-surface/50 border border-border" />
    );
  }

  if (variant === 'expanded') {
    return (
      <LayoutContainer className="flex items-center p-1 bg-background border border-border rounded-full shadow-inner w-full">
        <button
          onClick={() => setMode('light')}
          className={`flex-1 py-2 flex justify-center items-center rounded-full transition-all duration-200 text-sm font-semibold gap-2 ${
            !isDark ? 'bg-surface text-primary shadow border border-border' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Sun size={16} /> <span className="hidden sm:inline">Claro</span>
        </button>
        <button
          onClick={() => setMode('system')}
          className={`flex-1 py-2 flex justify-center items-center rounded-full transition-all duration-200 text-sm font-semibold gap-2 ${
            mode === 'system' ? 'bg-surface text-primary shadow border border-border' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Monitor size={16} /> <span className="hidden sm:inline">Auto</span>
        </button>
        <button
          onClick={() => setMode('dark')}
          className={`flex-1 py-2 flex justify-center items-center rounded-full transition-all duration-200 text-sm font-semibold gap-2 ${
            isDark ? 'bg-surface text-primary shadow border border-border' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Moon size={16} /> <span className="hidden sm:inline">Escuro</span>
        </button>
      </LayoutContainer>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-primary transition-all duration-200 focus:outline-none cursor-pointer group"
      aria-label={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
      title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
    >
      {isDark ? (
        <Sun size={18} className="text-primary group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon size={18} className="text-secondary group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
};
