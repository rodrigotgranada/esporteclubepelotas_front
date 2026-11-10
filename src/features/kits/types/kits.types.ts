export type KitType = 'HOME' | 'AWAY' | 'THIRD' | 'GOALKEEPER' | 'SPECIAL';

export interface ClubKit {
  id: string;
  championshipId?: string | null;
  name: string;
  kitType: KitType;
  competition: string;
  seasonYear: number;
  imageUrl: string;
  galleryUrls: string[];
  manufacturer?: string | null;
  sponsor?: string | null;
  description?: string | null;
  isCurrent: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClubKitCompetitionItem {
  competition: string;
  seasonYear: number;
  label: string;
}

export interface ClubKitFormData {
  championshipId?: string | null;
  name: string;
  kitType: KitType;
  competition: string;
  seasonYear: number;
  imageUrl: string;
  galleryUrls?: string[];
  manufacturer?: string;
  sponsor?: string;
  description?: string;
  isCurrent: boolean;
  isActive: boolean;
  displayOrder: number;
}

