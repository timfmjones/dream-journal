// src/hooks/useTextToSpeech.ts

import { useState, useRef, useEffect } from 'react';

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceURI?: string;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      speechSynthRef.current = window.speechSynthesis;
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = speechSynthRef.current!.getVoices();
        setVoices(availableVoices);
        
        // Set default voice (prefer English voices)
        if (availableVoices.length > 0 && !selectedVoice) {
          const englishVoice = availableVoices.find(voice => 
            voice.lang.startsWith('en-') && voice.localService
          ) || availableVoices[0];
          setSelectedVoice(englishVoice);
        }
      };

      loadVoices();
      
      // Chrome loads voices asynchronously
      if (speechSynthRef.current.onvoiceschanged !== undefined) {
        speechSynthRef.current.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text: string, customOptions?: UseTextToSpeechOptions) => {
    if (!isSupported || !speechSynthRef.current) {
      console.warn('Text-to-speech is not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    speechSynthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options
    const finalOptions = { ...options, ...customOptions };
    utterance.rate = finalOptions.rate || 1;
    utterance.pitch = finalOptions.pitch || 1;
    utterance.volume = finalOptions.volume || 1;
    
    // Set voice
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else if (finalOptions.voiceURI) {
      const voice = voices.find(v => v.voiceURI === finalOptions.voiceURI);
      if (voice) utterance.voice = voice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechSynthRef.current.speak(utterance);
  };

  const pause = () => {
    if (speechSynthRef.current && isSpeaking) {
      speechSynthRef.current.pause();
    }
  };

  const resume = () => {
    if (speechSynthRef.current && isPaused) {
      speechSynthRef.current.resume();
    }
  };

  const stop = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const setVoice = (voiceURI: string) => {
    const voice = voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      setSelectedVoice(voice);
    }
  };

  return {
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
  };
};