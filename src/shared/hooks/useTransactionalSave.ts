'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { TRANSACTIONAL_SAVE_TEXTS } from './transactional-save.constants';

export type TransactionalSaveStage = 'IDLE' | 'UPLOADING_MEDIA' | 'SAVING_DB';

export interface TransactionalSaveLabels {
  uploadingMedia?: string;
  savingDb?: string;
}

export interface RunTransactionalSaveOptions<TMedia = void, TResult = unknown> {
  hasPendingMedia?: boolean;
  uploadMedia?: () => Promise<TMedia>;
  saveToDb: (uploadedMedia: TMedia) => Promise<TResult>;
  onConfirmed?: (result: TResult) => void | Promise<void>;
  onError?: (error: unknown, failedStage: Exclude<TransactionalSaveStage, 'IDLE'>) => void;
}

export function isBlobUrl(url?: string | null): boolean {
  return typeof url === 'string' && url.trim().startsWith('blob:');
}

export function stripBlobUrl(url?: string | null, fallback = ''): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith('blob:')) return fallback;
  return trimmed;
}

export function sanitizeMediaUrlList(urls?: Array<string | null | undefined>): string[] {
  if (!Array.isArray(urls)) return [];
  return urls
    .map((u) => stripBlobUrl(u, ''))
    .filter((u) => u.length > 0);
}

export function verifyUploadedUrl(
  url?: string | null,
  errorMessage: string = TRANSACTIONAL_SAVE_TEXTS.ERROR_INVALID_UPLOAD_URL,
): string {
  const clean = stripBlobUrl(url, '');
  if (!clean) {
    throw new Error(errorMessage);
  }
  return clean;
}

/**
 * Padrão Arquitetural Global de Persistência Transacional (Media-First + Post-Commit Feedback):
 * 1. Bloqueia cliques duplicados concorrentes via ref síncrona (`inFlightRef`).
 * 2. Se houver mídia pendente, executa e aguarda a confirmação do upload ANTES de gravar no banco.
 * 3. Executa e aguarda o commit HTTP 2xx no banco de dados.
 * 4. Somente após confirmação de ambos (upload + banco) dispara `onConfirmed` (toast de sucesso, fechamento de modal, etc.).
 */
export function useTransactionalSave(customLabels?: TransactionalSaveLabels) {
  const [savingStage, setSavingStage] = useState<TransactionalSaveStage>('IDLE');
  const inFlightRef = useRef(false);

  const isSaving = savingStage !== 'IDLE';

  const savingLabel = useMemo(() => {
    if (savingStage === 'UPLOADING_MEDIA') {
      return customLabels?.uploadingMedia || TRANSACTIONAL_SAVE_TEXTS.STAGE_UPLOADING_MEDIA;
    }
    if (savingStage === 'SAVING_DB') {
      return customLabels?.savingDb || TRANSACTIONAL_SAVE_TEXTS.STAGE_SAVING_DB;
    }
    return '';
  }, [savingStage, customLabels?.uploadingMedia, customLabels?.savingDb]);

  const runTransactionalSave = useCallback(
    async <TMedia = void, TResult = unknown>(
      options: RunTransactionalSaveOptions<TMedia, TResult>,
    ): Promise<TResult | undefined> => {
      if (inFlightRef.current) {
        return undefined;
      }

      inFlightRef.current = true;
      let currentStage: Exclude<TransactionalSaveStage, 'IDLE'> = 'UPLOADING_MEDIA';

      try {
        let uploadedMedia = undefined as TMedia;

        if (options.uploadMedia && (options.hasPendingMedia ?? true)) {
          currentStage = 'UPLOADING_MEDIA';
          setSavingStage('UPLOADING_MEDIA');
          uploadedMedia = await options.uploadMedia();
        }

        currentStage = 'SAVING_DB';
        setSavingStage('SAVING_DB');
        const result = await options.saveToDb(uploadedMedia);

        if (options.onConfirmed) {
          await options.onConfirmed(result);
        }

        return result;
      } catch (error) {
        if (options.onError) {
          options.onError(error, currentStage);
        } else {
          throw error;
        }
        return undefined;
      } finally {
        inFlightRef.current = false;
        setSavingStage('IDLE');
      }
    },
    [],
  );

  return {
    isSaving,
    savingStage,
    savingLabel,
    inFlightRef,
    runTransactionalSave,
  };
}

