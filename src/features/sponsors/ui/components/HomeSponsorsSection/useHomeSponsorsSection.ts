'use client';

import { useCallback, useEffect, useState } from 'react';
import { Sponsor } from '../../../types/sponsors.types';
import { sponsorsService } from '../../../services/sponsors.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useHomeSponsorsSection = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSponsors = useCallback(async () => {
    try {
      const data = await sponsorsService.getActiveSponsors();
      setSponsors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Erro ao carregar patrocinadores para a Home:', err);
      setSponsors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
