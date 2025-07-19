// src/components/journal/DreamDetail.tsx

import React from 'react';
import { X, Play, Mic, Wand2, Brain, Image } from 'lucide-react';
import Modal from '../common/Modal';
import type { Dream } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface DreamDetailProps {
  dream: Dream | null;
  isGenerating: boolean;
  isAnalyzing: boolean;
  onClose: () => void;
  onDelete: (dreamId: string) => void;
  onGenerateStory: () => void;
  onAnalyze: () => void;
}

const DreamDetail: React.FC<DreamDetailProps> = ({
  dream,
  isGenerating,
  isAnalyzing,
  onClose,
  onDelete,
  onGenerateStory,
  onAnalyze
}) => {
  const { user, isGuest } = useAuth();

  if (!dream) return null;

  const handlePlayAudio = () => {
    if (dream.audioBlob) {
      const audioUrl = URL.createObjectURL(dream.audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <Modal isOpen={!!dream} onClose={onClose} maxWidth="max-w-4xl">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{dream.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{dream.date}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                {dream.inputMode === 'voice' ? (
                  <>
                    <Mic className="w-3 h-3" />
                    <span>Voice Memo</span>
                  </>
                ) : (
                  <span>Text</span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {dream.audioBlob && (
              <button
                onClick={handlePlayAudio}
                className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200 flex items-center space-x-1 transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>Play</span>
              </button>
            )}
            {user && !isGuest && dream.userId === user.uid && (
              <button
                onClick={() => onDelete(dream.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete dream"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Original Dream */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Original Dream</h3>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-700 leading-relaxed">{dream.originalDream}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {(!dream.story || !dream.analysis) && (
          <div className="button-group">
            {!dream.story && (
              <button
                onClick={onGenerateStory}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Fairy Tale</span>
                  </>
                )}
              </button>
            )}
            {!dream.analysis && (
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-2.5 px-4 rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Analyze Dream</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Generated Fairy Tale */}
        {dream.story && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Wand2 className="w-5 h-5 text-purple-600" />
              <span>Generated Fairy Tale</span>
            </h3>
            <div className="fairy-tale-content p-6 rounded-xl shadow-sm">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dream.story}</p>
            </div>
          </div>
        )}

        {/* Dream Analysis */}
        {dream.analysis && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              <span>Dream Analysis</span>
            </h3>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm border border-indigo-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dream.analysis}</p>
            </div>
          </div>
        )}

        {/* Images */}
        {dream.images && dream.images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Image className="w-5 h-5 text-purple-600" />
              <span>Story Illustrations</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dream.images.map((image, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square rounded-xl overflow-hidden shadow-md bg-gray-100">
                    <img 
                      src={image.url} 
                      alt={image.description}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center font-medium">{image.scene}</p>
                  <p className="text-xs text-gray-500 text-center">{image.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DreamDetail;