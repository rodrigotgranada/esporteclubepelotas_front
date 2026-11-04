'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
  DEFAULT_IDOL_COVER,
  Spinner,
} from '@/shared/ui/components';
import { IDOLS_CONSTANTS } from '../../constants/idols.constants';
import { idolsService, IdolData } from '../../services/idols.service';

export interface IdolPrevNextNavProps {
  currentSlug: string;
}

export const IdolPrevNextNav: React.FC<IdolPrevNextNavProps> = ({ currentSlug }) => {
  const texts = IDOLS_CONSTANTS.PREV_NEXT;
  const [prevIdol, setPrevIdol] = useState<IdolData | null>(null);
  const [nextIdol, setNextIdol] = useState<IdolData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    idolsService
      .getPrevNext(currentSlug)
      .then((res) => {
        if (isMounted) {
          setPrevIdol(res.previous);
          setNextIdol(res.next);
        }
      })
      .catch(() => {
        // Silently fail if navigation isn't available
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentSlug]);

  if (loading) {
    return (
      <LayoutContainer className="flex items-center justify-center py-6">
        <Spinner size={24} />
      </LayoutContainer>
    );
  }

  if (!prevIdol && !nextIdol) {
    return null;
  }

  return (
    <LayoutContainer className="flex flex-col gap-4 pt-8 border-t border-border">
      <LayoutContainer className="flex items-center justify-between">
        <Title level="h3" className="text-sm font-extrabold text-text-secondary uppercase tracking-wider">
          {texts.TITLE}
        </Title>
        <Link
          href="/idolos"
          className="text-xs font-bold text-primary hover:underline transition-all"
        >
          {texts.BACK_TO_MEMORIAL}
        </Link>
      </LayoutContainer>

      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Previous Idol */}
        {prevIdol ? (
          <Link
            href={`/idolos/${prevIdol.slug}`}
            className="group p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all flex items-center gap-3.5 shadow-xs"
          >
            <LayoutContainer className="p-2 rounded-xl bg-background border border-border group-hover:border-primary/40 group-hover:bg-primary/10 transition-colors shrink-0">
              <ChevronLeft className="w-5 h-5 text-primary group-hover:-translate-x-0.5 transition-transform" />
            </LayoutContainer>

            <LayoutContainer className="relative w-12 h-16 rounded-lg overflow-hidden bg-background border border-border shrink-0 shadow-xs">
              <SafeImage
                src={prevIdol.photoUrl}
                fallbackSrc={DEFAULT_IDOL_COVER}
                alt={prevIdol.name}
                fill
                className="object-cover object-top"
                sizes="48px"
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col min-w-0 flex-1">
              <Text as="span" className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {texts.PREVIOUS}
              </Text>
              <Title level="h4" className="text-sm font-black text-text-primary group-hover:text-primary transition-colors truncate">
                {prevIdol.nickname || prevIdol.name}
              </Title>
              {prevIdol.nickname && (
                <Text as="span" className="text-xs text-text-secondary truncate">
                  {prevIdol.name}
                </Text>
              )}
            </LayoutContainer>
          </Link>
        ) : (
          <LayoutContainer className="hidden sm:block" />
        )}

        {/* Next Idol */}
        {nextIdol ? (
          <Link
            href={`/idolos/${nextIdol.slug}`}
            className="group p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all flex items-center justify-between gap-3.5 shadow-xs text-right"
          >
            <LayoutContainer className="flex flex-col min-w-0 flex-1">
              <Text as="span" className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {texts.NEXT}
              </Text>
              <Title level="h4" className="text-sm font-black text-text-primary group-hover:text-primary transition-colors truncate">
                {nextIdol.nickname || nextIdol.name}
              </Title>
              {nextIdol.nickname && (
                <Text as="span" className="text-xs text-text-secondary truncate">
                  {nextIdol.name}
                </Text>
              )}
            </LayoutContainer>

            <LayoutContainer className="relative w-12 h-16 rounded-lg overflow-hidden bg-background border border-border shrink-0 shadow-xs order-last">
              <SafeImage
                src={nextIdol.photoUrl}
                fallbackSrc={DEFAULT_IDOL_COVER}
                alt={nextIdol.name}
                fill
                className="object-cover object-top"
                sizes="48px"
              />
            </LayoutContainer>

            <LayoutContainer className="p-2 rounded-xl bg-background border border-border group-hover:border-primary/40 group-hover:bg-primary/10 transition-colors shrink-0 order-last">
              <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 transition-transform" />
            </LayoutContainer>
          </Link>
        ) : (
          <LayoutContainer className="hidden sm:block" />
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
