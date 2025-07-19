// src/services/api.ts

import { API_BASE_URL } from '../utils/constants';

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

  async generateImages(story: string, tone: string): Promise<{ images: any[] }> {
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

  async analyzeDream(dreamText: string): Promise<{ analysis: string }> {
    const response = await fetch(`${API_BASE_URL}/analyze-dream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dreamText }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze dream');
    }
    
    return response.json();
  }
};