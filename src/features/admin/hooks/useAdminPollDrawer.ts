'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { pollService } from '@/features/poll/services/poll.service';
import { Poll } from '@/features/poll/types/poll.types';
import { POLL_TEXTS } from '@/features/poll/constants/poll.constants';

interface UseAdminPollDrawerProps {
  poll: Poll | null;
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function useAdminPollDrawer({
  poll,
  isOpen,
  onSuccess,
  onClose,
}: UseAdminPollDrawerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [onlyMembers, setOnlyMembers] = useState(true);
  const [active, setActive] = useState(true);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (poll) {
      setTitle(poll.title || '');
      setDescription(poll.description || '');
      setOnlyMembers(poll.onlyMembers ?? true);
      setActive(poll.active ?? true);
      setOptions(poll.options?.map((o) => o.title) || ['', '']);
    } else {
      setTitle('');
      setDescription('');
      setOnlyMembers(true);
      setActive(true);
      setOptions(['', '']);
    }
  }, [poll, isOpen]);

  const handleAddOption = () => {
    setOptions((prev) => [...prev, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.error(POLL_TEXTS.ADMIN.MIN_OPTIONS_ERROR);
      return;
    }
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.error('Informe o título da enquete.');
      return;
    }

    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!poll && validOptions.length < 2) {
      toast.error(POLL_TEXTS.ADMIN.MIN_OPTIONS_ERROR);
      return;
    }

    try {
      setIsSaving(true);
      if (poll) {
        await pollService.update(poll.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          onlyMembers,
          active,
        });
      } else {
        await pollService.create({
          title: title.trim(),
          description: description.trim() || undefined,
          onlyMembers,
          active,
          options: validOptions,
        });
      }

      toast.success(POLL_TEXTS.ADMIN.SAVE_SUCCESS);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Erro ao salvar enquete:', err);
      const msg = err instanceof Error ? err.message : 'Falha ao salvar enquete.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    onlyMembers,
    setOnlyMembers,
    active,
    setActive,
    options,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    isSaving,
    handleSubmit,
  };
}

