'use client';

import React, { useState } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
} from '@/shared/ui/components';
import { MEMBERSHIP_TEXTS } from '@/features/membership/constants/membership.constants';
import { useAdminMembershipPlans } from '@/features/admin/hooks/membership/useAdminMembershipPlans';
import { useAdminMembershipLeads } from '@/features/admin/hooks/membership/useAdminMembershipLeads';
import { MembershipPlansTab } from './components/MembershipPlansTab';
import { MembershipLeadsTab } from './components/MembershipLeadsTab';
import { MembershipSyncTab } from './components/MembershipSyncTab';
import { MembershipPlanDrawer } from './components/MembershipPlanDrawer';
import { MembershipSystemSelectorCard } from './components/MembershipSystemSelectorCard';
import { UserCheck, MessageSquare, Users } from 'lucide-react';

export const AdminMembershipFeature: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'leads' | 'sync'>('plans');

  const {
    plans,
    isLoading: isPlansLoading,
    isDrawerOpen,
    selectedPlan,
    planToDelete,
    isDeleteModalOpen,
    isDeleting,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDrawer,
    handleToggleActive,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    refetch: refetchPlans,
  } = useAdminMembershipPlans();

  const {
    leads,
    isLoading: isLeadsLoading,
    statusFilter,
    setStatusFilter,
    totalLeads,
    handleUpdateStatus,
    openWhatsAppToTorcedor,
  } = useAdminMembershipLeads();

  return (
    <LayoutContainer className="flex flex-col gap-8 p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Cabeçalho da Gestão */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <LayoutContainer className="flex flex-col gap-1">
          <Title level="h1" className="text-2xl sm:text-3xl font-black text-text-primary">
            {MEMBERSHIP_TEXTS.ADMIN_TITLE}
          </Title>
          <Text as="p" className="text-sm text-text-secondary">
            {MEMBERSHIP_TEXTS.ADMIN_SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Seletor de Provedor Oficial (ElevenTickets vs Portal Nativo) */}
      <MembershipSystemSelectorCard />

      {/* Navegador de Abas */}
      <LayoutContainer className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab('plans')}
          className={`font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'plans'
              ? 'bg-primary text-background shadow-xs hover:bg-primary/90'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{MEMBERSHIP_TEXTS.ADMIN_TAB_PLANS}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab('leads')}
          className={`font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'leads'
              ? 'bg-primary text-background shadow-xs hover:bg-primary/90'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{MEMBERSHIP_TEXTS.ADMIN_TAB_LEADS}</span>
          {totalLeads > 0 && (
            <Text
              as="span"
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'leads'
                  ? 'bg-background text-primary'
                  : 'bg-primary/20 text-primary'
              }`}
            >
              {totalLeads}
            </Text>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab('sync')}
          className={`font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'sync'
              ? 'bg-primary text-background shadow-xs hover:bg-primary/90'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{MEMBERSHIP_TEXTS.ADMIN_TAB_MEMBERS}</span>
        </Button>
      </LayoutContainer>

      {/* Conteúdo da Aba 1: Planos de Sócios */}
      {activeTab === 'plans' && (
        <MembershipPlansTab
          plans={plans}
          isLoading={isPlansLoading}
          onOpenCreate={handleOpenCreate}
          onOpenEdit={handleOpenEdit}
          onToggleActive={handleToggleActive}
          onOpenDelete={handleOpenDelete}
          isDeleteModalOpen={isDeleteModalOpen}
          onCloseDelete={handleCloseDelete}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
          planToDelete={planToDelete}
        />
      )}

      {/* Conteúdo da Aba 2: Leads & Adesões */}
      {activeTab === 'leads' && (
        <MembershipLeadsTab
          leads={leads}
          isLoading={isLeadsLoading}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
          onUpdateStatus={handleUpdateStatus}
          onOpenWhatsApp={openWhatsAppToTorcedor}
          totalLeads={totalLeads}
        />
      )}

      {/* Conteúdo da Aba 3: Sócios ElevenTickets & Base */}
      {activeTab === 'sync' && <MembershipSyncTab />}

      {/* Drawer de Cadastro / Edição de Plano */}
      <MembershipPlanDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        plan={selectedPlan}
        onSuccess={refetchPlans}
      />
    </LayoutContainer>
  );
};
