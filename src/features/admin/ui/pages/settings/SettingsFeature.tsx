'use client';

import React, { useState, useEffect } from 'react';
import { LayoutContainer, Text, Title, Tabs, TabItem } from '@/shared/ui/components';
import { SETTINGS_TEXTS } from '../../../constants/settings.constants';
import { ThemesSettingsTab } from '../../components/settings/themes/ThemesSettingsTab';

import { GeneralSettingsTab } from '../../components/settings/general/GeneralSettingsTab';
import { SocialSettingsTab } from '../../components/settings/social/SocialSettingsTab';

export const SettingsFeature = () => {
  const [defaultTab, setDefaultTab] = useState<string>('LOGO');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('tab')) {
      params.delete('tab');
      const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
      window.history.replaceState(null, '', newUrl);
    }

    const savedTab = localStorage.getItem('ecp_settings_tab');
    if (savedTab) {
      setDefaultTab(savedTab);
    }
    setIsMounted(true);
  }, []);

  const handleTabChange = (tabId: string) => {
    localStorage.setItem('ecp_settings_tab', tabId);
  };

  const tabs: TabItem[] = [
    {
      id: 'LOGO',
      label: SETTINGS_TEXTS.TAB_LOGO,
      content: (
        <LayoutContainer>
          <GeneralSettingsTab />
        </LayoutContainer>
      )
    },
    {
      id: 'THEME',
      label: SETTINGS_TEXTS.TAB_THEME,
      content: (
        <LayoutContainer>
          <ThemesSettingsTab />
        </LayoutContainer>
      )
    },
    {
      id: 'SOCIAL',
      label: SETTINGS_TEXTS.TAB_SOCIAL,
      content: (
        <LayoutContainer>
          <SocialSettingsTab />
        </LayoutContainer>
      )
    }
  ];

  if (!isMounted) return null;

  return (
    <LayoutContainer className="max-w-6xl mx-auto">
      <LayoutContainer className="mb-8">
        <Title level="h1" className="text-3xl font-bold text-text-primary mb-2">{SETTINGS_TEXTS.TITLE}</Title>
        <Text className="text-text-secondary">{SETTINGS_TEXTS.SUBTITLE}</Text>
      </LayoutContainer>

      <Tabs tabs={tabs} defaultTab={defaultTab} onChange={handleTabChange} />
    </LayoutContainer>
  );
};
