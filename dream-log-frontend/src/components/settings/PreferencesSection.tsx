// src/components/settings/PreferencesSection.tsx

import React from 'react';
import { TONE_OPTIONS, LENGTH_OPTIONS } from '../../utils/constants';
import type { StoryTone, StoryLength } from '../../types';

interface PreferencesSectionProps {
  storyTone: StoryTone;
  storyLength: StoryLength;
  onToneChange: (tone: StoryTone) => void;
  onLengthChange: (length: StoryLength) => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  storyTone,
  storyLength,
  onToneChange,
  onLengthChange
}) => {
  return (
    <>
      <div className="form-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Story Tone
            </label>
            <select
              value={storyTone}
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
              Default Story Length
            </label>
            <select
              value={storyLength}
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

      <div className="form-section">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Story Length: {LENGTH_OPTIONS.find(o => o.key === storyLength)?.label}
        </label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={storyLength === 'short' ? 0 : storyLength === 'medium' ? 1 : 2}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              onLengthChange(value === 0 ? 'short' : value === 1 ? 'medium' : 'long');
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #6b46c1 0%, #6b46c1 ${((storyLength === 'short' ? 0 : storyLength === 'medium' ? 1 : 2) / 2) * 100}%, #e5e7eb ${((storyLength === 'short' ? 0 : storyLength === 'medium' ? 1 : 2) / 2) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Short</span>
            <span>Medium</span>
            <span>Long</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreferencesSection;