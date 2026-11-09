'use client';

import { useSettingsStore } from '@/store/useSettingsStore';

export const ELEVENTICKETS_DEFAULT_URL = 'https://socioecpelotas.eleventickets.com/#/';

export interface MembershipLinkInfo {
  provider: 'ELEVENTICKETS' | 'NATIVE';
  url: string;
  isExternal: boolean;
  target: '_blank' | '_self';
  rel: string | undefined;
  externalUrl: string;
}

export const useMembershipLink = (): MembershipLinkInfo => {
  const { settings } = useSettingsStore();

  const provider = settings?.membershipSystemProvider === 'NATIVE' ? 'NATIVE' : 'ELEVENTICKETS';
  const externalUrl = settings?.membershipExternalUrl?.trim() || ELEVENTICKETS_DEFAULT_URL;

  const isExternal = provider === 'ELEVENTICKETS';
  const url = isExternal ? externalUrl : '/socio';
  const target = isExternal ? '_blank' : '_self';
  const rel = isExternal ? 'noopener noreferrer' : undefined;

  return {
    provider,
    url,
    isExternal,
    target,
    rel,
    externalUrl,
  };
};

