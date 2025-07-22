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
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 space-y-6 border border-indigo-100 fade-in">
      {title && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <Brain className="w-6 h-6 text-indigo-600" />
          <span>Dream Analysis</span>
        </h3>
        <TextToSpeech text={analysis} showSettings={true} />
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{analysis}</p>
      </div>

      <button
        onClick={onSave}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 flex items-center justify-center space-x-2 transition-all shadow-md"
      >
        <Save className="w-5 h-5" />
        <span>Save to Journal</span>
      </button>
    </div>
  );
};

export default GeneratedAnalysis;