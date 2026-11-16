export type GlobalSearchResultType =
  | 'NEWS'
  | 'ATHLETE'
  | 'IDOL'
  | 'MATCH'
  | 'TRANSPARENCY';

export interface GlobalSearchItem {
  id: string;
  slug?: string;
  type: GlobalSearchResultType;
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl?: string | null;
  url: string;
  externalUrl?: string | null;
}

export interface GlobalSearchResponse {
  query: string;
  totalResults: number;
  news: GlobalSearchItem[];
  athletes: GlobalSearchItem[];
  idols: GlobalSearchItem[];
  matches: GlobalSearchItem[];
  transparency: GlobalSearchItem[];
}

export type GlobalSearchGroupKey =
  | 'news'
  | 'athletes'
  | 'idols'
  | 'matches'
  | 'transparency';

