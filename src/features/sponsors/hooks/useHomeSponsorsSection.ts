'use client';

import { useCallback, useEffect, useState } from 'react';
import { Sponsor } from '../types/sponsors.types';
import { sponsorsService } from '../services/sponsors.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export interface UseHomeSponsorsSectionProps {
  scope?: 'MAIN' | 'YOUTH' | 'FEMALE';
}

export const useHomeSponsorsSection = (props?: UseHomeSponsorsSectionProps) => {
  const scope = props?.scope || 'MAIN';
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSponsors = useCallback(async () => {
    try {
      const data = await sponsorsService.getActiveSponsors(scope);
      setSponsors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn(`Erro ao carregar patrocinadores para o escopo ${scope}:`, err);
      setSponsors([]);
    } finally {
      setIsLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    loadSponsors();
  }, [loadSponsors]);

  useRealtimeEvents('sponsors', () => {
    loadSponsors();
  });

  const handleSponsorClick = useCallback((sponsor: Sponsor) => {
    if (!sponsor.id) return;
    // Rastreamento não bloqueante de cliques
    sponsorsService.trackSponsorClick(sponsor.id).catch((err) => {
      console.warn('Falha ao registrar clique no patrocinador:', err);
    });

    if (sponsor.websiteUrl) {
      window.open(sponsor.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return {
    sponsors,
    isLoading,
    handleSponsorClick,
  };
};

