'use client';

import { useEffect, useState } from 'react';
import { idolsService, IdolData } from '../services/idols.service';

export const useIdolPrevNext = (currentSlug: string) => {
  const [prevIdol, setPrevIdol] = useState<IdolData | null>(null);
  const [nextIdol, setNextIdol] = useState<IdolData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    idolsService
      .getPrevNext(currentSlug)
      .then((res) => {
        if (isMounted) {
          setPrevIdol(res.previous);
          setNextIdol(res.next);
        }
      })
      .catch(() => {
        // Silently ignore navigation error
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentSlug]);

  return {
    prevIdol,
    nextIdol,
    isLoading,
  };
};

