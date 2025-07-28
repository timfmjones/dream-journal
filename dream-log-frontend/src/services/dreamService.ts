// src/services/dreamService.ts

import { type User } from 'firebase/auth';
import type { Dream } from '../types';
import { API_BASE_URL } from '../utils/constants';
import { api } from './api';

const getAuthToken = async (user: User | null) => {
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

export const dreamService = {
  async loadDreams(user: User | null, isGuest: boolean, favoritesOnly: boolean = false): Promise<Dream[]> {
    if (user && !isGuest) {
      try {
        const token = await getAuthToken(user);
        const queryParams = new URLSearchParams({
          page: '1',
          limit: '50',
          ...(favoritesOnly && { favoritesOnly: 'true' })
        });
        
        const response = await fetch(`${API_BASE_URL}/dreams?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          // Handle both old and new response formats
          const dreams = data.dreams || data;
          
          // Transform backend dream format to frontend format if needed
          return dreams.map((dream: any) => ({
            ...dream,
            originalDream: dream.dreamText || dream.originalDream || '', // Map backend dreamText to frontend originalDream
            audioBlob: dream.audioUrl ? undefined : dream.audioBlob, // Don't load audio from server
            inputMode: dream.hasAudio ? 'voice' : 'text',
            tone: dream.storyTone || 'whimsical',
            length: dream.storyLength || 'medium',
            isFavorite: dream.isFavorite || false
          }));
        }
      } catch (error) {
        console.error('Failed to load dreams from server:', error);
      }
    }
    
    // Fall back to localStorage for guest mode
    const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
    if (favoritesOnly) {
      return savedDreams.filter((dream: Dream) => dream.isFavorite === true);
    }
    return savedDreams;
  },

  async saveDream(dream: Dream, user: User | null, isGuest: boolean): Promise<Dream> {
    if (user && !isGuest) {
      try {
        const token = await getAuthToken(user);
        
        // Prepare dream data for backend
        const dreamData = {
          title: dream.title,
          dreamText: dream.originalDream,
          story: dream.story,
          storyTone: dream.tone,
          storyLength: dream.length,
          hasAudio: dream.inputMode === 'voice',
          tags: [], // You can add tag support later
          mood: undefined, // You can add mood support later
          lucidity: undefined, // You can add lucidity support later
          images: dream.images,
          isFavorite: dream.isFavorite || false
        };
        
        const response = await fetch(`${API_BASE_URL}/dreams`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dreamData)
        });

        if (response.ok) {
          const data = await response.json();
          return {
            ...dream,
            id: data.dream.id,
            userId: data.dream.userId,
            isFavorite: data.dream.isFavorite
          };
        }
      } catch (error) {
        console.error('Failed to save to server:', error);
      }
    }
    
    // Save to localStorage for guest mode
    const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
    const updatedDreams = [dream, ...savedDreams];
    localStorage.setItem('dreamLogDreams', JSON.stringify(updatedDreams));
    return dream;
  },

  async updateDream(dreamId: string, updates: Partial<Dream>, user: User | null, isGuest: boolean): Promise<Dream> {
    if (user && !isGuest) {
      try {
        const token = await getAuthToken(user);
        
        // Transform updates to backend format
        const backendUpdates: any = {};
        if (updates.title !== undefined) backendUpdates.title = updates.title;
        if (updates.originalDream !== undefined) backendUpdates.dreamText = updates.originalDream;
        if (updates.story !== undefined) backendUpdates.story = updates.story;
        if (updates.analysis !== undefined) backendUpdates.analysis = updates.analysis;
        if (updates.tone !== undefined) backendUpdates.storyTone = updates.tone;
        if (updates.length !== undefined) backendUpdates.storyLength = updates.length;
        if (updates.images !== undefined) backendUpdates.images = updates.images;
        if (updates.isFavorite !== undefined) backendUpdates.isFavorite = updates.isFavorite;
        
        const response = await fetch(`${API_BASE_URL}/dreams/${dreamId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(backendUpdates)
        });

        if (response.ok) {
          const data = await response.json();
          // Return the updated dream in frontend format
          return {
            ...updates,
            id: data.dream.id,
            title: data.dream.title || updates.title,
            originalDream: data.dream.dreamText || updates.originalDream || '',
            story: data.dream.story || updates.story,
            analysis: data.dream.analysis || updates.analysis,
            tone: data.dream.storyTone || updates.tone || 'whimsical',
            length: data.dream.storyLength || updates.length || 'medium',
            isFavorite: data.dream.isFavorite,
            date: data.dream.date || updates.date,
            inputMode: data.dream.hasAudio ? 'voice' : 'text',
            images: data.dream.images || updates.images,
            userId: data.dream.userId,
            userEmail: data.dream.userEmail
          } as Dream;
        }
      } catch (error) {
        console.error('Failed to update on server:', error);
      }
    }
    
    // Update in localStorage for guest mode
    const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
    const updatedDreams = savedDreams.map((d: Dream) => 
      d.id === dreamId ? { ...d, ...updates } : d
    );
    localStorage.setItem('dreamLogDreams', JSON.stringify(updatedDreams));
    
    const updatedDream = updatedDreams.find((d: Dream) => d.id === dreamId);
    return updatedDream;
  },

  // NEW METHOD: Toggle favorite status
  async toggleDreamFavorite(dreamId: string, user: User | null, isGuest: boolean): Promise<Dream | null> {
    if (user && !isGuest) {
      try {
        const result = await api.toggleDreamFavorite(dreamId);
        if (result.success && result.dream) {
          return {
            id: result.dream.id,
            title: result.dream.title || 'Untitled Dream',
            originalDream: result.dream.dreamText || '',
            story: result.dream.story,
            analysis: result.dream.analysis,
            tone: result.dream.storyTone || 'whimsical',
            length: result.dream.storyLength || 'medium',
            inputMode: result.dream.hasAudio ? 'voice' : 'text',
            date: result.dream.date || new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            images: result.dream.images,
            isFavorite: result.dream.isFavorite,
            userId: result.dream.userId,
            userEmail: result.dream.userEmail
          } as Dream;
        }
      } catch (error) {
        console.error('Failed to toggle favorite on server:', error);
        throw error;
      }
    } else {
      // Toggle in localStorage for guest mode
      const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
      const updatedDreams = savedDreams.map((d: Dream) => {
        if (d.id === dreamId) {
          return { ...d, isFavorite: !d.isFavorite };
        }
        return d;
      });
      localStorage.setItem('dreamLogDreams', JSON.stringify(updatedDreams));
      
      return updatedDreams.find((d: Dream) => d.id === dreamId) || null;
    }
  },

  async deleteDream(dreamId: string, user: User | null, isGuest: boolean): Promise<void> {
    if (user && !isGuest) {
      try {
        const token = await getAuthToken(user);
        const response = await fetch(`${API_BASE_URL}/dreams/${dreamId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete dream');
        }
      } catch (error) {
        console.error('Failed to delete from server:', error);
        throw error;
      }
    } else {
      // Delete from localStorage for guest mode
      const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
      const updatedDreams = savedDreams.filter((d: Dream) => d.id !== dreamId);
      localStorage.setItem('dreamLogDreams', JSON.stringify(updatedDreams));
    }
  }
};