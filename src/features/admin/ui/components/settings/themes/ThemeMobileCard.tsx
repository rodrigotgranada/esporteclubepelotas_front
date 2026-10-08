import React from 'react';
import { LayoutContainer, Text, Badge, Button } from '@/shared/ui/components';
import { SETTINGS_TEXTS } from '../../../../constants/settings.constants';

interface ThemeMobileCardProps {
  theme: any;
  previewTheme: any;
  setPreviewTheme: (theme: any) => void;
  handleActivate: (id: string) => void;
  handleOpenDrawer: (theme: any) => void;
}

export const ThemeMobileCard = ({ theme, previewTheme, setPreviewTheme, handleActivate, handleOpenDrawer }: ThemeMobileCardProps) => {
  const rowKey = typeof theme._id === 'string' ? theme._id : (theme._id as any)?.$oid;
  const isPreviewed = previewTheme?._id === theme._id;

  return (
    <LayoutContainer 
      className={`bg-surface border rounded-xl p-4 flex flex-col gap-3 transition-colors cursor-pointer ${isPreviewed ? 'border-primary' : 'border-border'}`}
      onClick={() => setPreviewTheme(theme)}
    >
      <LayoutContainer className="flex justify-between items-start gap-2">
        <LayoutContainer>
          <Text className="text-base font-bold text-text-primary">{theme.name}</Text>
          {theme.isDefault && <Text className="text-xs text-text-secondary">{SETTINGS_TEXTS.THEMES.BADGE_DEFAULT}</Text>}
        </LayoutContainer>
        {theme.isActive ? (
          <Badge variant="success" size="sm">{SETTINGS_TEXTS.THEMES.BADGE_ACTIVE}</Badge>
        ) : (
          <Badge variant="default" size="sm">{SETTINGS_TEXTS.THEMES.BADGE_INACTIVE}</Badge>
        )}
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
        {!theme.isActive && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); handleActivate(rowKey); }}
          >
            {SETTINGS_TEXTS.THEMES.BTN_ACTIVATE}
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => { e.stopPropagation(); handleOpenDrawer(theme); }}
        >
          {SETTINGS_TEXTS.THEMES.BTN_EDIT}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
