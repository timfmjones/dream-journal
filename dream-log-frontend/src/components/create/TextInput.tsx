// src/components/create/TextInput.tsx

import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tell me about your dream...
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="I was flying through a forest of giant mushrooms when I met a talking rabbit who gave me a golden key..."
        className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
      />
    </div>
  );
};

export default TextInput;