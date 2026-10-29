import React from 'react';
import { LayoutContainer, Text, Badge, Button } from '@/shared/ui/components';
import { SETTINGS_TEXTS } from '../../../../constants/settings.constants';
import { ThemeDocument } from '@/services/theme.service';

interface ThemeMobileCardProps {
  theme: ThemeDocument;
  previewTheme?: ThemeDocument;
  setPreviewTheme: (theme: ThemeDocument) => void;
  handleActivate: (id: string) => void;
  handleDeactivate?: (id: string) => void;
  handleOpenDrawer: (theme: ThemeDocument) => void;
  getThemeStatus: (theme: ThemeDocument) => {
    label: string;
    variant: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    isCampaignActive: boolean;
  };
}

export const ThemeMobileCard = ({
  theme,
  previewTheme,
  setPreviewTheme,
  handleActivate,
  handleDeactivate,
  handleOpenDrawer,
  getThemeStatus,
}: ThemeMobileCardProps) => {
  const rowKey =
    typeof theme._id === 'string' ? theme._id : (theme._id as any)?.$oid;
  const isPreviewed = previewTheme?._id === theme._id;
  const status = getThemeStatus(theme);

  const formatDate = (date?: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    return !isNaN(d.getTime()) ? d.toLocaleDateString('pt-BR') : '';
  };

  return (
    <LayoutContainer
      className={`bg-surface border rounded-xl p-4 flex flex-col gap-3 transition-colors cursor-pointer ${
        isPreviewed ? 'border-primary' : 'border-border'
      }`}
      onClick={() => setPreviewTheme(theme)}
    >
      <LayoutContainer className="flex justify-between items-start gap-2">
        <LayoutContainer>
          <LayoutContainer className="flex items-center gap-2 flex-wrap">
            <Text className="text-base font-bold text-text-primary">
              {theme.name}
            </Text>
            {theme.isCampaign && (
              <Badge variant="primary" size="sm">
                {SETTINGS_TEXTS.THEMES.BADGE_CAMPAIGN}
              </Badge>
            )}
          </LayoutContainer>

          {theme.isDefault && (
            <Text className="text-xs text-text-secondary">
              {SETTINGS_TEXTS.THEMES.BADGE_DEFAULT}
            </Text>
          )}

          {theme.isCampaign && (theme.startDate || theme.endDate) && (
            <Text className="text-xs text-text-secondary mt-0.5">
              📅 {formatDate(theme.startDate)} {theme.endDate ? `até ${formatDate(theme.endDate)}` : ''}
            </Text>
          )}
        </LayoutContainer>

        <Badge variant={status.variant} size="sm">
          {status.label}
        </Badge>
      </LayoutContainer>

      <LayoutContainer className="flex items-center gap-2 mt-2">
        <Text className="text-xs text-text-secondary mr-2">Cores:</Text>
        <LayoutContainer
          className="w-6 h-6 rounded-full border border-border"
          style={{ backgroundColor: theme.light.primary }}
          title={`Primary (Light): ${theme.light.primary}`}
        />
        <LayoutContainer
          className="w-6 h-6 rounded-full border border-border"
          style={{ backgroundColor: theme.light.background }}
          title={`Background (Light): ${theme.light.background}`}
        />
        <LayoutContainer
          className="w-6 h-6 rounded-full border border-border"
          style={{ backgroundColor: theme.dark.background }}
          title={`Background (Dark): ${theme.dark.background}`}
        />
      </LayoutContainer>

      <LayoutContainer className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
        {!theme.isActive ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleActivate(rowKey);
            }}
          >
            {SETTINGS_TEXTS.THEMES.BTN_ACTIVATE}
          </Button>
        ) : (
          theme.isCampaign && handleDeactivate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-amber-500 hover:border-amber-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDeactivate(rowKey);
              }}
            >
              {SETTINGS_TEXTS.THEMES.BTN_DEACTIVATE}
            </Button>
          )
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDrawer(theme);
          }}
        >
          {SETTINGS_TEXTS.THEMES.BTN_EDIT}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
