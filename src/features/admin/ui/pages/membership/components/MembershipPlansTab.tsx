'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Spinner,
  ConfirmModal,
} from '@/shared/ui/components';
import { MembershipPlan } from '@/features/membership/types/membership.types';
import { MEMBERSHIP_TEXTS } from '@/features/membership/constants/membership.constants';
import { Edit2, Trash2, Power, Star, Plus } from 'lucide-react';

export interface MembershipPlansTabProps {
  plans: MembershipPlan[];
  isLoading: boolean;
  onOpenCreate: () => void;
  onOpenEdit: (plan: MembershipPlan) => void;
  onToggleActive: (plan: MembershipPlan) => void;
  onOpenDelete: (plan: MembershipPlan) => void;
  isDeleteModalOpen: boolean;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
  planToDelete: MembershipPlan | null;
}

export const MembershipPlansTab: React.FC<MembershipPlansTabProps> = ({
  plans,
  isLoading,
  onOpenCreate,
  onOpenEdit,
  onToggleActive,
  onOpenDelete,
  isDeleteModalOpen,
  onCloseDelete,
  onConfirmDelete,
  isDeleting,
  planToDelete,
}) => {
  return (
    <LayoutContainer className="flex flex-col gap-6">
      {/* Barra de Ações Superior */}
      <LayoutContainer className="flex items-center justify-between">
        <LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary">
            Total de {plans.length} planos cadastrados no Quadro Social
          </Text>
        </LayoutContainer>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenCreate}
          className="font-bold text-xs uppercase tracking-wider px-4 py-2.5 inline-flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{MEMBERSHIP_TEXTS.ADMIN_NEW_PLAN}</span>
        </Button>
      </LayoutContainer>

      {/* Loading State */}
      {isLoading && (
        <LayoutContainer className="flex flex-col items-center justify-center py-16">
          <Spinner className="w-8 h-8 text-primary mb-3" />
          <Text as="p" className="text-xs text-text-secondary">
            Carregando planos de sócios...
          </Text>
        </LayoutContainer>
      )}

      {/* Tabela de Planos */}
      {!isLoading && plans.length > 0 && (
        <LayoutContainer className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
          <LayoutContainer className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background/80 border-b border-border text-xs uppercase tracking-wider text-text-secondary font-bold">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Plano</th>
                  <th className="py-3.5 px-4">Valor / Recorrência</th>
                  <th className="py-3.5 px-4">Vantagens</th>
                  <th className="py-3.5 px-4 text-center">Destaque</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {plans.map((plan, index) => {
                  const formattedPrice = plan.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  });

                  return (
                    <tr
                      key={plan.id}
                      className="hover:bg-background/50 transition-colors"
                    >
                      {/* Posição / Ordem */}
                      <td className="py-4 px-4 text-center text-xs font-bold text-text-secondary">
                        {index + 1}
                      </td>

                      {/* Nome do Plano */}
                      <td className="py-4 px-4">
                        <LayoutContainer className="flex flex-col gap-1">
                          <LayoutContainer className="flex items-center gap-2">
                            <Text as="span" className="font-bold text-text-primary text-sm">
                              {plan.name}
                            </Text>
                            {plan.badgeText && (
                              <Badge
                                variant={plan.highlighted ? 'primary' : 'default'}
                                size="sm"
                                className="text-[10px] font-bold px-2 py-0.5"
                              >
                                {plan.badgeText}
                              </Badge>
                            )}
                          </LayoutContainer>
                          {plan.description && (
                            <Text as="span" className="text-xs text-text-secondary line-clamp-1">
                              {plan.description}
                            </Text>
                          )}
                        </LayoutContainer>
                      </td>

                      {/* Valor & Periodicidade */}
                      <td className="py-4 px-4">
                        <LayoutContainer className="flex items-baseline gap-1">
                          <Text as="span" className="font-extrabold text-primary text-sm">
                            {formattedPrice}
                          </Text>
                          <Text as="span" className="text-xs text-text-secondary">
                            /{plan.billingPeriod.toLowerCase()}
                          </Text>
                        </LayoutContainer>
                      </td>

                      {/* Quantidade de vantagens */}
                      <td className="py-4 px-4">
                        <Badge variant="default" size="sm" className="text-xs font-semibold">
                          {plan.advantages?.length || 0} benefícios
                        </Badge>
                      </td>

                      {/* Destaque */}
                      <td className="py-4 px-4 text-center">
                        {plan.highlighted ? (
                          <Badge variant="primary" size="sm" className="font-bold inline-flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Sim</span>
                          </Badge>
                        ) : (
                          <Text as="span" className="text-xs text-text-secondary">
                            —
                          </Text>
                        )}
                      </td>

                      {/* Status Ativo / Inativo */}
                      <td className="py-4 px-4 text-center">
                        <Badge
                          variant={plan.active ? 'primary' : 'default'}
                          size="sm"
                          className="font-bold text-xs"
                        >
                          {plan.active ? 'Ativo' : 'Pausado'}
                        </Badge>
                      </td>

                      {/* Ações */}
                      <td className="py-4 px-4 text-right">
                        <LayoutContainer className="flex items-center justify-end gap-1">
                          {/* Alternar Ativo/Inativo */}
                          <Button
                            variant="ghost"
                            size="none"
                            onClick={() => onToggleActive(plan)}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              plan.active
                                ? 'text-primary hover:bg-primary/10'
                                : 'text-text-secondary hover:bg-surface'
                            }`}
                            title={plan.active ? 'Pausar plano' : 'Ativar plano'}
                            aria-label="Alternar status"
                          >
                            <Power className="w-4 h-4" />
                          </Button>

                          {/* Editar */}
                          <Button
                            variant="ghost"
                            size="none"
                            onClick={() => onOpenEdit(plan)}
                            className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                            title="Editar plano"
                            aria-label="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>

                          {/* Excluir (Soft Delete) */}
                          <Button
                            variant="ghost"
                            size="none"
                            onClick={() => onOpenDelete(plan)}
                            className="p-2 text-[#ea580c] hover:bg-[#ea580c]/10 rounded-lg transition-colors cursor-pointer"
                            title="Excluir plano"
                            aria-label="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </LayoutContainer>
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
      {!isLoading && plans.length === 0 && (
        <LayoutContainer className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-border bg-surface/30 text-center">
          <Text as="p" className="text-sm font-semibold text-text-secondary mb-3">
            {MEMBERSHIP_TEXTS.ADMIN_EMPTY_PLANS}
          </Text>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreate}
            className="font-bold text-xs uppercase px-4 py-2"
          >
            {MEMBERSHIP_TEXTS.ADMIN_NEW_PLAN}
          </Button>
        </LayoutContainer>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
        title={MEMBERSHIP_TEXTS.ADMIN_CONFIRM_DELETE_TITLE}
        description={`${MEMBERSHIP_TEXTS.ADMIN_CONFIRM_DELETE_MSG} "${planToDelete?.name}".`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </LayoutContainer>
  );
};
