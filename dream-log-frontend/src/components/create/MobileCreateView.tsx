// src/components/create/MobileCreateView.tsx
import React, { useState } from 'react';
import { Wand2, Brain, Save, Mic, Square, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useDreams } from '../../hooks/useDreams';
import { api } from '../../services/api';
import type { GenerationMode, StoryTone, StoryLength } from '../../types';
import Logo from '../common/Logo';
import GeneratedStory from './GeneratedStory';
import GeneratedAnalysis from './GeneratedAnalysis';
import { TONE_OPTIONS, LENGTH_OPTIONS } from '../../utils/constants';

interface MobileCreateViewProps {
  onNavigateToJournal?: () => void;
}

const MobileCreateView: React.FC<MobileCreateViewProps> = ({ onNavigateToJournal }) => {
  const [currentDream, setCurrentDream] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [generatedAnalysis, setGeneratedAnalysis] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [storyTone, setStoryTone] = useState<StoryTone>('whimsical');
  const [storyLength, setStoryLength] = useState<StoryLength>('medium');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [transcribedText, setTranscribedText] = useState('');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('none');
  const [generateImages, setGenerateImages] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  
  const { saveDream } = useDreams();
  const {
    isRecording,
    audioBlob,
    isPlaying,
    startRecording,
    stopRecording,
    playAudio,
    stopAudio,
    clearAudio
  } = useAudioRecorder();

  const generateStory = async (dreamText?: string) => {
    const textToUse = dreamText || currentDream;
    if (!textToUse.trim() && !audioBlob) return;
    
    setIsGenerating(true);
    
    try {
      let finalDreamText = textToUse;
      
      if (audioBlob && inputMode === 'voice' && !dreamText) {
        const transcribeData = await api.transcribeAudio(audioBlob);
        finalDreamText = transcribeData.text;
        setTranscribedText(finalDreamText);
      }
      
      if (!generatedTitle && !dreamText) {
        const titleData = await api.generateTitle(finalDreamText);
        setGeneratedTitle(titleData.title);
      }
      
      const storyData = await api.generateStory(finalDreamText, storyTone, storyLength);
      setGeneratedStory(storyData.story);
      
      if (generateImages) {
        const imageData = await api.generateImages(storyData.story, storyTone);
        setGeneratedImages(imageData.images);
      } else {
        setGeneratedImages([]);
      }
      
      return { story: storyData.story, images: generateImages ? generatedImages : [] };
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate fairy tale. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeDream = async (dreamText?: string) => {
    const textToUse = dreamText || currentDream;
    if (!textToUse.trim() && !audioBlob) return;
    
    setIsAnalyzing(true);
    
    try {
      let finalDreamText = textToUse;
      
      if (audioBlob && inputMode === 'voice' && !dreamText) {
        const transcribeData = await api.transcribeAudio(audioBlob);
        finalDreamText = transcribeData.text;
        setTranscribedText(finalDreamText);
      }
      
      if (!generatedTitle && !dreamText) {
        const titleData = await api.generateTitle(finalDreamText);
        setGeneratedTitle(titleData.title);
      }
      
      const analysisData = await api.analyzeDream(finalDreamText);
      setGeneratedAnalysis(analysisData.analysis);
      
      return analysisData.analysis;
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze dream. Please try again.');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveDream = async () => {
    if ((!currentDream.trim() && !transcribedText) || (!generatedStory && !generatedAnalysis && generationMode === 'none')) return;
    
    const dreamText = transcribedText || currentDream;
    
    try {
      await saveDream({
        originalDream: dreamText,
        story: generatedStory || undefined,
        analysis: generatedAnalysis || undefined,
        title: generatedTitle || 'Untitled Dream',
        tone: storyTone,
        length: storyLength,
        images: generatedImages.length > 0 ? generatedImages : undefined,
        audioBlob: audioBlob || undefined,
        inputMode: inputMode,
      });
      
      // Reset form
      setCurrentDream('');
      setGeneratedStory('');
      setGeneratedAnalysis('');
      setGeneratedTitle('');
      setGeneratedImages([]);
      setTranscribedText('');
      setInputMode('text');
      setGenerationMode('none');
      clearAudio();
      
      if (onNavigateToJournal) {
        onNavigateToJournal();
      }
    } catch (error) {
      console.error('Failed to save dream:', error);
      alert('Failed to save dream. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-safe">
      {/* Hero Section */}
      <div className="text-center px-4 py-6">
        <div className="flex justify-center mb-3">
          <Logo size="large" showText={false} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Dream</h1>
        <p className="text-gray-600 text-sm">Transform dreams into magical stories</p>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Input Mode Selector */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => {
                setInputMode('text');
                clearAudio();
              }}
              className={`flex-1 py-4 px-4 font-medium text-sm transition-all ${
                inputMode === 'text' 
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Type Dream
            </button>
            <button
              onClick={() => setInputMode('voice')}
              className={`flex-1 py-4 px-4 font-medium text-sm transition-all ${
                inputMode === 'voice' 
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Voice Memo
            </button>
          </div>

          {/* Input Content */}
          <div className="p-4">
            {inputMode === 'text' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell me about your dream...
                </label>
                <textarea
                  value={currentDream}
                  onChange={(e) => setCurrentDream(e.target.value)}
                  placeholder="I was flying through a forest of giant mushrooms when I met a talking rabbit..."
                  className="w-full min-h-[120px] p-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  style={{ fontSize: '16px' }} // Prevent zoom on iOS
                />
              </div>
            ) : (
              <div className="text-center py-8">
                {!audioBlob ? (
                  <>
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transition-all ${
                      isRecording 
                        ? 'bg-red-100 animate-pulse' 
                        : 'bg-purple-100'
                    }`}>
                      <Mic className={`w-10 h-10 ${
                        isRecording ? 'text-red-600' : 'text-purple-600'
                      }`} />
                    </div>
                    
                    {isRecording ? (
                      <>
                        <p className="text-red-600 font-semibold mb-4">Recording...</p>
                        <button
                          onClick={stopRecording}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium active:scale-95 transition-transform"
                        >
                          <Square className="w-4 h-4" />
                          Stop Recording
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 mb-4">Tap to record your dream</p>
                        <button
                          onClick={startRecording}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium active:scale-95 transition-transform"
                        >
                          <Mic className="w-4 h-4" />
                          Start Recording
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                      <Mic className="w-10 h-10 text-green-600" />
                    </div>
                    
                    <p className="text-green-600 font-semibold mb-2">Recording saved!</p>
                    {transcribedText && (
                      <p className="text-sm text-gray-600 italic mb-4 px-4">
                        "{transcribedText}"
                      </p>
                    )}
                    
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={isPlaying ? stopAudio : playAudio}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm active:scale-95 transition-transform"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                      <button
                        onClick={clearAudio}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium text-sm active:scale-95 transition-transform"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Re-record
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Generation Options */}
          <div className="p-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What would you like to create?
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setGenerationMode('story')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  generationMode === 'story'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  generationMode === 'story' ? 'bg-purple-600' : 'bg-gray-100'
                }`}>
                  <Wand2 className={`w-5 h-5 ${
                    generationMode === 'story' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <p className={`font-medium ${
                    generationMode === 'story' ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                    Fairy Tale
                  </p>
                  <p className="text-xs text-gray-600">Transform into a magical story</p>
                </div>
                {generationMode === 'story' && (
                  <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setGenerationMode('analysis')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  generationMode === 'analysis'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  generationMode === 'analysis' ? 'bg-purple-600' : 'bg-gray-100'
                }`}>
                  <Brain className={`w-5 h-5 ${
                    generationMode === 'analysis' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <p className={`font-medium ${
                    generationMode === 'analysis' ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                    Analysis
                  </p>
                  <p className="text-xs text-gray-600">Understand dream meanings</p>
                </div>
                {generationMode === 'analysis' && (
                  <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setGenerationMode('none')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  generationMode === 'none'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  generationMode === 'none' ? 'bg-purple-600' : 'bg-gray-100'
                }`}>
                  <Save className={`w-5 h-5 ${
                    generationMode === 'none' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <p className={`font-medium ${
                    generationMode === 'none' ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                    Just Save
                  </p>
                  <p className="text-xs text-gray-600">Save dream for later</p>
                </div>
                {generationMode === 'none' && (
                  <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Story Options */}
          {generationMode === 'story' && (
            <div className="p-4 border-t border-gray-100 bg-purple-50/50">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="w-full flex items-center justify-between py-2 text-purple-700 font-medium text-sm"
              >
                <span>Story Options</span>
                <span className="text-xs">{showOptions ? '−' : '+'}</span>
              </button>
              
              {showOptions && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Story Tone
                    </label>
                    <select
                      value={storyTone}
                      onChange={(e) => setStoryTone(e.target.value as StoryTone)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900"
                      style={{ fontSize: '16px' }}
                    >
                      {TONE_OPTIONS.map(({ key, label }) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Story Length
                    </label>
                    <select
                      value={storyLength}
                      onChange={(e) => setStoryLength(e.target.value as StoryLength)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900"
                      style={{ fontSize: '16px' }}
                    >
                      {LENGTH_OPTIONS.map(({ key, label }) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Generate Illustrations
                      </span>
                    </div>
                    <button
                      onClick={() => setGenerateImages(!generateImages)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        generateImages ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        generateImages ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="p-4 border-t border-gray-100">
            {generationMode === 'story' && (
              <button
                onClick={() => generateStory()}
                disabled={(!currentDream.trim() && !audioBlob) || isGenerating}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
              >
                {isGenerating ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating fairy tale...
                  </>
                ) : (
                  <>
                    <Wand2 className="inline-block w-4 h-4 mr-2" />
                    Generate Fairy Tale
                  </>
                )}
              </button>
            )}

            {generationMode === 'analysis' && (
              <button
                onClick={() => analyzeDream()}
                disabled={(!currentDream.trim() && !audioBlob) || isAnalyzing}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
              >
                {isAnalyzing ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing dream...
                  </>
                ) : (
                  <>
                    <Brain className="inline-block w-4 h-4 mr-2" />
                    Analyze Dream
                  </>
                )}
              </button>
            )}

            {generationMode === 'none' && (
              <button
                onClick={handleSaveDream}
                disabled={!currentDream.trim() && !audioBlob}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
              >
                <Save className="inline-block w-4 h-4 mr-2" />
                Save Dream
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generated Content */}
      {generatedStory && (
        <div className="px-4 mt-6">
          <GeneratedStory
            title={generatedTitle}
            story={generatedStory}
            images={generatedImages}
            onSave={handleSaveDream}
          />
        </div>
      )}

      {generatedAnalysis && (
        <div className="px-4 mt-6">
          <GeneratedAnalysis
            title={generatedTitle}
            analysis={generatedAnalysis}
            onSave={handleSaveDream}
          />
        </div>
      )}

      <style jsx>{`
        .pb-safe {
          padding-bottom: max(24px, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  );
};

export default MobileCreateView;