// src/components/journal/JournalView.tsx

import React, { useState } from 'react';
import { Book } from 'lucide-react';
import DreamCard from './DreamCard';
import DreamDetail from './DreamDetail';
import EmptyJournal from './EmptyJournal';
import { useDreams } from '../../hooks/useDreams';
import { api } from '../../services/api';
import type { Dream } from '../../types';

const JournalView: React.FC = () => {
  const { dreams, updateDream, deleteDream } = useDreams();
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generateImages, setGenerateImages] = useState(true); // New state for image generation preference

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
      // Pass dreamId to save analysis in database
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

  return (
    <div className="py-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center space-x-2">
          <Book className="w-8 h-8 text-purple-600" />
          <span>Dream Journal</span>
        </h2>
        <p className="text-gray-600 mt-2">Your collection of dreams and stories</p>
      </div>

      {dreams.length === 0 ? (
        <EmptyJournal />
      ) : (
        <div className="space-y-4">
          {dreams.map((dream) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              onClick={() => setSelectedDream(dream)}
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
        onGenerateStory={() => selectedDream && generateStoryForDream(selectedDream)}
        onAnalyze={() => selectedDream && analyzeDreamFromJournal(selectedDream)}
        onGenerateImagesChange={setGenerateImages}
      />
    </div>
  );
};

export default JournalView;