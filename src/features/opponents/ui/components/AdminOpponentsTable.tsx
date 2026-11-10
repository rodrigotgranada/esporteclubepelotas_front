'use client';

import React from 'react';
import {
  LayoutContainer,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Text,
  Badge,
  Button,
  Input,
} from '@/shared/ui/components/atoms';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { OpponentClub } from '../../types/opponents.types';
import { OPPONENTS_CONSTANTS } from '../../constants/opponents.constants';

export interface AdminOpponentsTableProps {
  opponents: OpponentClub[];
  search: string;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
  onEdit: (club: OpponentClub) => void;
  onDelete: (club: OpponentClub) => void;
}

export const AdminOpponentsTable: React.FC<AdminOpponentsTableProps> = ({
  opponents,
  search,
  onSearchChange,
  onOpenCreate,
  onEdit,
  onDelete,
}) => {
  const { TABLE } = OPPONENTS_CONSTANTS;

  return (
    <LayoutContainer className="space-y-4">
      {/* Barra de Filtro e Ação */}
      <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <Input
          placeholder={TABLE.SEARCH_PLACEHOLDER}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-96"
        />

        <Button
          onClick={onOpenCreate}
          variant="primary"
          className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-5 py-2.5 rounded-xl shadow-md shrink-0 cursor-pointer"
        >
          + {TABLE.ADD_BUTTON}
        </Button>
      </LayoutContainer>

      {/* Tabela de Clubes */}
      <LayoutContainer className="rounded-2xl border border-border/60 bg-surface-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{TABLE.BADGE}</TableHead>
              <TableHead>{TABLE.NAME}</TableHead>
              <TableHead>{TABLE.SHORT_NAME}</TableHead>
              <TableHead>{TABLE.CITY}</TableHead>
              <TableHead>{TABLE.STADIUM}</TableHead>
              <TableHead>{TABLE.STATUS}</TableHead>
              <TableHead className="text-right">{TABLE.ACTIONS}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opponents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-text-muted text-sm">
                  {TABLE.EMPTY_STATE}
                </TableCell>
              </TableRow>
            ) : (
              opponents.map((club) => (
                <TableRow key={club.id} className="hover:bg-surface-hover/50">
                  <TableCell>
                    <LayoutContainer className="w-10 h-10 rounded-xl bg-surface-hover border border-border/60 flex items-center justify-center p-1 overflow-hidden shadow-xs">
                      <SafeImage
                        src={club.badgeUrl || '/images/pelotas-logo.png'}
                        alt={club.name}
                        width={32}
                        height={32}
                        className="object-contain max-h-8"
                      />
                    </LayoutContainer>
                  </TableCell>

                  <TableCell>
                    <Text className="text-sm font-bold text-text-primary block">
                      {club.name}
                    </Text>
                  </TableCell>

                  <TableCell>
                    <Badge variant="default" className="bg-surface border-border text-text-secondary font-semibold">
                      {club.shortName || '-'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Text className="text-xs text-text-muted block">
                      {club.city || '-'}
                    </Text>
                  </TableCell>

                  <TableCell>
                    <Text className="text-xs font-medium text-text-primary block">
                      {club.stadiumName || '-'}
                    </Text>
                  </TableCell>

                  <TableCell>
                    {club.isActive ? (
                      <Badge variant="default" className="border-secondary/40 text-secondary bg-secondary/10">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="default" className="border-border text-text-muted bg-surface">
                        Inativo
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <LayoutContainer className="flex items-center justify-end space-x-2">
                      <Button
                        onClick={() => onEdit(club)}
                        variant="ghost"
                        size="sm"
                        className="text-xs font-semibold hover:text-secondary cursor-pointer"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => onDelete(club)}
                        variant="ghost"
                        size="sm"
                        className="text-xs font-semibold text-orange-500 hover:text-orange-400 cursor-pointer"
                      >
                        Excluir
                      </Button>
                    </LayoutContainer>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </LayoutContainer>
    </LayoutContainer>
  );
};
