// src/components/create/GeneratedStory.tsx

import React from 'react';
import { Sparkles, Image, Save } from 'lucide-react';
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
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-2xl shadow-xl p-8 space-y-6 border border-purple-100 fade-in">
      {title && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <span>Your Fairy Tale</span>
        </h3>
        <TextToSpeech text={story} showSettings={true} />
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story}</p>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Image className="w-5 h-5 text-purple-600" />
            <span>Story Illustrations</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {images.map((image, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square rounded-xl overflow-hidden shadow-md bg-gray-100">
                  {image.url ? (
                    <img 
                      src={image.url} 
                      alt={image.description}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Image className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs">Loading...</p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 text-center font-medium">{image.scene}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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

export default GeneratedStory;