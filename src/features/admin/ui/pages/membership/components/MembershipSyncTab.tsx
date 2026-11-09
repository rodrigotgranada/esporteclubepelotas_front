'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  Select,
  Option,
  Spinner,
} from '@/shared/ui/components';
import { MEMBERSHIP_TEXTS } from '@/features/membership/constants/membership.constants';
import { useAdminMembershipSync } from '@/features/admin/hooks/membership/useAdminMembershipSync';
import { useAdminManualOverrideModal } from '@/features/admin/hooks/membership/useAdminManualOverrideModal';
import { ManualSocioOverrideModal } from './ManualSocioOverrideModal';
import { EleventicketsImportResultModal } from './EleventicketsImportResultModal';
import {
  Upload,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  ShieldAlert,
  UserX,
  RotateCcw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
} from 'lucide-react';

export const MembershipSyncTab: React.FC = () => {
  const {
    summary,
    members,
    isLoadingSummary,
    isLoadingMembers,
    page,
    setPage,
    totalPages,
    totalMembers,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    syncModeFilter,
    setSyncModeFilter,
    selectedFile,
    handleSelectFile,
    fileInputRef,
    handleTriggerFileInput,
    isImporting,
    importResult,
    isResultModalOpen,
    handleImportCsv,
    handleReleaseOverride,
    handleCloseResultModal,
    refetch,
  } = useAdminMembershipSync();

  const {
    isOpen: isOverrideOpen,
    selectedMember,
    status: overrideStatus,
    setStatus: setOverrideStatus,
    reason: overrideReason,
    setReason: setOverrideReason,
    isSubmitting: isSubmittingOverride,
    handleOpen: handleOpenOverride,
    handleClose: handleCloseOverride,
    handleSubmit: handleSubmitOverride,
  } = useAdminManualOverrideModal(refetch);

  return (
    <LayoutContainer className="flex flex-col gap-8 w-full">
      {/* 1. Grid de Métricas do Quadro Social */}
      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Métrica 1: Sócios Ativos */}
        <LayoutContainer className="flex items-center justify-between p-5 rounded-2xl bg-surface border border-border shadow-xs">
          <LayoutContainer className="flex flex-col gap-1">
            <Text as="span" className="text-xs font-semibold text-text-secondary">
              {MEMBERSHIP_TEXTS.SYNC_METRIC_ACTIVE}
            </Text>
            <Title level="h3" className="text-2xl font-black text-text-primary">
              {isLoadingSummary ? '...' : summary?.totalActiveMembers ?? 0}
            </Title>
          </LayoutContainer>
          <LayoutContainer className="p-3 rounded-xl bg-primary/20 text-primary">
            <ShieldCheck className="w-6 h-6" />
          </LayoutContainer>
        </LayoutContainer>

        {/* Métrica 2: Pré-cadastros no Cache */}
        <LayoutContainer className="flex items-center justify-between p-5 rounded-2xl bg-surface border border-border shadow-xs">
          <LayoutContainer className="flex flex-col gap-1">
            <Text as="span" className="text-xs font-semibold text-text-secondary">
              {MEMBERSHIP_TEXTS.SYNC_METRIC_CACHE}
            </Text>
            <Title level="h3" className="text-2xl font-black text-text-primary">
              {isLoadingSummary ? '...' : summary?.totalCachePending ?? 0}
            </Title>
          </LayoutContainer>
          <LayoutContainer className="p-3 rounded-xl bg-primary/10 text-primary">
            <Users className="w-6 h-6" />
          </LayoutContainer>
        </LayoutContainer>

        {/* Métrica 3: Travas Manuais */}
        <LayoutContainer className="flex items-center justify-between p-5 rounded-2xl bg-surface border border-border shadow-xs">
          <LayoutContainer className="flex flex-col gap-1">
            <Text as="span" className="text-xs font-semibold text-text-secondary">
              {MEMBERSHIP_TEXTS.SYNC_METRIC_OVERRIDES}
            </Text>
            <Title level="h3" className="text-2xl font-black text-[#ea580c]">
              {isLoadingSummary ? '...' : summary?.totalManualOverrides ?? 0}
            </Title>
          </LayoutContainer>
          <LayoutContainer className="p-3 rounded-xl bg-[#ea580c]/15 text-[#ea580c]">
            <ShieldAlert className="w-6 h-6" />
          </LayoutContainer>
        </LayoutContainer>

        {/* Métrica 4: Inativos */}
        <LayoutContainer className="flex items-center justify-between p-5 rounded-2xl bg-surface border border-border shadow-xs">
          <LayoutContainer className="flex flex-col gap-1">
            <Text as="span" className="text-xs font-semibold text-text-secondary">
              {MEMBERSHIP_TEXTS.SYNC_METRIC_INACTIVE}
            </Text>
            <Title level="h3" className="text-2xl font-black text-text-secondary">
              {isLoadingSummary ? '...' : summary?.totalInactiveMembers ?? 0}
            </Title>
          </LayoutContainer>
          <LayoutContainer className="p-3 rounded-xl bg-background text-text-secondary border border-border">
            <UserX className="w-6 h-6" />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* 2. Card de Importação de Planilha ElevenTickets */}
      <LayoutContainer className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 p-6 rounded-3xl bg-surface border-2 border-border shadow-sm">
        <LayoutContainer className="flex-1 flex flex-col gap-2">
          <LayoutContainer className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <Title level="h2" className="text-lg font-black text-text-primary">
              {MEMBERSHIP_TEXTS.SYNC_CARD_TITLE}
            </Title>
          </LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary leading-relaxed max-w-2xl">
            {MEMBERSHIP_TEXTS.SYNC_CARD_DESC}
          </Text>

          {selectedFile && (
            <LayoutContainer className="flex items-center gap-2 pt-2 text-xs font-bold text-primary">
              <CheckCircle className="w-4 h-4" />
              <Text as="span">
                {MEMBERSHIP_TEXTS.SYNC_FILE_SELECTED} {selectedFile.name} (
                {Math.round(selectedFile.size / 1024)} KB)
              </Text>
            </LayoutContainer>
          )}
        </LayoutContainer>

        <LayoutContainer className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={(e) => handleSelectFile(e.target.files?.[0] || null)}
            className="hidden"
          />

          <Button
            variant="outline"
            size="md"
            onClick={handleTriggerFileInput}
            disabled={isImporting}
            className="w-full sm:w-auto font-bold text-xs uppercase px-5 py-2.5 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{selectedFile ? 'Trocar Arquivo' : MEMBERSHIP_TEXTS.SYNC_SELECT_FILE}</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleImportCsv}
            disabled={isImporting || !selectedFile}
            className="w-full sm:w-auto font-black text-xs uppercase px-6 py-2.5 inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isImporting ? (
              <>
                <Spinner className="w-4 h-4 text-background" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4" />
                <span>{MEMBERSHIP_TEXTS.SYNC_BUTTON_IMPORT}</span>
              </>
            )}
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* 3. Filtros da Tabela */}
      <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <LayoutContainer className="relative flex-1 max-w-md">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={MEMBERSHIP_TEXTS.SYNC_SEARCH_PLACEHOLDER}
            className="pl-9 text-xs py-2 w-full"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs py-2"
          >
            <Option value="ALL">{MEMBERSHIP_TEXTS.SYNC_FILTER_ALL}</Option>
            <Option value="ACTIVE">{MEMBERSHIP_TEXTS.SYNC_FILTER_ACTIVE}</Option>
            <Option value="OVERDUE">{MEMBERSHIP_TEXTS.SYNC_FILTER_OVERDUE}</Option>
            <Option value="INACTIVE">{MEMBERSHIP_TEXTS.SYNC_FILTER_INACTIVE}</Option>
          </Select>

          <Select
            value={syncModeFilter}
            onChange={(e) => {
              setSyncModeFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs py-2"
          >
            <Option value="ALL">{MEMBERSHIP_TEXTS.SYNC_FILTER_MODE_ALL}</Option>
            <Option value="AUTO">{MEMBERSHIP_TEXTS.SYNC_FILTER_MODE_AUTO}</Option>
            <Option value="MANUAL_OVERRIDE">{MEMBERSHIP_TEXTS.SYNC_FILTER_MODE_MANUAL}</Option>
          </Select>
        </LayoutContainer>
      </LayoutContainer>

      {/* 4. Tabela de Sócios */}
      <LayoutContainer className="w-full overflow-hidden rounded-3xl bg-surface border border-border shadow-xs">
        <LayoutContainer className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-background/50 text-[11px] font-extrabold uppercase tracking-wider text-text-secondary">
                <th className="py-4 px-5">{MEMBERSHIP_TEXTS.SYNC_COL_MEMBER}</th>
                <th className="py-4 px-5">{MEMBERSHIP_TEXTS.SYNC_COL_IDENTIFIER}</th>
                <th className="py-4 px-5">{MEMBERSHIP_TEXTS.SYNC_COL_PLAN}</th>
                <th className="py-4 px-5">{MEMBERSHIP_TEXTS.SYNC_COL_STATUS}</th>
                <th className="py-4 px-5">{MEMBERSHIP_TEXTS.SYNC_COL_MODE}</th>
                <th className="py-4 px-5 text-right">{MEMBERSHIP_TEXTS.SYNC_COL_ACTIONS}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoadingMembers ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-secondary">
                    <LayoutContainer className="flex flex-col items-center justify-center gap-2">
                      <Spinner className="w-6 h-6 text-primary" />
                      <Text as="span">Carregando base de sócios...</Text>
                    </LayoutContainer>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-secondary">
                    <Text as="p" className="text-xs font-semibold">
                      {MEMBERSHIP_TEXTS.ADMIN_EMPTY_MEMBERS}
                    </Text>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.userId} className="hover:bg-background/40 transition-colors">
                    {/* Torcedor */}
                    <td className="py-4 px-5">
                      <LayoutContainer className="flex items-center gap-3">
                        <LayoutContainer className="w-9 h-9 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center text-xs shrink-0">
                          {member.name.charAt(0).toUpperCase()}
                        </LayoutContainer>
                        <LayoutContainer className="flex flex-col">
                          <Text as="span" className="font-bold text-text-primary text-xs">
                            {member.name}
                          </Text>
                          <Text as="span" className="text-[11px] text-text-secondary">
                            {member.email}
                          </Text>
                        </LayoutContainer>
                      </LayoutContainer>
                    </td>

                    {/* CPF & Matrícula */}
                    <td className="py-4 px-5">
                      <LayoutContainer className="flex flex-col">
                        <Text as="span" className="font-mono text-xs text-text-primary">
                          {member.cpf || '-'}
                        </Text>
                        <Text as="span" className="text-[11px] text-text-secondary">
                          Matrícula: {member.eleventicketsId || '-'}
                        </Text>
                      </LayoutContainer>
                    </td>

                    {/* Plano */}
                    <td className="py-4 px-5">
                      <Text as="span" className="font-semibold text-text-primary">
                        {member.planName || 'Sócio Áureo-Cerúleo'}
                      </Text>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      {member.status === 'ACTIVE' && (
                        <Badge variant="primary" size="sm" className="font-black text-[10px] uppercase">
                          Ativo
                        </Badge>
                      )}
                      {member.status === 'OVERDUE' && (
                        <Badge variant="warning" size="sm" className="font-black text-[10px] uppercase">
                          Inadimplente
                        </Badge>
                      )}
                      {member.status === 'SUSPENDED' && (
                        <Badge variant="warning" size="sm" className="font-black text-[10px] uppercase">
                          Suspenso
                        </Badge>
                      )}
                      {member.status === 'INACTIVE' && (
                        <Badge variant="default" size="sm" className="font-black text-[10px] uppercase">
                          Inativo
                        </Badge>
                      )}
                    </td>

                    {/* Modo de Sincronização */}
                    <td className="py-4 px-5">
                      {member.syncMode === 'MANUAL_OVERRIDE' ? (
                        <LayoutContainer className="flex flex-col gap-0.5">
                          <Badge variant="warning" size="sm" className="font-black text-[10px] uppercase w-fit">
                            Trava Manual
                          </Badge>
                          {member.overrideReason && (
                            <Text as="span" className="text-[10px] text-text-secondary truncate max-w-[160px]" title={member.overrideReason}>
                              {member.overrideReason}
                            </Text>
                          )}
                        </LayoutContainer>
                      ) : (
                        <Badge variant="primary" size="sm" className="font-bold text-[10px] uppercase">
                          Automático
                        </Badge>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-5 text-right">
                      <LayoutContainer className="flex items-center justify-end gap-2">
                        {member.syncMode === 'MANUAL_OVERRIDE' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReleaseOverride(member.userId)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-background cursor-pointer"
                            title="Restaurar modo de sincronização automático"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenOverride(member)}
                          className="font-bold text-[11px] px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Ajustar</span>
                        </Button>
                      </LayoutContainer>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </LayoutContainer>

        {/* 5. Paginação */}
        {totalPages > 1 && (
          <LayoutContainer className="flex items-center justify-between p-4 border-t border-border bg-background/30 text-xs">
            <Text as="span" className="text-text-secondary">
              Mostrando página {page} de {totalPages} ({totalMembers} registros)
            </Text>

            <LayoutContainer className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </LayoutContainer>
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Modais */}
      <ManualSocioOverrideModal
        isOpen={isOverrideOpen}
        member={selectedMember}
        status={overrideStatus}
        onChangeStatus={setOverrideStatus}
        reason={overrideReason}
        onChangeReason={setOverrideReason}
        isSubmitting={isSubmittingOverride}
        onClose={handleCloseOverride}
        onSubmit={handleSubmitOverride}
      />

      <EleventicketsImportResultModal
        isOpen={isResultModalOpen}
        result={importResult}
        onClose={handleCloseResultModal}
      />
    </LayoutContainer>
  );
};

