'use client';

import { useCallback, useEffect, useState } from 'react';
import { Sponsor } from '../../../types/sponsors.types';
import { sponsorsService } from '../../../services/sponsors.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useHomeSponsorsTicker = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFeaturedSponsors = useCallback(async () => {
    try {
      const data = await sponsorsService.getFeaturedSponsors();
      setSponsors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Erro ao carregar patrocinadores em destaque:', err);
      setSponsors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedSponsors();
  }, [loadFeaturedSponsors]);

  useRealtimeEvents('sponsors', () => {
    loadFeaturedSponsors();
  });

  const handleSponsorClick = useCallback((sponsor: Sponsor) => {
    if (!sponsor.id) return;
    // Rastreamento não bloqueante de cliques
    sponsorsService.trackSponsorClick(sponsor.id).catch((err) => {
      console.warn('Falha ao rastrear clique do patrocinador:', err);
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
