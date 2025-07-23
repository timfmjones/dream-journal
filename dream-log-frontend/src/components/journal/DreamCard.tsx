// src/components/journal/DreamCard.tsx

import React from 'react';
import { Wand2, Brain, Mic, FileText } from 'lucide-react';
import type { Dream } from '../../types';

interface DreamCardProps {
  dream: Dream;
  onClick: () => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, onClick }) => {
  // Get the first 150 characters of the dream as excerpt
  const excerpt = dream.originalDream.length > 150 
    ? dream.originalDream.substring(0, 150) + '...' 
    : dream.originalDream;

  return (
    <div className="dream-list-card" onClick={onClick}>
      <h3 className="dream-list-title">{dream.title}</h3>
      <p className="dream-list-excerpt">{excerpt}</p>
      
      <div className="dream-list-meta">
        <span>{dream.date}</span>
        
        {dream.inputMode === 'voice' && (
          <div className="dream-list-tag">
            <Mic style={{ width: '12px', height: '12px' }} />
            Voice
          </div>
        )}
        
        {dream.story && (
          <div className="dream-list-tag">
            <Wand2 style={{ width: '12px', height: '12px' }} />
            Fairy Tale
          </div>
        )}
        
        {dream.analysis && (
          <div className="dream-list-tag">
            <Brain style={{ width: '12px', height: '12px' }} />
            Analysis
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamCard;