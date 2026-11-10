'use client';

import React from 'react';
import {
  LayoutContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Text,
  Badge,
  Button,
  Input,
} from '@/shared/ui/components/atoms';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { Championship } from '../../../types/matches.types';
import {
  CHAMPIONSHIP_CATEGORY_LABELS,
  MATCHES_CONSTANTS,
} from '../../../constants/matches.constants';

export interface AdminChampionshipsTableProps {
  championships: Championship[];
  search: string;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
  onEdit: (championship: Championship) => void;
  onDelete: (championship: Championship) => void;
}

export const AdminChampionshipsTable: React.FC<AdminChampionshipsTableProps> = ({
  championships,
  search,
  onSearchChange,
  onOpenCreate,
  onEdit,
  onDelete,
}) => {
  const { CHAMPIONSHIPS_TABLE } = MATCHES_CONSTANTS.ADMIN;

  return (
    <LayoutContainer className="space-y-4">
      {/* Barra de Filtros e Ação */}
      <LayoutContainer className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <Input
          placeholder={CHAMPIONSHIPS_TABLE.SEARCH_PLACEHOLDER}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-80"
        />

        <Button
          onClick={onOpenCreate}
          variant="primary"
          className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-5 py-2 rounded-xl shadow-md shrink-0"
        >
          + {CHAMPIONSHIPS_TABLE.ADD_CHAMPIONSHIP_BUTTON}
        </Button>
      </LayoutContainer>

      {/* Tabela de Dados */}
      <LayoutContainer className="rounded-2xl border border-border/60 bg-surface-card overflow-hidden shadow-sm">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{CHAMPIONSHIPS_TABLE.NAME}</TableHeader>
              <TableHeader>{CHAMPIONSHIPS_TABLE.SEASON}</TableHeader>
              <TableHeader>{CHAMPIONSHIPS_TABLE.CATEGORY}</TableHeader>
              <TableHeader>Tabela FGF/CBF</TableHeader>
              <TableHeader>Regulamentos</TableHeader>
              <TableHeader>{CHAMPIONSHIPS_TABLE.STATUS}</TableHeader>
              <TableHeader className="text-right">{CHAMPIONSHIPS_TABLE.ACTIONS}</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {championships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-text-muted text-sm">
                  {CHAMPIONSHIPS_TABLE.EMPTY_STATE}
                </TableCell>
              </TableRow>
            ) : (
              championships.map((champ) => (
                <TableRow key={champ.id} className="hover:bg-surface-hover/50">
                  <TableCell>
                    <LayoutContainer className="flex items-center space-x-3">
                      <LayoutContainer className="w-8 h-8 rounded-lg bg-surface-hover border border-border/50 flex items-center justify-center p-1">
                        <SafeImage
                          src={champ.logoUrl || '/images/pelotas-logo.png'}
                          alt={champ.name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </LayoutContainer>
                      <Text className="text-sm font-bold text-text-primary">
                        {champ.name}
                      </Text>
                    </LayoutContainer>
                  </TableCell>

                  <TableCell>
                    <Text className="text-xs font-semibold text-text-primary">
                      {champ.seasonYear}
                    </Text>
                  </TableCell>

                  <TableCell>
                    <Badge variant="default" className="border-border text-xs">
                      {CHAMPIONSHIP_CATEGORY_LABELS[champ.category] || champ.category}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {champ.tableUrl ? (
                      <a
                        href={champ.tableUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-secondary hover:text-secondary-hover font-medium underline"
                      >
                        Ver link ↗
                      </a>
                    ) : (
                      <Text className="text-xs text-text-muted">Não configurado</Text>
                    )}
                  </TableCell>

                  <TableCell>
                    <Text className="text-xs text-text-muted">
                      {champ.regulations?.length || 0} documento(s)
                    </Text>
                  </TableCell>

                  <TableCell>
                    {champ.isActive ? (
                      <Badge variant="default" className="bg-emerald-600/20 text-emerald-500 border border-emerald-500/30">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-text-muted">
                        Inativo
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <LayoutContainer className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        onClick={() => onEdit(champ)}
                        className="text-xs text-secondary hover:text-secondary-hover px-2 py-1 h-auto"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => onDelete(champ)}
                        className="text-xs text-orange-500 hover:text-orange-400 px-2 py-1 h-auto"
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
