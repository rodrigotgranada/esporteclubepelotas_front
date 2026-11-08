'use client';

import React, { useState } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  FormField,
  Input,
  Select,
  Modal,
} from '@/shared/ui/components';
import { StadiumQuickFact } from '@/features/stadium/types/stadium.types';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import {
  Calendar,
  Users,
  Maximize2,
  MapPin,
  Zap,
  Flame,
  Trophy,
  Shield,
  Star,
  Award,
  Info,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertTriangle,
  Loader2,
  Clock,
  Compass,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  calendar: Calendar,
  users: Users,
  maximize: Maximize2,
  flame: Flame,
  zap: Zap,
  mapPin: MapPin,
  trophy: Trophy,
  shield: Shield,
  star: Star,
  award: Award,
  info: Info,
  clock: Clock,
  compass: Compass,
};

const ICON_OPTIONS = [
  { value: 'calendar', label: '📅 Calendário / Fundação' },
  { value: 'users', label: '👥 Público / Capacidade' },
  { value: 'maximize', label: '📐 Dimensões / Gramado' },
  { value: 'flame', label: '🔥 Mística / Alcunha' },
  { value: 'zap', label: '⚡ Refletores / Pioneirismo' },
  { value: 'mapPin', label: '📍 Localização / Bairro' },
  { value: 'trophy', label: '🏆 Troféu / Conquista' },
  { value: 'shield', label: '🛡️ Escudo / Tradição' },
  { value: 'star', label: '⭐ Estrela / Destaque' },
  { value: 'award', label: '🎖️ Honraria / Reconhecimento' },
  { value: 'info', label: 'ℹ️ Informação Geral' },
];

interface StadiumQuickFactsManagerProps {
  quickFacts: StadiumQuickFact[];
  onAddCard: (card: Omit<StadiumQuickFact, 'id'>) => Promise<void> | void;
  onUpdateCard: (index: number, updatedCard: StadiumQuickFact) => Promise<void> | void;
  onRemoveCard: (index: number) => Promise<void> | void;
}

