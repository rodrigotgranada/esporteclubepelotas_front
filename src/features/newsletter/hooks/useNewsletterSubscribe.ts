'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { newsletterService } from '../services/newsletter.service';
import { NEWSLETTER_TEXTS } from '../constants/newsletter.constants';

export function useNewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      toast.error(NEWSLETTER_TEXTS.INVALID_EMAIL);
      return;
    }

    try {
      setIsSubmitting(true);
      await newsletterService.subscribe({
        email: cleanEmail,
        name: name.trim() || undefined,
      });

      setIsSuccess(true);
      setEmail('');
      setName('');
      toast.success(NEWSLETTER_TEXTS.SUCCESS_MESSAGE);
    } catch (err: unknown) {
      console.error('Erro na inscrição da newsletter:', err);
      const msg = err instanceof Error ? err.message : 'Falha ao realizar inscrição.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    name,
    setName,
    isSubmitting,
    isSuccess,
    handleSubmit,
  };
}

