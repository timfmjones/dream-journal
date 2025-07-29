// src/components/journal/JournalView.tsx

import React, { useState } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import DreamCard from './DreamCard';
import DreamDetail from './DreamDetail';
import EmptyJournal from './EmptyJournal';
import { useDreams } from '../../hooks/useDreams';
import { api } from '../../services/api';
import type { Dream } from '../../types';

const JournalView: React.FC = () => {
  const { dreams, updateDream, deleteDream, toggleDreamFavorite, refreshDreams } = useDreams();
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generateImages, setGenerateImages] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const generateStoryForDream = async (dream: Dream) => {
    setIsGenerating(true);
    try {
      const storyData = await api.generateStory(dream.originalDream, dream.tone, dream.length);
      
      let imageData: { images: any[] } = { images: [] };
      if (generateImages) {
        imageData = await api.generateImages(storyData.story, dream.tone);
      }
      
      const updates = {
        story: storyData.story,
        images: imageData.images
      };
      
      await updateDream(dream.id, updates);
      setSelectedDream({ ...dream, ...updates });
    } catch (error) {
      console.error('Failed to generate story:', error);
      alert('Failed to generate fairy tale. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeDreamFromJournal = async (dream: Dream) => {
    setIsAnalyzing(true);
    try {
      const analysisData = await api.analyzeDream(dream.originalDream, dream.id);
      
      const updates = {
        analysis: analysisData.analysis
      };
      
      await updateDream(dream.id, updates);
      setSelectedDream({ ...dream, ...updates });
    } catch (error) {
      console.error('Failed to analyze dream:', error);
      alert('Failed to analyze dream. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteDream = async (dreamId: string) => {
    if (!confirm('Are you sure you want to delete this dream?')) return;
    
    try {
      await deleteDream(dreamId);
      setSelectedDream(null);
    } catch (error) {
      console.error('Failed to delete dream:', error);
      alert('Failed to delete dream. Please try again.');
    }
  };

  const handleToggleFavorite = async (dreamId: string) => {
    try {
      const updatedDream = await toggleDreamFavorite(dreamId);
      // Update selected dream if it's the one being toggled
      if (selectedDream && selectedDream.id === dreamId && updatedDream) {
        setSelectedDream(updatedDream);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('Failed to update favorite status. Please try again.');
    }
  };

  const handleFavoritesFilterToggle = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
    refreshDreams(!showFavoritesOnly);
  };

  // Filter and sort dreams
  const filteredDreams = dreams
    .filter(dream => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        dream.title.toLowerCase().includes(query) ||
        dream.originalDream.toLowerCase().includes(query)
      );
    })
    .filter(dream => {
      if (showFavoritesOnly) {
        return dream.isFavorite === true;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div>
      <div className="journal-header">
        <h2>Dream Journal</h2>
        <p>Your collection of dreams and stories</p>
      </div>

      {dreams.length > 0 && (
        <div className="search-container">
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search your dreams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest')}
              className="select-input"
              style={{ width: 'auto' }}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            
            <button 
              className={`nav-button ${showFavoritesOnly ? 'active' : ''}`} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                ...(showFavoritesOnly && {
                  background: '#f59e0b',
                  color: 'white'
                })
              }}
              onClick={handleFavoritesFilterToggle}
            >
              <Star 
                style={{ 
                  width: '16px', 
                  height: '16px',
                  fill: showFavoritesOnly ? 'white' : 'none'
                }} 
              />
              Favorites
            </button>
            
            <button className="nav-button" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter style={{ width: '16px', height: '16px' }} />
              Filter
            </button>
          </div>
        </div>
      )}

      {filteredDreams.length === 0 && dreams.length > 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">
            {showFavoritesOnly ? 'No favorite dreams yet' : 'No dreams match your search'}
          </p>
          <p className="empty-state-subtext">
            {showFavoritesOnly ? 'Star your special dreams to see them here' : 'Try a different search term'}
          </p>
        </div>
      ) : filteredDreams.length === 0 ? (
        <EmptyJournal />
      ) : (
        <div>
          {filteredDreams.map((dream) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              onClick={() => setSelectedDream(dream)}
              onToggleFavorite={() => handleToggleFavorite(dream.id)}
            />
          ))}
        </div>
      )}

      <DreamDetail
        dream={selectedDream}
        isGenerating={isGenerating}
        isAnalyzing={isAnalyzing}
        generateImages={generateImages}
        onClose={() => setSelectedDream(null)}
        onDelete={handleDeleteDream}
        onToggleFavorite={() => selectedDream && handleToggleFavorite(selectedDream.id)}
        onGenerateStory={() => selectedDream && generateStoryForDream(selectedDream)}
        onAnalyze={() => selectedDream && analyzeDreamFromJournal(selectedDream)}
        onGenerateImagesChange={setGenerateImages}
      />
    </div>
  );
};

export default JournalView;