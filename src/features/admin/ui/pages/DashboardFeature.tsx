'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Spinner } from '@/shared/ui/components';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';
import { DASHBOARD_FEATURE_TEXTS } from './DashboardFeature.constants';
import { useDashboard } from '../../hooks/useDashboard';

export const DashboardFeature = () => {
  const { stats, isLoading } = useDashboard();

  const cards = [
    { title: DASHBOARD_FEATURE_TEXTS.CARDS.TOTAL_USERS, value: stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: DASHBOARD_FEATURE_TEXTS.CARDS.ACTIVE_USERS, value: stats.active, icon: UserCheck, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: DASHBOARD_FEATURE_TEXTS.CARDS.BLOCKED, value: stats.blocked, icon: UserX, color: 'text-error', bg: 'bg-error/10' },
    { title: DASHBOARD_FEATURE_TEXTS.CARDS.PENDING_EMAIL, value: stats.pending, icon: Activity, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  return (
    <LayoutContainer className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <LayoutContainer>
        <Title level="h1" className="text-3xl font-black text-text-primary">
          {DASHBOARD_FEATURE_TEXTS.TITLE}
        </Title>
        <Text className="text-text-secondary mt-1">
          {DASHBOARD_FEATURE_TEXTS.SUBTITLE}
        </Text>
      </LayoutContainer>

      {isLoading ? (
        <LayoutContainer className="flex items-center justify-center py-16 gap-3">
          <Spinner size={24} />
          <Text className="text-sm text-text-secondary">{DASHBOARD_FEATURE_TEXTS.LOADING}</Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <LayoutContainer key={i} className="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
                <LayoutContainer className="flex items-start justify-between">
                  <LayoutContainer>
                    <Text className="text-sm font-medium text-text-secondary">{card.title}</Text>
                    <Text className="text-3xl font-black text-text-primary mt-2">{card.value}</Text>
                  </LayoutContainer>
                  <LayoutContainer className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
                    <Icon size={24} />
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
