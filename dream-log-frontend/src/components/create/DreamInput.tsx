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
      {/* Input Mode Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => {
            onInputModeChange('text');
            onClearAudio();
          }}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'text' 
              ? 'bg-white text-purple-700 shadow-sm' 
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          Type Dream
        </button>
        <button
          onClick={() => onInputModeChange('voice')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'voice' 
              ? 'bg-white text-purple-700 shadow-sm' 
              : 'text-gray-600 hover:text-purple-600'
          }`}
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