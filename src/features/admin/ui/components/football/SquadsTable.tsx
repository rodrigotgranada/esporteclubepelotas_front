'use client';

import React from 'react';
import { Users, Edit2, Trash2, Star, Trophy, Shield } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Spinner,
} from '@/shared/ui/components';
import { SquadData } from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../../constants/admin-football.constants';
import { FOOTBALL_CONSTANTS } from '@/features/football/constants/football.constants';

export interface SquadsTableProps {
  squads: SquadData[];
  isLoading: boolean;
  onEdit: (squad: SquadData) => void;
  onDelete: (squad: SquadData) => void;
  onManageMembers: (squad: SquadData) => void;
  onToggleCurrent: (squad: SquadData) => void;
}

export const SquadsTable: React.FC<SquadsTableProps> = ({
  squads,
  isLoading,
  onEdit,
  onDelete,
  onManageMembers,
  onToggleCurrent,
}) => {
  const texts = ADMIN_FOOTBALL_CONSTANTS.SQUADS_TAB;

  if (isLoading) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner size={32} />
        <Text as="p" className="text-xs font-semibold text-text-muted">
          Carregando temporadas e elencos...
        </Text>
      </LayoutContainer>
    );
  }

  if (squads.length === 0) {
    return (
      <LayoutContainer className="p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center justify-center gap-2">
        <LayoutContainer className="p-3 rounded-2xl bg-background border border-border text-primary mb-1">
          <Trophy className="w-8 h-8 opacity-40 text-primary" />
        </LayoutContainer>
        <Title level="h3" className="text-base font-bold text-text-primary">
          {texts.EMPTY_TITLE}
        </Title>
        <Text as="p" className="text-xs text-text-muted max-w-sm">
          {texts.EMPTY_DESC}
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="flex flex-col gap-4">
      {/* Desktop Table */}
      <LayoutContainer className="hidden md:block rounded-2xl border border-border overflow-hidden bg-surface">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-background/50 text-text-muted uppercase tracking-wider font-extrabold text-[11px]">
              <th className="py-3 px-4">{texts.COLUMN_YEAR}</th>
              <th className="py-3 px-4">{texts.COLUMN_CATEGORY}</th>
              <th className="py-3 px-4">{texts.COLUMN_NAME}</th>
              <th className="py-3 px-4">{texts.COLUMN_COACH}</th>
              <th className="py-3 px-4 text-center">{texts.COLUMN_MEMBERS_COUNT}</th>
              <th className="py-3 px-4 text-center">{texts.COLUMN_STATUS}</th>
              <th className="py-3 px-4 text-right">{texts.COLUMN_ACTIONS}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {squads.map((squad) => {
              const categoryLabel =
                (FOOTBALL_CONSTANTS.CATEGORIES as any)[squad.category] || squad.category;
              const membersCount = squad.members ? squad.members.length : 0;

              return (
                <tr key={squad.id || squad._id} className="hover:bg-background/40 transition-colors">
                  {/* Temporada / Ano */}
                  <td className="py-3 px-4">
                    <Text as="span" className="font-black text-sm text-text-primary">
                      {squad.year}
                    </Text>
                  </td>

                  {/* Categoria */}
                  <td className="py-3 px-4">
                    <Badge variant="primary" size="sm" className="font-bold text-[10px] uppercase">
                      {categoryLabel}
                    </Badge>
                  </td>

                  {/* Nome da Temporada / Competição */}
                  <td className="py-3 px-4">
                    <Text as="span" className="font-extrabold text-xs text-text-primary">
                      {squad.seasonName}
                    </Text>
                  </td>

                  {/* Treinador */}
                  <td className="py-3 px-4 text-text-secondary">
                    {squad.coachName ? (
                      <LayoutContainer className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        <span>{squad.coachName}</span>
                      </LayoutContainer>
                    ) : (
                      <span className="text-text-muted italic">-</span>
                    )}
                  </td>

                  {/* Contagem de Atletas */}
                  <td className="py-3 px-4 text-center">
                    <Badge variant="default" size="sm" className="font-bold text-xs bg-surface border border-border">
                      {membersCount} atletas
                    </Badge>
                  </td>

                  {/* Status Elenco Atual */}
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleCurrent(squad)}
                      className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                        squad.isCurrent
                          ? 'bg-primary/20 text-primary border border-primary/40'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                      title="Clique para alternar elenco atual"
                    >
                      <Star className={`w-3.5 h-3.5 mr-1 ${squad.isCurrent ? 'fill-primary' : ''}`} />
                      {squad.isCurrent ? texts.CURRENT_TAG : 'Histórico'}
                    </Button>
                  </td>

                  {/* Ações */}
                  <td className="py-3 px-4 text-right">
                    <LayoutContainer className="inline-flex items-center gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onManageMembers(squad)}
                        className="font-bold text-xs text-primary border-primary/40 hover:bg-primary/10 gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{texts.ACTION_MANAGE_MEMBERS}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(squad)}
                        className="p-1.5 text-text-muted hover:text-text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(squad)}
                        className="p-1.5 text-text-muted hover:text-primary"
                      >
                        <Trash2 className="w-4 h-4 text-[#ea580c]" />
                      </Button>
                    </LayoutContainer>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </LayoutContainer>

      {/* Mobile Cards */}
      <LayoutContainer className="grid grid-cols-1 gap-3 md:hidden">
        {squads.map((squad) => {
          const categoryLabel =
            (FOOTBALL_CONSTANTS.CATEGORIES as any)[squad.category] || squad.category;
          const membersCount = squad.members ? squad.members.length : 0;

          return (
            <LayoutContainer
              key={squad.id || squad._id}
              className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-3 shadow-xs"
            >
              <LayoutContainer className="flex items-center justify-between">
                <LayoutContainer className="flex items-center gap-2">
                  <Text as="span" className="font-black text-base text-text-primary">
                    {squad.year}
                  </Text>
                  <Badge variant="primary" size="sm" className="text-[9px] uppercase font-bold">
                    {categoryLabel}
                  </Badge>
                </LayoutContainer>

                {squad.isCurrent && (
                  <Badge variant="warning" size="sm" className="text-[9px] uppercase font-bold">
                    {texts.CURRENT_TAG}
                  </Badge>
                )}
              </LayoutContainer>

              <Title level="h4" className="text-sm font-bold text-text-primary">
                {squad.seasonName}
              </Title>

              {squad.coachName && (
                <Text as="p" className="text-xs text-text-secondary">
                  Comandante: <strong className="text-text-primary">{squad.coachName}</strong>
                </Text>
              )}

              <LayoutContainer className="flex items-center justify-between pt-2 border-t border-border">
                <Badge variant="default" size="sm" className="font-bold text-xs">
                  {membersCount} atletas
                </Badge>

                <LayoutContainer className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManageMembers(squad)}
                    className="font-bold text-xs text-primary border-primary/40"
                  >
                    <Users className="w-3.5 h-3.5 mr-1" />
                    Atletas
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(squad)}
                    className="p-1.5 text-text-muted"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(squad)}
                    className="p-1.5 text-text-muted"
                  >
                    <Trash2 className="w-4 h-4 text-[#ea580c]" />
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>
          );
        })}
      </LayoutContainer>
    </LayoutContainer>
  );
};
