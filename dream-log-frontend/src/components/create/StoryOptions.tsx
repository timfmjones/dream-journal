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
    <div className="form-section">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="form-label">Story Tone</label>
          <select
            value={tone}
            onChange={(e) => onToneChange(e.target.value as StoryTone)}
            className="select-input"
          >
            {TONE_OPTIONS.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Story Length</label>
          <select
            value={length}
            onChange={(e) => onLengthChange(e.target.value as StoryLength)}
            className="select-input"
          >
            {LENGTH_OPTIONS.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="image-toggle-container">
        <div className="image-toggle-label">
          <Image style={{ width: '16px', height: '16px' }} />
          <div>
            <div style={{ fontWeight: '500' }}>Generate Illustrations</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
              Create AI-generated images for your fairy tale (3 scenes)
            </div>
          </div>
        </div>
        <div 
          className={`toggle-switch ${generateImages ? 'active' : ''}`}
          onClick={() => onGenerateImagesChange(!generateImages)}
        >
          <div className="toggle-switch-knob" />
        </div>
      </div>
      {!generateImages && (
        <p style={{ fontSize: '12px', color: '#7c3aed', marginTop: '8px', fontStyle: 'italic' }}>
          Your fairy tale will be created without illustrations to save time
        </p>
      )}
    </div>
  );
};

export default StoryOptions;