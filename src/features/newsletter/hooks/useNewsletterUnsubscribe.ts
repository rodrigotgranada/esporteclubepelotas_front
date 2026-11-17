'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { newsletterService } from '../services/newsletter.service';
import { NEWSLETTER_TEXTS } from '../constants/newsletter.constants';

export type UnsubscribeStatus = 'idle' | 'loading' | 'success' | 'error';

export function useNewsletterUnsubscribe() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = (searchParams.get('token') || '').trim();

  const [status, setStatus] = useState<UnsubscribeStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleConfirmUnsubscribe = useCallback(async () => {
    if (!token || status === 'loading') return;
    try {
      setStatus('loading');
      setErrorMessage('');
      await newsletterService.unsubscribe(token);
      setStatus('success');
      toast.success(NEWSLETTER_TEXTS.UNSUBSCRIBE.SUCCESS_TITLE);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        NEWSLETTER_TEXTS.UNSUBSCRIBE.ERROR_GENERIC;
      setErrorMessage(msg);
      setStatus('error');
      toast.error(msg);
    }
  }, [token, status]);

  const handleGoHome = useCallback(() => {
    router.push('/');
  }, [router]);

  return {
    hasToken: Boolean(token),
    status,
    errorMessage,
    handleConfirmUnsubscribe,
    handleGoHome,
  };
}

