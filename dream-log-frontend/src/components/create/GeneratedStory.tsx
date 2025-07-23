// src/components/create/GeneratedStory.tsx

import React from 'react';
import { Sparkles, Save } from 'lucide-react';
import TextToSpeech from '../common/TextToSpeech';
import type { DreamImage } from '../../types';

interface GeneratedStoryProps {
  title?: string;
  story: string;
  images: DreamImage[];
  onSave: () => void;
}

const GeneratedStory: React.FC<GeneratedStoryProps> = ({ title, story, images, onSave }) => {
  return (
    <div className="generated-content" style={{ marginTop: '24px' }}>
      {title && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#4c1d95', marginBottom: '8px' }}>{title}</h2>
          <div style={{ 
            width: '60px', 
            height: '3px', 
            background: 'linear-gradient(to right, #7c3aed, #a78bfa)', 
            margin: '0 auto',
            borderRadius: '2px'
          }} />
        </div>
      )}
      
      <div className="generated-header">
        <h3 className="generated-title">
          <Sparkles style={{ width: '20px', height: '20px' }} />
          Your Fairy Tale
        </h3>
        <TextToSpeech text={story} showSettings={true} />
      </div>
      
      <div className="generated-text">
        {story}
      </div>

      {images.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#4c1d95', marginBottom: '16px' }}>
            Story Illustrations
          </h3>
          <div className="images-grid">
            {images.map((image, i) => (
              <div key={i}>
                <div className="image-card">
                  {image.url ? (
                    <img src={image.url} alt={image.description} />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#999'
                    }}>
                      Loading...
                    </div>
                  )}
                </div>
                <p className="image-caption">{image.scene}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="button-group" style={{ marginTop: '32px' }}>
        <button
          onClick={onSave}
          className="primary-button"
          style={{ background: '#10b981' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
        >
          <Save style={{ width: '16px', height: '16px' }} />
          Save to Journal
        </button>
      </div>
    </div>
  );
};

export default GeneratedStory;