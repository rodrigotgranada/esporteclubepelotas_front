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
  Select,
  Option,
} from '@/shared/ui/components/atoms';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { OpponentClub } from '../../types/opponents.types';
import { OPPONENTS_CONSTANTS, DEFAULT_CLUB_BADGE } from '../../constants/opponents.constants';
import { OpponentSortField, SortDirection, OpponentStatusFilter } from '../../hooks/useAdminOpponents';

export interface AdminOpponentsTableProps {
  opponents: OpponentClub[];
  totalCount: number;
  filteredCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: OpponentStatusFilter;
  onStatusFilterChange: (status: OpponentStatusFilter) => void;
  sortField: OpponentSortField;
  sortDirection: SortDirection;
  onSort: (field: OpponentSortField) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage: (page: number) => void;
  onOpenCreate: () => void;
  onEdit: (club: OpponentClub) => void;
  onDelete: (club: OpponentClub) => void;
}

export const AdminOpponentsTable: React.FC<AdminOpponentsTableProps> = ({
  opponents,
  totalCount,
  filteredCount,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  itemsPerPage,
  onNextPage,
  onPrevPage,
  onGoToPage,
  onOpenCreate,
  onEdit,
  onDelete,
}) => {
  const { TABLE } = OPPONENTS_CONSTANTS;

  const renderSortIndicator = (field: OpponentSortField) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? (
        <ArrowUp className="w-3.5 h-3.5 text-secondary inline ml-1.5" />
      ) : (
        <ArrowDown className="w-3.5 h-3.5 text-secondary inline ml-1.5" />
      );
    }
    return (
      <ArrowUpDown className="w-3.5 h-3.5 text-text-muted/40 group-hover:text-text-muted inline ml-1.5 transition-colors" />
    );
  };

  return (
    <LayoutContainer className="space-y-4">
      {/* Barra de Filtro, Seleção de Status e Ação */}
      <LayoutContainer className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <LayoutContainer className="flex flex-wrap items-center gap-3 flex-1">
          <Input
            placeholder={TABLE.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-80"
          />

          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as OpponentStatusFilter)}
            className="w-full sm:w-44"
          >
            <Option value="ALL">{TABLE.STATUS_FILTER_ALL}</Option>
            <Option value="ACTIVE">{TABLE.STATUS_FILTER_ACTIVE}</Option>
            <Option value="INACTIVE">{TABLE.STATUS_FILTER_INACTIVE}</Option>
          </Select>

          {totalCount > 0 && (
            <Text className="text-xs text-text-muted hidden lg:inline">
              {TABLE.COUNTER_LABEL(filteredCount, totalCount)}
            </Text>
          )}
        </LayoutContainer>

        <Button
          onClick={onOpenCreate}
          variant="primary"
          className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-5 py-2.5 rounded-xl shadow-md shrink-0 cursor-pointer"
        >
          + {TABLE.ADD_BUTTON}
        </Button>
      </LayoutContainer>

      {/* Tabela de Clubes com Cabeçalhos Ordenáveis */}
      <LayoutContainer className="rounded-2xl border border-border/60 bg-surface-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{TABLE.BADGE}</TableHead>

              <TableHead
                onClick={() => onSort('name')}
                className="cursor-pointer group select-none hover:text-secondary transition-colors"
              >
                <LayoutContainer className="flex items-center">
                  <Text className="font-semibold text-xs tracking-wider uppercase">
                    {TABLE.NAME}
                  </Text>
                  {renderSortIndicator('name')}
                </LayoutContainer>
              </TableHead>

              <TableHead
                onClick={() => onSort('shortName')}
                className="cursor-pointer group select-none hover:text-secondary transition-colors"
              >
                <LayoutContainer className="flex items-center">
                  <Text className="font-semibold text-xs tracking-wider uppercase">
                    {TABLE.SHORT_NAME}
                  </Text>
                  {renderSortIndicator('shortName')}
                </LayoutContainer>
              </TableHead>

              <TableHead
                onClick={() => onSort('city')}
                className="cursor-pointer group select-none hover:text-secondary transition-colors"
              >
                <LayoutContainer className="flex items-center">
                  <Text className="font-semibold text-xs tracking-wider uppercase">
                    {TABLE.CITY}
                  </Text>
                  {renderSortIndicator('city')}
                </LayoutContainer>
              </TableHead>

              <TableHead
                onClick={() => onSort('stadiumName')}
                className="cursor-pointer group select-none hover:text-secondary transition-colors"
              >
                <LayoutContainer className="flex items-center">
                  <Text className="font-semibold text-xs tracking-wider uppercase">
                    {TABLE.STADIUM}
                  </Text>
                  {renderSortIndicator('stadiumName')}
                </LayoutContainer>
              </TableHead>

              <TableHead
                onClick={() => onSort('isActive')}
                className="cursor-pointer group select-none hover:text-secondary transition-colors w-24"
              >
                <LayoutContainer className="flex items-center">
                  <Text className="font-semibold text-xs tracking-wider uppercase">
                    {TABLE.STATUS}
                  </Text>
                  {renderSortIndicator('isActive')}
                </LayoutContainer>
              </TableHead>

              <TableHead className="text-right w-28">
                <Text className="font-semibold text-xs tracking-wider uppercase">
                  {TABLE.ACTIONS}
                </Text>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {opponents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Text className="text-sm text-text-muted">
                    {TABLE.EMPTY_STATE}
                  </Text>
                </TableCell>
              </TableRow>
            ) : (
              opponents.map((club) => (
                <TableRow
                  key={club.id}
                  className="hover:bg-surface-hover/40 transition-colors border-b border-border/40"
                >
                  <TableCell>
                    <LayoutContainer className="w-9 h-9 rounded-full bg-surface-card border border-border/80 flex items-center justify-center p-1 overflow-hidden shrink-0">
                      <SafeImage
                        src={club.badgeUrl || DEFAULT_CLUB_BADGE}
                        alt={club.name}
                        width={32}
                        height={32}
                        className="object-contain w-full h-full"
                        fallbackSrc={DEFAULT_CLUB_BADGE}
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

      {/* Controles de Paginação */}
      {filteredCount > 0 && (
        <LayoutContainer className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 px-1">
          <Text className="text-xs text-text-muted">
            {TABLE.PAGINATION.INFO(
              (currentPage - 1) * itemsPerPage + 1,
              Math.min(currentPage * itemsPerPage, filteredCount),
              filteredCount
            )}
          </Text>

          {totalPages > 1 && (
            <LayoutContainer className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevPage}
                disabled={currentPage === 1}
                className="text-xs border border-border/60 hover:bg-surface-hover disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed px-3 py-1.5 rounded-lg"
              >
                {TABLE.PAGINATION.PREVIOUS}
              </Button>

              <LayoutContainer className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => onGoToPage(page)}
                    className={`text-xs px-2.5 py-1 rounded-lg cursor-pointer ${
                      page === currentPage
                        ? 'bg-secondary text-primary font-bold shadow-sm'
                        : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </LayoutContainer>

              <Button
                variant="ghost"
                size="sm"
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                className="text-xs border border-border/60 hover:bg-surface-hover disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed px-3 py-1.5 rounded-lg"
              >
                {TABLE.PAGINATION.NEXT}
              </Button>
            </LayoutContainer>
          )}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
