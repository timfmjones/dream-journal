// src/services/api.ts

import { API_BASE_URL } from '../utils/constants';

// Helper to get auth token
const getAuthHeaders = async (): Promise<HeadersInit> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Get auth token if available
  try {
    const { auth } = await import('../config/firebase');
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Failed to get auth token:', error);
  }
  
  return headers;
};

export const api = {
  async transcribeAudio(audioBlob: Blob): Promise<{ text: string }> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'dream.wav');
    
    const response = await fetch(`${API_BASE_URL}/transcribe`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }
    
    return response.json();
  },

  async generateTitle(dreamText: string): Promise<{ title: string }> {
    const response = await fetch(`${API_BASE_URL}/generate-title`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dreamText }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate title');
    }
    
    return response.json();
  },

  async generateStory(dreamText: string, tone: string, length: string): Promise<{ story: string }> {
    const response = await fetch(`${API_BASE_URL}/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dreamText, tone, length }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate story');
    }
    
    return response.json();
  },

  async generateImages(story: string, tone: string, skipGeneration?: boolean): Promise<{ images: any[] }> {
    // If skip generation is true, return empty images array immediately
    if (skipGeneration) {
      return { images: [] };
    }

    const response = await fetch(`${API_BASE_URL}/generate-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ story, tone }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate images');
    }
    
    return response.json();
  },

  async analyzeDream(dreamText: string, dreamId?: string): Promise<{ 
    analysis: string;
    themes?: string[];
    emotions?: string[];
    saved?: boolean;
    analysisId?: string;
  }> {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/analyze-dream`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ dreamText, dreamId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze dream');
    }
    
    return response.json();
  },

  async getUserStats(): Promise<{
    totalDreams: number;
    dreamsThisMonth: number;
    mostCommonTags: Array<{ tag: string; count: number }>;
    moodDistribution: Array<{ mood: string; count: number }>;
    averageLucidity: number | null;
  }> {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user stats');
    }
    
    return response.json();
  },

  async textToSpeech(text: string, voice: string = 'alloy', speed: number = 1.0): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice, speed }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }
    
    return response.blob();
  },
};