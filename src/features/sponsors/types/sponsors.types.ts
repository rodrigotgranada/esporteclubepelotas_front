export type SponsorStatus = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'INACTIVE';

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  clicksCount: number;
  status: SponsorStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSponsorPayload {
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
}

export interface UpdateSponsorPayload {
  name?: string;
  logoUrl?: string;
  websiteUrl?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
}

export interface GetSponsorsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isFeatured?: boolean;
}

export interface GetSponsorsResponse {
  data: Sponsor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SponsorReorderItem {
  id: string;
  displayOrder: number;
}
