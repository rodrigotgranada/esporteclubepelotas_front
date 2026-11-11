'use client';

import React from 'react';
import { LayoutContainer, Title, Text, SafeImage, Badge } from '@/shared/ui/components';
import { User } from 'lucide-react';
import { TransparencyBoardMember } from '../../types/transparency.types';
import { TRANSPARENCY_TEXTS } from '../../constants/transparency.constants';

interface TransparencyBoardSectionProps {
  executiveBoard: TransparencyBoardMember[];
  deliberativeCouncil: TransparencyBoardMember[];
  fiscalCouncil: TransparencyBoardMember[];
}

export function TransparencyBoardSection({
  executiveBoard,
  deliberativeCouncil,
  fiscalCouncil,
}: TransparencyBoardSectionProps) {
  const renderGroup = (title: string, members: TransparencyBoardMember[]) => {
    if (members.length === 0) return null;

    return (
      <LayoutContainer className="mb-12">
        <LayoutContainer className="border-b border-amber-400/20 pb-3 mb-6">
          <Title level="h3" className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
            {title}
          </Title>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <LayoutContainer
              key={member.id}
              className="flex flex-col items-center rounded-xl border border-gray-800 bg-[#0B1B3D]/50 p-6 text-center shadow-md transition-all hover:border-amber-400/40"
            >
              <LayoutContainer className="relative h-24 w-24 mb-4 overflow-hidden rounded-full border-2 border-amber-400/40 bg-[#071126] shadow-inner flex items-center justify-center">
                {member.photoUrl ? (
                  <SafeImage
                    src={member.photoUrl}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={36} className="text-amber-400/60" />
                )}
              </LayoutContainer>

              <Title level="h4" className="text-base font-bold text-white mb-1">
                {member.name}
              </Title>

              <Text className="text-xs font-semibold text-amber-400 mb-2">
                {member.roleTitle}
              </Text>

              {member.termPeriod && (
                <Badge className="bg-gray-800/80 text-gray-300 text-[10px] font-medium">
                  {member.termPeriod}
                </Badge>
              )}
            </LayoutContainer>
          ))}
        </LayoutContainer>
      </LayoutContainer>
    );
  };

  return (
    <LayoutContainer className="py-4">
      {renderGroup(TRANSPARENCY_TEXTS.BOARD_SECTIONS.DIRETORIA_EXECUTIVA, executiveBoard)}
      {renderGroup(TRANSPARENCY_TEXTS.BOARD_SECTIONS.CONSELHO_DELIBERATIVO, deliberativeCouncil)}
      {renderGroup(TRANSPARENCY_TEXTS.BOARD_SECTIONS.CONSELHO_FISCAL, fiscalCouncil)}
    </LayoutContainer>
  );
}

