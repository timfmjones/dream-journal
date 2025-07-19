// src/components/settings/SettingsView.tsx

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import AccountSection from './AccountSection';
import PreferencesSection from './PreferencesSection';
import DataManagementSection from './DataManagementSection';
import { useDreams } from '../../hooks/useDreams';
import type { StoryTone, StoryLength } from '../../types';

interface SettingsViewProps {
  onShowAuth: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onShowAuth }) => {
  const { dreams } = useDreams();
  const [storyTone, setStoryTone] = useState<StoryTone>('whimsical');
  const [storyLength, setStoryLength] = useState<StoryLength>('medium');

  const handleClearDreams = () => {
    // This would be handled by the parent component or a global state management solution
    localStorage.removeItem('dreamLogDreams');
    window.location.reload(); // Simple reload to reset state
  };

  return (
    <div className="container-narrow mx-auto content-container py-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
        <Settings className="w-8 h-8 text-purple-600" />
        <span>Settings</span>
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <AccountSection onShowAuth={onShowAuth} />
        
        <PreferencesSection
          storyTone={storyTone}
          storyLength={storyLength}
          onToneChange={setStoryTone}
          onLengthChange={setStoryLength}
        />

        <DataManagementSection
          dreamCount={dreams.length}
          onClearDreams={handleClearDreams}
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Dream Log transforms your dreams into magical fairy tales and provides insightful analysis using AI. 
            Record your dreams through text or voice, choose to generate a fairy tale, get dream analysis, 
            or simply save your dream for later. Sign in with Google to sync your dreams across devices,
            or continue as a guest to save locally.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;