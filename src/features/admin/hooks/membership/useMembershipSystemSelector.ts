'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { membershipService } from '@/features/membership/services/membership.service';
import { useSettingsStore } from '@/store/useSettingsStore';

const DEFAULT_ELEVENTICKETS_URL = 'https://socioecpelotas.eleventickets.com/#/';

export const useMembershipSystemSelector = () => {
  const { settings, updateSettings } = useSettingsStore();

  const [provider, setProvider] = useState<'ELEVENTICKETS' | 'NATIVE'>(
    settings?.membershipSystemProvider === 'NATIVE' ? 'NATIVE' : 'ELEVENTICKETS'
  );
  const [externalUrl, setExternalUrl] = useState(
    settings?.membershipExternalUrl || DEFAULT_ELEVENTICKETS_URL
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
    const previousProvider = provider;
    try {
      setIsSaving(true);
      await membershipService.updateSystemConfig({
        provider: newProvider,
        externalUrl,
      });
      setProvider(newProvider);
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
      setProvider(previousProvider);
      console.error('Erro ao alternar provedor:', err);
      toast.error('Erro ao salvar configuração do sistema de sócios.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExternalUrl = async () => {
    try {
      setIsSaving(true);
      const trimmedUrl = externalUrl.trim();
      await membershipService.updateSystemConfig({
        provider,
        externalUrl: trimmedUrl,
      });
      updateSettings({
        membershipSystemProvider: provider,
        membershipExternalUrl: trimmedUrl,
      });
      toast.success('Link da ElevenTickets atualizado com sucesso.');
    } catch (err: unknown) {
      console.error('Erro ao salvar URL externa:', err);
      toast.error('Erro ao atualizar link da ElevenTickets.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    provider,
    externalUrl,
    setExternalUrl,
    isLoading,
    isSaving,
    handleSelectProvider,
    handleSaveExternalUrl,
  };
};

