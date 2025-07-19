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
}

export interface DreamImage {
  url: string;
  scene: string;
  description: string;
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