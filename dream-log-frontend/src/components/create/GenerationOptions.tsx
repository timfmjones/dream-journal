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
      <label className="block text-sm font-medium text-gray-700 mb-4">
        What would you like to create?
      </label>
      <div className="generation-mode-grid">
        {options.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={`p-4 rounded-xl border-2 transition-all ${
              generationMode === mode 
                ? 'border-purple-500 bg-purple-50 text-purple-700' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <Icon className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium block">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenerationOptions;