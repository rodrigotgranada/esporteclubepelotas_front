export interface ClubAnthem {
  id: string;
  title: string;
  subtitle?: string | null;
  lyrics: string;
  authorLyrics?: string | null;
  authorMusic?: string | null;
  compositionYear?: number | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
  coverImageUrl?: string | null;
  historyTitle?: string | null;
  historyText?: string | null;
  isActive: boolean;
  isOfficial: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClubAnthemFormData {
  title: string;
  subtitle?: string;
  lyrics: string;
  authorLyrics?: string;
  authorMusic?: string;
  compositionYear?: number | null;
  audioUrl?: string;
  videoUrl?: string;
  coverImageUrl?: string;
  historyTitle?: string;
  historyText?: string;
  isActive: boolean;
  isOfficial: boolean;
  displayOrder: number;
}

