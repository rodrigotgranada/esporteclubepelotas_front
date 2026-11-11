'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
} from '@/shared/ui/components';
import { X, Shield, Calendar, Globe, Monitor, Terminal } from 'lucide-react';
import { AuditLogItem } from '../../../services/admin-audit.service';
import { ADMIN_AUDIT_TEXTS } from '../../../constants/admin-audit.constants';

export interface AuditLogDetailsModalProps {
  isOpen: boolean;
  log: AuditLogItem | null;
  onClose: () => void;
}

export const AuditLogDetailsModal: React.FC<AuditLogDetailsModalProps> = ({
  isOpen,
  log,
  onClose,
}) => {
  if (!isOpen || !log) return null;

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('pt-BR', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      });
    } catch {
      return isoString;
    }
  };

  let formattedDetails = log.details || '';
  try {
    const parsed = JSON.parse(log.details || '{}');
    formattedDetails = JSON.stringify(parsed, null, 2);
  } catch {
    // String normal
  }

  return (
    <LayoutContainer className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <LayoutContainer className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <LayoutContainer className="p-5 border-b border-border flex items-center justify-between bg-surface-hover/30">
          <LayoutContainer className="flex items-center gap-3">
            <LayoutContainer className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Shield className="w-5 h-5" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col">
              <Title level="h3" className="text-lg font-black text-text-primary">
                {ADMIN_AUDIT_TEXTS.MODAL_TITLE}
              </Title>
              <Text className="text-xs text-text-secondary">
                {ADMIN_AUDIT_TEXTS.MODAL_SUBTITLE}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:text-text-primary"
            aria-label={ADMIN_AUDIT_TEXTS.BTN_CLOSE}
          >
            <X className="w-5 h-5" />
          </Button>
        </LayoutContainer>

        {/* Body */}
        <LayoutContainer className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* Grid de Metadados */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayoutContainer className="p-3.5 rounded-xl bg-background border border-border flex flex-col gap-1">
              <LayoutContainer className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{ADMIN_AUDIT_TEXTS.COL_DATE}</span>
              </LayoutContainer>
              <Text className="text-sm font-bold text-text-primary font-mono">
                {formatDate(log.createdAt)}
              </Text>
            </LayoutContainer>

            <LayoutContainer className="p-3.5 rounded-xl bg-background border border-border flex flex-col gap-1">
              <LayoutContainer className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>{ADMIN_AUDIT_TEXTS.LABEL_ACTOR_ROLE}</span>
              </LayoutContainer>
              <LayoutContainer className="flex items-center gap-2">
                <Badge variant="primary" size="sm" className="font-bold text-[11px] uppercase">
                  {log.actorRole || 'ADMIN'}
                </Badge>
                <Text className="text-xs text-text-primary font-bold">
                  {log.actorName || log.actorEmail || 'Sistema'}
                </Text>
              </LayoutContainer>
            </LayoutContainer>

            <LayoutContainer className="p-3.5 rounded-xl bg-background border border-border flex flex-col gap-1">
              <LayoutContainer className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
                <Terminal className="w-3.5 h-3.5" />
                <span>Ação & Módulo</span>
              </LayoutContainer>
              <LayoutContainer className="flex items-center gap-2">
                <Badge variant="default" size="sm" className="font-mono text-[11px]">
                  {log.module}
                </Badge>
                <Badge variant="default" size="sm" className="font-bold text-[11px] uppercase">
                  {log.action}
                </Badge>
              </LayoutContainer>
            </LayoutContainer>

            <LayoutContainer className="p-3.5 rounded-xl bg-background border border-border flex flex-col gap-1">
              <LayoutContainer className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
                <Globe className="w-3.5 h-3.5" />
                <span>{ADMIN_AUDIT_TEXTS.COL_IP}</span>
              </LayoutContainer>
              <Text className="text-xs font-mono text-text-primary">
                {log.ipAddress || '127.0.0.1'}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          {/* User Agent */}
          {log.userAgent && (
            <LayoutContainer className="p-3.5 rounded-xl bg-background border border-border flex flex-col gap-1">
              <LayoutContainer className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
                <Monitor className="w-3.5 h-3.5" />
                <span>{ADMIN_AUDIT_TEXTS.LABEL_USER_AGENT}</span>
              </LayoutContainer>
              <Text className="text-xs text-text-secondary font-mono break-all">
                {log.userAgent}
              </Text>
            </LayoutContainer>
          )}

          {/* Payload Details */}
          <LayoutContainer className="flex flex-col gap-2">
            <Text className="text-xs font-extrabold uppercase tracking-wider text-text-secondary">
              {ADMIN_AUDIT_TEXTS.LABEL_PAYLOAD}
            </Text>
            <pre className="p-4 rounded-xl bg-background border border-border font-mono text-xs text-primary/90 overflow-x-auto max-h-60 whitespace-pre-wrap">
              {formattedDetails || 'Nenhum detalhe adicional fornecido.'}
            </pre>
          </LayoutContainer>
        </LayoutContainer>

        {/* Footer */}
        <LayoutContainer className="p-4 border-t border-border flex justify-end bg-surface-hover/20">
          <Button variant="outline" size="sm" onClick={onClose} className="px-6 font-bold text-xs">
            {ADMIN_AUDIT_TEXTS.BTN_CLOSE}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

