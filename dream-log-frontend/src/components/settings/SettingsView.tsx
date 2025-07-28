// src/components/settings/SettingsView.tsx - Updated with mobile support
import React, { useState, useEffect } from 'react';
import { User, LogOut, Download, Upload, Trash2, Image, Shield, Bell, Moon } from 'lucide-react';
import { useDreams } from '../../hooks/useDreams';
import { useAuth } from '../../contexts/AuthContext';
import { useMobileDetect } from '../../hooks/useMobileDetect';
import { api } from '../../services/api';
import type { StoryTone, StoryLength, UserStats } from '../../types';
import { TONE_OPTIONS, LENGTH_OPTIONS } from '../../utils/constants';

interface SettingsViewProps {
  onShowAuth: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onShowAuth }) => {
  const { dreams } = useDreams();
  const { user, isGuest, logout } = useAuth();
  const { isMobile } = useMobileDetect();
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
    if (confirm('Are you sure you want to clear all dreams? This cannot be undone.')) {
      localStorage.removeItem('dreamLogDreams');
      window.location.reload();
    }
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

  const getLocalStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const dreamsThisMonth = dreams.filter(dream => {
      const dreamDate = new Date(dream.date);
      return dreamDate.getMonth() === currentMonth && dreamDate.getFullYear() === currentYear;
    }).length;

    const favoriteDreams = dreams.filter(dream => dream.isFavorite).length;

    return {
      totalDreams: dreams.length,
      dreamsThisMonth,
      favoriteDreams
    };
  };

  const localStats = getLocalStats();
  const containerClass = isMobile ? "" : "settings-container";
  const headerClass = isMobile ? "px-4 pt-6 pb-4" : "settings-header";
  const cardClass = isMobile ? "" : "settings-card";
  const sectionClass = isMobile ? "bg-white border-t border-gray-100" : "settings-section";

  return (
    <div className={containerClass}>
      <div className={headerClass}>
        <h2 className={isMobile ? "text-2xl font-bold text-gray-900 mb-2" : ""}>Settings</h2>
        <p className={isMobile ? "text-gray-600 text-sm" : ""}>Customize your dream journal experience</p>
      </div>

      <div className={cardClass}>
        {/* Account Section */}
        <div className={`${sectionClass} ${isMobile ? 'px-4 py-6' : ''}`}>
          <h3 className={isMobile ? "text-lg font-semibold text-gray-900 mb-4" : ""}>Account</h3>
          {user && !isGuest ? (
            <div>
              <div className={`${isMobile ? 'flex flex-col space-y-4' : 'account-info'}`}>
                <div className={`flex items-center ${isMobile ? 'justify-between' : 'gap-3'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white shadow-sm">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.displayName || 'User'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {isMobile && (
                    <button
                      onClick={logout}
                      className="text-red-600 text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
                {!isMobile && (
                  <button
                    onClick={logout}
                    className="nav-button text-red-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Your dreams are synced across all your devices
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  ⚠️ You're in guest mode. Dreams are saved locally only.
                </p>
              </div>
              <button
                onClick={onShowAuth}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In for Free Account
              </button>
            </div>
          )}
        </div>

        {/* Story Preferences */}
        <div className={`${sectionClass} ${isMobile ? 'px-4 py-6' : ''}`}>
          <h3 className={isMobile ? "text-lg font-semibold text-gray-900 mb-4" : ""}>Story Preferences</h3>
          <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-2 gap-4 mb-4'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Story Tone
              </label>
              <select
                value={storyTone}
                onChange={(e) => handleToneChange(e.target.value as StoryTone)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                style={{ fontSize: '16px' }}
              >
                {TONE_OPTIONS.map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Story Length
              </label>
              <select
                value={storyLength}
                onChange={(e) => handleLengthChange(e.target.value as StoryLength)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                style={{ fontSize: '16px' }}
              >
                {LENGTH_OPTIONS.map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-purple-700" />
                <span className="font-medium text-gray-900">Generate Illustrations by Default</span>
              </div>
              <button
                onClick={() => handleGenerateImagesChange(!generateImages)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  generateImages ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  generateImages ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2 px-4">
              Automatically create AI-generated images when generating fairy tales
            </p>
          </div>
        </div>

        {/* Dream Statistics */}
        <div className={`${sectionClass} ${isMobile ? 'px-4 py-6' : ''}`}>
          <h3 className={isMobile ? "text-lg font-semibold text-gray-900 mb-4" : ""}>Dream Statistics</h3>
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-4'}`}>
            <div className={`${isMobile ? 'bg-purple-50 p-4 rounded-lg' : 'stat-card'}`}>
              <div className="text-xs text-gray-600 mb-1">Total Dreams</div>
              <div className="text-2xl font-bold text-purple-700">
                {user && !isGuest && stats ? stats.totalDreams : localStats.totalDreams}
              </div>
            </div>
            <div className={`${isMobile ? 'bg-blue-50 p-4 rounded-lg' : 'stat-card'}`}>
              <div className="text-xs text-gray-600 mb-1">This Month</div>
              <div className="text-2xl font-bold text-blue-700">
                {user && !isGuest && stats ? stats.dreamsThisMonth : localStats.dreamsThisMonth}
              </div>
            </div>
            <div className={`${isMobile ? 'bg-amber-50 p-4 rounded-lg col-span-2' : 'stat-card'}`}>
              <div className="text-xs text-gray-600 mb-1">Favorites</div>
              <div className="text-2xl font-bold text-amber-700">
                {user && !isGuest && stats ? stats.favoriteDreams : localStats.favoriteDreams}
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className={`${sectionClass} ${isMobile ? 'px-4 py-6' : ''}`}>
          <h3 className={isMobile ? "text-lg font-semibold text-gray-900 mb-4" : ""}>Data Management</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Export Dreams</span>
              </div>
              <span className="text-xs text-gray-500">Coming soon</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Import Dreams</span>
              </div>
              <span className="text-xs text-gray-500">Coming soon</span>
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-base font-semibold text-red-600 mb-3">Danger Zone</h4>
            <button
              onClick={handleClearDreams}
              className="w-full flex items-center justify-center gap-2 p-3 border-2 border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Dreams
            </button>
          </div>
        </div>

        {/* Additional Settings (Mobile Only) */}
        {isMobile && (
          <>
            <div className={`${sectionClass} px-4 py-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Dream Reminders</span>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-gray-300">
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow" />
                </button>
              </div>
            </div>

            <div className={`${sectionClass} px-4 py-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Dark Mode</span>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-gray-300">
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* About */}
        <div className={`${sectionClass} ${isMobile ? 'px-4 py-6' : ''}`}>
          <h3 className={isMobile ? "text-lg font-semibold text-gray-900 mb-4" : ""}>About</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Dream Log transforms your dreams into magical fairy tales and provides insightful analysis using AI. 
            Record your dreams through text or voice, generate illustrations, and keep a beautiful journal of your subconscious adventures.
          </p>
          <p className="text-xs text-gray-500">
            Version 2.2 - Mobile optimized
          </p>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="#" className="text-purple-600 font-medium">Privacy Policy</a>
              <a href="#" className="text-purple-600 font-medium">Terms of Service</a>
              <a href="#" className="text-purple-600 font-medium">Support</a>
            </div>
          </div>
        </div>

        {/* Bottom padding for mobile */}
        {isMobile && <div className="h-6 safe-bottom" />}
      </div>

      <style jsx>{`
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default SettingsView;