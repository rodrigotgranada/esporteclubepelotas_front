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
        setSettings(settings);
      } catch (error) {
        console.error('Failed to fetch settings', error);
      }
    };
    fetchSettings();
  }, [setSettings]);

  return <>{children}</>;
};
