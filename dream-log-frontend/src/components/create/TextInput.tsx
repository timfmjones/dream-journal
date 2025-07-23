// src/components/create/TextInput.tsx

import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="form-label">Tell me about your dream...</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="I was flying through a forest of giant mushrooms when I met a talking rabbit who gave me a golden key..."
        className="textarea-input"
      />
    </div>
  );
};

export default TextInput;