export interface StadiumGalleryImage {
  url: string;
  caption: string;
  order: number;
}

export interface StadiumFact {
  year: string;
  title: string;
  description: string;
}

export interface StadiumData {
  id: number;
  title: string;
  subtitle: string;
  coverImageUrl: string;
  inaugurationDate: string;
  capacity: string;
  pitchDimensions: string;
  address: string;
  mapsDirectUrl?: string;
  mapsEmbedUrl?: string;
  contentHtml: string;
  gallery: StadiumGalleryImage[];
  facts: StadiumFact[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateStadiumInput {
  title: string;
  subtitle?: string;
  coverImageUrl?: string;
  inaugurationDate?: string;
  capacity?: string;
  pitchDimensions?: string;
  address?: string;
  mapsDirectUrl?: string;
  mapsEmbedUrl?: string;
  contentHtml: string;
  gallery: StadiumGalleryImage[];
  facts: StadiumFact[];
  isActive?: boolean;
}

