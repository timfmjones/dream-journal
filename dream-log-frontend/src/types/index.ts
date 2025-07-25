// src/types/index.ts

export interface Dream {
  id: string;
  originalDream: string;
  story?: string;
  analysis?: string;
  title: string;
  tone: string;
  length: string;
  date: string;
  images?: DreamImage[];
  audioBlob?: Blob;
  inputMode: 'text' | 'voice';
  userId?: string;
  userEmail?: string;
  // New fields from PostgreSQL backend
  mood?: string;
  lucidity?: number;
  tags?: string[];
  isFavorite?: boolean;  // NEW FIELD
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    analyses: number;
  };
}

export interface DreamImage {
  url: string;
  scene: string;
  description: string;
  prompt?: string; // New field from backend
}

export type StoryTone = 'whimsical' | 'mystical' | 'adventurous' | 'gentle' | 'mysterious' | 'comedy';
export type StoryLength = 'short' | 'medium' | 'long';
export type GenerationMode = 'story' | 'analysis' | 'none';
export type ViewType = 'create' | 'journal' | 'settings';

export interface ToneOption {
  key: StoryTone;
  label: string;
}

export interface LengthOption {
  key: StoryLength;
  label: string;
}

// New types for pagination and filtering
export interface DreamFilters {
  search?: string;
  tags?: string[];
  mood?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: 'createdAt' | 'date' | 'title';
  order?: 'asc' | 'desc';
  favoritesOnly?: boolean;  // NEW FIELD
}

export interface DreamListResponse {
  dreams: Dream[];
  total: number;
  hasMore: boolean;
}

export interface UserStats {
  totalDreams: number;
  dreamsThisMonth: number;
  favoriteDreams: number;  // NEW FIELD
  mostCommonTags: Array<{ tag: string; count: number }>;
  moodDistribution: Array<{ mood: string; count: number }>;
  averageLucidity: number | null;
}