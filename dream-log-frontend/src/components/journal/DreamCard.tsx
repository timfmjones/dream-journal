// src/components/journal/DreamCard.tsx

import React from 'react';
import { Wand2, Brain, Mic, FileText, Star } from 'lucide-react';
import type { Dream } from '../../types';

interface DreamCardProps {
  dream: Dream;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, onClick, onToggleFavorite }) => {
  // Get the first 150 characters of the dream as excerpt
  const dreamText = dream.originalDream || '';
  const excerpt = dreamText.length > 150 
    ? dreamText.substring(0, 150) + '...' 
    : dreamText;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onToggleFavorite(e);
  };

  return (
    <div className="dream-list-card" onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
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
        
        <button
          onClick={handleFavoriteClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            marginLeft: '16px',
            transition: 'all 0.2s',
            borderRadius: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
          title={dream.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            style={{
              width: '20px',
              height: '20px',
              color: dream.isFavorite ? '#f59e0b' : '#d1d5db',
              fill: dream.isFavorite ? '#f59e0b' : 'none',
              transition: 'all 0.2s'
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default DreamCard;