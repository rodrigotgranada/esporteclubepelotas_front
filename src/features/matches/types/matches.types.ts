export type ChampionshipCategory =
  | 'PROFESSIONAL_MEN'
  | 'PROFESSIONAL_WOMEN'
  | 'YOUTH_U20'
  | 'YOUTH_U17'
  | 'YOUTH_U15';

export type HomeAway = 'HOME' | 'AWAY';

export type MatchStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'POSTPONED'
  | 'CANCELLED';

export interface RegulationItem {
  title: string;
  url: string;
}

export interface Championship {
  id: string;
  name: string;
  seasonYear: number;
  category: ChampionshipCategory;
  logoUrl?: string | null;
  tableUrl?: string | null;
  regulations?: RegulationItem[];
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Match {
  id: string;
  championshipId: string;
  championshipName?: string;
  seasonYear?: number;
  opponentName: string;
  opponentLogoUrl?: string | null;
  homeAway: HomeAway;
  stadiumName: string;
  city?: string | null;
  matchDate: string; // ISO string UTC
  roundName: string;
  status: MatchStatus;
  pelotasScore?: number | null;
  opponentScore?: number | null;
  penaltyPelotasScore?: number | null;
  penaltyOpponentScore?: number | null;
  ticketUrl?: string | null;
  broadcastChannel?: string | null;
  transmissionUrl?: string | null;
  notes?: string | null;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChampionshipFormData {
  name: string;
  seasonYear: number;
  category: ChampionshipCategory;
  logoUrl?: string;
  tableUrl?: string;
  regulations?: RegulationItem[];
  isActive: boolean;
  displayOrder: number;
}

export interface MatchFormData {
  championshipId: string;
  opponentName: string;
  opponentLogoUrl?: string;
  homeAway: HomeAway;
  stadiumName: string;
  city?: string;
  matchDate: string;
  roundName: string;
  status: MatchStatus;
  pelotasScore?: number | null;
  opponentScore?: number | null;
  penaltyPelotasScore?: number | null;
  penaltyOpponentScore?: number | null;
  ticketUrl?: string;
  broadcastChannel?: string;
  transmissionUrl?: string;
  notes?: string;
  displayOrder: number;
}
