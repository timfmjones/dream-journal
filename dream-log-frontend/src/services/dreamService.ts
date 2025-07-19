// src/services/dreamService.ts

import { type User } from 'firebase/auth';
import type { Dream } from '../types';
import { API_BASE_URL } from '../utils/constants';

const getAuthToken = async (user: User | null) => {
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

export const dreamService = {
  async loadDreams(user: User | null, isGuest: boolean): Promise<Dream[]> {
    if (user && !isGuest) {
      try {
        const token = await getAuthToken(user);
        const response = await fetch(`${API_BASE_URL}/dreams`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          return data.dreams;
        }
      } catch (error) {
        console.error('Failed to load dreams from server:', error);
      }
    }
    
    // Fall back to localStorage
    const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
    return savedDreams;
  },

  async saveDream(dream: Dream, user: User | null, isGuest: boolean): Promise<Dream> {
    if (user && !isGuest) {
      try {
        const token = await getAuthToken(user);
        const response = await fetch(`${API_BASE_URL}/dreams`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dream)
        });

        if (response.ok) {
          const data = await response.json();
          return data.dream;
        }
      } catch (error) {
        console.error('Failed to save to server:', error);
      }
    }
    
    // Save to localStorage
    const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
    const updatedDreams = [dream, ...savedDreams];
    localStorage.setItem('dreamLogDreams', JSON.stringify(updatedDreams));
    return dream;
  },

  async updateDream(dreamId: string, updates: Partial<Dream>, user: User | null, isGuest: boolean): Promise<Dream> {
    if (user && !isGuest) {
      try {
        const token = await getAuthToken(user);
        const response = await fetch(`${API_BASE_URL}/dreams/${dreamId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updates)
        });

        if (response.ok) {
          const data = await response.json();
          return data.dream;
        }
      } catch (error) {
        console.error('Failed to update on server:', error);
      }
    }
    
    // Update in localStorage
    const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
    const updatedDreams = savedDreams.map((d: Dream) => 
      d.id === dreamId ? { ...d, ...updates } : d
    );
    localStorage.setItem('dreamLogDreams', JSON.stringify(updatedDreams));
    
    const updatedDream = updatedDreams.find((d: Dream) => d.id === dreamId);
    return updatedDream;
  },

  async deleteDream(dreamId: string, user: User | null, isGuest: boolean): Promise<void> {
    if (user && !isGuest) {
      try {
        const token = await getAuthToken(user);
        await fetch(`${API_BASE_URL}/dreams/${dreamId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Failed to delete from server:', error);
      }
    }
    
    // Delete from localStorage
    const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
    const updatedDreams = savedDreams.filter((d: Dream) => d.id !== dreamId);
    localStorage.setItem('dreamLogDreams', JSON.stringify(updatedDreams));
  }
};