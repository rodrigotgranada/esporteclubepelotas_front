'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  Spinner,
} from '@/shared/ui/components';
import { membershipService } from '@/features/membership/services/membership.service';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Ticket, Sparkles, ExternalLink, Check, Save } from 'lucide-react';

export const MembershipSystemSelectorCard: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const [provider, setProvider] = useState<'ELEVENTICKETS' | 'NATIVE'>(
    settings?.membershipSystemProvider === 'NATIVE' ? 'NATIVE' : 'ELEVENTICKETS'
  );
  const [externalUrl, setExternalUrl] = useState(
    settings?.membershipExternalUrl || 'https://socioecpelotas.eleventickets.com/#/'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const data = await membershipService.getSystemConfig();
        setProvider(data.provider);
        if (data.externalUrl) {
          setExternalUrl(data.externalUrl);
        }
      } catch (err: unknown) {
        console.error('Erro ao carregar configuração de provedor de sócios:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleSelectProvider = async (newProvider: 'ELEVENTICKETS' | 'NATIVE') => {
    try {
      setProvider(newProvider);
      setIsSaving(true);
      await membershipService.updateSystemConfig({
        provider: newProvider,
        externalUrl,
      });
      updateSettings({
        membershipSystemProvider: newProvider,
        membershipExternalUrl: externalUrl,
      });
      toast.success(
        newProvider === 'ELEVENTICKETS'
          ? 'Sistema alternado para ElevenTickets Oficial (Produção).'
          : 'Sistema alternado para Módulo Nativo do Portal (Demonstração).'
      );
    } catch (err: unknown) {
      console.error('Erro ao alternar provedor:', err);
      toast.error('Erro ao salvar configuração do sistema de sócios.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExternalUrl = async () => {
    try {
      setIsSaving(true);
      await membershipService.updateSystemConfig({
        provider,
        externalUrl: externalUrl.trim(),
      });
      updateSettings({
        membershipSystemProvider: provider,
        membershipExternalUrl: externalUrl.trim(),
      });
      toast.success('Link da ElevenTickets atualizado com sucesso.');
    } catch (err: unknown) {
      console.error('Erro ao salvar URL externa:', err);
      toast.error('Erro ao atualizar link da ElevenTickets.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LayoutContainer className="flex flex-col gap-5 p-6 rounded-3xl bg-surface border-2 border-border shadow-sm">
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/70">
        <LayoutContainer className="flex flex-col gap-1">
          <LayoutContainer className="flex items-center gap-2">
            <Title level="h2" className="text-lg font-black text-text-primary">
              Plataforma Ativa do Quadro Social
            </Title>
            <Badge variant="primary" size="sm" className="font-bold text-[10px] uppercase">
              Controle do Owner
            </Badge>
          </LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary">
            Defina qual plataforma será aberta para os torcedores ao clicarem em &ldquo;Seja Sócio&rdquo; em qualquer parte do portal.
          </Text>
        </LayoutContainer>

        {isSaving && (
          <LayoutContainer className="flex items-center gap-2 text-xs font-semibold text-primary animate-pulse">
            <Spinner className="w-4 h-4 text-primary" />
            <Text as="span">Sincronizando...</Text>
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Grid de Seleção dos Dois Sistemas */}
      <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opção 1: ElevenTickets Oficial */}
        <LayoutContainer
          onClick={() => handleSelectProvider('ELEVENTICKETS')}
          className={`flex flex-col justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
            provider === 'ELEVENTICKETS'
              ? 'bg-surface border-primary shadow-md shadow-primary/10'
              : 'bg-background/40 border-border hover:border-primary/40 opacity-75 hover:opacity-100'
          }`}
        >
          <LayoutContainer className="flex flex-col gap-3">
            <LayoutContainer className="flex items-center justify-between">
              <LayoutContainer className="flex items-center gap-2">
                <LayoutContainer className="p-2 rounded-xl bg-primary/20 text-primary">
                  <Ticket className="w-5 h-5" />
                </LayoutContainer>
                <Title level="h3" className="text-base font-extrabold text-text-primary">
                  ElevenTickets Oficial
                </Title>
              </LayoutContainer>

              <Badge
                variant={provider === 'ELEVENTICKETS' ? 'primary' : 'default'}
                size="sm"
                className="font-black text-[10px] uppercase"
              >
                {provider === 'ELEVENTICKETS' ? 'Ativo em Produção' : 'Disponível'}
              </Badge>
            </LayoutContainer>

            <Text as="p" className="text-xs text-text-secondary leading-relaxed">
              Direciona todos os botões e CTAs do portal para a plataforma externa oficial da ElevenTickets onde o Pelotas opera o Quadro Social hoje.
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-between pt-4 mt-2 border-t border-border/50 text-xs">
            <Text as="span" className="text-[11px] font-semibold text-text-secondary truncate max-w-[200px]">
              {externalUrl}
            </Text>
            {provider === 'ELEVENTICKETS' && (
              <LayoutContainer className="flex items-center gap-1 text-primary font-bold">
                <Check className="w-4 h-4" />
                <Text as="span">Selecionado</Text>
              </LayoutContainer>
            )}
          </LayoutContainer>
        </LayoutContainer>

        {/* Opção 2: Portal Nativo Pelotas */}
        <LayoutContainer
          onClick={() => handleSelectProvider('NATIVE')}
          className={`flex flex-col justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
            provider === 'NATIVE'
              ? 'bg-surface border-primary shadow-md shadow-primary/10'
              : 'bg-background/40 border-border hover:border-primary/40 opacity-75 hover:opacity-100'
          }`}
        >
          <LayoutContainer className="flex flex-col gap-3">
            <LayoutContainer className="flex items-center justify-between">
              <LayoutContainer className="flex items-center gap-2">
                <LayoutContainer className="p-2 rounded-xl bg-primary/20 text-primary">
                  <Sparkles className="w-5 h-5" />
                </LayoutContainer>
                <Title level="h3" className="text-base font-extrabold text-text-primary">
                  Portal Nativo Pelotas
                </Title>
              </LayoutContainer>

              <Badge
                variant={provider === 'NATIVE' ? 'primary' : 'default'}
                size="sm"
                className="font-black text-[10px] uppercase"
              >
                {provider === 'NATIVE' ? 'Ativo (Demonstração)' : 'Modo Apresentação'}
              </Badge>
            </LayoutContainer>

            <Text as="p" className="text-xs text-text-secondary leading-relaxed">
              Exibe a vitrine moderna com os cards de planos, modal detalhada com vantagens, formulário de captura de leads e encaminhamento para o WhatsApp da secretaria.
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-between pt-4 mt-2 border-t border-border/50 text-xs">
            <Text as="span" className="text-[11px] font-semibold text-text-secondary">
              Rota interna: /socio
            </Text>
            {provider === 'NATIVE' && (
              <LayoutContainer className="flex items-center gap-1 text-primary font-bold">
                <Check className="w-4 h-4" />
                <Text as="span">Selecionado</Text>
              </LayoutContainer>
            )}
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Campo para editar o Link da ElevenTickets */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-border/60">
        <Text as="span" className="text-xs font-bold text-text-secondary shrink-0">
          URL da ElevenTickets:
        </Text>
        <Input
          type="url"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://socioecpelotas.eleventickets.com/#/"
          className="text-xs py-2 flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveExternalUrl}
          disabled={isSaving}
          className="font-bold text-xs uppercase px-4 py-2 shrink-0 inline-flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Salvar Link</span>
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
