'use client';

import { api } from '@/services/api';
import { AxiosProgressEvent } from 'axios';

export interface MediaUploadOptions {
  /**
   * Endpoint de destino da API.
   * Default: '/admin/media/upload'
   */
  endpoint?: string;
  /**
   * Pasta lógica ou propósito do upload (ex: 'stadium', 'news', 'settings', 'athletes', 'idols')
   */
  folder?: string;
  /**
   * Prefixo do nome do arquivo quando gerado a partir de Blob (ex: 'cover', 'logo', 'gallery')
   */
  prefix?: string;
  /**
   * Nome de campo alternativo / legado a ser enviado junto no FormData (ex: 'logo', 'cover', 'photo', 'image')
   */
  legacyFieldName?: string;
  /**
   * Identificador da entidade pai (ex: articleId, idolId)
   */
  folderId?: string;
  /**
   * Callback opcional para acompanhar o progresso percentual (0 a 100)
   */
  onProgress?: (progressPercent: number) => void;
}

export interface MediaUploadResult {
  url: string;
}

/**
 * Converte um Blob ou File para um File válido com nome semântico e mimetype seguro.
 */
function normalizeUploadFile(fileOrBlob: File | Blob, prefix = 'media'): File {
  if (fileOrBlob instanceof File && fileOrBlob.name) {
    return fileOrBlob;
  }
  const ext = fileOrBlob.type.includes('png')
    ? 'png'
    : fileOrBlob.type.includes('jpeg') || fileOrBlob.type.includes('jpg')
    ? 'jpg'
    : fileOrBlob.type.includes('webp')
    ? 'webp'
    : fileOrBlob.type.includes('svg')
    ? 'svg'
    : 'png';

  const fileName = `${prefix}-${Date.now()}.${ext}`;
  return new File([fileOrBlob], fileName, {
    type: fileOrBlob.type || 'image/png',
  });
}

/**
 * Serviço Unificado de Upload de Mídia do Portal Esporte Clube Pelotas.
 *
 * Garante contrato canônico estrito enviando SEMPRE a chave 'file' (com fallback
 * opcional para a chave legada), valida a resposta contra URLs temporárias blob:
 * e unifica o tratamento de erros e progresso de requisição multipart.
 */
export async function uploadMedia(
  fileOrBlob: File | Blob,
  options: MediaUploadOptions = {}
): Promise<MediaUploadResult> {
  const uploadFile = normalizeUploadFile(fileOrBlob, options.prefix);
  const formData = new FormData();

  // Contrato canônico obrigatório
  formData.append('file', uploadFile);

  // Alias / chave legada se especificada
  if (options.legacyFieldName && options.legacyFieldName !== 'file') {
    formData.append(options.legacyFieldName, uploadFile);
  }

  // Metadados adicionais
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  if (options.folderId) {
    formData.append('folderId', options.folderId);
  }

  const endpoint = options.endpoint || '/admin/media/upload';

  const response = await api.post<Record<string, unknown>>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (options.onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        options.onProgress(percent);
      }
    },
  });

  const data = response.data;
  let returnedUrl = '';

  if (typeof data === 'string') {
    returnedUrl = data;
  } else if (data && typeof data === 'object') {
    returnedUrl = (data.url as string) || (data.publicUrl as string) || (data.logoUrl as string) || '';
  }

  if (!returnedUrl) {
    throw new Error('O servidor de armazenamento não retornou uma URL válida para a mídia.');
  }

  if (returnedUrl.startsWith('blob:')) {
    throw new Error('Tentativa de persistência com URL temporária blob: bloqueada pelo serviço de mídia.');
  }

  return { url: returnedUrl };
}

/**
 * Serviço Unificado para Upload de Múltiplos Arquivos (Galerias).
 */
export async function uploadMultipleMedia(
  files: (File | Blob)[],
  options: MediaUploadOptions = {}
): Promise<string[]> {
  const formData = new FormData();

  files.forEach((item, index) => {
    const file = normalizeUploadFile(item, `${options.prefix || 'gallery'}-${index + 1}`);
    formData.append('files', file);
    formData.append('file', file);
    if (options.legacyFieldName && options.legacyFieldName !== 'files' && options.legacyFieldName !== 'file') {
      formData.append(options.legacyFieldName, file);
    }
  });

  if (options.folder) {
    formData.append('folder', options.folder);
  }
  if (options.folderId) {
    formData.append('folderId', options.folderId);
  }

  const endpoint = options.endpoint || '/admin/media/upload-gallery';

  const response = await api.post<Record<string, unknown>>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (options.onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        options.onProgress(percent);
      }
    },
  });

  const data = response.data;
  let returnedUrls: string[] = [];

  if (Array.isArray(data)) {
    returnedUrls = data as string[];
  } else if (data && typeof data === 'object') {
    returnedUrls = ((data.urls as string[]) || (data.gallery as string[]) || []) as string[];
  }

  return returnedUrls.filter((url) => typeof url === 'string' && !url.startsWith('blob:'));
}

/**
 * Upload de arquivo binário genérico (ex: planilhas CSV, documentos PDF)
 * respeitando o contrato canônico multipart ('file').
 */
export async function uploadMultipartFile<T = unknown>(
  file: File,
  endpoint: string,
  onProgress?: (percent: number) => void
): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<T>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data;
}
