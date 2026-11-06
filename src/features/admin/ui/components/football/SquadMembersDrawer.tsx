'use client';

import React from 'react';
import { Plus, Trash2, Users, Star } from 'lucide-react';
import {
  Drawer,
  LayoutContainer,
  Title,
  Text,
  Badge,
  Input,
  Select,
  Option,
  Button,
  Spinner,
  SafeImage,
  DEFAULT_IDOL_COVER,
} from '@/shared/ui/components';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../../constants/admin-football.constants';
import { FOOTBALL_CONSTANTS } from '@/features/football/constants/football.constants';
import {
  AthleteData,
  SquadData,
  SquadMemberData,
  SquadMemberRole,
  SquadSector,
} from '@/features/football/services/football.service';

export interface SquadMembersDrawerProps {
  isOpen: boolean;
  squad: SquadData | null;
  members: SquadMemberData[];
  availableAthletes: AthleteData[];
  isLoadingAthletes: boolean;
  isSaving: boolean;
  includeYouthAthletes?: boolean;
  setIncludeYouthAthletes?: (v: boolean) => void;
  includeRetiredAthletes?: boolean;
  setIncludeRetiredAthletes?: (v: boolean) => void;
  onClose: () => void;
  onSave: () => void;
  selectedAthleteId: string;
  setSelectedAthleteId: (v: string) => void;
  jerseyNumber: string;
  setJerseyNumber: (v: string) => void;
  sector: SquadSector;
  setSector: (v: SquadSector) => void;
  role: SquadMemberRole;
  setRole: (v: SquadMemberRole) => void;
  onAddMember: () => void;
  onRemoveMember: (athleteId: string) => void;
}

