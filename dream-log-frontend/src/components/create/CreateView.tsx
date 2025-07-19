// src/components/create/CreateView.tsx

import React, { useState } from 'react';
import { Wand2, Brain, Save } from 'lucide-react';
import Logo from '../common/Logo';
import DreamInput from './DreamInput';
import GenerationOptions from './GenerationOptions';
import StoryOptions from './StoryOptions';
import GeneratedStory from './GeneratedStory';
import GeneratedAnalysis from './GeneratedAnalysis';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useDreams } from '../../hooks/useDreams';
import { api } from '../../services/api';
import type { GenerationMode, StoryTone, StoryLength } from '../../types';

interface CreateViewProps {
  onNavigateToJournal?: () => void;
}

const CreateView: React.FC<CreateViewProps> = ({ onNavigateToJournal }) => {
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
      
      // Transcribe audio if needed
      if (audioBlob && inputMode === 'voice' && !dreamText) {
        const transcribeData = await api.transcribeAudio(audioBlob);
        finalDreamText = transcribeData.text;
        setTranscribedText(finalDreamText);
      }
      
      // Generate title if needed
      if (!generatedTitle && !dreamText) {
        const titleData = await api.generateTitle(finalDreamText);
        setGeneratedTitle(titleData.title);
      }
      
      // Generate story
      const storyData = await api.generateStory(finalDreamText, storyTone, storyLength);
      setGeneratedStory(storyData.story);
      
      // Generate images
      const imageData = await api.generateImages(storyData.story, storyTone);
      setGeneratedImages(imageData.images);
      
      return { story: storyData.story, images: imageData.images };
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
      
      // Transcribe audio if needed
      if (audioBlob && inputMode === 'voice' && !dreamText) {
        const transcribeData = await api.transcribeAudio(audioBlob);
        finalDreamText = transcribeData.text;
        setTranscribedText(finalDreamText);
      }
      
      // Generate title if needed
      if (!generatedTitle && !dreamText) {
        const titleData = await api.generateTitle(finalDreamText);
        setGeneratedTitle(titleData.title);
      }
      
      // Analyze dream
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
      
      // Navigate to journal if callback provided
      if (onNavigateToJournal) {
        onNavigateToJournal();
      }
    } catch (error) {
      console.error('Failed to save dream:', error);
      alert('Failed to save dream. Please try again.');
    }
  };

  return (
    <div className="container-narrow mx-auto content-container py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Logo size="large" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Dream Log</h1>
        <p className="text-lg text-gray-600">Transform your dreams into magical fairy tales</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <DreamInput
          inputMode={inputMode}
          currentDream={currentDream}
          isRecording={isRecording}
          audioBlob={audioBlob}
          isPlaying={isPlaying}
          transcribedText={transcribedText}
          onInputModeChange={setInputMode}
          onDreamChange={setCurrentDream}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onPlayAudio={playAudio}
          onStopAudio={stopAudio}
          onClearAudio={() => {
            clearAudio();
            setTranscribedText('');
          }}
        />

        <GenerationOptions
          generationMode={generationMode}
          onChange={setGenerationMode}
        />

        {generationMode === 'story' && (
          <StoryOptions
            tone={storyTone}
            length={storyLength}
            onToneChange={setStoryTone}
            onLengthChange={setStoryLength}
          />
        )}

        <div className="button-group">
          {generationMode === 'story' && (
            <button
              onClick={() => generateStory()}
              disabled={(!currentDream.trim() && !audioBlob) || isGenerating}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating fairy tale...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Fairy Tale</span>
                </>
              )}
            </button>
          )}

          {generationMode === 'analysis' && (
            <button
              onClick={() => analyzeDream()}
              disabled={(!currentDream.trim() && !audioBlob) || isAnalyzing}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing dream...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Analyze Dream</span>
                </>
              )}
            </button>
          )}

          {generationMode === 'none' && (
            <button
              onClick={handleSaveDream}
              disabled={!currentDream.trim() && !audioBlob}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              <Save className="w-5 h-5" />
              <span>Save Dream</span>
            </button>
          )}
        </div>
      </div>

      {generatedStory && (
        <GeneratedStory
          title={generatedTitle}
          story={generatedStory}
          images={generatedImages}
          onSave={handleSaveDream}
        />
      )}

      {generatedAnalysis && (
        <GeneratedAnalysis
          title={generatedTitle}
          analysis={generatedAnalysis}
          onSave={handleSaveDream}
        />
      )}
    </div>
  );
};

export default CreateView;