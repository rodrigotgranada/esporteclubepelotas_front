'use client';

import React, { useCallback, useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { setSettings } = useSettingsStore();

  const fetchSettings = useCallback(async () => {
    try {
      const settings = await settingsApi.getSettings();
      if (settings) {
        setSettings(settings);
      }
    } catch (error: any) {
      console.warn(
        'Configurações institucionais carregadas com padrões locais (servidor em inicialização):',
        error?.message || error,
      );
    }
  }, [setSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useRealtimeEvents('settings', () => {
    fetchSettings();
  });

  return <>{children}</>;
};
