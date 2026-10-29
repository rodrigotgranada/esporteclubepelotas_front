import React from 'react';
import {
  Drawer,
  Text,
  LayoutContainer,
  Button,
  Input,
  ColorInput,
  Form,
  ConfirmModal,
  Badge,
} from '@/shared/ui/components';
import { ThemeDocument } from '@/services/theme.service';
import {
  useThemeAdminDrawer,
  CAMPAIGN_PRESETS,
} from '../../../../hooks/settings/useThemeAdminDrawer';
import { SETTINGS_TEXTS } from '../../../../constants/settings.constants';

interface ThemeAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  theme?: ThemeDocument;
}

export const ThemeAdminDrawer = ({
  isOpen,
  onClose,
  onSuccess,
  theme,
}: ThemeAdminDrawerProps) => {
  const {
    formData,
    isLoading,
    isCampaign,
    campaignColor,
    startDateStr,
    setStartDateStr,
    endDateStr,
    setEndDateStr,
    showAdvanced,
    setShowAdvanced,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleChange,
    handleCampaignColorChange,
    handleSelectPreset,
    handleToggleMode,
    handleSave,
    handleDelete,
  } = useThemeAdminDrawer(theme, onSuccess, onClose);

  const renderColorInput = (label: string, field: string, mode: 'light' | 'dark') => {
    const value =
      formData[mode]?.[field as keyof typeof formData.light] || '#000000';
    return (
      <LayoutContainer className="mb-2">
        <ColorInput
          label={label}
          value={value}
          onChange={(e) => handleChange(field, e.target.value, mode)}
        />
      </LayoutContainer>
    );
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={
          theme
            ? SETTINGS_TEXTS.THEMES.DRAWER_TITLE_EDIT
            : SETTINGS_TEXTS.THEMES.DRAWER_TITLE_NEW
        }
      >
        <Form onSubmit={handleSave} className="flex flex-col h-full">
          <LayoutContainer className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Mode Switcher */}
            <LayoutContainer className="bg-surface p-1 rounded-xl border border-border flex gap-1">
              <Button
                type="button"
                variant={!isCampaign ? 'primary' : 'ghost'}
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleToggleMode(false)}
              >
                {SETTINGS_TEXTS.THEMES.MODE_CUSTOM_LABEL}
              </Button>
              <Button
                type="button"
                variant={isCampaign ? 'primary' : 'ghost'}
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleToggleMode(true)}
              >
                {SETTINGS_TEXTS.THEMES.MODE_CAMPAIGN_LABEL}
              </Button>
            </LayoutContainer>

            {/* Campaign Preset Chips & Information */}
            {isCampaign && (
              <LayoutContainer className="bg-surface/60 border border-primary/30 rounded-2xl p-4 space-y-3">
                <LayoutContainer className="flex items-center gap-2">
                  <Badge variant="success">
                    {SETTINGS_TEXTS.THEMES.BADGE_CAMPAIGN}
                  </Badge>
                  <Text className="text-xs font-semibold text-text-primary">
                    {SETTINGS_TEXTS.THEMES.CAMPAIGN_INFO_TITLE}
                  </Text>
                </LayoutContainer>
                <Text className="text-xs text-text-secondary leading-relaxed">
                  {SETTINGS_TEXTS.THEMES.CAMPAIGN_INFO_DESC}
                </Text>

                <LayoutContainer className="pt-2">
                  <Text className="text-xs font-medium text-text-secondary mb-2">
                    {SETTINGS_TEXTS.THEMES.PRESETS_TITLE}
                  </Text>
                  <LayoutContainer className="flex flex-wrap gap-2">
                    {CAMPAIGN_PRESETS.map((p) => (
                      <Button
                        key={p.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs flex items-center gap-1.5 py-1 px-2.5 hover:border-primary"
                        onClick={() => handleSelectPreset(p)}
                      >
                        <LayoutContainer
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: p.color }}
                        />
                        <Text className="text-xs text-text-primary">
                          {p.icon} {p.name}
                        </Text>
                      </Button>
                    ))}
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* Name Input */}
            <LayoutContainer>
              <Input
                label={SETTINGS_TEXTS.THEMES.FIELD_NAME_LABEL}
                placeholder={SETTINGS_TEXTS.THEMES.FIELD_NAME_PLACEHOLDER}
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </LayoutContainer>

            {/* Campaign Specific Inputs: Seed Color & Dates */}
            {isCampaign && (
              <LayoutContainer className="space-y-4">
                <ColorInput
                  label={SETTINGS_TEXTS.THEMES.FIELD_CAMPAIGN_COLOR}
                  value={campaignColor}
                  onChange={(e) => handleCampaignColorChange(e.target.value)}
                />

                <LayoutContainer className="grid grid-cols-2 gap-3">
                  <Input
                    label={SETTINGS_TEXTS.THEMES.FIELD_START_DATE}
                    type="date"
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                  />
                  <Input
                    label={SETTINGS_TEXTS.THEMES.FIELD_END_DATE}
                    type="date"
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                  />
                </LayoutContainer>
                <Text className="text-xs text-text-secondary italic">
                  {SETTINGS_TEXTS.THEMES.FIELD_DATES_HINT}
                </Text>

                {/* Live Preview Bar of Calculated Colors */}
                <LayoutContainer className="p-3 bg-surface border border-border rounded-xl space-y-2">
                  <Text className="text-xs font-medium text-text-secondary">
                    Prévia Automática de Contraste (Light & Dark)
                  </Text>
                  <LayoutContainer className="flex items-center gap-3">
                    <LayoutContainer
                      className="flex-1 p-2.5 rounded-lg border border-border flex items-center justify-between"
                      style={{
                        backgroundColor: formData.light?.background,
                        color: formData.light?.textPrimary,
                      }}
                    >
                      <Text
                        className="text-xs font-bold"
                        style={{ color: formData.light?.primary }}
                      >
                        Claro
                      </Text>
                      <LayoutContainer
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          backgroundColor: formData.light?.primary,
                          color: '#ffffff',
                        }}
                      >
                        Botão
                      </LayoutContainer>
                    </LayoutContainer>

                    <LayoutContainer
                      className="flex-1 p-2.5 rounded-lg border border-border flex items-center justify-between"
                      style={{
                        backgroundColor: formData.dark?.background,
                        color: formData.dark?.textPrimary,
                      }}
                    >
                      <Text
                        className="text-xs font-bold"
                        style={{ color: formData.dark?.primary }}
                      >
                        Escuro
                      </Text>
                      <LayoutContainer
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          backgroundColor: formData.dark?.primary,
                          color: '#ffffff',
                        }}
                      >
                        Botão
                      </LayoutContainer>
                    </LayoutContainer>
                  </LayoutContainer>
                </LayoutContainer>

                <LayoutContainer className="pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary underline"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced
                      ? SETTINGS_TEXTS.THEMES.HIDE_ADVANCED_COLORS
                      : SETTINGS_TEXTS.THEMES.SHOW_ADVANCED_COLORS}
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* Individual Hex Inputs for Light & Dark */}
            {(!isCampaign || showAdvanced) && (
              <LayoutContainer className="space-y-6">
                <LayoutContainer>
                  <Text className="font-bold text-text-primary mb-3 border-b border-border pb-2 text-sm">
                    {SETTINGS_TEXTS.THEMES.PALETTE_LIGHT}
                  </Text>
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_PRIMARY, 'primary', 'light')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_SECONDARY, 'secondary', 'light')}
                  {renderColorInput(
                    SETTINGS_TEXTS.THEMES.COLOR_BUTTON_SECONDARY,
                    'buttonSecondary',
                    'light'
                  )}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BACKGROUND, 'background', 'light')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_SURFACE, 'surface', 'light')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_HEADER, 'header', 'light')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_CARD, 'card', 'light')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_DRAWER, 'drawer', 'light')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TABLE, 'table', 'light')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TEXT_PRIMARY, 'textPrimary', 'light')}
                  {renderColorInput(
                    SETTINGS_TEXTS.THEMES.COLOR_TEXT_SECONDARY,
                    'textSecondary',
                    'light'
                  )}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BORDER, 'border', 'light')}
                </LayoutContainer>

                <LayoutContainer>
                  <Text className="font-bold text-text-primary mb-3 border-b border-border pb-2 text-sm">
                    {SETTINGS_TEXTS.THEMES.PALETTE_DARK}
                  </Text>
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_PRIMARY, 'primary', 'dark')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_SECONDARY, 'secondary', 'dark')}
                  {renderColorInput(
                    SETTINGS_TEXTS.THEMES.COLOR_BUTTON_SECONDARY,
                    'buttonSecondary',
                    'dark'
                  )}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BACKGROUND, 'background', 'dark')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_SURFACE, 'surface', 'dark')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_HEADER, 'header', 'dark')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_CARD, 'card', 'dark')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_DRAWER, 'drawer', 'dark')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TABLE, 'table', 'dark')}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TEXT_PRIMARY, 'textPrimary', 'dark')}
                  {renderColorInput(
                    SETTINGS_TEXTS.THEMES.COLOR_TEXT_SECONDARY,
                    'textSecondary',
                    'dark'
                  )}
                  {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BORDER, 'border', 'dark')}
                </LayoutContainer>
              </LayoutContainer>
            )}
          </LayoutContainer>

          <LayoutContainer className="mt-6 pt-6 border-t border-border flex justify-between gap-4">
            {theme && !theme.isDefault ? (
              <Button
                type="button"
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
              <Button type="button" variant="ghost" size="md" onClick={onClose}>
                {SETTINGS_TEXTS.THEMES.BTN_CANCEL}
              </Button>
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
        description={SETTINGS_TEXTS.THEMES.DELETE_MESSAGE.replace(
          '{themeName}',
          theme?.name || ''
        )}
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
