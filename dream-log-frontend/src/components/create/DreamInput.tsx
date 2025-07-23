// src/components/create/DreamInput.tsx

import React from 'react';
import TextInput from './TextInput';
import VoiceInput from './VoiceInput';

interface DreamInputProps {
  inputMode: 'text' | 'voice';
  currentDream: string;
  isRecording: boolean;
  audioBlob: Blob | null;
  isPlaying: boolean;
  transcribedText: string;
  onInputModeChange: (mode: 'text' | 'voice') => void;
  onDreamChange: (dream: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayAudio: () => void;
  onStopAudio: () => void;
  onClearAudio: () => void;
}

const DreamInput: React.FC<DreamInputProps> = ({
  inputMode,
  currentDream,
  isRecording,
  audioBlob,
  isPlaying,
  transcribedText,
  onInputModeChange,
  onDreamChange,
  onStartRecording,
  onStopRecording,
  onPlayAudio,
  onStopAudio,
  onClearAudio
}) => {
  return (
    <div className="form-section">
      <div className="toggle-group">
        <button
          onClick={() => {
            onInputModeChange('text');
            onClearAudio();
          }}
          className={`toggle-button ${inputMode === 'text' ? 'active' : ''}`}
        >
          Type Dream
        </button>
        <button
          onClick={() => onInputModeChange('voice')}
          className={`toggle-button ${inputMode === 'voice' ? 'active' : ''}`}
        >
          Voice Memo
        </button>
      </div>

      {inputMode === 'text' ? (
        <TextInput value={currentDream} onChange={onDreamChange} />
      ) : (
        <VoiceInput
          isRecording={isRecording}
          audioBlob={audioBlob}
          isPlaying={isPlaying}
          transcribedText={transcribedText}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          onPlayAudio={onPlayAudio}
          onStopAudio={onStopAudio}
          onClearAudio={onClearAudio}
        />
      )}
    </div>
  );
};

export default DreamInput;