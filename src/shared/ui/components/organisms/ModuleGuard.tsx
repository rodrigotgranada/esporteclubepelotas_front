'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { LayoutContainer, Title, Text, Button, Badge, ShieldPlaceholder } from '../atoms';
import { Home, AlertTriangle } from 'lucide-react';
import { useSystemModulesStore } from '@/store/useSystemModulesStore';
import { MODULE_GUARD_TEXTS } from './ModuleGuard.constants';

export interface ModuleGuardProps {
  moduleSlug: string;
  moduleName?: string;
  children: React.ReactNode;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  moduleSlug,
  moduleName,
  children,
}) => {
  const { isLoaded, isModuleActive, fetchModules } = useSystemModulesStore();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const isActive = isModuleActive(moduleSlug);

  // Se o módulo já está verificado como inativo pelo store
  if (isLoaded && !isActive) {
    return (
      <LayoutContainer className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <LayoutContainer className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center gap-6 shadow-xl relative overflow-hidden">
          {/* Glow decorativo de fundo */}
          <LayoutContainer className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Brasão do Pelotas */}
          <LayoutContainer className="relative">
            <LayoutContainer className="w-20 h-20 rounded-2xl bg-surface-hover/80 border border-border flex items-center justify-center p-3 shadow-md">
              <ShieldPlaceholder className="w-full h-full text-primary" />
            </LayoutContainer>
            <LayoutContainer className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface border-2 border-border flex items-center justify-center text-accent">
              <AlertTriangle className="w-4 h-4" />
            </LayoutContainer>
          </LayoutContainer>

          {/* Badge & Textos */}
          <LayoutContainer className="flex flex-col items-center gap-3">
            <Badge variant="default" size="sm" className="font-extrabold uppercase tracking-wider text-[11px] py-1 px-3 border border-border bg-surface-hover">
              {MODULE_GUARD_TEXTS.BADGE}
            </Badge>

            <Title level="h2" className="text-xl sm:text-2xl font-black text-text-primary">
              {MODULE_GUARD_TEXTS.TITLE}
            </Title>

            <Text className="text-sm text-text-secondary leading-relaxed">
              {MODULE_GUARD_TEXTS.DESCRIPTION(moduleName)}
            </Text>
          </LayoutContainer>

          {/* Botão de retorno */}
          <Link href="/" className="w-full">
            <Button
              variant="primary"
              size="md"
              className="w-full font-bold uppercase tracking-wide justify-center shadow-md flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>{MODULE_GUARD_TEXTS.BACK_HOME}</span>
            </Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    );
  }

  return <>{children}</>;
};
