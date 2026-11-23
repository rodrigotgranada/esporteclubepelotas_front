'use client';

import React, { useCallback, useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';
import { logNonNetworkWarning } from '@/shared/utils';

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { setSettings } = useSettingsStore();

  const fetchSettings = useCallback(async () => {
    try {
      const settings = await settingsApi.getSettings();
      if (settings) {
        setSettings(settings);
      }
    } catch (error: unknown) {
      logNonNetworkWarning(
        'Configurações institucionais carregadas com padrões locais:',
        error,
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
