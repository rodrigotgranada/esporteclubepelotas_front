'use client';

import { useState } from 'react';
import { StadiumQuickFact } from '@/features/stadium/types/stadium.types';

interface UseStadiumQuickFactsManagerProps {
  quickFacts: StadiumQuickFact[];
  onAddCard: (card: Omit<StadiumQuickFact, 'id'>) => Promise<void> | void;
  onUpdateCard: (index: number, updatedCard: StadiumQuickFact) => Promise<void> | void;
  onRemoveCard: (index: number) => Promise<void> | void;
  onReorderCards: (newQuickFacts: StadiumQuickFact[]) => Promise<void> | void;
}

export const useStadiumQuickFactsManager = ({
  quickFacts,
  onAddCard,
  onUpdateCard,
  onRemoveCard,
  onReorderCards,
}: UseStadiumQuickFactsManagerProps) => {
  // Estado para novo card
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [icon, setIcon] = useState('calendar');
  const [isAdding, setIsAdding] = useState(false);

  // Estado para edição in-place
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editIcon, setEditIcon] = useState('calendar');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Estado para exclusão com confirmação
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para Drag and Drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const handleMoveCard = async (currentIndex: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= quickFacts.length) return;

    const reordered = [...quickFacts];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const updated = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
    try {
      setIsReordering(true);
      await onReorderCards(updated);
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...quickFacts];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    const updated = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
    setDraggedIndex(null);
    setDragOverIndex(null);

    try {
      setIsReordering(true);
      await onReorderCards(updated);
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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

  return {
    label,
    setLabel,
    value,
    setValue,
    icon,
    setIcon,
    isAdding,
    editingIndex,
    editLabel,
    setEditLabel,
    editValue,
    setEditValue,
    editIcon,
    setEditIcon,
    isSavingEdit,
    deletingIndex,
    setDeletingIndex,
    isDeleting,
    draggedIndex,
    dragOverIndex,
    isReordering,
    cardToDelete,
    handleMoveCard,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleAdd,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleConfirmDelete,
  };
};

