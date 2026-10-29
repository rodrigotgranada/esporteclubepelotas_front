'use client';

import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/services/api';
import { LayoutContainer } from '../atoms/LayoutContainer';
import { Text } from '../atoms/Text';
import { ENVIRONMENT_BADGE_TEXTS } from './EnvironmentBadge.constants';

interface EnvTestResponse {
  stage?: 'PROD' | 'DEV';
  environment?: string;
  databaseSuffix?: string;
  mongoConnected?: boolean;
  storageProvider?: string;
  storageProject?: string;
  storageConfigured?: boolean;
}

export const EnvironmentBadge = () => {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [envData, setEnvData] = useState<EnvTestResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const res = await api.get<EnvTestResponse>('/auth/env-test');
        if (!isMounted) return;
        const data = res.data;
        const resolvedStage: 'PROD' | 'DEV' =
          data.stage ||
          (data.databaseSuffix === 'ecp_prod' ? 'PROD' : 'DEV');

        setEnvData({ ...data, stage: resolvedStage });
        setStatus(data.mongoConnected === false ? 'error' : 'ok');
      } catch {
        if (!isMounted) return;
        setStatus('error');
      }
    };

    checkConnection();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isProd = status === 'ok' && envData?.stage === 'PROD';
  const isDev = status === 'ok' && envData?.stage !== 'PROD';

  const getCircleStyles = () => {
    if (status === 'loading') {
      return 'bg-neutral-500/30 border-neutral-400/60 text-white animate-pulse';
    }
    if (status === 'error') {
      return 'bg-red-500/35 border-red-400/80 text-white hover:bg-red-500/50';
    }
    if (isProd) {
      return 'bg-emerald-500/35 border-emerald-400/80 text-white hover:bg-emerald-500/50';
    }
    return 'bg-yellow-500/35 border-yellow-400/80 text-white hover:bg-yellow-500/50';
  };

  const getLabel = () => {
    if (status === 'loading') return ENVIRONMENT_BADGE_TEXTS.LOADING_LABEL;
    if (status === 'error') return ENVIRONMENT_BADGE_TEXTS.ERROR_LABEL;
    if (isProd) return ENVIRONMENT_BADGE_TEXTS.PROD_LABEL;
    return ENVIRONMENT_BADGE_TEXTS.DEV_LABEL;
  };

  const getPanelTitle = () => {
    if (status === 'loading') return ENVIRONMENT_BADGE_TEXTS.PANEL_TITLE_LOADING;
    if (status === 'error') return ENVIRONMENT_BADGE_TEXTS.PANEL_TITLE_ERROR;
    if (isProd) return ENVIRONMENT_BADGE_TEXTS.PANEL_TITLE_PROD;
    return ENVIRONMENT_BADGE_TEXTS.PANEL_TITLE_DEV;
  };

  return (
    <LayoutContainer
      ref={containerRef}
      className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end"
    >
      {isOpen && (
        <LayoutContainer className="mb-2 w-72 rounded-2xl bg-surface/95 backdrop-blur-md border border-border p-4 shadow-2xl text-xs space-y-2">
          <Text className="font-bold text-sm text-text-primary border-b border-border pb-1.5">
            {getPanelTitle()}
          </Text>

          {status === 'ok' && envData ? (
            <LayoutContainer className="space-y-1.5 pt-1">
              <LayoutContainer className="flex justify-between gap-2">
                <Text as="span" className="text-text-secondary">{ENVIRONMENT_BADGE_TEXTS.API_LABEL}</Text>
                <Text as="span" className="font-semibold text-success">{ENVIRONMENT_BADGE_TEXTS.STATUS_OK}</Text>
              </LayoutContainer>
              <LayoutContainer className="flex justify-between gap-2">
                <Text as="span" className="text-text-secondary">{ENVIRONMENT_BADGE_TEXTS.DB_LABEL}</Text>
                <Text as="span" className="font-mono font-semibold text-text-primary">
                  {envData.databaseSuffix} ({envData.mongoConnected !== false ? ENVIRONMENT_BADGE_TEXTS.STATUS_OK : ENVIRONMENT_BADGE_TEXTS.STATUS_DISCONNECTED})
                </Text>
              </LayoutContainer>
              <LayoutContainer className="flex justify-between gap-2">
                <Text as="span" className="text-text-secondary">{ENVIRONMENT_BADGE_TEXTS.STORAGE_LABEL}</Text>
                <Text as="span" className="font-mono font-semibold text-text-primary truncate max-w-[165px]">
                  {envData.storageProject || envData.storageProvider || ENVIRONMENT_BADGE_TEXTS.STATUS_OK}
                </Text>
              </LayoutContainer>
            </LayoutContainer>
          ) : status === 'error' ? (
            <Text className="text-error text-xs leading-relaxed">
              {ENVIRONMENT_BADGE_TEXTS.ERROR_HINT}
            </Text>
          ) : null}
        </LayoutContainer>
      )}

      <button
        type="button"
        data-testid="environment-badge"
        aria-label={ENVIRONMENT_BADGE_TEXTS.ARIA_LABEL}
        title={getPanelTitle()}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-12 h-12 rounded-full border-2 backdrop-blur-md shadow-lg flex items-center justify-center transition-all cursor-pointer select-none ${getCircleStyles()}`}
      >
        <Text
          as="span"
          className="text-xs font-black tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
        >
          {getLabel()}
        </Text>
      </button>
    </LayoutContainer>
  );
};

