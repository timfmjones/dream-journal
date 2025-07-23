// src/components/create/StoryOptions.tsx

import React from 'react';
import { Image } from 'lucide-react';
import { TONE_OPTIONS, LENGTH_OPTIONS } from '../../utils/constants';
import type { StoryTone, StoryLength } from '../../types';

interface StoryOptionsProps {
  tone: StoryTone;
  length: StoryLength;
  generateImages: boolean;
  onToneChange: (tone: StoryTone) => void;
  onLengthChange: (length: StoryLength) => void;
  onGenerateImagesChange: (generate: boolean) => void;
}

const StoryOptions: React.FC<StoryOptionsProps> = ({ 
  tone, 
  length, 
  generateImages,
  onToneChange, 
  onLengthChange,
  onGenerateImagesChange 
}) => {
  return (
    <div className="form-section space-y-6">
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

      {/* Image Generation Toggle */}
      <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image className="w-5 h-5 text-purple-600" />
            <div>
              <label className="text-sm font-medium text-gray-700">
                Generate Illustrations
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                Create AI-generated images for your fairy tale (3 scenes)
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={generateImages}
              onChange={(e) => onGenerateImagesChange(e.target.checked)}
              className="sr-only"
            />
            <div 
              className="w-11 h-6 rounded-full relative transition-colors duration-200"
              style={{
                backgroundColor: generateImages ? '#6b46c1' : '#e5e7eb'
              }}
            >
              <div 
                className="absolute bg-white rounded-full h-5 w-5 transition-transform duration-200"
                style={{
                  top: '2px',
                  left: generateImages ? '24px' : '2px',
                  transform: `translateX(0)`
                }}
              />
            </div>
          </label>
        </div>
        {!generateImages && (
          <p className="text-xs text-purple-600 mt-2 italic">
            Your fairy tale will be created without illustrations to save time
          </p>
        )}
      </div>
    </div>
  );
};

export default StoryOptions;