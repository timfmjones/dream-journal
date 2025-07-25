// src/hooks/useDreams.ts

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Dream } from '../types';
import { dreamService } from '../services/dreamService';

export const useDreams = () => {
  const { user, isGuest } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const loadDreams = useCallback(async (favoritesOnly: boolean = false) => {
    setLoading(true);
    try {
      const loadedDreams = await dreamService.loadDreams(user, isGuest, favoritesOnly);
      setDreams(loadedDreams);
      
      // If we get pagination info from the backend, use it
      if (loadedDreams && typeof loadedDreams === 'object' && 'dreams' in loadedDreams) {
        setDreams(loadedDreams.dreams);
        setTotal(loadedDreams.total || loadedDreams.dreams.length);
        setHasMore(loadedDreams.hasMore || false);
      } else {
        setDreams(loadedDreams);
        setTotal(loadedDreams.length);
        setHasMore(false);
      }
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
      userEmail: user?.email || undefined,
      isFavorite: false  // Default to not favorite
    };

    try {
      const savedDream = await dreamService.saveDream(newDream, user, isGuest);
      setDreams(prev => [savedDream, ...prev]);
      setTotal(prev => prev + 1);
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

  const toggleDreamFavorite = async (dreamId: string) => {
    try {
      const updatedDream = await dreamService.toggleDreamFavorite(dreamId, user, isGuest);
      if (updatedDream) {
        setDreams(prev => prev.map(d => d.id === dreamId ? updatedDream : d));
        return updatedDream;
      }
      return null;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  };

  const deleteDream = async (dreamId: string) => {
    try {
      await dreamService.deleteDream(dreamId, user, isGuest);
      setDreams(prev => prev.filter(d => d.id !== dreamId));
      setTotal(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to delete dream:', error);
      throw error;
    }
  };

  return {
    dreams,
    loading,
    total,
    hasMore,
    saveDream,
    updateDream,
    toggleDreamFavorite,
    deleteDream,
    refreshDreams: loadDreams
  };
};