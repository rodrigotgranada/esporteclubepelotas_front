'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, MapPin, Settings } from 'lucide-react';
import { PROFILE_TEXTS } from '../../constants';
import { PersonalDataTab } from '../components/tabs/PersonalDataTab';
import { SecurityTab } from '../components/tabs/SecurityTab';
import { AddressesTab } from '../components/tabs/AddressesTab';
import { PreferencesTab } from '../components/tabs/PreferencesTab';
import { ChangesTab } from '../components/tabs/ChangesTab';
import { AlertCircle } from 'lucide-react';

type TabId = 'personal' | 'security' | 'address' | 'preferences' | 'changes';

export const ProfileFeature = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('personal');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      router.push('/login');
    }
  }, [user, router, isMounted]);

  if (!isMounted || !user) {
    return null;
  }

  const hasPendingChanges = user.pendingChanges && user.pendingChanges.length > 0;

  const baseTabs = [
    { id: 'personal', label: PROFILE_TEXTS.TAB_PERSONAL, icon: User },
    { id: 'security', label: PROFILE_TEXTS.TAB_SECURITY, icon: ShieldCheck },
    { id: 'address', label: PROFILE_TEXTS.TAB_ADDRESSES, icon: MapPin },
    { id: 'preferences', label: PROFILE_TEXTS.TAB_PREFERENCES, icon: Settings },
  ] as const;

  const tabs = hasPendingChanges
    ? [...baseTabs, { id: 'changes', label: PROFILE_TEXTS.TAB_CHANGES, icon: AlertCircle }]
    : baseTabs;

  return (
    <LayoutContainer className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <LayoutContainer className="mb-8">
        <Title level="h1" className="text-3xl font-black text-text-primary">{PROFILE_TEXTS.PAGE_TITLE}</Title>
        <Text className="text-text-secondary mt-1">{PROFILE_TEXTS.PAGE_SUBTITLE}</Text>
      </LayoutContainer>

      <LayoutContainer className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <LayoutContainer className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            let badgeCount = 0;
            if (tab.id === 'security') {
              if (!user.emailVerified) badgeCount++;
              if (user.phones && user.phones.length > 0 && !user.phones[0].isVerified) badgeCount++;
            }

            return (
              <Button
                key={tab.id}
                variant={isActive ? 'primary' : 'ghost'}
                size="md"
                fullWidth
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`justify-start px-4 ${isActive ? 'scale-[1.02] shadow-md border-transparent' : 'text-text-secondary hover:text-text-primary'}`}
                leftIcon={<Icon size={18} />}
              >
                <Text as="span" className="flex-1 text-left">{tab.label}</Text>
                {badgeCount > 0 && (
                  <Text as="span" className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-2 ${isActive ? 'bg-background text-text-primary' : 'bg-primary text-primary-foreground'}`}>
                    {badgeCount}
                  </Text>
                )}
              </Button>
            );
          })}
        </LayoutContainer>

        {/* Tab Content */}
        <LayoutContainer className="flex-1 bg-surface border border-border rounded-2xl p-6 md:p-8 min-h-[500px]">
          {activeTab === 'personal' && <PersonalDataTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'address' && <AddressesTab />}
          {activeTab === 'preferences' && <PreferencesTab user={user} />}
          {activeTab === 'changes' && <ChangesTab />}
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
