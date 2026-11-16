'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Em localhost/desenvolvimento, remove caches e workers antigos para evitar HTML/chunks defasados
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isLocalhost) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => registration.unregister());
        }).catch(() => undefined);
        if ('caches' in window) {
          caches.keys().then((keys) => {
            keys.forEach((key) => {
              if (key.startsWith('ecpelotas-pwa')) {
                caches.delete(key);
              }
            });
          }).catch(() => undefined);
        }
      } else {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Erro ao registrar Service Worker do PWA:', err);
        });
      }
    }

    // Checar se já foi dispensado recentemente
    const dismissedUntil = localStorage.getItem('pwa_prompt_dismissed_until');
    if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismissClick = () => {
    setIsVisible(false);
    // Não exibir novamente por 7 dias
    localStorage.setItem('pwa_prompt_dismissed_until', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
  };

  return {
    isVisible,
    isInstalled,
    handleInstallClick,
    handleDismissClick,
  };
}

