// src/components/settings/SettingsView.tsx

import React, { useState, useEffect } from 'react';
import { Settings, TrendingUp, Tag, Brain, Calendar, Image } from 'lucide-react';
import AccountSection from './AccountSection';
import PreferencesSection from './PreferencesSection';
import DataManagementSection from './DataManagementSection';
import { useDreams } from '../../hooks/useDreams';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import type { StoryTone, StoryLength, UserStats } from '../../types';

interface SettingsViewProps {
  onShowAuth: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onShowAuth }) => {
  const { dreams } = useDreams();
  const { user, isGuest } = useAuth();
  const [storyTone, setStoryTone] = useState<StoryTone>('whimsical');
  const [storyLength, setStoryLength] = useState<StoryLength>('medium');
  const [generateImages, setGenerateImages] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      loadUserStats();
    }
    
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('dreamLogPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setStoryTone(preferences.tone || 'whimsical');
      setStoryLength(preferences.length || 'medium');
      setGenerateImages(preferences.generateImages !== false);
    }
  }, [user, isGuest]);

  const loadUserStats = async () => {
    setLoadingStats(true);
    try {
      const userStats = await api.getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleClearDreams = () => {
    // This would be handled by the parent component or a global state management solution
    localStorage.removeItem('dreamLogDreams');
    window.location.reload(); // Simple reload to reset state
  };

  const handleToneChange = (tone: StoryTone) => {
    setStoryTone(tone);
    savePreferences({ tone, length: storyLength, generateImages });
  };

  const handleLengthChange = (length: StoryLength) => {
    setStoryLength(length);
    savePreferences({ tone: storyTone, length, generateImages });
  };

  const handleGenerateImagesChange = (generate: boolean) => {
    setGenerateImages(generate);
    savePreferences({ tone: storyTone, length: storyLength, generateImages: generate });
  };

  const savePreferences = (preferences: { tone: StoryTone; length: StoryLength; generateImages: boolean }) => {
    localStorage.setItem('dreamLogPreferences', JSON.stringify(preferences));
  };

  return (
    <div className="py-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
        <Settings className="w-8 h-8 text-purple-600" />
        <span>Settings</span>
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <AccountSection onShowAuth={onShowAuth} />
        
        <PreferencesSection
          storyTone={storyTone}
          storyLength={storyLength}
          onToneChange={handleToneChange}
          onLengthChange={handleLengthChange}
        />

        {/* Image Generation Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Image className="w-5 h-5 text-purple-600" />
            <span>Image Generation</span>
          </h3>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Generate Illustrations by Default</p>
                <p className="text-sm text-gray-600 mt-1">
                  Automatically create AI-generated images when generating fairy tales
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateImages}
                  onChange={(e) => handleGenerateImagesChange(e.target.checked)}
                  className="sr-only"
                />
                <div 
                  className="w-11 h-6 rounded-full relative transition-colors duration-200"
                  style={{
                    backgroundColor: generateImages ? '#6b46c1' : '#e5e7eb'
                  }}
                >
                  <div 
                    className="absolute bg-white rounded-full h-5 w-5 transition-transform duration-200"
                    style={{
                      top: '2px',
                      left: generateImages ? '24px' : '2px',
                      transform: `translateX(0)`
                    }}
                  />
                </div>
              </label>
            </div>
            <p className="text-xs text-purple-600 mt-3 italic">
              {generateImages 
                ? "Images will be generated with each fairy tale (may take extra time)"
                : "Fairy tales will be created without illustrations (faster generation)"
              }
            </p>
          </div>
        </div>

        {/* User Statistics Section */}
        {user && !isGuest && stats && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>Your Dream Statistics</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Total Dreams</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">{stats.totalDreams}</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">This Month</span>
                </div>
                <p className="text-2xl font-bold text-indigo-700">{stats.dreamsThisMonth}</p>
              </div>
            </div>

            {stats.mostCommonTags.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>Most Common Tags</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {stats.mostCommonTags.slice(0, 5).map(({ tag, count }) => (
                    <span
                      key={tag}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag} ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {stats.averageLucidity !== null && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Average Lucidity</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${(stats.averageLucidity / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.averageLucidity.toFixed(1)}/5
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <DataManagementSection
          dreamCount={dreams.length}
          onClearDreams={handleClearDreams}
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Dream Log transforms your dreams into magical fairy tales and provides insightful analysis using AI. 
            Record your dreams through text or voice, choose to generate a fairy tale with or without illustrations, 
            get dream analysis, or simply save your dream for later. Sign in with Google to sync your dreams across devices,
            or continue as a guest to save locally.
          </p>
          <p className="text-gray-500 text-xs mt-4">
            Version 2.1 - Enhanced with customizable image generation options
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;