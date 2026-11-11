import { api } from '@/services/api';
import {
  TransparencyDocument,
  TransparencyBoardMember,
  CreateTransparencyDocumentPayload,
  UpdateTransparencyDocumentPayload,
  CreateTransparencyMemberPayload,
  UpdateTransparencyMemberPayload,
} from '../types/transparency.types';

export const transparencyService = {
  // Público
  getPublicDocuments: async (params?: { category?: string; year?: number }) => {
    const { data } = await api.get<TransparencyDocument[]>('/transparency/documents', { params });
    return data;
  },

  getPublicBoardMembers: async (boardType?: string) => {
    const { data } = await api.get<TransparencyBoardMember[]>('/transparency/board-members', {
      params: boardType ? { boardType } : undefined,
    });
    return data;
  },

  // Admin Documentos
  getAdminDocuments: async () => {
    const { data } = await api.get<TransparencyDocument[]>('/admin/transparency/documents');
    return data;
  },

  createDocument: async (payload: CreateTransparencyDocumentPayload) => {
    const { data } = await api.post<TransparencyDocument>('/admin/transparency/documents', payload);
    return data;
  },

  updateDocument: async (id: string, payload: UpdateTransparencyDocumentPayload) => {
    const { data } = await api.put<TransparencyDocument>(`/admin/transparency/documents/${id}`, payload);
    return data;
  },

  deleteDocument: async (id: string) => {
    await api.delete(`/admin/transparency/documents/${id}`);
  },

  // Admin Membros
  getAdminBoardMembers: async () => {
    const { data } = await api.get<TransparencyBoardMember[]>('/admin/transparency/board-members');
    return data;
  },

  createBoardMember: async (payload: CreateTransparencyMemberPayload) => {
    const { data } = await api.post<TransparencyBoardMember>('/admin/transparency/board-members', payload);
    return data;
  },

  updateBoardMember: async (id: string, payload: UpdateTransparencyMemberPayload) => {
    const { data } = await api.put<TransparencyBoardMember>(`/admin/transparency/board-members/${id}`, payload);
    return data;
  },

  deleteBoardMember: async (id: string) => {
    await api.delete(`/admin/transparency/board-members/${id}`);
  },
};