export const SquadMembersDrawer: React.FC<SquadMembersDrawerProps> = ({
  isOpen,
  squad,
  members,
  availableAthletes,
  isLoadingAthletes,
  isSaving,
  includeYouthAthletes = false,
  setIncludeYouthAthletes,
  includeRetiredAthletes = false,
  setIncludeRetiredAthletes,
  onClose,
  onSave,
  selectedAthleteId,
  setSelectedAthleteId,
  jerseyNumber,
  setJerseyNumber,
  sector,
  setSector,
  role,
  setRole,
  onAddMember,
  onRemoveMember,
}) => {
  const texts = ADMIN_FOOTBALL_CONSTANTS.DRAWER_MEMBERS;

  // Filter athletes that are already in the squad if needed, or allow changing
  const allocatedIds = new Set(
    members.map((m) => m.athleteId || m.athlete?._id || m.athlete?.id),
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${texts.TITLE} - ${squad?.seasonName || ''} (${squad?.year || ''})`}
      size="lg"
    >
      <LayoutContainer className="flex flex-col gap-6 p-6">
        {/* Adicionar Atleta Form Card */}
        <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-4 shadow-xs">
          <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
            <Title level="h4" className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <Text as="span">{texts.ADD_ATHLETE}</Text>
            </Title>

            <LayoutContainer className="flex items-center gap-2 flex-wrap">
              {/* Toggle para incluir Atletas da Base no Elenco Profissional */}
              {squad?.category === 'PROFESSIONAL' && setIncludeYouthAthletes && (
                <Button
                  type="button"
                  variant={includeYouthAthletes ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setIncludeYouthAthletes(!includeYouthAthletes)}
                  className="text-xs font-bold rounded-full transition-all"
                >
                  {includeYouthAthletes ? `✓ ${texts.TOGGLE_INCLUDE_YOUTH_ACTIVE}` : `🌱 ${texts.TOGGLE_INCLUDE_YOUTH}`}
                </Button>
              )}

              {/* Toggle para incluir Atletas Aposentados / Históricos */}
              {setIncludeRetiredAthletes && (
                <Button
                  type="button"
                  variant={includeRetiredAthletes ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setIncludeRetiredAthletes(!includeRetiredAthletes)}
                  className="text-xs font-bold rounded-full transition-all"
                >
                  {includeRetiredAthletes ? `✓ ${texts.TOGGLE_INCLUDE_RETIRED_ACTIVE}` : `👴 ${texts.TOGGLE_INCLUDE_RETIRED}`}
                </Button>
              )}
            </LayoutContainer>
          </LayoutContainer>

          {/* Avisos de Contexto e Regras de Negócio do Elenco */}
          {squad?.category === 'FEMININE' && (
            <LayoutContainer className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs text-text-secondary font-medium">
              ℹ️ {texts.FEMALE_ONLY_NOTICE}
            </LayoutContainer>
          )}

          {squad?.category?.startsWith('SUB_') && (
            <LayoutContainer className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs text-text-secondary font-medium">
              ℹ️ {texts.YOUTH_ONLY_NOTICE}
            </LayoutContainer>
          )}

          {squad?.category === 'PROFESSIONAL' && !includeYouthAthletes && (
            <LayoutContainer className="px-3 py-2 rounded-xl bg-surface-secondary border border-border text-[11px] text-text-muted">
              {texts.MALE_ONLY_NOTICE} Clique no botão acima para permitir alocar atletas da base em transição.
            </LayoutContainer>
          )}

          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            {/* Selecionar Atleta */}
            <LayoutContainer className="sm:col-span-5 flex flex-col gap-1">
              <Text as="span" className="text-[11px] font-bold text-text-muted">
                Atleta do Banco
              </Text>
              <Select
                value={selectedAthleteId}
                onChange={(e) => {
                  setSelectedAthleteId(e.target.value);
                  // Auto detect sector based on athlete primary position
                  const found = availableAthletes.find(
                    (a) => (a.id || a._id) === e.target.value,
                  );
                  if (found) {
                    if (found.athleteType === 'STAFF') {
                      setSector('STAFF');
                    } else {
                      const pos = (found.primaryPosition || '').toLowerCase();
                      if (pos.includes('gol')) setSector('GOALKEEPER');
                      else if (pos.includes('zag') || pos.includes('lat') || pos.includes('def'))
                        setSector('DEFENDER');
                      else if (pos.includes('vol') || pos.includes('meia') || pos.includes('meio'))
                        setSector('MIDFIELDER');
                      else if (pos.includes('ata') || pos.includes('pon') || pos.includes('cen'))
                        setSector('FORWARD');
                    }
                  }
                }}
                className="w-full"
              >
                <Option value="">{texts.SELECT_ATHLETE}</Option>
                {availableAthletes.map((a) => {
                  const id = a.id || a._id;
                  const isAllocated = allocatedIds.has(id);
                  return (
                    <Option key={id} value={id}>
                      {a.nickname || a.name} ({a.primaryPosition})
                      {a.isRetired ? ` [${texts.RETIRED_BADGE}]` : ''}
                      {a.athleteType === 'YOUTH' ? ` [${texts.YOUTH_BADGE}${a.youthCategory ? ` - ${a.youthCategory}` : ''}]` : ''}
                      {isAllocated ? ' ✓ Já no elenco' : ''}
                    </Option>
                  );
                })}
              </Select>
            </LayoutContainer>

            {/* Número da Camisa */}
            <LayoutContainer className="sm:col-span-2 flex flex-col gap-1">
              <Text as="span" className="text-[11px] font-bold text-text-muted">
                {texts.FIELD_JERSEY}
              </Text>
              <Input
                type="number"
                placeholder={sector === 'STAFF' ? 'N/A' : 'Ex: 9'}
                disabled={sector === 'STAFF'}
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value)}
                className="text-xs"
              />
            </LayoutContainer>

            {/* Setor */}
            <LayoutContainer className="sm:col-span-3 flex flex-col gap-1">
              <Text as="span" className="text-[11px] font-bold text-text-muted">
                {texts.FIELD_SECTOR}
              </Text>
              <Select
                value={sector}
                onChange={(e) => setSector(e.target.value as SquadSector)}
                className="w-full"
              >
                <Option value="GOALKEEPER">Goleiros</Option>
                <Option value="DEFENDER">Defensores</Option>
                <Option value="MIDFIELDER">Meio-Campistas</Option>
                <Option value="FORWARD">Atacantes</Option>
                <Option value="STAFF">Comissão Técnica</Option>
              </Select>
            </LayoutContainer>

            {/* Status / Role */}
            <LayoutContainer className="sm:col-span-2 flex flex-col gap-1">
              <Text as="span" className="text-[11px] font-bold text-text-muted">
                {texts.FIELD_ROLE}
              </Text>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as SquadMemberRole)}
                className="w-full"
              >
                <Option value="STARTER">Titular</Option>
                <Option value="SUBSTITUTE">Reserva</Option>
                <Option value="CAPTAIN">Capitão</Option>
                <Option value="INJURED">Dep. Médico</Option>
              </Select>
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={onAddMember}
              className="font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {texts.BTN_ADD}
            </Button>
          </LayoutContainer>
        </LayoutContainer>

        {/* Lista de Atletas Alocados */}
        <LayoutContainer className="flex flex-col gap-3">
          <LayoutContainer className="flex items-center justify-between">
            <Title level="h4" className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <Text as="span">Atletas neste Elenco ({members.length})</Text>
            </Title>
          </LayoutContainer>

          {members.length === 0 ? (
            <LayoutContainer className="p-8 text-center rounded-2xl bg-surface border border-border">
              <Text as="p" className="text-xs text-text-muted italic">
                {texts.EMPTY_MEMBERS}
              </Text>
            </LayoutContainer>
          ) : (
            <LayoutContainer className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
              {members.map((member, idx) => {
                const athleteId = member.athleteId || member.athlete?._id || member.athlete?.id;
                const athleteName = member.athlete?.nickname || member.athlete?.name || 'Atleta';
                const sectorLabel = (FOOTBALL_CONSTANTS.SECTORS as any)[member.sector] || member.sector;

                return (
                  <LayoutContainer
                    key={athleteId || idx}
                    className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-primary/30 transition-colors"
                  >
                    <LayoutContainer className="flex items-center gap-3">
                      {/* Camisa Badge */}
                      <Badge variant="primary" size="sm" className="font-black text-xs px-2.5">
                        {member.sector === 'STAFF' || !member.jerseyNumber ? 'STAFF' : '#' + member.jerseyNumber}
                      </Badge>

                      {/* Mini Foto */}
                      <LayoutContainer className="relative w-8 h-10 rounded-lg overflow-hidden bg-background shrink-0 border border-border">
                        <SafeImage
                          src={member.athlete?.photoUrl}
                          fallbackSrc={DEFAULT_IDOL_COVER}
                          alt={athleteName}
                          fill
                          className="object-cover object-top"
                        />
                      </LayoutContainer>

                      {/* Nome & Setor */}
                      <LayoutContainer className="flex flex-col">
                        <LayoutContainer className="flex items-center gap-1.5">
                          <Text as="span" className="font-extrabold text-text-primary">
                            {athleteName}
                          </Text>
                          {member.role === 'CAPTAIN' && (
                            <Badge variant="warning" size="sm" className="text-[9px] uppercase font-bold py-0">
                              <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                              Capitão
                            </Badge>
                          )}
                        </LayoutContainer>
                        <Text as="span" className="text-[11px] text-text-muted">
                          {sectorLabel} • {member.athlete?.primaryPosition || ''}
                        </Text>
                      </LayoutContainer>
                    </LayoutContainer>

                    {/* Ação Excluir do Elenco */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => athleteId && onRemoveMember(athleteId)}
                      className="p-1.5 text-text-muted hover:text-primary"
                    >
                      <Trash2 className="w-4 h-4 text-[#ea580c]" />
                    </Button>
                  </LayoutContainer>
                );
              })}
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Drawer Actions */}
        <LayoutContainer className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-auto">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            disabled={isSaving}
            className="font-bold min-w-[140px]"
          >
            {isSaving ? (
              <LayoutContainer className="flex items-center gap-2">
                <Spinner size={16} />
                <Text as="span">Salvando...</Text>
              </LayoutContainer>
            ) : (
              'Salvar Elenco'
            )}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Drawer>
  );
};
