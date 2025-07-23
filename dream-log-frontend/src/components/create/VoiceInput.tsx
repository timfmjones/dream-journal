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
    <div>
      <label className="form-label">Record your dream</label>
      
      <div className="voice-recording-container">
        {!audioBlob ? (
          <div>
            <div className={`voice-recording-icon ${isRecording ? 'recording' : ''}`}>
              <Mic style={{ width: '32px', height: '32px', color: isRecording ? '#ef4444' : '#7c3aed' }} />
            </div>
            
            {isRecording ? (
              <div>
                <p style={{ color: '#ef4444', fontWeight: '600', marginBottom: '16px' }}>Recording...</p>
                <button
                  onClick={onStopRecording}
                  className="primary-button"
                  style={{ background: '#ef4444' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                >
                  <Square style={{ width: '16px', height: '16px' }} />
                  Stop Recording
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: '#666', marginBottom: '16px' }}>Tap to record your dream</p>
                <button
                  onClick={onStartRecording}
                  className="primary-button"
                >
                  <Mic style={{ width: '16px', height: '16px' }} />
                  Start Recording
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="voice-recording-icon" style={{ background: '#dcfce7' }}>
              <Mic style={{ width: '32px', height: '32px', color: '#16a34a' }} />
            </div>
            
            <div>
              <p style={{ color: '#16a34a', fontWeight: '600', marginBottom: '8px' }}>Recording saved!</p>
              {transcribedText && (
                <p style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  fontStyle: 'italic', 
                  marginBottom: '16px',
                  padding: '0 20px'
                }}>
                  "{transcribedText}"
                </p>
              )}
              <div className="button-group">
                <button
                  onClick={isPlaying ? onStopAudio : onPlayAudio}
                  className="nav-button"
                  style={{ background: '#3b82f6', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                >
                  {isPlaying ? <Pause style={{ width: '16px', height: '16px' }} /> : <Play style={{ width: '16px', height: '16px' }} />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={onClearAudio}
                  className="nav-button"
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