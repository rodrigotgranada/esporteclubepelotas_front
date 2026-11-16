'use client';

import React from 'react';
import { Download, Share, X } from 'lucide-react';
import { LayoutContainer, Text, Title, Button, IconButton, SafeImage } from '@/shared/ui/components';
import { PWA_TEXTS } from '../../constants/pwa.constants';
import { usePwaInstall } from '../../hooks/usePwaInstall';

export function PwaInstallPrompt() {
  const {
    isVisible,
    isIosFallback,
    handleInstallClick,
    handleDismissClick,
  } = usePwaInstall();

  if (!isVisible) {
    return null;
  }

  return (
    <LayoutContainer className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <LayoutContainer className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border border-amber-400/30 bg-[#0B1B3D]/95 p-4 pr-12 shadow-2xl backdrop-blur-md">
        <IconButton
          type="button"
          icon={<X size={16} />}
          variant="secondary"
          size="sm"
          onClick={handleDismissClick}
          aria-label={PWA_TEXTS.CLOSE_ARIA}
          className="absolute top-3 right-3 z-10 bg-white/15 text-white hover:bg-white/25"
        />

        <LayoutContainer className="flex items-center gap-3">
          <LayoutContainer className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-amber-400/40 bg-[#071126] p-1.5 shadow-inner">
            <SafeImage
              src="/icons/icon-192x192.png"
              fallbackSrc="/images/pelotas-logo.png"
              alt="E.C. Pelotas"
              width={48}
              height={48}
              className="h-full w-full object-contain"
            />
          </LayoutContainer>

          <LayoutContainer className="flex flex-col">
            <Title level="h4" className="text-sm font-bold text-amber-400">
              {PWA_TEXTS.TITLE}
            </Title>
            <Text className="text-xs text-gray-300 leading-relaxed">
              {isIosFallback ? PWA_TEXTS.IOS_DESCRIPTION : PWA_TEXTS.DESCRIPTION}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex flex-shrink-0 items-center justify-end gap-2">
          {isIosFallback ? (
            <Button
              type="button"
              size="sm"
              onClick={handleDismissClick}
              leftIcon={<Share size={14} />}
              className="flex items-center gap-1.5 bg-amber-400 font-semibold text-[#0B1B3D] hover:bg-amber-300"
            >
              <Text as="span">{PWA_TEXTS.IOS_ACK_BUTTON}</Text>
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDismissClick}
                className="border-white/20 text-gray-200 hover:bg-white/10 hover:text-white text-xs"
              >
                <Text as="span">{PWA_TEXTS.DISMISS_BUTTON}</Text>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 bg-amber-400 font-semibold text-[#0B1B3D] hover:bg-amber-300"
              >
                <Download size={14} />
                <Text as="span">{PWA_TEXTS.INSTALL_BUTTON}</Text>
              </Button>
            </>
          )}
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
}