export const StadiumQuickFactsManager: React.FC<StadiumQuickFactsManagerProps> = ({
  quickFacts,
  onAddCard,
  onUpdateCard,
  onRemoveCard,
}) => {
  // Estado para novo card
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [icon, setIcon] = useState('calendar');
  const [isAdding, setIsAdding] = useState(false);

  // Estado para edição
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editIcon, setEditIcon] = useState('calendar');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Estado para exclusão com confirmação
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdd = async () => {
    if (!label.trim() || !value.trim()) return;
    try {
      setIsAdding(true);
      await onAddCard({
        label: label.trim(),
        value: value.trim(),
        icon,
      });
      setLabel('');
      setValue('');
      setIcon('calendar');
    } finally {
      setIsAdding(false);
    }
  };

  const handleStartEdit = (index: number) => {
    const card = quickFacts[index];
    if (!card) return;
    setEditingIndex(index);
    setEditLabel(card.label);
    setEditValue(card.value);
    setEditIcon(card.icon || 'calendar');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditLabel('');
    setEditValue('');
    setEditIcon('calendar');
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;
    const card = quickFacts[editingIndex];
    if (!card || !editLabel.trim() || !editValue.trim()) return;
    try {
      setIsSavingEdit(true);
      await onUpdateCard(editingIndex, {
        ...card,
        label: editLabel.trim(),
        value: editValue.trim(),
        icon: editIcon,
      });
      handleCancelEdit();
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingIndex === null) return;
    try {
      setIsDeleting(true);
      await onRemoveCard(deletingIndex);
      setDeletingIndex(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const cardToDelete = deletingIndex !== null ? quickFacts[deletingIndex] : null;

  return (
    <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-6">
      {/* Cabeçalho da Seção */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <LayoutContainer className="flex flex-col">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {ADMIN_STADIUM_TEXTS.QUICK_FACTS.TITLE}
          </Title>
          <Text className="text-xs text-text-secondary">
            {ADMIN_STADIUM_TEXTS.QUICK_FACTS.SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Formulário de Adição de Novo Card */}
      <LayoutContainer className="p-5 rounded-2xl bg-background border border-border flex flex-col gap-4">
        <Title level="h4" className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          {ADMIN_STADIUM_TEXTS.QUICK_FACTS.ADD_CARD_BUTTON}
        </Title>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <LayoutContainer className="sm:col-span-4">
            <FormField label={ADMIN_STADIUM_TEXTS.QUICK_FACTS.LABEL_FIELD}>
              <Input
                placeholder={ADMIN_STADIUM_TEXTS.QUICK_FACTS.LABEL_PLACEHOLDER}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="sm:col-span-4">
            <FormField label={ADMIN_STADIUM_TEXTS.QUICK_FACTS.VALUE_FIELD}>
              <Input
                placeholder={ADMIN_STADIUM_TEXTS.QUICK_FACTS.VALUE_PLACEHOLDER}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="sm:col-span-2">
            <FormField label={ADMIN_STADIUM_TEXTS.QUICK_FACTS.ICON_FIELD}>
              <Select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="sm:col-span-2">
            <Button
              type="button"
              variant="primary"
              disabled={isAdding || !label.trim() || !value.trim()}
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer h-10 shadow-xs"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <Text as="span">
                {isAdding ? 'Adicionando...' : ADMIN_STADIUM_TEXTS.QUICK_FACTS.ADD_CARD_BUTTON}
              </Text>
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Grid de Cards Existentes */}
      {quickFacts.length === 0 ? (
        <LayoutContainer className="py-12 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
          <Info className="w-8 h-8 text-text-secondary mb-2" />
          <Text className="text-sm text-text-secondary">
            {ADMIN_STADIUM_TEXTS.QUICK_FACTS.EMPTY}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {quickFacts.map((card, index) => {
            const Icon = (card.icon && ICON_MAP[card.icon]) || Info;
            return (
              <LayoutContainer
                key={card.id || index}
                className="p-4 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all flex flex-col justify-between gap-3 shadow-xs group"
              >
                <LayoutContainer className="flex items-start justify-between gap-2">
                  <LayoutContainer className="flex items-center gap-2.5">
                    <LayoutContainer className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-colors">
                      <Icon className="w-4 h-4" />
                    </LayoutContainer>
                    <LayoutContainer className="flex flex-col">
                      <Text as="span" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider line-clamp-1">
                        {card.label}
                      </Text>
                      <Text as="span" className="text-sm font-bold text-text-primary line-clamp-2">
                        {card.value}
                      </Text>
                    </LayoutContainer>
                  </LayoutContainer>

                  {/* Ações */}
                  <LayoutContainer className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      size="none"
                      variant="custom"
                      onClick={() => handleStartEdit(index)}
                      className="w-8 h-8 rounded-lg bg-surface hover:bg-primary text-text-secondary hover:text-black border border-border/80 shadow-xs flex items-center justify-center transition-all cursor-pointer"
                      title={ADMIN_STADIUM_TEXTS.QUICK_FACTS.EDIT_CARD_TOOLTIP}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="none"
                      variant="custom"
                      onClick={() => setDeletingIndex(index)}
                      className="w-8 h-8 rounded-lg bg-surface hover:bg-[#ea580c] text-text-secondary hover:text-white border border-border/80 shadow-xs flex items-center justify-center transition-all cursor-pointer"
                      title={ADMIN_STADIUM_TEXTS.QUICK_FACTS.DELETE_CARD_TOOLTIP}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      )}

      {/* Modal de Edição de Card */}
      <Modal
        isOpen={editingIndex !== null}
        onClose={() => !isSavingEdit && handleCancelEdit()}
        size="md"
      >
        <LayoutContainer className="flex flex-col gap-5 p-2">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {ADMIN_STADIUM_TEXTS.QUICK_FACTS.EDIT_CARD_TITLE}
          </Title>

          <LayoutContainer className="flex flex-col gap-4">
            <FormField label={ADMIN_STADIUM_TEXTS.QUICK_FACTS.LABEL_FIELD}>
              <Input
                value={editLabel}
                placeholder={ADMIN_STADIUM_TEXTS.QUICK_FACTS.LABEL_PLACEHOLDER}
                onChange={(e) => setEditLabel(e.target.value)}
              />
            </FormField>

            <FormField label={ADMIN_STADIUM_TEXTS.QUICK_FACTS.VALUE_FIELD}>
              <Input
                value={editValue}
                placeholder={ADMIN_STADIUM_TEXTS.QUICK_FACTS.VALUE_PLACEHOLDER}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </FormField>

            <FormField label={ADMIN_STADIUM_TEXTS.QUICK_FACTS.ICON_FIELD}>
              <Select
                value={editIcon}
                onChange={(e) => setEditIcon(e.target.value)}
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              disabled={isSavingEdit}
              onClick={handleCancelEdit}
              className="cursor-pointer"
            >
              <Text as="span">{ADMIN_STADIUM_TEXTS.QUICK_FACTS.CANCEL_EDIT_BUTTON}</Text>
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={isSavingEdit || !editLabel.trim() || !editValue.trim()}
              onClick={handleSaveEdit}
              className="cursor-pointer font-bold shadow-sm"
            >
              {isSavingEdit ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-1.5" />
              )}
              <Text as="span">
                {isSavingEdit ? 'Salvando...' : ADMIN_STADIUM_TEXTS.QUICK_FACTS.SAVE_EDIT_BUTTON}
              </Text>
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={deletingIndex !== null}
        onClose={() => !isDeleting && setDeletingIndex(null)}
        size="md"
      >
        <LayoutContainer className="flex flex-col gap-5 p-2">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {ADMIN_STADIUM_TEXTS.QUICK_FACTS.DELETE_CONFIRM_TITLE}
          </Title>
          <LayoutContainer className="flex items-start gap-3">
            <LayoutContainer className="w-10 h-10 rounded-full bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col gap-1">
              <Text className="text-sm text-text-primary font-medium">
                {ADMIN_STADIUM_TEXTS.QUICK_FACTS.DELETE_CONFIRM_DESC}
              </Text>
              {cardToDelete && (
                <Text className="text-xs text-text-secondary font-mono mt-1">
                  &quot;{cardToDelete.label}: {cardToDelete.value}&quot;
                </Text>
              )}
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              disabled={isDeleting}
              onClick={() => setDeletingIndex(null)}
              className="cursor-pointer"
            >
              <Text as="span">{ADMIN_STADIUM_TEXTS.QUICK_FACTS.CANCEL_EDIT_BUTTON}</Text>
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1.5" />
              )}
              <Text as="span">
                {isDeleting ? 'Excluindo...' : ADMIN_STADIUM_TEXTS.QUICK_FACTS.CONFIRM_DELETE_BUTTON}
              </Text>
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </Modal>
    </LayoutContainer>
  );
};
