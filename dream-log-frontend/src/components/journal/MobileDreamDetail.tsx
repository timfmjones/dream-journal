// src/components/journal/MobileDreamDetail.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, Play, Mic, Wand2, Brain, Image, Settings, Star, 
  Trash2, ChevronDown, Volume2, Share2, Calendar, Tag
} from 'lucide-react';
import TextToSpeech from '../common/TextToSpeech';
import type { Dream } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useSwipe } from '../../hooks/useSwipe';

interface MobileDreamDetailProps {
  dream: Dream | null;
  isGenerating: boolean;
  isAnalyzing: boolean;
  generateImages: boolean;
  onClose: () => void;
  onDelete: (dreamId: string) => void;
  onToggleFavorite: () => void;
  onGenerateStory: () => void;
  onAnalyze: () => void;
  onGenerateImagesChange: (generate: boolean) => void;
}

const MobileDreamDetail: React.FC<MobileDreamDetailProps> = ({
  dream,
  isGenerating,
  isAnalyzing,
  generateImages,
  onClose,
  onDelete,
  onToggleFavorite,
  onGenerateStory,
  onAnalyze,
  onGenerateImagesChange
}) => {
  const { user, isGuest } = useAuth();
  const [showImageToggle, setShowImageToggle] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Swipe down to close
  const swipeRef = useSwipe({
    onSwipeDown: () => {
      if (dragY > 100) {
        onClose();
      }
    }
  });

  useEffect(() => {
    if (dream) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [dream]);

  if (!dream) return null;

  const handlePlayAudio = () => {
    if (dream.audioBlob) {
      const audioUrl = URL.createObjectURL(dream.audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: dream.title,
      text: `Check out my dream: ${dream.title}\n\n${dream.originalDream.substring(0, 200)}...`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktop
        navigator.clipboard.writeText(shareData.text);
        alert('Dream copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragY(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const currentY = e.touches[0].clientY;
      setDragY(Math.max(0, currentY - 100));
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      onClose();
    }
    setIsDragging(false);
    setDragY(0);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm">
      <div 
        ref={swipeRef as any}
        className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl animate-slide-up overflow-hidden"
        style={{
          maxHeight: '95vh',
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />
          
          {/* Header */}
          <div className="px-4 pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate pr-2">
                  {dream.title}
                </h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {dream.date}
                  </span>
                  {dream.inputMode === 'voice' && (
                    <span className="flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5" />
                      Voice
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-lg text-gray-400 hover:text-gray-600 active:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-3">
              {dream.audioBlob && (
                <button
                  onClick={handlePlayAudio}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium active:scale-95"
                >
                  <Play className="w-3.5 h-3.5" />
                  Play
                </button>
              )}
              
              <button
                onClick={onToggleFavorite}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium active:scale-95 ${
                  dream.isFavorite
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${dream.isFavorite ? 'fill-current' : ''}`} />
                {dream.isFavorite ? 'Favorited' : 'Favorite'}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
              
              {user && !isGuest && dream.userId === user.uid && (
                <button
                  onClick={() => {
                    if (confirm('Delete this dream?')) {
                      onDelete(dream.id);
                    }
                  }}
                  className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(95vh - 140px)' }}>
          <div className="p-4 space-y-4">
            {/* Original Dream */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Original Dream
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {dream.originalDream}
                </p>
              </div>
            </section>

            {/* Action Buttons */}
            {(!dream.story || !dream.analysis) && (
              <section className="space-y-3">
                {!dream.story && (
                  <div>
                    <button
                      onClick={onGenerateStory}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium disabled:opacity-50 active:scale-95"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          <span>Generate Fairy Tale</span>
                        </>
                      )}
                    </button>

                    {/* Image Toggle */}
                    <button
                      onClick={() => setShowImageToggle(!showImageToggle)}
                      className="w-full mt-2 py-2 text-purple-700 text-sm font-medium"
                    >
                      {showImageToggle ? 'Hide' : 'Show'} image options
                      <ChevronDown className={`inline-block w-4 h-4 ml-1 transition-transform ${
                        showImageToggle ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {showImageToggle && (
                      <div className="mt-2 p-3 bg-purple-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4 text-purple-700" />
                          <span className="text-sm text-purple-900">Generate illustrations</span>
                        </div>
                        <button
                          onClick={() => onGenerateImagesChange(!generateImages)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            generateImages ? 'bg-purple-600' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            generateImages ? 'translate-x-5' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!dream.analysis && (
                  <button
                    onClick={onAnalyze}
                    disabled={isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium disabled:opacity-50 active:scale-95"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
              </section>
            )}

            {/* Generated Fairy Tale */}
            {dream.story && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-purple-600" />
                    Fairy Tale
                  </h3>
                  <TextToSpeech text={dream.story} />
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {dream.story}
                  </p>
                </div>
              </section>
            )}

            {/* Dream Analysis */}
            {dream.analysis && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    Analysis
                  </h3>
                  <TextToSpeech text={dream.analysis} />
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {dream.analysis}
                  </p>
                </div>
              </section>
            )}

            {/* Images */}
            {dream.images && dream.images.length > 0 && (
              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Image className="w-4 h-4 text-purple-600" />
                  Illustrations
                </h3>
                <div className="space-y-3">
                  {dream.images.map((image, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl overflow-hidden">
                      <div className="aspect-square bg-gray-100">
                        <img 
                          src={image.url} 
                          alt={image.description}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-gray-900 text-sm">{image.scene}</p>
                        <p className="text-xs text-gray-600 mt-1">{image.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tags (if any) */}
            {dream.tags && dream.tags.length > 0 && (
              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-600" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dream.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Bottom padding for safe area */}
          <div className="h-8 safe-bottom" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .overscroll-contain {
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default MobileDreamDetail;