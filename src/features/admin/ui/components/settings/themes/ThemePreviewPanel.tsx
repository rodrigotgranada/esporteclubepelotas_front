import React from 'react';
import { LayoutContainer, Text, Badge } from '@/shared/ui/components';
import { ThemeDocument } from '@/services/theme.service';
import { SETTINGS_TEXTS } from '../../../../constants/settings.constants';

interface ThemePreviewPanelProps {
  previewTheme?: ThemeDocument;
}

export const ThemePreviewPanel = ({ previewTheme }: ThemePreviewPanelProps) => {
  if (!previewTheme) {
    return (
      <LayoutContainer className="h-full min-h-[380px] flex flex-col items-center justify-center bg-surface border border-border rounded-2xl p-8 text-center text-text-secondary">
        <Text>{SETTINGS_TEXTS.THEMES.PREVIEW_EMPTY_STATE}</Text>
      </LayoutContainer>
    );
  }

  const palette = previewTheme.dark || previewTheme.light;

  return (
    <LayoutContainer className="h-full flex flex-col bg-surface border border-border rounded-2xl p-6">
      <LayoutContainer className="flex justify-between items-center mb-6">
        <LayoutContainer className="flex items-center gap-2">
          <Text className="font-bold text-lg text-text-primary">
            {SETTINGS_TEXTS.THEMES.PREVIEW_PANEL_TITLE}
            {previewTheme.name}
          </Text>
          {previewTheme.isCampaign && (
            <Badge variant="primary" size="sm">
              {SETTINGS_TEXTS.THEMES.BADGE_CAMPAIGN}
            </Badge>
          )}
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer
        className="flex-1 rounded-xl p-6 overflow-hidden relative shadow-inner border border-white/5"
        style={{
          backgroundColor: palette.background,
          color: palette.textPrimary,
        }}
      >
        {/* Mock Sidebar */}
        <LayoutContainer
          className="absolute left-0 top-0 bottom-0 w-16 md:w-24 border-r opacity-50"
          style={{
            borderColor: palette.border,
            backgroundColor: palette.surface,
          }}
        />

        {/* Mock Content Area */}
        <LayoutContainer className="ml-20 md:ml-28 h-full flex flex-col gap-4">
          {/* Header */}
          <LayoutContainer
            className="flex justify-between items-center pb-4 border-b opacity-80"
            style={{ borderColor: palette.border }}
          >
            <LayoutContainer>
              <LayoutContainer
                className="h-4 w-32 rounded mb-2"
                style={{
                  backgroundColor: palette.textPrimary,
                  opacity: 0.8,
                }}
              />
              <LayoutContainer
                className="h-3 w-48 rounded"
                style={{
                  backgroundColor: palette.textSecondary,
                  opacity: 0.6,
                }}
              />
            </LayoutContainer>
            <LayoutContainer
              className="h-8 px-4 rounded-lg flex items-center justify-center font-bold text-xs"
              style={{
                backgroundColor: palette.primary,
                color: palette.buttonPrimaryText || '#000000',
              }}
            >
              Ação
            </LayoutContainer>
          </LayoutContainer>

          {/* Cards Grid */}
          <LayoutContainer className="grid grid-cols-2 gap-4">
            <LayoutContainer
              className="p-4 rounded-xl border flex flex-col justify-between h-24"
              style={{
                backgroundColor: palette.card,
                borderColor: palette.border,
              }}
            >
              <LayoutContainer
                className="h-3 w-12 rounded"
                style={{
                  backgroundColor: palette.textSecondary,
                  opacity: 0.5,
                }}
              />
              <LayoutContainer
                className="h-6 w-16 rounded font-black text-xl flex items-center"
                style={{ color: palette.primary }}
              >
                1908
              </LayoutContainer>
            </LayoutContainer>
            <LayoutContainer
              className="p-4 rounded-xl border flex flex-col justify-between h-24"
              style={{
                backgroundColor: palette.card,
                borderColor: palette.border,
              }}
            >
              <LayoutContainer
                className="h-3 w-16 rounded"
                style={{
                  backgroundColor: palette.textSecondary,
                  opacity: 0.5,
                }}
              />
              <LayoutContainer
                className="h-6 w-24 rounded font-bold text-sm flex items-center"
                style={{ color: palette.secondary }}
              >
                Pelotas
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>

          {/* Table Mock */}
          <LayoutContainer
            className="flex-1 rounded-xl border overflow-hidden p-3 flex flex-col gap-2"
            style={{
              backgroundColor: palette.table,
              borderColor: palette.border,
            }}
          >
            <LayoutContainer
              className="h-4 w-full rounded opacity-30"
              style={{ backgroundColor: palette.textSecondary }}
            />
            <LayoutContainer
              className="h-4 w-5/6 rounded opacity-20"
              style={{ backgroundColor: palette.textSecondary }}
            />
            <LayoutContainer
              className="h-4 w-4/6 rounded opacity-20"
              style={{ backgroundColor: palette.textSecondary }}
            />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
