'use client';

import React from 'react';
import { UserCheck } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge } from '@/shared/ui/components';
import { AthleteCard } from './AthleteCard';
import { SquadMemberData, SquadStaffData } from '../../services/football.service';

export interface SquadSectorSectionProps {
  title: string;
  members?: SquadMemberData[];
  staff?: SquadStaffData[];
}

export const SquadSectorSection: React.FC<SquadSectorSectionProps> = ({
  title,
  members,
  staff,
}) => {
  const hasMembers = members && members.length > 0;
  const hasStaff = staff && staff.length > 0;

  if (!hasMembers && !hasStaff) return null;

  return (
    <LayoutContainer className="flex flex-col gap-5 mb-12">
      {/* Sector Header (sem ícone ao lado do título) */}
      <LayoutContainer className="flex items-center gap-3 pb-3 border-b border-border">
        <Title level="h2" className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
          {title}
        </Title>
        {members && (
          <Badge variant="default" size="sm" className="font-extrabold text-xs ml-auto">
            {members.length}
          </Badge>
        )}
      </LayoutContainer>

      {/* Athletes Grid */}
      {hasMembers && (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member, idx) => (
            <AthleteCard
              key={member.athleteId || member.athlete?._id || `member-${idx}`}
              member={member}
            />
          ))}
        </LayoutContainer>
      )}

      {/* Staff Members Grid */}
      {hasStaff && (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {staff.map((st, idx) => (
            <LayoutContainer
              key={idx}
              className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3.5 hover:border-primary/40 transition-colors shadow-xs"
            >
              <LayoutContainer className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <UserCheck className="w-5 h-5" />
              </LayoutContainer>
              <LayoutContainer className="flex flex-col">
                <Text as="span" className="text-[11px] font-extrabold uppercase text-text-muted tracking-wider">
                  {st.role}
                </Text>
                <Title level="h4" className="text-sm font-bold text-text-primary">
                  {st.name}
                </Title>
              </LayoutContainer>
            </LayoutContainer>
          ))}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
