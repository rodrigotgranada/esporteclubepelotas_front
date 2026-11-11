'use client';

import React from 'react';
import { Download, X } from 'lucide-react';
import { LayoutContainer, Text, Title, Button, IconButton, SafeImage } from '@/shared/ui/components';
import { PWA_TEXTS } from '../../constants/pwa.constants';
import { usePwaInstall } from '../../hooks/usePwaInstall';

export function PwaInstallPrompt() {
  const { isVisible, handleInstallClick, handleDismissClick } = usePwaInstall();

  if (!isVisible) {
    return null;
  }

  return (
    <LayoutContainer className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
      <LayoutContainer className="relative flex items-center justify-between gap-4 rounded-xl border border-amber-400/30 bg-[#0B1B3D]/95 p-4 shadow-2xl backdrop-blur-md">
        <LayoutContainer className="flex items-center gap-3">
          <LayoutContainer className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-amber-400/40 bg-[#071126] p-1.5 shadow-inner">
            <SafeImage
              src="/pelotas-logo.png"
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
            <Text className="text-xs text-gray-300 line-clamp-2">
              {PWA_TEXTS.DESCRIPTION}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex flex-shrink-0 items-center gap-2">
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 bg-amber-400 font-semibold text-[#0B1B3D] hover:bg-amber-300"
          >
            <Download size={14} />
            <Text as="span">{PWA_TEXTS.INSTALL_BUTTON}</Text>
          </Button>

          <IconButton
            icon={<X size={16} />}
            variant="ghost"
            size="sm"
            onClick={handleDismissClick}
            aria-label={PWA_TEXTS.DISMISS_BUTTON}
            className="text-gray-400 hover:text-white"
          />
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
}

