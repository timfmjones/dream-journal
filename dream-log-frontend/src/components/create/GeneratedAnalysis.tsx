// src/components/create/GeneratedAnalysis.tsx

import React from 'react';
import { Brain, Save } from 'lucide-react';
import TextToSpeech from '../common/TextToSpeech';

interface GeneratedAnalysisProps {
  title?: string;
  analysis: string;
  onSave: () => void;
}

const GeneratedAnalysis: React.FC<GeneratedAnalysisProps> = ({ title, analysis, onSave }) => {
  return (
    <div className="generated-content" style={{ 
      marginTop: '24px',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'
    }}>
      {title && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#4338ca', marginBottom: '8px' }}>{title}</h2>
          <div style={{ 
            width: '60px', 
            height: '3px', 
            background: 'linear-gradient(to right, #4f46e5, #818cf8)', 
            margin: '0 auto',
            borderRadius: '2px'
          }} />
        </div>
      )}
      
      <div className="generated-header">
        <h3 className="generated-title" style={{ color: '#4338ca' }}>
          <Brain style={{ width: '20px', height: '20px' }} />
          Dream Analysis
        </h3>
        <TextToSpeech text={analysis} showSettings={true} />
      </div>
      
      <div className="generated-text">
        {analysis}
      </div>

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

export default GeneratedAnalysis;