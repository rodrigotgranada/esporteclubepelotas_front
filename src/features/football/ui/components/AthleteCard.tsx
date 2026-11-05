'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Shield, ArrowUpRight } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, SafeImage, DEFAULT_IDOL_COVER } from '@/shared/ui/components';
import { FOOTBALL_CONSTANTS } from '../../constants/football.constants';
import { SquadMemberData, AthleteData } from '../../services/football.service';

export interface AthleteCardProps {
  member?: SquadMemberData;
  athlete?: AthleteData;
}

export const AthleteCard: React.FC<AthleteCardProps> = ({ member, athlete: directAthlete }) => {
  const athlete = member?.athlete || directAthlete;
  if (!athlete) return null;

  const jerseyNumber = member?.jerseyNumber;
  const isCaptain = member?.role === 'CAPTAIN';
  const isStaff = athlete.athleteType === 'STAFF' || member?.sector === 'STAFF';
  const displayPosition = isStaff ? (athlete.staffRole || athlete.primaryPosition || 'Comissão Técnica') : athlete.primaryPosition;

  return (
    <Link href={`/elenco/${athlete.slug}`} className="group block h-full focus:outline-none">
      <LayoutContainer className="relative h-full flex flex-col rounded-3xl overflow-hidden bg-surface border border-border group-hover:border-primary/50 group-hover:shadow-lg transition-all duration-300">
        {/* Photo Container (3:4 ratio) */}
        <LayoutContainer className="relative w-full aspect-[3/4] overflow-hidden bg-background">
          <SafeImage
            src={athlete.photoUrl}
            fallbackSrc={DEFAULT_IDOL_COVER}
            alt={athlete.nickname || athlete.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Gradient Overlay */}
          <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />

          {/* Top Badges & Camisa */}
          <LayoutContainer className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            {jerseyNumber ? (
              <Badge
                variant="primary"
                size="sm"
                className="font-black text-sm px-2.5 py-0.5 shadow-md flex items-center gap-1"
              >
                <span>#{jerseyNumber}</span>
              </Badge>
            ) : (
              <LayoutContainer />
            )}

            {isCaptain && (
              <Badge
                variant="warning"
                size="sm"
                className="font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 shadow-md flex items-center gap-1"
              >
                <Star className="w-3 h-3 fill-current" />
                <span>{FOOTBALL_CONSTANTS.CAPTAIN_BADGE}</span>
              </Badge>
            )}
          </LayoutContainer>

          {/* Bottom Info over Image */}
          <LayoutContainer className="absolute bottom-3 left-3 right-3 z-10 flex flex-col gap-1">
            <LayoutContainer className="inline-flex items-center gap-1.5 w-fit">
              <Badge
                variant="default"
                size="sm"
                className="text-[10px] font-extrabold uppercase tracking-wider bg-background/80 backdrop-blur-xs border border-border/70 text-primary px-2"
              >
                {displayPosition}
              </Badge>
            </LayoutContainer>

            <Title
              level="h3"
              className="text-lg sm:text-xl font-black text-text-primary group-hover:text-primary transition-colors leading-tight"
            >
              {athlete.nickname || athlete.name}
            </Title>

            {athlete.nickname && (
              <Text as="p" className="text-xs font-semibold text-text-secondary line-clamp-1">
                {athlete.name}
              </Text>
            )}
          </LayoutContainer>
        </LayoutContainer>

        {/* Card Footer Details */}
        <LayoutContainer className="p-3.5 flex items-center justify-between border-t border-border/60 bg-surface/50 text-xs text-text-muted">
          <LayoutContainer className="flex items-center gap-3">
            {athlete.age ? (
              <Text as="span" className="font-medium">
                {athlete.age} {FOOTBALL_CONSTANTS.CARD.AGE_SUFFIX}
              </Text>
            ) : null}

            {athlete.height ? (
              <Text as="span" className="font-medium">
                {athlete.height} {FOOTBALL_CONSTANTS.CARD.HEIGHT_SUFFIX}
              </Text>
            ) : null}
          </LayoutContainer>

          <LayoutContainer className="flex items-center text-primary font-bold gap-0.5 group-hover:translate-x-0.5 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </Link>
  );
};

