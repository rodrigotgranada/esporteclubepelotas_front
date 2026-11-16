'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
} from '@/features/privacy/constants/cookie-consent.constants';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_STORAGE_KEY = 'pwa_prompt_dismissed_until';

function checkIsIosDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  const isIosUa = /iphone|ipad|ipod/i.test(ua);
  const isIpadOs =
    window.navigator.platform === 'MacIntel' &&
    typeof window.navigator.maxTouchPoints === 'number' &&
    window.navigator.maxTouchPoints > 1;
  return isIosUa || isIpadOs;
}

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true
  );
}

function isDismissedRecently(): boolean {
  if (typeof window === 'undefined') return true;
  const dismissedUntil = localStorage.getItem(DISMISS_STORAGE_KEY);
  return Boolean(dismissedUntil && Number(dismissedUntil) > Date.now());
}

function hasSettledCookieConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIosFallback, setIsIosFallback] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [cookieSettled, setCookieSettled] = useState(false);

  useEffect(() => {
    // Em localhost/desenvolvimento, remove caches e workers antigos para evitar HTML/chunks defasados
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isLocalhost) {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => {
            registrations.forEach((registration) => registration.unregister());
          })
          .catch(() => undefined);
        if ('caches' in window) {
          caches
            .keys()
            .then((keys) => {
              keys.forEach((key) => {
                if (key.startsWith('ecpelotas-pwa')) {
                  caches.delete(key);
                }
              });
            })
            .catch(() => undefined);
        }
      } else {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Erro ao registrar Service Worker do PWA:', err);
        });
      }
    }

    setCookieSettled(hasSettledCookieConsent());
    const onCookieUpdated = () => setCookieSettled(true);
    window.addEventListener(COOKIE_CONSENT_EVENT, onCookieUpdated);

    if (checkIsStandalone() || isDismissedRecently()) {
      return () => {
        window.removeEventListener(COOKIE_CONSENT_EVENT, onCookieUpdated);
      };
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsIosFallback(false);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (checkIsIosDevice()) {
      iosTimer = setTimeout(() => {
        setIsIosFallback(true);
      }, 1500);
    }

    return () => {
      if (iosTimer) clearTimeout(iosTimer);
      window.removeEventListener(COOKIE_CONSENT_EVENT, onCookieUpdated);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!cookieSettled || isInstalled || isDismissedRecently()) {
      return;
    }
    if (deferredPrompt || isIosFallback) {
      setIsVisible(true);
    }
  }, [cookieSettled, deferredPrompt, isIosFallback, isInstalled]);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismissClick = useCallback(() => {
    setIsVisible(false);
    // Não exibir novamente por 7 dias
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now() + sevenDaysMs));
  }, []);

  return {
    isVisible,
    isInstalled,
    isIosFallback,
    handleInstallClick,
    handleDismissClick,
  };
}
