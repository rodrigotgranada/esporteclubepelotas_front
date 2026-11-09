'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Badge,
} from '@/shared/ui/components';
import { EleventicketsImportSummary } from '@/features/membership/types/membership.types';
import { FileCheck, Users, ShieldCheck, UserX, AlertTriangle, X } from 'lucide-react';

export interface EleventicketsImportResultModalProps {
  isOpen: boolean;
  result: EleventicketsImportSummary | null;
  onClose: () => void;
}

export const EleventicketsImportResultModal: React.FC<EleventicketsImportResultModalProps> = ({
  isOpen,
  result,
  onClose,
}) => {
  if (!isOpen || !result) return null;

  return (
    <LayoutContainer className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <LayoutContainer className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-surface border-2 border-border shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <LayoutContainer className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
          <LayoutContainer className="flex items-center gap-3">
            <LayoutContainer className="p-2.5 rounded-2xl bg-primary/20 text-primary">
              <FileCheck className="w-6 h-6" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col">
              <Title level="h3" className="text-lg font-black text-text-primary">
                Resultado da Importação ElevenTickets
              </Title>
              <Text as="span" className="text-xs text-text-secondary">
                Processamento atômico finalizado com sucesso
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 rounded-xl text-text-secondary hover:text-text-primary hover:bg-background"
          >
            <X className="w-5 h-5" />
          </Button>
        </LayoutContainer>

        {/* Grid de Métricas de Resultado */}
        <LayoutContainer className="grid grid-cols-2 gap-3">
          <LayoutContainer className="p-4 rounded-2xl bg-background border border-border flex flex-col gap-1">
            <LayoutContainer className="flex items-center justify-between text-xs text-text-secondary">
              <Text as="span">Total Linhas</Text>
              <Users className="w-4 h-4 text-primary" />
            </LayoutContainer>
            <Text as="strong" className="text-2xl font-black text-text-primary">
              {result.totalRows}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="p-4 rounded-2xl bg-background border border-border flex flex-col gap-1">
            <LayoutContainer className="flex items-center justify-between text-xs text-text-secondary">
              <Text as="span">Ativados no Portal</Text>
              <ShieldCheck className="w-4 h-4 text-green-500" />
            </LayoutContainer>
            <Text as="strong" className="text-2xl font-black text-green-500">
              {result.usersActivated}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="p-4 rounded-2xl bg-background border border-border flex flex-col gap-1">
            <LayoutContainer className="flex items-center justify-between text-xs text-text-secondary">
              <Text as="span">Pré-Cadastros no Cache</Text>
              <Badge variant="primary" size="sm" className="font-bold text-[9px]">
                Novos
              </Badge>
            </LayoutContainer>
            <Text as="strong" className="text-2xl font-black text-text-primary">
              {result.cacheInserted}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="p-4 rounded-2xl bg-background border border-border flex flex-col gap-1">
            <LayoutContainer className="flex items-center justify-between text-xs text-text-secondary">
              <Text as="span">Travas Preservadas</Text>
              <Badge variant="warning" size="sm" className="font-bold text-[9px]">
                Manual
              </Badge>
            </LayoutContainer>
            <Text as="strong" className="text-2xl font-black text-[#ea580c]">
              {result.manualOverridesPreserved}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        {/* Lista de Erros se houver */}
        {result.errorsCount > 0 && (
          <LayoutContainer className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#ea580c]/10 border border-[#ea580c]/30 max-h-40 overflow-y-auto">
            <LayoutContainer className="flex items-center gap-1.5 text-[#ea580c] font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <Text as="span">{result.errorsCount} avisos / linhas ignoradas:</Text>
            </LayoutContainer>
            {result.errorMessages.map((msg, idx) => (
              <Text key={idx} as="p" className="text-[11px] text-[#ea580c]/90">
                • {msg}
              </Text>
            ))}
          </LayoutContainer>
        )}

        {/* Footer */}
        <LayoutContainer className="flex items-center justify-end pt-2 border-t border-border/80">
          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
            className="font-bold text-xs uppercase px-6 py-2.5"
          >
            Concluir
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

