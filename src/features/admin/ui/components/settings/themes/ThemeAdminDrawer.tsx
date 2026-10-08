import React from 'react';
import { Drawer, Text, LayoutContainer, Button, Input, Form, ConfirmModal } from '@/shared/ui/components';
import { ThemeDocument } from '@/services/theme.service';
import { useThemeAdminDrawer } from '../../../../hooks/settings/useThemeAdminDrawer';
import { SETTINGS_TEXTS } from '../../../../constants/settings.constants';

interface ThemeAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  theme?: ThemeDocument;
}

export const ThemeAdminDrawer = ({ isOpen, onClose, onSuccess, theme }: ThemeAdminDrawerProps) => {
  const { formData, isLoading, isDeleteModalOpen, setIsDeleteModalOpen, handleChange, handleSave, handleDelete } = useThemeAdminDrawer(theme, onSuccess, onClose);

  const renderColorInput = (label: string, field: string, mode: 'light' | 'dark') => {
    const value = formData[mode]?.[field as keyof typeof formData.light] || '#000000';
    return (
      <LayoutContainer className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border mb-2">
        <Text className="text-sm font-semibold text-text-primary">{label}</Text>
        <LayoutContainer className="flex items-center gap-3">
          <Text className="text-xs text-text-secondary uppercase">{value}</Text>
          <input
            type="color"
            value={value}
            onChange={(e) => handleChange(field, e.target.value, mode)}
            className="w-8 h-8 p-0 border-0 rounded cursor-pointer bg-transparent"
          />
        </LayoutContainer>
      </LayoutContainer>
    );
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={theme ? SETTINGS_TEXTS.THEMES.DRAWER_TITLE_EDIT : SETTINGS_TEXTS.THEMES.DRAWER_TITLE_NEW}
      >
        <Form onSubmit={handleSave} className="flex flex-col h-full">
          <LayoutContainer className="flex-1 overflow-y-auto space-y-6 pr-2">
            
            <LayoutContainer>
              <Input
                label={SETTINGS_TEXTS.THEMES.FIELD_NAME_LABEL}
                placeholder={SETTINGS_TEXTS.THEMES.FIELD_NAME_PLACEHOLDER}
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </LayoutContainer>

            <LayoutContainer>
              <Text className="font-bold text-text-primary mb-4 border-b border-border pb-2">{SETTINGS_TEXTS.THEMES.PALETTE_LIGHT}</Text>
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_PRIMARY, 'primary', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_SECONDARY, 'secondary', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BUTTON_SECONDARY, 'buttonSecondary', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BACKGROUND, 'background', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_SURFACE, 'surface', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_HEADER, 'header', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_CARD, 'card', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_DRAWER, 'drawer', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TABLE, 'table', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TEXT_PRIMARY, 'textPrimary', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TEXT_SECONDARY, 'textSecondary', 'light')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BORDER, 'border', 'light')}
            </LayoutContainer>

            <LayoutContainer>
              <Text className="font-bold text-text-primary mb-4 border-b border-border pb-2 mt-6">{SETTINGS_TEXTS.THEMES.PALETTE_DARK}</Text>
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_PRIMARY, 'primary', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_SECONDARY, 'secondary', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BUTTON_SECONDARY, 'buttonSecondary', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BACKGROUND, 'background', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_SURFACE, 'surface', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_HEADER, 'header', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_CARD, 'card', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_DRAWER, 'drawer', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TABLE, 'table', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TEXT_PRIMARY, 'textPrimary', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TEXT_SECONDARY, 'textSecondary', 'dark')}
              {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BORDER, 'border', 'dark')}
            </LayoutContainer>

          </LayoutContainer>

          <LayoutContainer className="mt-6 pt-6 border-t border-border flex justify-between gap-4">
            {theme && !theme.isDefault ? (
              <Button 
                variant="outline" 
                size="md" 
                className="text-red-500 hover:bg-red-500/10 border-red-500/30"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                {SETTINGS_TEXTS.THEMES.BTN_DELETE}
              </Button>
            ) : (
              <LayoutContainer />
            )}
            <LayoutContainer className="flex gap-4">
              <Button variant="ghost" size="md" onClick={onClose}>{SETTINGS_TEXTS.THEMES.BTN_CANCEL}</Button>
              <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
                {theme ? SETTINGS_TEXTS.THEMES.BTN_SAVE : SETTINGS_TEXTS.THEMES.BTN_CREATE}
              </Button>
            </LayoutContainer>
          </LayoutContainer>
        </Form>
      </Drawer>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={SETTINGS_TEXTS.THEMES.DELETE_TITLE}
        description={SETTINGS_TEXTS.THEMES.DELETE_MESSAGE.replace('{themeName}', theme?.name || '')}
        confirmText={SETTINGS_TEXTS.THEMES.DELETE_CONFIRM}
        onConfirm={async () => {
          await handleDelete();
        }}
        onClose={() => setIsDeleteModalOpen(false)}
        isLoading={isLoading}
        variant="danger"
      />
    </>
  );
};
