'use client';

import React, { useState } from 'react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Button,
  Input,
  PhoneInput,
  CpfInput,
  EmailInput,
} from '@/shared/ui/components';
import { MembershipPlan } from '../../types/membership.types';
import { MEMBERSHIP_TEXTS } from '../../constants/membership.constants';
import { MessageCircle, ShieldCheck } from 'lucide-react';

export interface QuickLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
  onSubmit: (data: {
    name: string;
    phone: string;
    email: string;
    cpf?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export const QuickLeadModal: React.FC<QuickLeadModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSubmit,
  isSubmitting = false,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!plan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe um número de WhatsApp válido com DDD.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor, informe um e-mail válido.');
      return;
    }

    await onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      cpf: cpf.trim() || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" className="bg-surface border-border">
      <form onSubmit={handleSubmit}>
        <LayoutContainer className="flex flex-col gap-5 p-2">
          {/* Cabeçalho */}
          <LayoutContainer className="flex flex-col gap-1.5 text-left">
            <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
              {MEMBERSHIP_TEXTS.LEAD_MODAL_TITLE}
            </Title>
            <Text as="p" className="text-xs text-text-secondary leading-relaxed">
              {MEMBERSHIP_TEXTS.LEAD_MODAL_SUBTITLE}
            </Text>
            <LayoutContainer className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 mt-1">
              <Text as="span" className="text-xs font-bold text-primary">
                Plano selecionado: {plan.name}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          {/* Mensagem de Erro com token Áureo-Cerúleo */}
          {errorMsg && (
            <LayoutContainer className="p-3 rounded-xl bg-[#ea580c]/10 border border-[#ea580c]/30 text-[#ea580c] text-xs font-semibold">
              {errorMsg}
            </LayoutContainer>
          )}

          {/* Campos do Formulário */}
          <LayoutContainer className="flex flex-col gap-3.5">
            <LayoutContainer className="flex flex-col gap-1 text-left">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {MEMBERSHIP_TEXTS.LEAD_LABEL_NAME} *
              </Text>
              <Input
                type="text"
                placeholder={MEMBERSHIP_TEXTS.LEAD_PLACEHOLDER_NAME}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-sm py-2.5"
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1 text-left">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {MEMBERSHIP_TEXTS.LEAD_LABEL_PHONE} *
              </Text>
              <PhoneInput
                placeholder={MEMBERSHIP_TEXTS.LEAD_PLACEHOLDER_PHONE}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full text-sm py-2.5"
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1 text-left">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {MEMBERSHIP_TEXTS.LEAD_LABEL_EMAIL} *
              </Text>
              <EmailInput
                placeholder={MEMBERSHIP_TEXTS.LEAD_PLACEHOLDER_EMAIL}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-sm py-2.5"
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1 text-left">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {MEMBERSHIP_TEXTS.LEAD_LABEL_CPF}
              </Text>
              <CpfInput
                placeholder={MEMBERSHIP_TEXTS.LEAD_PLACEHOLDER_CPF}
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full text-sm py-2.5"
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* Garantia de privacidade */}
          <LayoutContainer className="flex items-center gap-2 text-xs text-text-secondary text-left">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <Text as="span">{MEMBERSHIP_TEXTS.LEAD_DATA_SECURITY}</Text>
          </LayoutContainer>

          {/* Botão de Envio */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full font-black uppercase tracking-wider py-3.5 shadow-md inline-flex items-center justify-center gap-2 text-sm mt-1"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>
              {isSubmitting
                ? MEMBERSHIP_TEXTS.LEAD_SUBMITTING
                : MEMBERSHIP_TEXTS.LEAD_BUTTON_SUBMIT}
            </span>
          </Button>
        </LayoutContainer>
      </form>
    </Modal>
  );
};
