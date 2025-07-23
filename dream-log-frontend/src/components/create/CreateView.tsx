// src/components/create/CreateView.tsx

import React, { useState } from 'react';
import { Wand2, Brain, Save } from 'lucide-react';
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
  const [generateImages, setGenerateImages] = useState(true);
  
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
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div className="logo-container large">
            <div className="logo-icon large" />
          </div>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Dream Log</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>Transform your dreams into magical stories</p>
      </div>

      <div className="dream-card">
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
            generateImages={generateImages}
            onToneChange={setStoryTone}
            onLengthChange={setStoryLength}
            onGenerateImagesChange={setGenerateImages}
          />
        )}

        <div className="button-group">
          {generationMode === 'story' && (
            <button
              onClick={() => generateStory()}
              disabled={(!currentDream.trim() && !audioBlob) || isGenerating}
              className="primary-button"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%'
                  }} />
                  <span>Creating fairy tale...</span>
                </>
              ) : (
                <>
                  <Wand2 style={{ width: '16px', height: '16px' }} />
                  <span>Generate Fairy Tale</span>
                </>
              )}
            </button>
          )}

          {generationMode === 'analysis' && (
            <button
              onClick={() => analyzeDream()}
              disabled={(!currentDream.trim() && !audioBlob) || isAnalyzing}
              className="primary-button"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%'
                  }} />
                  <span>Analyzing dream...</span>
                </>
              ) : (
                <>
                  <Brain style={{ width: '16px', height: '16px' }} />
                  <span>Analyze Dream</span>
                </>
              )}
            </button>
          )}

          {generationMode === 'none' && (
            <button
              onClick={handleSaveDream}
              disabled={!currentDream.trim() && !audioBlob}
              className="primary-button"
            >
              <Save style={{ width: '16px', height: '16px' }} />
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