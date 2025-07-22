// src/components/common/TextToSpeech.tsx

import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Pause, Play, Settings } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

interface TextToSpeechProps {
  text: string;
  className?: string;
  showSettings?: boolean;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ 
  text, 
  className = '', 
  showSettings = false 
}) => {
  const {
    isSupported,
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    speak,
    pause,
    resume,
    stop,
    setVoice,
  } = useTextToSpeech();

  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  
  // Store the text being spoken to restart if needed
  const currentTextRef = useRef(text);
  currentTextRef.current = text;

  if (!isSupported) {
    return null;
  }

  const handlePlayPause = () => {
    if (!isSpeaking) {
      // Start speaking
      speak(currentTextRef.current, { rate, pitch });
    } else if (isPaused) {
      // Resume if paused
      resume();
    } else {
      // Pause if speaking
      pause();
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVoiceURI = e.target.value;
    setVoice(newVoiceURI);
    
    // If currently speaking, restart with new voice
    if (isSpeaking) {
      stop();
      setTimeout(() => {
        speak(currentTextRef.current, { rate, pitch });
      }, 100);
    }
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    
    // If currently speaking, restart with new rate
    if (isSpeaking) {
      stop();
      setTimeout(() => {
        speak(currentTextRef.current, { rate: newRate, pitch });
      }, 100);
    }
  };

  const handlePitchChange = (newPitch: number) => {
    setPitch(newPitch);
    
    // If currently speaking, restart with new pitch
    if (isSpeaking) {
      stop();
      setTimeout(() => {
        speak(currentTextRef.current, { rate, pitch: newPitch });
      }, 100);
    }
  };

  // Debug info
  const getButtonLabel = () => {
    if (!isSpeaking) return 'Read Aloud';
    if (isPaused) return 'Resume';
    return 'Pause';
  };

  return (
    <div className={`text-to-speech-controls ${className}`}>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePlayPause}
          className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          title={getButtonLabel()}
        >
          {!isSpeaking ? (
            <>
              <Volume2 className="w-4 h-4" />
              <span className="text-sm">Read Aloud</span>
            </>
          ) : isPaused ? (
            <>
              <Play className="w-4 h-4" />
              <span className="text-sm">Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              <span className="text-sm">Pause</span>
            </>
          )}
        </button>

        {isSpeaking && (
          <button
            onClick={handleStop}
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
            title="Stop reading"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        )}

        {showSettings && (
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
            title="Voice settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {showVoiceSettings && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voice
            </label>
            <select
              value={selectedVoice?.voiceURI || ''}
              onChange={handleVoiceChange}
              className="w-full p-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {voices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speed: {rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #6b46c1 0%, #6b46c1 ${((rate - 0.5) / 1.5) * 100}%, #e5e7eb ${((rate - 0.5) / 1.5) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>1.5x</span>
              <span>2.0x</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pitch: {pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #6b46c1 0%, #6b46c1 ${((pitch - 0.5) / 1.5) * 100}%, #e5e7eb ${((pitch - 0.5) / 1.5) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Low</span>
              <span>Normal</span>
              <span>High</span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Changing voice, speed, or pitch will restart the reading from the beginning.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;