'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { LayoutContainer, Text, SafeImage } from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';
import { newsService, NewsPrevNextData } from '../../services/news.service';

export interface NewsPrevNextNavProps {
  slug: string;
}

export const NewsPrevNextNav: React.FC<NewsPrevNextNavProps> = ({ slug }) => {
  const [data, setData] = useState<NewsPrevNextData | null>(null);

  useEffect(() => {
    let isMounted = true;
    newsService.getPrevNext(slug).then((res) => {
      if (isMounted) setData(res);
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!data || (!data.previous && !data.next)) return null;

  return (
    <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border">
      {/* Matéria Anterior */}
      {data.previous ? (
        <Link
          href={`/noticias/${data.previous.slug}`}
          className="group flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all shadow-xs"
        >
          {data.previous.coverImage && (
            <LayoutContainer className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-drawer border border-border">
              <SafeImage
                src={data.previous.coverImage}
                alt={data.previous.title}
                fill
                sizes="64px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </LayoutContainer>
          )}
          <LayoutContainer className="flex flex-col min-w-0">
            <LayoutContainer className="flex items-center gap-1 text-[11px] font-bold text-text-secondary group-hover:text-primary transition-colors">
              <ArrowLeft className="w-3 h-3" />
              <Text as="span">{PUBLIC_NEWS_TEXTS.PREV_ARTICLE}</Text>
            </LayoutContainer>
            <Text as="p" className="text-xs sm:text-sm font-bold text-text-primary truncate mt-1">
              {data.previous.title}
            </Text>
          </LayoutContainer>
        </Link>
      ) : (
        <LayoutContainer className="hidden sm:block" />
      )}

      {/* Próxima Matéria */}
      {data.next && (
        <Link
          href={`/noticias/${data.next.slug}`}
          className="group flex items-center justify-between gap-3 p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all shadow-xs text-right sm:ml-auto w-full"
        >
          <LayoutContainer className="flex flex-col min-w-0 flex-1">
            <LayoutContainer className="flex items-center justify-end gap-1 text-[11px] font-bold text-text-secondary group-hover:text-primary transition-colors">
              <Text as="span">{PUBLIC_NEWS_TEXTS.NEXT_ARTICLE}</Text>
              <ArrowRight className="w-3 h-3" />
            </LayoutContainer>
            <Text as="p" className="text-xs sm:text-sm font-bold text-text-primary truncate mt-1">
              {data.next.title}
            </Text>
          </LayoutContainer>
          {data.next.coverImage && (
            <LayoutContainer className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-drawer border border-border">
              <SafeImage
                src={data.next.coverImage}
                alt={data.next.title}
                fill
                sizes="64px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </LayoutContainer>
          )}
        </Link>
      )}
    </LayoutContainer>
  );
};

