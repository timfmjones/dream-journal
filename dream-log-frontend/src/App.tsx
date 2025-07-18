import React, { useState, useEffect, useRef } from 'react';
import { Moon, Settings, Book, Sparkles, Image, Save, Mic, Square, Play, Pause, X } from 'lucide-react';

interface Dream {
  id: number;
  originalDream: string;
  story: string;
  title: string;
  tone: string;
  length: string;
  date: string;
  images: { url: string; scene: string; description: string }[];
  audioBlob?: Blob;
  inputMode: 'text' | 'voice';
}

const DreamLogApp = () => {
  const [currentView, setCurrentView] = useState('create');
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [currentDream, setCurrentDream] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyTone, setStoryTone] = useState('whimsical');
  const [storyLength, setStoryLength] = useState('medium');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [transcribedText, setTranscribedText] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load dreams from localStorage on mount
  useEffect(() => {
    const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
    setDreams(savedDreams);
  }, []);

  // Save dreams to localStorage whenever they change
  useEffect(() => {
    if (dreams.length > 0) {
      localStorage.setItem('dreamLogDreams', JSON.stringify(dreams));
    }
  }, [dreams]);

  const toneOptions = {
    whimsical: 'Whimsical & Playful',
    mystical: 'Mystical & Magical',
    adventurous: 'Adventurous & Bold',
    gentle: 'Gentle & Soothing',
    mysterious: 'Dark & Mysterious',
    comedy: 'Funny & Comedic'
  };

  const lengthOptions = {
    short: 'Short',
    medium: 'Medium',
    long: 'Long'
  };

  const generateStory = async () => {
    if (!currentDream.trim() && !audioBlob) return;
    
    setIsGenerating(true);
    
    try {
      let dreamText = currentDream;
      
      // If audio was recorded, transcribe it first
      if (audioBlob && inputMode === 'voice') {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'dream.wav');
        
        const transcribeResponse = await fetch('http://localhost:3001/api/transcribe', {
          method: 'POST',
          body: formData,
        });
        
        if (!transcribeResponse.ok) {
          throw new Error('Failed to transcribe audio');
        }
        
        const transcribeData = await transcribeResponse.json();
        dreamText = transcribeData.text;
        setTranscribedText(dreamText);
      }
      
      // Generate title
      const titleResponse = await fetch('http://localhost:3001/api/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dreamText: dreamText,
        }),
      });
      
      if (titleResponse.ok) {
        const titleData = await titleResponse.json();
        setGeneratedTitle(titleData.title);
      }
      
      // Generate story
      const storyResponse = await fetch('http://localhost:3001/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dreamText: dreamText,
          tone: storyTone,
          length: storyLength,
        }),
      });
      
      if (!storyResponse.ok) {
        throw new Error('Failed to generate story');
      }
      
      const storyData = await storyResponse.json();
      setGeneratedStory(storyData.story);
      
      // Generate images
      const imageResponse = await fetch('http://localhost:3001/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story: storyData.story,
          tone: storyTone
        }),
      });
      
      if (!imageResponse.ok) {
        throw new Error('Failed to generate images');
      }
      
      const imageData = await imageResponse.json();
      setGeneratedImages(imageData.images);
      
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate fairy tale. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDream = () => {
    if ((!currentDream.trim() && !transcribedText) || !generatedStory) return;
    
    const dreamText = transcribedText || currentDream;
    
    const newDream: Dream = {
      id: Date.now(),
      originalDream: dreamText,
      story: generatedStory,
      title: generatedTitle || 'Untitled Dream',
      tone: storyTone,
      length: storyLength,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      images: generatedImages,
      audioBlob: audioBlob || undefined,
      inputMode: inputMode
    };
    
    setDreams([newDream, ...dreams]);
    
    // Reset form
    setCurrentDream('');
    setGeneratedStory('');
    setGeneratedTitle('');
    setGeneratedImages([]);
    setAudioBlob(null);
    setTranscribedText('');
    setInputMode('text');
    setCurrentView('journal');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setInputMode('voice');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
      
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    setInputMode('text');
    setTranscribedText('');
    stopAudio();
  };

  const renderCreate = () => (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg">
            <Moon className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Dream Log</h1>
        <p className="text-lg text-gray-600">Transform your dreams into magical fairy tales</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <div className="space-y-4">
          {/* Input Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => {
                setInputMode('text');
                clearAudio();
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'text' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Type Dream
            </button>
            <button
              onClick={() => setInputMode('voice')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'voice' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Voice Memo
            </button>
          </div>

          {/* Text Input */}
          {inputMode === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell me about your dream...
              </label>
              <textarea
                value={currentDream}
                onChange={(e) => setCurrentDream(e.target.value)}
                placeholder="I was flying through a forest of giant mushrooms when I met a talking rabbit who gave me a golden key..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
              />
            </div>
          )}

          {/* Voice Input */}
          {inputMode === 'voice' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Record your dream
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center space-y-4 bg-gray-50">
                {!audioBlob ? (
                  <div className="space-y-4">
                    <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all ${
                      isRecording ? 'bg-red-100 animate-pulse shadow-lg' : 'bg-purple-100'
                    }`}>
                      <Mic className={`w-12 h-12 ${isRecording ? 'text-red-600' : 'text-purple-600'}`} />
                    </div>
                    
                    {isRecording ? (
                      <div className="space-y-3">
                        <p className="text-red-600 font-medium animate-pulse">Recording...</p>
                        <button
                          onClick={stopRecording}
                          className="bg-red-600 text-white px-6 py-2.5 rounded-xl hover:bg-red-700 flex items-center space-x-2 mx-auto transition-all shadow-md"
                        >
                          <Square className="w-4 h-4" />
                          <span>Stop Recording</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-600">Tap to record your dream</p>
                        <button
                          onClick={startRecording}
                          className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 flex items-center space-x-2 mx-auto transition-all shadow-md"
                        >
                          <Mic className="w-4 h-4" />
                          <span>Start Recording</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-24 h-24 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                      <Mic className="w-12 h-12 text-green-600" />
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-green-600 font-medium">Recording saved!</p>
                      {transcribedText && (
                        <p className="text-sm text-gray-600 italic px-4">"{transcribedText}"</p>
                      )}
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={isPlaying ? stopAudio : playAudio}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center space-x-2 transition-all shadow-md"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span>{isPlaying ? 'Pause' : 'Play'}</span>
                        </button>
                        <button
                          onClick={clearAudio}
                          className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-all shadow-md"
                        >
                          Re-record
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Tone
            </label>
            <select
              value={storyTone}
              onChange={(e) => setStoryTone(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {Object.entries(toneOptions).map(([key, label]) => (
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
              onChange={(e) => setStoryLength(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {Object.entries(lengthOptions).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateStory}
          disabled={(!currentDream.trim() && !audioBlob) || isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all shadow-md"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Creating your fairy tale...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Fairy Tale</span>
            </>
          )}
        </button>
      </div>

      {generatedStory && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-2xl shadow-xl p-6 space-y-6 border border-purple-100">
          {generatedTitle && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{generatedTitle}</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
            </div>
          )}
          
          <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span>Your Fairy Tale</span>
          </h3>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedStory}</p>
          </div>

          {generatedImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Image className="w-5 h-5 text-purple-600" />
                <span>Story Illustrations</span>
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {generatedImages.map((image, i) => (
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
                    <p className="text-xs text-gray-600 text-center">{image.scene}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={saveDream}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 flex items-center justify-center space-x-2 transition-all shadow-md"
          >
            <Save className="w-5 h-5" />
            <span>Save to Journal</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderJournal = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center space-x-2">
          <Book className="w-8 h-8 text-purple-600" />
          <span>Dream Journal</span>
        </h2>
        <p className="text-gray-600 mt-2">Your collection of magical dream stories</p>
      </div>

      {dreams.length === 0 ? (
        <div className="text-center py-16">
          <Moon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No dreams recorded yet</p>
          <p className="text-gray-400">Start by creating your first dream story</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dreams.map((dream) => (
            <div key={dream.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{dream.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {dream.date} • {toneOptions[dream.tone as keyof typeof toneOptions]} • {lengthOptions[dream.length as keyof typeof lengthOptions]} • {dream.inputMode === 'voice' ? 'Voice Memo' : 'Text'}
                  </p>
                </div>
                {dream.audioBlob && (
                  <button
                    onClick={() => {
                      const audioUrl = URL.createObjectURL(dream.audioBlob!);
                      const audio = new Audio(audioUrl);
                      audio.play();
                    }}
                    className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200 flex items-center space-x-1 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>Play</span>
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Original Dream:</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">{dream.originalDream}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Fairy Tale:</h4>
                  <p className="text-gray-700 leading-relaxed line-clamp-4">{dream.story}</p>
                </div>
                
                {dream.images && dream.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {dream.images.map((image, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-md bg-gray-100">
                        <img 
                          src={image.url} 
                          alt={image.description}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
        <Settings className="w-8 h-8 text-purple-600" />
        <span>Settings</span>
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Story Tone
            </label>
            <select
              value={storyTone}
              onChange={(e) => setStoryTone(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {Object.entries(toneOptions).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Story Length
            </label>
            <select
              value={storyLength}
              onChange={(e) => setStoryLength(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {Object.entries(lengthOptions).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Story Length: {lengthOptions[storyLength as keyof typeof lengthOptions]}
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={storyLength === 'short' ? 0 : storyLength === 'medium' ? 1 : 2}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setStoryLength(value === 0 ? 'short' : value === 1 ? 'medium' : 'long');
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((storyLength === 'short' ? 0 : storyLength === 'medium' ? 1 : 2) / 2) * 100}%, #e5e7eb ${((storyLength === 'short' ? 0 : storyLength === 'medium' ? 1 : 2) / 2) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Short</span>
              <span>Medium</span>
              <span>Long</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
          <div className="space-y-3">
            <p className="text-gray-600">Total dreams saved: {dreams.length}</p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all dreams? This cannot be undone.')) {
                  setDreams([]);
                  localStorage.removeItem('dreamLogDreams');
                }
              }}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear All Dreams
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
          <p className="text-gray-600 text-sm">
            Dream Log transforms your dreams into magical fairy tales using AI. 
            Record your dreams through text or voice, choose a tone and length, and watch 
            as they're transformed into enchanting stories with beautiful illustrations.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-2 rounded-xl shadow-md">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Dream Log</h1>
            </div>
            
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('create')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  currentView === 'create' 
                    ? 'bg-purple-100 text-purple-700 shadow-sm' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Create</span>
              </button>
              
              <button
                onClick={() => setCurrentView('journal')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  currentView === 'journal' 
                    ? 'bg-purple-100 text-purple-700 shadow-sm' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Book className="w-4 h-4" />
                <span>Journal</span>
              </button>
              
              <button
                onClick={() => setCurrentView('settings')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  currentView === 'settings' 
                    ? 'bg-purple-100 text-purple-700 shadow-sm' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {currentView === 'create' && renderCreate()}
        {currentView === 'journal' && renderJournal()}
        {currentView === 'settings' && renderSettings()}
      </main>

      {/* Custom CSS for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default DreamLogApp;