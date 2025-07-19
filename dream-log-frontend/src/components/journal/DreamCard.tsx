// src/components/journal/DreamCard.tsx

import React from 'react';
import { Sparkles, Mic, Wand2, Brain } from 'lucide-react';
import type { Dream } from '../../types';

interface DreamCardProps {
  dream: Dream;
  onClick: () => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, onClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 dream-card">
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{dream.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{dream.date}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                {dream.inputMode === 'voice' ? (
                  <>
                    <Mic className="w-3 h-3" />
                    <span>Voice</span>
                  </>
                ) : (
                  <span>Text</span>
                )}
              </span>
              {dream.story && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Wand2 className="w-3 h-3" />
                    <span>Story</span>
                  </span>
                </>
              )}
              {dream.analysis && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Brain className="w-3 h-3" />
                    <span>Analysis</span>
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="text-purple-600 hover:text-purple-800 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamCard;