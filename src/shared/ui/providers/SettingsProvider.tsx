'use client';

import React, { useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { setSettings } = useSettingsStore();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsApi.getSettings();
        if (settings) {
          setSettings(settings);
        }
      } catch (error: any) {
        // Log com aviso não-bloqueante para não poluir o console com erro fatal quando a API estiver em cold start
        console.warn(
          'Configurações institucionais carregadas com padrões locais (servidor em inicialização):',
          error?.message || error
        );
      }
    };
    fetchSettings();
  }, [setSettings]);

  return <>{children}</>;
};
