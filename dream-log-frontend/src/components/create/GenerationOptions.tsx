// src/components/create/GenerationOptions.tsx

import React from 'react';
import { Wand2, Brain, Save } from 'lucide-react';
import type { GenerationMode } from '../../types';

interface GenerationOptionsProps {
  generationMode: GenerationMode;
  onChange: (mode: GenerationMode) => void;
}

const GenerationOptions: React.FC<GenerationOptionsProps> = ({ generationMode, onChange }) => {
  const options = [
    { mode: 'story' as GenerationMode, icon: Wand2, label: 'Fairy Tale' },
    { mode: 'analysis' as GenerationMode, icon: Brain, label: 'Analysis' },
    { mode: 'none' as GenerationMode, icon: Save, label: 'Just Save' }
  ];

  return (
    <div className="form-section">
      <label className="form-label">What would you like to create?</label>
      <div className="generation-grid">
        {options.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={`generation-option ${generationMode === mode ? 'active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenerationOptions;