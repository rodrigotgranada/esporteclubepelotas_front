'use client';

import React from 'react';
import {
  Drawer,
  LayoutContainer,
  Text,
  Button,
  Input,
  Select,
  Checkbox,
  Spinner,
} from '@/shared/ui/components';
import { MembershipPlan } from '@/features/membership/types/membership.types';
import { useAdminMembershipDrawer } from '@/features/admin/hooks/membership/useAdminMembershipDrawer';
import { Plus, Trash2, Check } from 'lucide-react';

export interface MembershipPlanDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
  onSuccess: () => void;
}

export const MembershipPlanDrawer: React.FC<MembershipPlanDrawerProps> = ({
  isOpen,
  onClose,
  plan,
  onSuccess,
}) => {
  const {
    name,
    setName,
    slug,
    setSlug,
    description,
    setDescription,
    price,
    setPrice,
    billingPeriod,
    setBillingPeriod,
    advantages,
    newAdvantageInput,
    setNewAdvantageInput,
    handleAddAdvantage,
    handleRemoveAdvantage,
    badgeText,
    setBadgeText,
    highlighted,
    setHighlighted,
    whatsappOverride,
    setWhatsappOverride,
    active,
    setActive,
    isSaving,
    errorMsg,
    handleSubmit,
  } = useAdminMembershipDrawer({
    plan,
    isOpen,
    onClose,
    onSuccess,
  });

  const title = plan ? `Editar Plano: ${plan.name}` : 'Cadastrar Novo Plano de Sócio';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
        <LayoutContainer className="flex flex-col gap-5 p-6 overflow-y-auto">
          {/* Mensagem de Erro */}
          {errorMsg && (
            <LayoutContainer className="p-3.5 rounded-xl bg-[#ea580c]/10 border border-[#ea580c]/30 text-[#ea580c] text-xs font-semibold">
              {errorMsg}
            </LayoutContainer>
          )}

          {/* Nome e Slug */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                Nome do Plano *
              </Text>
              <Input
                type="text"
                placeholder="Ex: Sócio Lobo Raça"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-sm py-2.5"
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                Slug (identificador na URL)
              </Text>
              <Input
                type="text"
                placeholder="Ex: socio-lobo-raca"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="text-sm py-2.5"
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* Preço e Recorrência */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                Valor (R$) *
              </Text>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 45.00"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                required
                className="text-sm py-2.5 font-bold"
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                Periodicidade de Cobrança *
              </Text>
              <Select
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(e.target.value as any)}
                className="text-sm py-2.5"
              >
                <option value="MENSAL">Mensal</option>
                <option value="TRIMESTRAL">Trimestral</option>
                <option value="SEMESTRAL">Semestral</option>
                <option value="ANUAL">Anual</option>
              </Select>
            </LayoutContainer>
          </LayoutContainer>

          {/* Badge e WhatsApp de Atendimento Específico */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                Badge / Etiqueta de Destaque (opcional)
              </Text>
              <Input
                type="text"
                placeholder="Ex: MAIS ESCOLHIDO, ARQUIBANCADA"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="text-sm py-2.5"
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                WhatsApp Específico do Plano (opcional)
              </Text>
              <Input
                type="text"
                placeholder="Ex: 53981112024 (deixe vazio para usar geral)"
                value={whatsappOverride}
                onChange={(e) => setWhatsappOverride(e.target.value)}
                className="text-sm py-2.5"
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* Opções de Ativação e Destaque */}
          <LayoutContainer className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-surface/50 border border-border">
            <Checkbox
              id="plan-highlighted"
              label="Destacar plano com borda dourada no portal"
              checked={highlighted}
              onChange={(e) => setHighlighted(e.target.checked)}
            />

            <Checkbox
              id="plan-active"
              label="Plano ativo e disponível para contratação"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </LayoutContainer>

          {/* Descrição */}
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-secondary">
              Descrição Resumida do Plano
            </Text>
            <Input
              type="text"
              placeholder="Ex: Ideal para quem vai a todos os jogos e apoia o Pelotas incondicionalmente."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm py-2.5"
            />
          </LayoutContainer>

          {/* Lista Dinâmica de Vantagens */}
          <LayoutContainer className="flex flex-col gap-3 pt-2">
            <LayoutContainer className="flex items-center justify-between">
              <Text as="span" className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Vantagens & Benefícios Inclusos ({advantages.length})
              </Text>
            </LayoutContainer>

            {/* Input para adicionar nova vantagem */}
            <LayoutContainer className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Digite uma nova vantagem (ex: 15% de desconto na Loja Oficial)..."
                value={newAdvantageInput}
                onChange={(e) => setNewAdvantageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAdvantage();
                  }
                }}
                className="text-sm py-2 flex-1"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleAddAdvantage}
                className="font-bold text-xs uppercase px-4 py-2 shrink-0 inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </Button>
            </LayoutContainer>

            {/* Lista com itens já adicionados */}
            <LayoutContainer className="flex flex-col gap-2 mt-1">
              {advantages.map((adv, idx) => (
                <LayoutContainer
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface border border-border/70"
                >
                  <LayoutContainer className="flex items-center gap-2.5 flex-1 min-w-0">
                    <LayoutContainer className="p-1 rounded-full bg-primary/20 text-primary shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </LayoutContainer>
                    <Text as="span" className="text-xs sm:text-sm text-text-primary truncate">
                      {adv}
                    </Text>
                  </LayoutContainer>
                  <Button
                    type="button"
                    variant="ghost"
                    size="none"
                    onClick={() => handleRemoveAdvantage(idx)}
                    className="p-1 text-[#ea580c] hover:bg-[#ea580c]/10 rounded-lg transition-colors cursor-pointer"
                    aria-label="Remover vantagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </LayoutContainer>
              ))}
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Rodapé do Drawer com Ações */}
        <LayoutContainer className="flex items-center justify-end gap-3 p-6 border-t border-border bg-surface shrink-0">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSaving}
            className="text-xs font-bold uppercase tracking-wider px-5 py-2.5"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSaving}
            className="text-xs font-black uppercase tracking-wider px-6 py-2.5 shadow-sm inline-flex items-center gap-2"
          >
            {isSaving && <Spinner className="w-4 h-4 text-background animate-spin" />}
            <span>{isSaving ? 'Salvando...' : 'Salvar Plano'}</span>
          </Button>
        </LayoutContainer>
      </form>
    </Drawer>
  );
};
