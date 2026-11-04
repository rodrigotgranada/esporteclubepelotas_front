'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Star, Shield, UserCheck, Heart } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge } from '@/shared/ui/components';
import { IDOLS_CONSTANTS } from '../../constants/idols.constants';
import { IdolCategory, IdolData } from '../../services/idols.service';

export interface IdolCardProps {
  idol: IdolData;
}

export const IdolCard: React.FC<IdolCardProps> = ({ idol }) => {
  const texts = IDOLS_CONSTANTS.CARD;

  const getCategoryBadge = (category: IdolCategory) => {
    switch (category) {
      case 'PLAYER':
        return (
          <Badge variant="primary" size="sm" className="font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm">
            <Trophy className="w-3 h-3" />
            {IDOLS_CONSTANTS.CATEGORY_BADGES.PLAYER}
          </Badge>
        );
      case 'COACH':
        return (
          <Badge variant="warning" size="sm" className="font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm">
            <Shield className="w-3 h-3" />
            {IDOLS_CONSTANTS.CATEGORY_BADGES.COACH}
          </Badge>
        );
      case 'STAFF':
        return (
          <Badge variant="default" size="sm" className="font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm border border-border">
            <UserCheck className="w-3 h-3 text-primary" />
            {IDOLS_CONSTANTS.CATEGORY_BADGES.STAFF}
          </Badge>
        );
      case 'FAN':
        return (
          <Badge variant="default" size="sm" className="font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm border border-primary/40 text-primary">
            <Heart className="w-3 h-3 text-primary" />
            {IDOLS_CONSTANTS.CATEGORY_BADGES.FAN}
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatPeriod = (startYear: number, endYear?: number | null, isActiveInClub?: boolean) => {
    if (isActiveInClub) {
      return `Desde ${startYear} • ${texts.ACTIVE_IN_CLUB}`;
    }
    if (endYear && endYear !== startYear) {
      return `${startYear} - ${endYear}`;
    }
    return `${startYear}`;
  };

  const renderStatsPill = () => {
    if (idol.category === 'PLAYER' && idol.playerStats) {
      const parts: string[] = [];
      if (idol.playerStats.matchesCount) parts.push(`${idol.playerStats.matchesCount} ${texts.LABEL_MATCHES}`);
      if (idol.playerStats.goalsCount) parts.push(`${idol.playerStats.goalsCount} ${texts.LABEL_GOALS}`);
      if (parts.length > 0) {
        return (
          <Text as="span" className="text-xs font-bold text-primary">
            {parts.join(' • ')}
          </Text>
        );
      }
    }

    if (idol.category === 'COACH' && idol.coachStats) {
      if (idol.coachStats.matchesCount) {
        return (
          <Text as="span" className="text-xs font-bold text-primary">
            {idol.coachStats.matchesCount} {texts.LABEL_MATCHES}
            {idol.coachStats.titles && idol.coachStats.titles.length > 0 && ` • ${idol.coachStats.titles.length} títulos`}
          </Text>
        );
      }
    }

    if (idol.category === 'STAFF' && idol.staffStats?.roleName) {
      return (
        <Text as="span" className="text-xs font-bold text-primary line-clamp-1">
          {idol.staffStats.roleName}
        </Text>
      );
    }

    if (idol.category === 'FAN' && idol.fanStats?.stadiumSector) {
      return (
        <Text as="span" className="text-xs font-bold text-primary line-clamp-1">
          {idol.fanStats.stadiumSector}
        </Text>
      );
    }

    return null;
  };

  return (
    <Link href={`/idolos/${idol.slug}`} className="group block h-full focus:outline-none">
      <LayoutContainer className="relative h-full flex flex-col rounded-3xl overflow-hidden bg-surface border border-border group-hover:border-primary/50 group-hover:shadow-lg transition-all duration-300">
        {/* Photo Container 3:4 */}
        <LayoutContainer className="relative w-full aspect-[3/4] overflow-hidden bg-background">
          {idol.photoUrl ? (
            <Image
              src={idol.photoUrl}
              alt={idol.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <LayoutContainer className="w-full h-full flex items-center justify-center text-text-muted bg-surface/50">
              <Trophy className="w-16 h-16 opacity-30" />
            </LayoutContainer>
          )}

          {/* Gradient Overlay for Readable Text */}
          <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {/* Top Badges */}
          <LayoutContainer className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            {getCategoryBadge(idol.category)}

            <LayoutContainer className="flex items-center gap-1.5">
              {idol.deathDate && (
                <Badge variant="default" size="sm" className="bg-background/90 backdrop-blur-sm text-[9px] font-bold border border-border text-text-muted">
                  {texts.IN_MEMORIAM}
                </Badge>
              )}
              {idol.isFeatured && (
                <LayoutContainer className="p-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 text-primary shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-primary" />
                </LayoutContainer>
              )}
            </LayoutContainer>
          </LayoutContainer>

          {/* Bottom Info over Image */}
          <LayoutContainer className="absolute bottom-3 left-3 right-3 z-10 flex flex-col gap-1">
            <Text as="span" className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">
              {formatPeriod(idol.startYear, idol.endYear, idol.isActiveInClub)}
            </Text>

            <Title
              level="h3"
              className="text-lg sm:text-xl font-black text-text-primary group-hover:text-primary transition-colors leading-tight"
            >
              {idol.nickname || idol.name}
            </Title>

            {idol.nickname && (
              <Text as="p" className="text-xs font-semibold text-text-secondary line-clamp-1">
                {idol.name}
              </Text>
            )}

            {renderStatsPill() && (
              <LayoutContainer className="mt-1">
                {renderStatsPill()}
              </LayoutContainer>
            )}
          </LayoutContainer>
        </LayoutContainer>

        {/* Card Footer Quote or Bio Preview */}
        {idol.quote ? (
          <LayoutContainer className="p-4 pt-3 flex flex-col justify-between flex-1 border-t border-border/60 bg-surface/40">
            <Text as="p" className="text-xs text-text-secondary italic line-clamp-2 leading-relaxed">
              &quot;{idol.quote}&quot;
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="p-4 pt-3 flex flex-col justify-between flex-1 border-t border-border/60 bg-surface/40">
            <Text as="p" className="text-xs text-text-muted line-clamp-2 leading-relaxed">
              {idol.biography}
            </Text>
          </LayoutContainer>
        )}
      </LayoutContainer>
    </Link>
  );
};
