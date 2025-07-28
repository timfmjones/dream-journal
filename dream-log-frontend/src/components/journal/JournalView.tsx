// src/components/journal/JournalView.tsx - Updated with mobile support
import React, { useState } from 'react';
import { Search, Calendar, Filter, Star } from 'lucide-react';
import DreamCard from './DreamCard';
import DreamDetail from './DreamDetail';
import MobileDreamDetail from './MobileDreamDetail';
import EmptyJournal from './EmptyJournal';
import { useDreams } from '../../hooks/useDreams';
import { useMobileDetect } from '../../hooks/useMobileDetect';
import { api } from '../../services/api';
import type { Dream } from '../../types';

const JournalView: React.FC = () => {
  const { dreams, updateDream, deleteDream, toggleDreamFavorite, refreshDreams } = useDreams();
  const { isMobile } = useMobileDetect();
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
      
      let imageData = { images: [] };
      if (generateImages) {
        imageData = await api.generateImages(storyData.story, dream.tone);
      }
      
      const updates = {
        story: storyData.story,
        images: imageData.images
      };
      
      const updatedDream = await updateDream(dream.id, updates);
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
      
      const updatedDream = await updateDream(dream.id, updates);
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

  const DreamDetailComponent = isMobile ? MobileDreamDetail : DreamDetail;

  return (
    <div className={isMobile ? "pb-safe" : ""}>
      <div className={isMobile ? "px-4 pt-6 pb-4" : "journal-header"}>
        <h2 className={isMobile ? "text-2xl font-bold text-gray-900 mb-2" : ""}>Dream Journal</h2>
        <p className={isMobile ? "text-gray-600 text-sm" : ""}>Your collection of dreams and stories</p>
      </div>

      {dreams.length > 0 && (
        <div className={isMobile ? "px-4 pb-4" : "search-container"}>
          <div className="relative mb-4">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search your dreams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={isMobile ? { fontSize: '16px' } : {}}
            />
          </div>
          
          <div className={`flex gap-2 ${isMobile ? 'overflow-x-auto pb-2 -mx-4 px-4' : 'flex-wrap'}`}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest')}
              className={`select-input ${isMobile ? 'min-w-[120px]' : 'w-auto'}`}
              style={isMobile ? { fontSize: '16px' } : {}}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            
            <button 
              className={`nav-button flex items-center gap-1.5 whitespace-nowrap ${showFavoritesOnly ? 'active' : ''}`} 
              style={showFavoritesOnly ? { background: '#f59e0b', color: 'white' } : {}}
              onClick={handleFavoritesFilterToggle}
            >
              <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              Favorites
            </button>
            
            <button className="nav-button flex items-center gap-1.5 whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      )}

      <div className={isMobile ? "px-4" : ""}>
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
          <div className={isMobile ? "space-y-3" : ""}>
            {filteredDreams.map((dream) => (
              <DreamCard
                key={dream.id}
                dream={dream}
                onClick={() => setSelectedDream(dream)}
                onToggleFavorite={(e) => handleToggleFavorite(dream.id)}
              />
            ))}
          </div>
        )}
      </div>

      <DreamDetailComponent
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

      <style jsx>{`
        .pb-safe {
          padding-bottom: max(24px, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  );
};

export default JournalView;