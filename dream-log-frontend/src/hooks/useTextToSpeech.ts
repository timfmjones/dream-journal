// src/hooks/useTextToSpeech.ts

import { useState, useRef, useCallback } from 'react';
import { api } from '../services/api';

interface UseTextToSpeechOptions {
  voice?: string;
  speed?: number;
}

export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // OpenAI TTS voices with descriptions
  const voices = [
    { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
    { id: 'echo', name: 'Echo', description: 'Warm and conversational' },
    { id: 'fable', name: 'Fable', description: 'Expressive and dynamic' },
    { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
    { id: 'nova', name: 'Nova', description: 'Friendly and upbeat' },
    { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle' }
  ];

  const [selectedVoice, setSelectedVoice] = useState(voices[0]);

  const speak = useCallback(async (text: string, options?: UseTextToSpeechOptions) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Clean up previous audio URL
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      // Fetch audio from OpenAI
      const audioBlob = await api.textToSpeech(
        text, 
        options?.voice || selectedVoice.id,
        options?.speed || 1.0
      );
      
      // Create audio URL and element
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      // Set up event handlers
      audio.onplay = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      
      audio.onpause = () => {
        setIsPaused(true);
      };
      
      audio.onended = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        // Clean up
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setError('Failed to play audio');
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      // Start playback
      await audio.play();
      
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
      setIsSpeaking(false);
      setIsPaused(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVoice.id]);

  const pause = useCallback(() => {
    if (audioRef.current && isSpeaking && !isPaused) {
      audioRef.current.pause();
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (audioRef.current && isSpeaking && isPaused) {
      audioRef.current.play();
    }
  }, [isSpeaking, isPaused]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
      setIsPaused(false);
      
      // Clean up
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      audioRef.current = null;
    }
  }, []);

  const setVoice = useCallback((voiceId: string) => {
    const voice = voices.find(v => v.id === voiceId);
    if (voice) {
      setSelectedVoice(voice);
    }
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  return {
    isSupported: true, // Always true since we're using OpenAI API
    isLoading,
    isSpeaking,
    isPaused,
    error,
    voices,
    selectedVoice,
    speak,
    pause,
    resume,
    stop,
    setVoice,
    cleanup
  };
};