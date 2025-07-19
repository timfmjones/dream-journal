// src/hooks/useDreams.ts

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Dream } from '../types';
import { dreamService } from '../services/dreamService';

export const useDreams = () => {
  const { user, isGuest } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDreams = useCallback(async () => {
    setLoading(true);
    try {
      const loadedDreams = await dreamService.loadDreams(user, isGuest);
      setDreams(loadedDreams);
    } catch (error) {
      console.error('Failed to load dreams:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isGuest]);

  useEffect(() => {
    loadDreams();
  }, [loadDreams]);

  const saveDream = async (dreamData: Omit<Dream, 'id' | 'date' | 'userId' | 'userEmail'>) => {
    const newDream: Dream = {
      ...dreamData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      userId: user?.uid,
      userEmail: user?.email || undefined
    };

    try {
      const savedDream = await dreamService.saveDream(newDream, user, isGuest);
      setDreams(prev => [savedDream, ...prev]);
      return savedDream;
    } catch (error) {
      console.error('Failed to save dream:', error);
      throw error;
    }
  };

  const updateDream = async (dreamId: string, updates: Partial<Dream>) => {
    try {
      const updatedDream = await dreamService.updateDream(dreamId, updates, user, isGuest);
      setDreams(prev => prev.map(d => d.id === dreamId ? { ...d, ...updatedDream } : d));
      return updatedDream;
    } catch (error) {
      console.error('Failed to update dream:', error);
      throw error;
    }
  };

  const deleteDream = async (dreamId: string) => {
    try {
      await dreamService.deleteDream(dreamId, user, isGuest);
      setDreams(prev => prev.filter(d => d.id !== dreamId));
    } catch (error) {
      console.error('Failed to delete dream:', error);
      throw error;
    }
  };

  return {
    dreams,
    loading,
    saveDream,
    updateDream,
    deleteDream,
    refreshDreams: loadDreams
  };
};