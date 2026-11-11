export type TransparencyCategory = 'ESTATUTO' | 'BALANCO' | 'ATA' | 'FINANCEIRO' | 'OUTRO';

export type BoardType = 'DIRETORIA_EXECUTIVA' | 'CONSELHO_DELIBERATIVO' | 'CONSELHO_FISCAL';

export interface TransparencyDocument {
  id: string;
  title: string;
  description?: string;
  category: TransparencyCategory | string;
  year: number;
  fileUrl: string;
  fileSize?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransparencyBoardMember {
  id: string;
  name: string;
  roleTitle: string;
  boardType: BoardType | string;
  termPeriod?: string;
  photoUrl?: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransparencyDocumentPayload {
  title: string;
  description?: string;
  category: string;
  year: number;
  fileUrl: string;
  fileSize?: string;
  published?: boolean;
}

export interface UpdateTransparencyDocumentPayload {
  title?: string;
  description?: string;
  category?: string;
  year?: number;
  fileUrl?: string;
  fileSize?: string;
  published?: boolean;
}

export interface CreateTransparencyMemberPayload {
  name: string;
  roleTitle: string;
  boardType: string;
  termPeriod?: string;
  photoUrl?: string;
  displayOrder?: number;
  active?: boolean;
}

export interface UpdateTransparencyMemberPayload {
  name?: string;
  roleTitle?: string;
  boardType?: string;
  termPeriod?: string;
  photoUrl?: string;
  displayOrder?: number;
  active?: boolean;
}

