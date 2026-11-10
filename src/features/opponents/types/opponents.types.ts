export interface OpponentClub {
  id: string;
  name: string;
  shortName?: string | null;
  badgeUrl?: string | null;
  city?: string | null;
  stadiumName?: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OpponentClubFormData {
  name: string;
  shortName?: string;
  badgeUrl?: string;
  city?: string;
  stadiumName?: string;
  isActive: boolean;
  displayOrder: number;
}

