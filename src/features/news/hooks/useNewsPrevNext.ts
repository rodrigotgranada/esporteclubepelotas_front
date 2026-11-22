'use client';

import { useState, useEffect } from 'react';
import { newsService, NewsPrevNextData } from '../services/news.service';

export const useNewsPrevNext = (slug: string) => {
  const [data, setData] = useState<NewsPrevNextData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    newsService
      .getPrevNext(slug)
      .then((res) => {
        if (isMounted) setData(res);
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
  }, [slug]);

  return {
    data,
    isLoading,
  };
};

