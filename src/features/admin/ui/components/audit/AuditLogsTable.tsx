'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  LayoutContainer,
  Text,
  Badge,
  IconButton,
  Button,
  Spinner,
} from '@/shared/ui/components';
import { Shield, Eye, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { AuditLogItem } from '../../../services/admin-audit.service';
import { ADMIN_AUDIT_TEXTS } from '../../../constants/admin-audit.constants';

export interface AuditLogsTableProps {
  logs: AuditLogItem[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onViewDetails: (log: AuditLogItem) => void;
}

export const AuditLogsTable: React.FC<AuditLogsTableProps> = ({
  logs,
  isLoading,
  page,
  totalPages,
  total,
  onPageChange,
  onViewDetails,
}) => {
  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getActionBadgeVariant = (action: string): 'primary' | 'default' | 'warning' | 'success' => {
    const act = (action || '').toUpperCase();
    if (act.includes('DELETE') || act.includes('REMOVE')) return 'warning';
    if (act.includes('CREATE') || act.includes('INSERT')) return 'success';
    if (act.includes('UPDATE') || act.includes('EDIT')) return 'primary';
    return 'default';
  };

  if (isLoading) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center p-16 bg-surface rounded-xl border border-border shadow-xs">
        <Spinner className="w-8 h-8 text-primary mb-3" />
        <Text as="p" className="text-text-secondary font-medium">
          {ADMIN_AUDIT_TEXTS.LOADING}
        </Text>
      </LayoutContainer>
    );
  }

  if (logs.length === 0) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center p-16 bg-surface rounded-xl border border-border text-center shadow-xs">
        <LayoutContainer className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
          <FileText className="w-6 h-6" />
        </LayoutContainer>
        <Text as="p" className="text-text-secondary font-medium text-base">
          {ADMIN_AUDIT_TEXTS.EMPTY}
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="bg-surface rounded-xl border border-border shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ADMIN_AUDIT_TEXTS.COL_DATE}</TableHead>
            <TableHead>{ADMIN_AUDIT_TEXTS.COL_ACTOR}</TableHead>
            <TableHead>{ADMIN_AUDIT_TEXTS.COL_MODULE}</TableHead>
            <TableHead>{ADMIN_AUDIT_TEXTS.COL_ACTION}</TableHead>
            <TableHead>{ADMIN_AUDIT_TEXTS.COL_IP}</TableHead>
            <TableHead className="text-right">{ADMIN_AUDIT_TEXTS.COL_ACTIONS}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-surface-hover/50 transition-colors">
              {/* Date */}
              <TableCell className="whitespace-nowrap">
                <Text as="span" className="text-xs font-mono text-text-secondary font-medium">
                  {formatDate(log.createdAt)}
                </Text>
              </TableCell>

              {/* Actor */}
              <TableCell className="min-w-[180px]">
                <LayoutContainer className="flex flex-col">
                  <Text as="span" className="text-xs font-bold text-text-primary">
                    {log.actorName || log.actorEmail || 'Sistema Automático'}
                  </Text>
                  {log.actorEmail && log.actorName && (
                    <Text as="span" className="text-[11px] text-text-secondary">
                      {log.actorEmail}
                    </Text>
                  )}
                  {log.actorRole && (
                    <LayoutContainer className="mt-0.5">
                      <Badge variant="default" size="sm" className="text-[9px] px-1.5 py-0 font-medium">
                        {log.actorRole}
                      </Badge>
                    </LayoutContainer>
                  )}
                </LayoutContainer>
              </TableCell>

              {/* Module */}
              <TableCell>
                <Badge variant="default" size="sm" className="font-mono text-[11px] uppercase tracking-wide">
                  {log.module}
                </Badge>
              </TableCell>

              {/* Action */}
              <TableCell>
                <Badge variant={getActionBadgeVariant(log.action)} size="sm" className="font-bold text-[11px]">
                  {log.action}
                </Badge>
              </TableCell>

              {/* IP */}
              <TableCell className="whitespace-nowrap">
                <Text as="span" className="text-xs font-mono text-text-secondary">
                  {log.ipAddress || '-'}
                </Text>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <IconButton
                  icon={<Eye className="w-4 h-4 text-primary" />}
                  aria-label={ADMIN_AUDIT_TEXTS.BTN_VIEW_DETAILS}
                  title={ADMIN_AUDIT_TEXTS.BTN_VIEW_DETAILS}
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetails(log)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <LayoutContainer className="flex items-center justify-between p-4 border-t border-border">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {ADMIN_AUDIT_TEXTS.PAGINATION_LABEL(page, totalPages)}
          </Text>
          <LayoutContainer className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              className="text-xs font-semibold"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="text-xs font-semibold"
            >
              Próxima
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};

