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
  slug?: string;
  hasLiveCoverage?: boolean;
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
  currentPeriod?: string;
  currentMinute?: string;
  timerStartedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type MatchEventType =
  | 'GOAL_PELOTAS'
  | 'GOAL_OPPONENT'
  | 'YELLOW_CARD'
  | 'RED_CARD'
  | 'SUBSTITUTION'
  | 'DANGEROUS_ATTACK'
  | 'PENALTY'
  | 'VAR'
  | 'GENERAL_TEXT'
  | 'START_FIRST_HALF'
  | 'END_FIRST_HALF'
  | 'START_SECOND_HALF'
  | 'END_SECOND_HALF'
  | 'START_EXTRA_TIME'
  | 'END_MATCH';

export type MatchPeriod =
  | 'PRE_MATCH'
  | 'FIRST_HALF'
  | 'HALF_TIME'
  | 'SECOND_HALF'
  | 'EXTRA_TIME_1'
  | 'EXTRA_TIME_2'
  | 'PENALTIES'
  | 'FINISHED';

export type MatchEventTeam = 'PELOTAS' | 'OPPONENT' | 'NEUTRAL';

export interface MatchEvent {
  id: string;
  matchId: string;
  minute: number;
  minuteExtra?: number | null;
  formattedMinute: string;
  period: MatchPeriod;
  eventType: MatchEventType;
  team: MatchEventTeam;
  playerName?: string | null;
  playerOutName?: string | null;
  title: string;
  description?: string | null;
  scorePelotasMoment?: number | null;
  scoreOpponentMoment?: number | null;
  createdAt: string;
}

export interface MatchLiveDetails {
  match: Match;
  events: MatchEvent[];
  currentPeriod: string;
  currentMinute: string;
  timerStartedAt?: string | null;
  isTimerRunning: boolean;
}

export interface MatchEventFormData {
  minute: number;
  minuteExtra?: number;
  period?: MatchPeriod;
  eventType: MatchEventType;
  team?: MatchEventTeam;
  playerName?: string;
  playerOutName?: string;
  title?: string;
  description?: string;
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
  slug?: string;
  hasLiveCoverage?: boolean;
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

