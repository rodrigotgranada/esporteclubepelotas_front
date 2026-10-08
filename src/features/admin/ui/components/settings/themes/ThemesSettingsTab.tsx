import React from 'react';
import { LayoutContainer, Text, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge, Spinner } from '@/shared/ui/components';
import { useThemesSettingsTab } from '../../../../hooks/settings/useThemesSettingsTab';
import { ThemeAdminDrawer } from './ThemeAdminDrawer';
import { ThemePreviewPanel } from './ThemePreviewPanel';
import { ThemeMobileCard } from './ThemeMobileCard';
import { SETTINGS_TEXTS } from '../../../../constants/settings.constants';

export const ThemesSettingsTab = () => {
  const { themes, isLoading, isDrawerOpen, themeToEdit, previewTheme, setPreviewTheme, handleActivate, handleOpenDrawer, handleCloseDrawer, handleSaveSuccess } = useThemesSettingsTab();

  if (isLoading) {
    return <Spinner text={SETTINGS_TEXTS.THEMES.LOADING} />;
  }

  return (
    <LayoutContainer>
      <LayoutContainer className="flex justify-between items-center mb-6">
        <Text className="text-gray-300">
          {SETTINGS_TEXTS.THEMES.LIST_DESC}
        </Text>
        <Button variant="primary" size="sm" onClick={() => handleOpenDrawer()}>
          {SETTINGS_TEXTS.THEMES.NEW_THEME_BUTTON}
        </Button>
      </LayoutContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <LayoutContainer className="lg:col-span-2 w-full min-w-0">
          {/* Mobile/Tablet View */}
          <LayoutContainer className="flex flex-col gap-4 lg:hidden mb-6">
            {themes.map((theme, index) => {
              const rowKey = typeof theme._id === 'string' ? theme._id : (theme._id as any)?.$oid || index;
              return (
                <ThemeMobileCard 
                  key={rowKey} 
                  theme={theme} 
                  previewTheme={previewTheme} 
                  setPreviewTheme={setPreviewTheme} 
                  handleActivate={handleActivate} 
                  handleOpenDrawer={handleOpenDrawer} 
                />
              );
            })}
            {themes.length === 0 && (
              <LayoutContainer className="bg-surface border border-border rounded-xl p-8 text-center text-text-secondary">
                {SETTINGS_TEXTS.THEMES.EMPTY_LIST}
              </LayoutContainer>
            )}
          </LayoutContainer>

          {/* Desktop View */}
          <LayoutContainer className="hidden lg:block w-full min-w-0 bg-surface border border-border rounded-2xl overflow-hidden">
            <LayoutContainer className="overflow-x-auto w-full">
              <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{SETTINGS_TEXTS.THEMES.TABLE_COL_NAME}</TableHead>
                <TableHead>{SETTINGS_TEXTS.THEMES.TABLE_COL_STATUS}</TableHead>
                <TableHead>{SETTINGS_TEXTS.THEMES.TABLE_COL_COLORS}</TableHead>
                <TableHead className="text-right">{SETTINGS_TEXTS.THEMES.TABLE_COL_ACTIONS}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {themes.map((theme, index) => {
                const rowKey = typeof theme._id === 'string' ? theme._id : (theme._id as any)?.$oid || index;
                return (
                <TableRow 
                  key={rowKey}
                  className={`cursor-pointer transition-colors ${previewTheme?._id === theme._id ? 'bg-surface border-l-2 border-primary' : ''}`}
                  onClick={() => setPreviewTheme(theme)}
                >
                  <TableCell>
                    <Text className="font-semibold text-text-primary">{theme.name}</Text>
                    {theme.isDefault && <Text className="text-xs text-text-secondary">{SETTINGS_TEXTS.THEMES.BADGE_DEFAULT}</Text>}
                  </TableCell>
                  <TableCell>
                    {theme.isActive ? (
                      <Badge variant="success">{SETTINGS_TEXTS.THEMES.BADGE_ACTIVE}</Badge>
                    ) : (
                      <Badge variant="default">{SETTINGS_TEXTS.THEMES.BADGE_INACTIVE}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <LayoutContainer className="flex items-center gap-2">
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
                  </TableCell>
                  <TableCell className="text-right">
                    <LayoutContainer className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); setPreviewTheme(theme); }}
                      >
                        {SETTINGS_TEXTS.THEMES.BTN_PREVIEW}
                      </Button>
                      {!theme.isActive && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => { e.stopPropagation(); handleActivate(typeof theme._id === 'string' ? theme._id : (theme._id as any).$oid); }}
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
                  </TableCell>
                </TableRow>
                );
              })}
              {themes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-text-secondary">
                    {SETTINGS_TEXTS.THEMES.EMPTY_LIST}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="lg:col-span-1 h-[600px] sticky top-6">
          {previewTheme ? (
            <ThemePreviewPanel theme={previewTheme} />
          ) : (
            <LayoutContainer className="h-full flex items-center justify-center bg-surface border border-border rounded-2xl p-6">
              <Text className="text-text-secondary text-center">{SETTINGS_TEXTS.THEMES.PREVIEW_EMPTY_STATE}</Text>
            </LayoutContainer>
          )}
        </LayoutContainer>
      </div>

      <ThemeAdminDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSuccess={handleSaveSuccess}
        theme={themeToEdit}
      />
    </LayoutContainer>
  );
};
