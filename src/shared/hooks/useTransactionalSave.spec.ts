import { renderHook, act } from '@testing-library/react';
import {
  useTransactionalSave,
  verifyUploadedUrl,
  stripBlobUrl,
  sanitizeMediaUrlList,
} from './useTransactionalSave';

describe('useTransactionalSave & Media Sanitizers', () => {
  it('executes uploadMedia strictly before saveToDb and only fires onConfirmed after both succeed', async () => {
    const callOrder: string[] = [];
    const { result } = renderHook(() => useTransactionalSave());

    await act(async () => {
      await result.current.runTransactionalSave({
        hasPendingMedia: true,
        uploadMedia: async () => {
          callOrder.push('1_upload_media');
          return 'https://cdn.pelotas.com.br/news/cover.webp';
        },
        saveToDb: async (uploadedUrl) => {
          expect(uploadedUrl).toBe('https://cdn.pelotas.com.br/news/cover.webp');
          callOrder.push('2_save_db');
          return { id: 'news-123' };
        },
        onConfirmed: (saved) => {
          expect(saved).toEqual({ id: 'news-123' });
          callOrder.push('3_confirmed_feedback');
        },
      });
    });

    expect(callOrder).toEqual(['1_upload_media', '2_save_db', '3_confirmed_feedback']);
    expect(result.current.isSaving).toBe(false);
    expect(result.current.savingStage).toBe('IDLE');
  });

  it('aborts before saveToDb and never fires onConfirmed if media upload fails', async () => {
    const saveToDb = jest.fn();
    const onConfirmed = jest.fn();
    const onError = jest.fn();
    const { result } = renderHook(() => useTransactionalSave());

    await act(async () => {
      await result.current.runTransactionalSave({
        hasPendingMedia: true,
        uploadMedia: async () => {
          throw new Error('Storage unavailable');
        },
        saveToDb,
        onConfirmed,
        onError,
      });
    });

    expect(saveToDb).not.toHaveBeenCalled();
    expect(onConfirmed).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 'UPLOADING_MEDIA');
    expect(result.current.isSaving).toBe(false);
  });

  it('never fires onConfirmed if database persistence fails after media upload', async () => {
    const onConfirmed = jest.fn();
    const onError = jest.fn();
    const { result } = renderHook(() => useTransactionalSave());

    await act(async () => {
      await result.current.runTransactionalSave({
        hasPendingMedia: true,
        uploadMedia: async () => 'https://cdn.pelotas.com.br/avatar.png',
        saveToDb: async () => {
          throw new Error('DB constraint error');
        },
        onConfirmed,
        onError,
      });
    });

    expect(onConfirmed).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 'SAVING_DB');
    expect(result.current.isSaving).toBe(false);
  });

  it('blocks blob: URLs from leaking into database payloads', () => {
    expect(stripBlobUrl('blob:http://localhost:7999/1234')).toBe('');
    expect(stripBlobUrl('https://cdn.pelotas.com.br/img.jpg')).toBe(
      'https://cdn.pelotas.com.br/img.jpg',
    );
    expect(
      sanitizeMediaUrlList([
        'blob:http://localhost:7999/temp',
        'https://cdn.pelotas.com.br/1.jpg',
        '',
        null,
      ]),
    ).toEqual(['https://cdn.pelotas.com.br/1.jpg']);
    expect(() => verifyUploadedUrl('blob:http://localhost:7999/temp')).toThrow();
    expect(() => verifyUploadedUrl('')).toThrow();
  });
});

