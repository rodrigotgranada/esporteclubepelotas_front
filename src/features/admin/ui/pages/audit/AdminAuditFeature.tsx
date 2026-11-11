'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Input,
  Select,
  Option,
} from '@/shared/ui/components';
import { Search, ShieldAlert } from 'lucide-react';
import { useAdminAuditLogs } from '../../../hooks/useAdminAuditLogs';
import { AuditLogsTable } from '../../components/audit/AuditLogsTable';
import { AuditLogDetailsModal } from '../../components/audit/AuditLogDetailsModal';
import { ADMIN_AUDIT_TEXTS } from '../../../constants/admin-audit.constants';

export const AdminAuditFeature: React.FC = () => {
  const {
    logs,
    total,
    page,
    setPage,
    totalPages,
    isLoading,
    search,
    handleSearchChange,
    moduleFilter,
    handleModuleChange,
    actionFilter,
    handleActionChange,
    selectedLog,
    isDetailsModalOpen,
    openDetails,
    closeDetails,
  } = useAdminAuditLogs();

  return (
    <LayoutContainer className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <LayoutContainer className="flex items-center gap-3">
          <LayoutContainer className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Title level="h1" className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              {ADMIN_AUDIT_TEXTS.PAGE_TITLE}
            </Title>
            <Text className="text-xs sm:text-sm text-text-secondary mt-0.5">
              {ADMIN_AUDIT_TEXTS.PAGE_SUBTITLE}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="default" size="sm" className="font-semibold px-3 py-1 text-xs">
            {ADMIN_AUDIT_TEXTS.TOTAL_COUNT(total)}
          </Badge>
        </LayoutContainer>
      </LayoutContainer>

      {/* Filters Bar */}
      <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-border shadow-xs">
        {/* Search */}
        <LayoutContainer className="relative flex-1">
          <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary z-10">
            <Search className="w-4 h-4" />
          </LayoutContainer>
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={ADMIN_AUDIT_TEXTS.SEARCH_PLACEHOLDER}
            className="pl-9"
          />
        </LayoutContainer>

        {/* Module Filter */}
        <LayoutContainer className="w-full sm:w-48">
          <Select value={moduleFilter} onChange={(e) => handleModuleChange(e.target.value)}>
            <Option value="">{ADMIN_AUDIT_TEXTS.FILTER_MODULE_ALL}</Option>
            <Option value="users">Usuários</Option>
            <Option value="news">Matérias</Option>
            <Option value="news-comments">Comentários</Option>
            <Option value="squads">Futebol & Elenco</Option>
            <Option value="matches">Campeonatos & Jogos</Option>
            <Option value="idols">Ídolos</Option>
            <Option value="kits">Uniformes</Option>
            <Option value="sponsors">Patrocinadores</Option>
            <Option value="settings">Configurações</Option>
            <Option value="modules">Módulos</Option>
            <Option value="auth">Autenticação</Option>
          </Select>
        </LayoutContainer>

        {/* Action Filter */}
        <LayoutContainer className="w-full sm:w-48">
          <Select value={actionFilter} onChange={(e) => handleActionChange(e.target.value)}>
            <Option value="">{ADMIN_AUDIT_TEXTS.FILTER_ACTION_ALL}</Option>
            <Option value="LOGIN">LOGIN</Option>
            <Option value="CREATE">CREATE / INSERT</Option>
            <Option value="UPDATE">UPDATE / EDIT</Option>
            <Option value="DELETE">DELETE / REMOVE</Option>
            <Option value="REPORT">REPORT / DENÚNCIA</Option>
          </Select>
        </LayoutContainer>
      </LayoutContainer>

      {/* Table */}
      <AuditLogsTable
        logs={logs}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        onViewDetails={openDetails}
      />

      {/* Modal de Detalhes */}
      <AuditLogDetailsModal
        isOpen={isDetailsModalOpen}
        log={selectedLog}
        onClose={closeDetails}
      />
    </LayoutContainer>
  );
};

