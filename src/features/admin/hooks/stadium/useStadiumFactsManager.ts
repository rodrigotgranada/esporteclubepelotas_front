'use client';

import { useState } from 'react';
import { StadiumFact } from '@/features/stadium/types/stadium.types';

export interface UseStadiumFactsManagerProps {
  facts: StadiumFact[];
  onAddFact: (fact: StadiumFact) => Promise<void> | void;
  onUpdateFact: (index: number, updatedFact: StadiumFact) => Promise<void> | void;
  onRemoveFact: (index: number) => Promise<void> | void;
}

export function useStadiumFactsManager({
  facts,
  onAddFact,
  onUpdateFact,
  onRemoveFact,
}: UseStadiumFactsManagerProps) {
  // Estado para criação de novo marco
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Estado para edição in-place de marco existente
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editYear, setEditYear] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Estado para exclusão com confirmação
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdd = async () => {
    if (!year.trim() || !title.trim() || !description.trim()) return;
    try {
      setIsAdding(true);
      await onAddFact({
        year: year.trim(),
        title: title.trim(),
        description: description.trim(),
      });
      setYear('');
      setTitle('');
      setDescription('');
    } finally {
      setIsAdding(false);
    }
  };

  const handleStartEdit = (index: number) => {
    const fact = facts[index];
    if (!fact) return;
    setEditingIndex(index);
    setEditYear(fact.year);
    setEditTitle(fact.title);
    setEditDescription(fact.description);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditYear('');
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;
    if (!editYear.trim() || !editTitle.trim() || !editDescription.trim()) return;
    try {
      setIsSavingEdit(true);
      await onUpdateFact(editingIndex, {
        year: editYear.trim(),
        title: editTitle.trim(),
        description: editDescription.trim(),
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
      await onRemoveFact(deletingIndex);
      setDeletingIndex(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const factToDelete = deletingIndex !== null ? facts[deletingIndex] : null;

  return {
    year,
    setYear,
    title,
    setTitle,
    description,
    setDescription,
    isAdding,
    editingIndex,
    editYear,
    setEditYear,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    isSavingEdit,
    deletingIndex,
    setDeletingIndex,
    isDeleting,
    factToDelete,
    handleAdd,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleConfirmDelete,
  };
}

export type UseStadiumFactsManagerReturn = ReturnType<typeof useStadiumFactsManager>;

