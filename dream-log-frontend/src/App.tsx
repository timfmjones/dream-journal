import React, { useState, useEffect, useRef } from 'react';
import { Moon, User, Settings, Book, Sparkles, Image, Save, LogIn, UserPlus, Mic, Square, Play, Pause } from 'lucide-react';

const DreamLogApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [dreams, setDreams] = useState([]);
  const [currentDream, setCurrentDream] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyTone, setStoryTone] = useState('whimsical');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
  const [generatedImages, setGeneratedImages] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Load dreams from memory on component mount
  useEffect(() => {
    const savedDreams = JSON.parse(localStorage.getItem('dreamLogDreams') || '[]');
    setDreams(savedDreams);
  }, []);

  // Save dreams to memory whenever dreams change
  useEffect(() => {
    localStorage.setItem('dreamLogDreams', JSON.stringify(dreams));
  }, [dreams]);

  const toneOptions = {
    whimsical: 'Whimsical & Playful',
    mystical: 'Mystical & Magical',
    adventurous: 'Adventurous & Bold',
    gentle: 'Gentle & Soothing',
    mysterious: 'Dark & Mysterious'
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
        }),
      });
      
      if (!storyResponse.ok) {
        throw new Error('Failed to generate story');
      }
      
      const storyData = await storyResponse.json();
      
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
      
      setGeneratedStory(storyData.story);
      setGeneratedImages(imageData.images);
      
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate fairy tale. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDream = () => {
    if ((!currentDream.trim() && !audioBlob) || !generatedStory) return;
    
    const dreamText = audioBlob && inputMode === 'voice' ? 
      "I was flying through a forest of giant mushrooms when I met a talking rabbit who gave me a golden key and told me to find the crystal castle beyond the rainbow bridge..." : 
      currentDream;
    
    const newDream = {
      id: Date.now(),
      originalDream: dreamText,
      story: generatedStory,
      tone: storyTone,
      date: new Date().toLocaleDateString(),
      images: ['dream-image-1.jpg', 'dream-image-2.jpg', 'dream-image-3.jpg'], // Placeholder image names
      audioBlob: audioBlob,
      inputMode: inputMode
    };
    
    setDreams([newDream, ...dreams]);
    setCurrentDream('');
    setGeneratedStory('');
    setGeneratedImages([]);
    setAudioBlob(null);
    setInputMode('text');
    setCurrentView('journal');
  };

  const handleAuth = (isLogin) => {
    // Simulate authentication
    setUser({ name: isLogin ? 'Dream Explorer' : 'New Dreamer', email: 'user@example.com' });
    setShowAuth(false);
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
    stopAudio();
  };

  const renderHome = () => (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-purple-100 p-4 rounded-full">
            <Moon className="w-12 h-12 text-purple-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Dream Log</h1>
        <p className="text-lg text-gray-600">Transform your dreams into magical fairy tales</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="space-y-4">
          {/* Input Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setInputMode('text');
                clearAudio();
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                inputMode === 'text' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Type Dream
            </button>
            <button
              onClick={() => setInputMode('voice')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
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
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          )}

          {/* Voice Input */}
          {inputMode === 'voice' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Record your dream
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-4">
                {!audioBlob ? (
                  <div className="space-y-4">
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                      isRecording ? 'bg-red-100 animate-pulse' : 'bg-purple-100'
                    }`}>
                      <Mic className={`w-10 h-10 ${isRecording ? 'text-red-600' : 'text-purple-600'}`} />
                    </div>
                    
                    {isRecording ? (
                      <div className="space-y-2">
                        <p className="text-red-600 font-medium">Recording...</p>
                        <button
                          onClick={stopRecording}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 mx-auto"
                        >
                          <Square className="w-4 h-4" />
                          <span>Stop Recording</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-gray-600">Tap to record your dream</p>
                        <button
                          onClick={startRecording}
                          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2 mx-auto"
                        >
                          <Mic className="w-4 h-4" />
                          <span>Start Recording</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                      <Mic className="w-10 h-10 text-green-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-green-600 font-medium">Recording saved!</p>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={isPlaying ? stopAudio : playAudio}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span>{isPlaying ? 'Pause' : 'Play'}</span>
                        </button>
                        <button
                          onClick={clearAudio}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Story Tone
          </label>
          <select
            value={storyTone}
            onChange={(e) => setStoryTone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            {Object.entries(toneOptions).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={generateStory}
          disabled={(!currentDream.trim() && !audioBlob) || isGenerating}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span>Your Fairy Tale</span>
          </h2>
          
          <div className="bg-white p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{generatedStory}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Image className="w-5 h-5 text-purple-600" />
              <span>Generated Images</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {generatedImages.length > 0 ? (
                generatedImages.map((image, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden shadow-md">
                    {image.error ? (
                      <div className="aspect-square bg-red-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-red-600">
                          <Image className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Failed to generate</p>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={image.url} 
                        alt={`Dream illustration ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))
              ) : (
                [1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <Image className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Generating...</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={saveDream}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center space-x-2"
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
        <div className="text-center py-12">
          <Moon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No dreams recorded yet</p>
          <p className="text-gray-400">Start by sharing a dream on the home page</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dreams.map((dream) => (
            <div key={dream.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Dream Story</h3>
                  <p className="text-gray-500 text-sm">
                    {dream.date} • {toneOptions[dream.tone]} • {dream.inputMode === 'voice' ? 'Voice Memo' : 'Text'}
                  </p>
                </div>
                {dream.audioBlob && (
                  <button
                    onClick={() => {
                      const audioUrl = URL.createObjectURL(dream.audioBlob);
                      const audio = new Audio(audioUrl);
                      audio.play();
                    }}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Play</span>
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Original Dream:</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{dream.originalDream}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Fairy Tale:</h4>
                  <p className="text-gray-700 leading-relaxed">{dream.story}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <Image className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-xs">Image {i}</p>
                      </div>
                    </div>
                  ))}
                </div>
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

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Story Tone
          </label>
          <select
            value={storyTone}
            onChange={(e) => setStoryTone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            {Object.entries(toneOptions).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account</h3>
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setUser(null)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600">You're using Dream Log as a guest</p>
              <button
                onClick={() => setShowAuth(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Create Account / Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAuth = () => (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {authMode === 'login' ? 'Welcome Back' : 'Join Dream Log'}
          </h2>
          <p className="text-gray-600 mt-2">
            {authMode === 'login' ? 'Sign in to access your dreams' : 'Create an account to save your dreams'}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          
          <button
            onClick={() => handleAuth(authMode === 'login')}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700"
          >
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-purple-600 hover:text-purple-800 text-sm"
          >
            {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowAuth(false)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Dream Log</h1>
            </div>
            
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentView('home')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'home' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Create</span>
              </button>
              
              <button
                onClick={() => setCurrentView('journal')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'journal' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Book className="w-4 h-4" />
                <span>Journal</span>
              </button>
              
              <button
                onClick={() => setCurrentView('settings')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'settings' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600'
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
        {showAuth ? renderAuth() : 
         currentView === 'home' ? renderHome() :
         currentView === 'journal' ? renderJournal() :
         renderSettings()}
      </main>
    </div>
  );
};

export default DreamLogApp;