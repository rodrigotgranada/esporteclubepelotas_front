export type SymbolCategory = 'MASCOT' | 'SHIELD' | 'FLAG' | 'COLORS';
export type SymbolOverviewCategory = 'MASCOT' | 'SHIELD' | 'FLAG_COLORS';

export interface ClubSymbol {
  id: string;
  category: SymbolCategory;
  name: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  galleryUrls: string[];
  yearStart?: number | null;
  yearEnd?: number | null;
  isOfficial: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClubSymbolFormData {
  category: SymbolCategory;
  name?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  galleryUrls?: string[];
  yearStart?: number | null;
  yearEnd?: number | null;
  isOfficial: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface ClubSymbolOverview {
  category: SymbolOverviewCategory;
  title: string;
  description: string;
  updatedAt?: string;
}

export interface ClubSymbolOverviewFormData {
  title: string;
  description: string;
}
