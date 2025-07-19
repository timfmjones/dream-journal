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

export const API_BASE_URL = 'http://localhost:3001/api';