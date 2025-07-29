// src/utils/constants.ts

import type { ToneOption, LengthOption } from '../types';

export const TONE_OPTIONS: ToneOption[] = [
  { key: 'whimsical', label: 'Whimsical & Playful' },
  { key: 'mystical', label: 'Mystical & Magical' },
  { key: 'adventurous', label: 'Adventurous & Bold' },
  { key: 'gentle', label: 'Gentle & Soothing' },
  { key: 'mysterious', label: 'Dark & Mysterious' },
  { key: 'comedy', label: 'Funny & Comedic' }
];

export const LENGTH_OPTIONS: LengthOption[] = [
  { key: 'short', label: 'Short' },
  { key: 'medium', label: 'Medium' },
  { key: 'long', label: 'Long' }
];

// Dynamic API URL based on environment
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

// Feature flags
export const FEATURES = {
  VOICE_RECORDING: import.meta.env.VITE_ENABLE_VOICE_RECORDING !== 'false',
  IMAGE_GENERATION: import.meta.env.VITE_ENABLE_IMAGE_GENERATION !== 'false',
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};

// App metadata
export const APP_CONFIG = {
  name: 'DreamSprout',
  version: '2.1.0',
  support_email: 'support@dreamsprout.app',
};