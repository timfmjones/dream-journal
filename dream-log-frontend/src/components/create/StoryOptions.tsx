// src/components/create/StoryOptions.tsx

import React from 'react';
import { TONE_OPTIONS, LENGTH_OPTIONS } from '../../utils/constants';
import type { StoryTone, StoryLength } from '../../types';

interface StoryOptionsProps {
  tone: StoryTone;
  length: StoryLength;
  onToneChange: (tone: StoryTone) => void;
  onLengthChange: (length: StoryLength) => void;
}

const StoryOptions: React.FC<StoryOptionsProps> = ({ tone, length, onToneChange, onLengthChange }) => {
  return (
    <div className="form-section">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Story Tone
          </label>
          <select
            value={tone}
            onChange={(e) => onToneChange(e.target.value as StoryTone)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            {TONE_OPTIONS.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Story Length
          </label>
          <select
            value={length}
            onChange={(e) => onLengthChange(e.target.value as StoryLength)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            {LENGTH_OPTIONS.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StoryOptions;