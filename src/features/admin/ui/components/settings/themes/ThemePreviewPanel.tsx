import React, { useState } from 'react';
import { LayoutContainer, Text, IconButton } from '@/shared/ui/components';
import { ThemeDocument } from '@/services/theme.service';
import { Moon, Sun } from 'lucide-react';
import { SETTINGS_TEXTS } from '../../../../constants/settings.constants';

interface ThemePreviewPanelProps {
  theme: ThemeDocument;
}

export const ThemePreviewPanel = ({ theme }: ThemePreviewPanelProps) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  
  const palette = theme[mode];

  return (
    <LayoutContainer className="h-full flex flex-col bg-surface border border-border rounded-2xl p-6">
      <LayoutContainer className="flex justify-between items-center mb-6">
        <Text className="font-bold text-lg text-text-primary">{SETTINGS_TEXTS.THEMES.PREVIEW_PANEL_TITLE}{theme.name}</Text>
        <LayoutContainer className="flex bg-background rounded-lg p-1 border border-border gap-1">
          <IconButton 
            onClick={() => setMode('light')}
            icon={<Sun size={16} />}
            variant="ghost"
            className={`transition-colors h-8 w-8 ${mode === 'light' ? 'bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          />
          <IconButton 
            onClick={() => setMode('dark')}
            icon={<Moon size={16} />}
            variant="ghost"
            className={`transition-colors h-8 w-8 ${mode === 'dark' ? 'bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          />
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer 
        className="flex-1 rounded-xl p-6 overflow-hidden relative shadow-inner border border-white/5"
        style={{ backgroundColor: palette.background, color: palette.textPrimary }}
      >
        {/* Fake Sidebar */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-16 md:w-24 border-r opacity-50"
          style={{ borderColor: palette.border, backgroundColor: palette.surface }}
        />

        {/* Fake Content Area */}
        <div className="ml-20 md:ml-28 h-full flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b opacity-80" style={{ borderColor: palette.border }}>
            <div>
              <div className="h-4 w-32 rounded mb-2" style={{ backgroundColor: palette.textPrimary, opacity: 0.8 }} />
              <div className="h-3 w-48 rounded" style={{ backgroundColor: palette.textSecondary, opacity: 0.6 }} />
            </div>
            <div 
              className="h-8 w-8 rounded-full" 
              style={{ backgroundColor: palette.primary }}
            />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div 
              className="p-4 rounded-xl shadow-sm border"
              style={{ backgroundColor: palette.surface, borderColor: palette.border }}
            >
              <div className="h-3 w-20 rounded mb-4" style={{ backgroundColor: palette.textSecondary }} />
              <div className="h-6 w-12 rounded" style={{ backgroundColor: palette.primary }} />
            </div>
            <div 
              className="p-4 rounded-xl shadow-sm border"
              style={{ backgroundColor: palette.surface, borderColor: palette.border }}
            >
              <div className="h-3 w-20 rounded mb-4" style={{ backgroundColor: palette.textSecondary }} />
              <div className="h-6 w-12 rounded" style={{ backgroundColor: palette.secondary }} />
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-auto pt-4 flex justify-end gap-2">
            <div 
              className="px-4 py-2 rounded-lg text-sm font-bold opacity-80 border"
              style={{ borderColor: palette.border, color: palette.textPrimary }}
            >
              {SETTINGS_TEXTS.THEMES.PREVIEW_PANEL_BTN_CANCEL}
            </div>
            <div 
              className="px-4 py-2 rounded-lg text-sm font-bold shadow-md"
              style={{ backgroundColor: palette.primary, color: '#171717' }} 
            >
              {SETTINGS_TEXTS.THEMES.PREVIEW_PANEL_BTN_MAIN}
            </div>
          </div>
        </div>
      </LayoutContainer>
    </LayoutContainer>
  );
};
