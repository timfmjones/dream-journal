// src/components/create/VoiceInput.tsx

import React from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface VoiceInputProps {
  isRecording: boolean;
  audioBlob: Blob | null;
  isPlaying: boolean;
  transcribedText: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayAudio: () => void;
  onStopAudio: () => void;
  onClearAudio: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  isRecording,
  audioBlob,
  isPlaying,
  transcribedText,
  onStartRecording,
  onStopRecording,
  onPlayAudio,
  onStopAudio,
  onClearAudio
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Record your dream
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center space-y-4 bg-gray-50">
        {!audioBlob ? (
          <div className="space-y-4">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all ${
              isRecording ? 'bg-red-100 animate-pulse shadow-lg' : 'bg-purple-100'
            }`}>
              <Mic className={`w-12 h-12 ${isRecording ? 'text-red-600' : 'text-purple-600'}`} />
            </div>
            
            {isRecording ? (
              <div className="space-y-3">
                <p className="text-red-600 font-medium animate-pulse">Recording...</p>
                <button
                  onClick={onStopRecording}
                  className="bg-red-600 text-white px-6 py-2.5 rounded-xl hover:bg-red-700 flex items-center space-x-2 mx-auto transition-all shadow-md"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop Recording</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600">Tap to record your dream</p>
                <button
                  onClick={onStartRecording}
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 flex items-center space-x-2 mx-auto transition-all shadow-md"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Recording</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-24 h-24 rounded-full bg-green-100 mx-auto flex items-center justify-center">
              <Mic className="w-12 h-12 text-green-600" />
            </div>
            
            <div className="space-y-3">
              <p className="text-green-600 font-medium">Recording saved!</p>
              {transcribedText && (
                <p className="text-sm text-gray-600 italic px-4">"{transcribedText}"</p>
              )}
              <div className="button-group justify-center">
                <button
                  onClick={isPlaying ? onStopAudio : onPlayAudio}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center space-x-2 transition-all shadow-md"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={onClearAudio}
                  className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-all shadow-md"
                >
                  Re-record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;