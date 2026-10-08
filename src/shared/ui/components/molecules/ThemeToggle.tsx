'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore, ThemeMode } from '@/store/useThemeStore';
import { LayoutContainer } from '../atoms/LayoutContainer';

export interface ThemeToggleProps {
  variant?: 'dropdown' | 'expanded';
}

export const ThemeToggle = ({ variant = 'dropdown' }: ThemeToggleProps) => {
  const { mode, setMode } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant === 'expanded') return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant]);

  const renderCurrentIcon = () => {
    if (mode === 'light') return <Sun size={18} />;
    if (mode === 'dark') return <Moon size={18} />;
    return <Monitor size={18} />;
  };

  const handleSelect = (selectedMode: ThemeMode) => {
    setMode(selectedMode);
    setIsOpen(false);
  };

  if (variant === 'expanded') {
    return (
      <LayoutContainer className="flex items-center p-1 bg-background border border-border rounded-full shadow-inner w-full">
        <button
          onClick={() => setMode('light')}
          className={`flex-1 py-2 flex justify-center items-center rounded-full transition-all duration-200 text-sm font-semibold gap-2 ${
            mode === 'light' ? 'bg-surface text-primary shadow border border-border' : 'text-text-secondary hover:text-text-primary'
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
            mode === 'dark' ? 'bg-surface text-primary shadow border border-border' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Moon size={16} /> <span className="hidden sm:inline">Escuro</span>
        </button>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-primary transition-colors focus:outline-none cursor-pointer"
        aria-label="Alternar Tema"
        title="Alternar Tema"
      >
        {renderCurrentIcon()}
      </button>

      {isOpen && (
        <LayoutContainer className="absolute right-0 mt-2 w-36 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => handleSelect('light')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
              mode === 'light' ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary hover:bg-background hover:text-text-primary'
            }`}
          >
            <Sun size={16} /> Claro
          </button>
          <button
            onClick={() => handleSelect('dark')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
              mode === 'dark' ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary hover:bg-background hover:text-text-primary'
            }`}
          >
            <Moon size={16} /> Escuro
          </button>
          <button
            onClick={() => handleSelect('system')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t border-border ${
              mode === 'system' ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary hover:bg-background hover:text-text-primary'
            }`}
          >
            <Monitor size={16} /> Sistema
          </button>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
