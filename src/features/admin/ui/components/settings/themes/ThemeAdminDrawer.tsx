import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Drawer,
  Text,
  LayoutContainer,
  Button,
  Input,
  ColorInput,
  Form,
  FormField,
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
    form,
    isLoading,
    showAdvanced,
    setShowAdvanced,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleCampaignColorChange,
    handleSelectPreset,
    handleToggleMode,
    handleSave,
    handleDelete,
  } = useThemeAdminDrawer(theme, onSuccess, onClose);

  const isCampaign = form.watch('isCampaign');
  const campaignColor = form.watch('campaignColor');
  const darkPalette = form.watch('dark');

  const renderColorInput = (label: string, field: string) => {
    const fieldName = `dark.${field}` as any;
    return (
      <Controller
        name={fieldName}
        control={form.control}
        render={({ field: f }) => (
          <LayoutContainer className="mb-2">
            <ColorInput
              label={label}
              value={f.value || '#000000'}
              onChange={(e) => f.onChange(e.target.value)}
            />
          </LayoutContainer>
        )}
      />
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
            {/* Alternador de Modo: Campanha Sazonal vs Paleta Oficial */}
            <LayoutContainer className="bg-surface p-1 rounded-xl border border-border flex gap-1">
              <Button
                type="button"
                variant={isCampaign ? 'primary' : 'ghost'}
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleToggleMode(true)}
              >
                {SETTINGS_TEXTS.THEMES.MODE_CAMPAIGN_LABEL}
              </Button>
              <Button
                type="button"
                variant={!isCampaign ? 'primary' : 'ghost'}
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleToggleMode(false)}
              >
                {SETTINGS_TEXTS.THEMES.MODE_CUSTOM_LABEL}
              </Button>
            </LayoutContainer>

            {/* Presets Rápidos de Campanhas Sazonais */}
            {isCampaign && (
              <LayoutContainer className="bg-surface/60 border border-secondary/30 rounded-2xl p-4 space-y-3 shadow-sm">
                <LayoutContainer className="flex items-center gap-2">
                  <Badge variant="default" className="bg-secondary/20 text-secondary border-secondary/40 font-bold">
                    {SETTINGS_TEXTS.THEMES.BADGE_CAMPAIGN}
                  </Badge>
                  <Text className="text-xs font-semibold text-text-primary">
                    {SETTINGS_TEXTS.THEMES.CAMPAIGN_INFO_TITLE}
                  </Text>
                </LayoutContainer>
                <Text className="text-xs text-text-secondary leading-relaxed">
                  Escolha um preset ou defina a cor principal. O portal aplica automaticamente o cálculo dinâmico sobre a base escura oficial do clube.
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
                        className="text-xs flex items-center gap-1.5 py-1 px-2.5 hover:border-secondary cursor-pointer"
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

            {/* Nome da Campanha / Tema */}
            <FormField
              name="name"
              control={form.control}
              label={SETTINGS_TEXTS.THEMES.FIELD_NAME_LABEL}
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={SETTINGS_TEXTS.THEMES.FIELD_NAME_PLACEHOLDER}
                  error={form.formState.errors.name?.message}
                />
              )}
            />

            {/* Seletor da Cor da Campanha e Vigência */}
            {isCampaign && (
              <LayoutContainer className="space-y-4">
                <Controller
                  name="campaignColor"
                  control={form.control}
                  render={({ field }) => (
                    <ColorInput
                      label={SETTINGS_TEXTS.THEMES.FIELD_CAMPAIGN_COLOR}
                      value={field.value || campaignColor}
                      onChange={(e) => handleCampaignColorChange(e.target.value)}
                    />
                  )}
                />

                <LayoutContainer className="grid grid-cols-2 gap-4">
                  <FormField
                    name="startDate"
                    control={form.control}
                    label={SETTINGS_TEXTS.THEMES.FIELD_START_DATE}
                    render={({ field }) => (
                      <Input
                        type="date"
                        value={field.value ? String(field.value).split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="AAAA-MM-DD"
                      />
                    )}
                  />
                  <FormField
                    name="endDate"
                    control={form.control}
                    label={SETTINGS_TEXTS.THEMES.FIELD_END_DATE}
                    render={({ field }) => (
                      <Input
                        type="date"
                        value={field.value ? String(field.value).split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="AAAA-MM-DD"
                      />
                    )}
                  />
                </LayoutContainer>
                <Text className="text-xs text-text-secondary italic">
                  {SETTINGS_TEXTS.THEMES.FIELD_DATES_HINT}
                </Text>

                {/* Prévia da Paleta Calculada no Fundo Escuro */}
                <LayoutContainer className="p-3.5 bg-surface border border-border rounded-xl space-y-2">
                  <Text className="text-xs font-semibold text-text-secondary">
                    Prévia do Contraste em Modo Escuro
                  </Text>
                  <LayoutContainer
                    className="p-3 rounded-lg border border-border flex items-center justify-between"
                    style={{
                      backgroundColor: darkPalette?.background || '#0b1a32',
                      color: darkPalette?.textPrimary || '#f8fafc',
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: darkPalette?.primary || campaignColor }}
                    >
                      Destaque da Campanha
                    </Text>
                    <LayoutContainer
                      className="px-2.5 py-1 rounded text-[10px] font-bold shadow-xs"
                      style={{
                        backgroundColor: darkPalette?.primary || campaignColor,
                        color: (darkPalette as any)?.buttonPrimaryText || '#0b1a32',
                      }}
                    >
                      Botão Oficial
                    </LayoutContainer>
                  </LayoutContainer>
                </LayoutContainer>

                <LayoutContainer className="pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-secondary underline cursor-pointer"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced
                      ? SETTINGS_TEXTS.THEMES.HIDE_ADVANCED_COLORS
                      : SETTINGS_TEXTS.THEMES.SHOW_ADVANCED_COLORS}
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* Inputs de Cores em Modo Escuro (Apenas quando não for campanha ou modo avançado) */}
            {(!isCampaign || showAdvanced) && (
              <LayoutContainer className="space-y-4">
                <Text className="font-bold text-text-primary border-b border-border pb-2 text-sm">
                  Paleta Noturna Oficial do Clube
                </Text>
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_PRIMARY, 'primary')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_SECONDARY, 'secondary')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BUTTON_SECONDARY, 'buttonSecondary')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BACKGROUND, 'background')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_SURFACE, 'surface')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_HEADER, 'header')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_CARD, 'card')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_DRAWER, 'drawer')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TABLE, 'table')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TEXT_PRIMARY, 'textPrimary')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_TEXT_SECONDARY, 'textSecondary')}
                {renderColorInput(SETTINGS_TEXTS.THEMES.COLOR_BORDER, 'border')}
              </LayoutContainer>
            )}
          </LayoutContainer>

          <LayoutContainer className="mt-6 pt-6 border-t border-border flex justify-between gap-4">
            {theme && !theme.isDefault ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                className="text-orange-500 hover:bg-orange-500/10 border-orange-500/30 cursor-pointer"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                {SETTINGS_TEXTS.THEMES.BTN_DELETE}
              </Button>
            ) : (
              <LayoutContainer />
            )}
            <LayoutContainer className="flex gap-4">
              <Button type="button" variant="ghost" size="md" onClick={onClose} className="cursor-pointer">
                {SETTINGS_TEXTS.THEMES.BTN_CANCEL}
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="cursor-pointer">
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
