'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
} from '../constants/cookie-consent.constants';

export type CookieConsentStatus = 'accepted_all' | 'essential_only';

export interface CookieConsentRecord {
  status: CookieConsentStatus;
  updatedAt: string;
}

export function getStoredCookieConsent(): CookieConsentRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed?.status === 'accepted_all' || parsed?.status === 'essential_only') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function useCookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const existing = getStoredCookieConsent();
    if (!existing) {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = useCallback((status: CookieConsentStatus) => {
    try {
      const record: CookieConsentRecord = {
        status,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
      window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: record }));
    } catch (err) {
      console.warn('Não foi possível salvar preferência de cookies:', err);
    } finally {
      setIsVisible(false);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    saveConsent('accepted_all');
  }, [saveConsent]);

  const handleEssentialOnly = useCallback(() => {
    saveConsent('essential_only');
  }, [saveConsent]);

  const handleToggleDetails = useCallback(() => {
    setShowDetails((prev) => !prev);
  }, []);

  return {
    isVisible,
    showDetails,
    handleAcceptAll,
    handleEssentialOnly,
    handleToggleDetails,
  };
}

