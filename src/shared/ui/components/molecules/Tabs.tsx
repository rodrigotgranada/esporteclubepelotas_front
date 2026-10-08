'use client';

import React, { useState } from 'react';
import { LayoutContainer } from '../atoms/LayoutContainer';
import { Button } from '../atoms/Button';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs = ({ tabs, defaultTab, onChange }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  return (
    <LayoutContainer>
      <LayoutContainer className="flex border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => handleTabClick(tab.id)}
            className={`rounded-none border-b-2 px-6 py-3 font-semibold whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </LayoutContainer>
      
      <LayoutContainer className="bg-surface border border-border rounded-2xl p-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </LayoutContainer>
    </LayoutContainer>
  );
};
