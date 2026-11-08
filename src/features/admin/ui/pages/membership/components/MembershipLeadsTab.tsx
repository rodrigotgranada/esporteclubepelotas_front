'use client';

import React from 'react';
import {
  LayoutContainer,
  Text,
  Badge,
  Button,
  Spinner,
  Select,
} from '@/shared/ui/components';
import {
  MembershipLead,
  MembershipLeadStatus,
} from '@/features/membership/types/membership.types';
import { MEMBERSHIP_TEXTS } from '@/features/membership/constants/membership.constants';
import { MessageCircle, Phone, Mail } from 'lucide-react';

export interface MembershipLeadsTabProps {
  leads: MembershipLead[];
  isLoading: boolean;
  statusFilter: string;
  onFilterChange: (status: string) => void;
  onUpdateStatus: (leadId: string, status: MembershipLeadStatus) => void;
  onOpenWhatsApp: (lead: MembershipLead) => void;
  totalLeads: number;
}

export const MembershipLeadsTab: React.FC<MembershipLeadsTabProps> = ({
  leads,
  isLoading,
  statusFilter,
  onFilterChange,
  onUpdateStatus,
  onOpenWhatsApp,
  totalLeads,
}) => {
  return (
    <LayoutContainer className="flex flex-col gap-6">
      {/* Barra de Filtros e Total */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border">
        <LayoutContainer className="flex items-center gap-3">
          <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Filtrar:
          </Text>
          <Select
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="text-xs py-2 w-48"
          >
            <option value="ALL">Todos os Status</option>
            <option value="NOVO">Novos</option>
            <option value="CONTATADO">Contatados</option>
            <option value="CONVERTIDO">Convertidos em Sócios</option>
            <option value="CANCELADO">Cancelados</option>
          </Select>
        </LayoutContainer>

        <Text as="span" className="text-xs text-text-secondary font-medium">
          Total de <strong className="text-text-primary">{totalLeads}</strong> intenções de adesão registradas
        </Text>
      </LayoutContainer>

      {/* Loading State */}
      {isLoading && (
        <LayoutContainer className="flex flex-col items-center justify-center py-16">
          <Spinner className="w-8 h-8 text-primary mb-3" />
          <Text as="p" className="text-xs text-text-secondary">
            Carregando lista de torcedores interessados...
          </Text>
        </LayoutContainer>
      )}

      {/* Tabela de Leads */}
      {!isLoading && leads.length > 0 && (
        <LayoutContainer className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
          <LayoutContainer className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background/80 border-b border-border text-xs uppercase tracking-wider text-text-secondary font-bold">
                <tr>
                  <th className="py-3.5 px-4">Data / Hora</th>
                  <th className="py-3.5 px-4">Torcedor</th>
                  <th className="py-3.5 px-4">Plano Escolhido</th>
                  <th className="py-3.5 px-4">Contato</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Chamar Torcedor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {leads.map((lead) => {
                  const formattedDate = lead.createdAt
                    ? new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—';

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-background/50 transition-colors"
                    >
                      {/* Data */}
                      <td className="py-4 px-4 text-xs text-text-secondary whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Torcedor & CPF */}
                      <td className="py-4 px-4">
                        <LayoutContainer className="flex flex-col gap-0.5">
                          <Text as="span" className="font-bold text-text-primary text-sm">
                            {lead.name}
                          </Text>
                          {lead.cpf && (
                            <Text as="span" className="text-[11px] text-text-secondary">
                              CPF: {lead.cpf}
                            </Text>
                          )}
                        </LayoutContainer>
                      </td>

                      {/* Plano Escolhido */}
                      <td className="py-4 px-4">
                        <Badge variant="primary" size="sm" className="font-bold text-xs">
                          {lead.planName || 'Quadro Social'}
                        </Badge>
                      </td>

                      {/* Contatos */}
                      <td className="py-4 px-4">
                        <LayoutContainer className="flex flex-col gap-1 text-xs">
                          <LayoutContainer className="flex items-center gap-1.5 text-text-primary">
                            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                            <Text as="span" className="font-semibold">{lead.phone}</Text>
                          </LayoutContainer>
                          <LayoutContainer className="flex items-center gap-1.5 text-text-secondary">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <Text as="span" className="truncate max-w-[180px]">{lead.email}</Text>
                          </LayoutContainer>
                        </LayoutContainer>
                      </td>

                      {/* Seletor de Status de Atendimento */}
                      <td className="py-4 px-4 text-center">
                        <Select
                          value={lead.status}
                          onChange={(e) =>
                            onUpdateStatus(lead.id, e.target.value as MembershipLeadStatus)
                          }
                          className="text-xs py-1.5 w-32"
                        >
                          <option value="NOVO">Novo</option>
                          <option value="CONTATADO">Contatado</option>
                          <option value="CONVERTIDO">Convertido</option>
                          <option value="CANCELADO">Cancelado</option>
                        </Select>
                      </td>

                      {/* Botão de WhatsApp Direto */}
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onOpenWhatsApp(lead)}
                          className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 inline-flex items-center gap-1.5 shadow-xs"
                          title="Abrir WhatsApp para falar com este torcedor"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Empty State */}
      {!isLoading && leads.length === 0 && (
        <LayoutContainer className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-border bg-surface/30 text-center">
          <Text as="p" className="text-sm font-semibold text-text-secondary">
            {MEMBERSHIP_TEXTS.ADMIN_EMPTY_LEADS}
          </Text>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
