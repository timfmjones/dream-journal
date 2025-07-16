// server.js - Dream Log Backend
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const storyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit story generation to 5 per minute
  message: 'Story generation rate limit exceeded. Please wait a moment.'
});

const imageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit image generation to 3 per minute
  message: 'Image generation rate limit exceeded. Please wait a moment.'
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer setup for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
});

// API Configuration
const API_CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
  },
  stability: {
    apiKey: process.env.STABILITY_API_KEY,
    baseURL: 'https://api.stability.ai/v1',
  }
};

// Utility function to make API calls
async function makeAPICall(url, options) {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${error.message || 'Unknown error'}`);
  }
  
  return response.json();
}

// Speech-to-Text endpoint
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    if (!API_CONFIG.openai.apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const formData = new FormData();
    formData.append('file', new Blob([req.file.buffer], { type: req.file.mimetype }));
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const response = await fetch(`${API_CONFIG.openai.baseURL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.openai.apiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.status}`);
    }

    const result = await response.json();
    res.json({ text: result.text });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Story Generation endpoint
app.post('/api/generate-story', storyLimiter, async (req, res) => {
  try {
    const { dreamText, tone = 'whimsical' } = req.body;

    if (!dreamText || dreamText.trim().length === 0) {
      return res.status(400).json({ error: 'Dream text is required' });
    }

    if (!API_CONFIG.openai.apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const tonePrompts = {
      whimsical: "Transform this dream into a whimsical, playful fairy tale with magical creatures, rainbow colors, and joyful adventures. Make it feel like a Disney story.",
      mystical: "Transform this dream into a mystical, magical fairy tale with ancient wisdom, ethereal beings, and spiritual undertones. Include elements of wonder and enlightenment.",
      adventurous: "Transform this dream into an adventurous, bold fairy tale with brave heroes, epic quests, and thrilling challenges. Make it exciting and action-packed.",
      gentle: "Transform this dream into a gentle, soothing fairy tale with kind characters, peaceful settings, and heartwarming moments. Make it comforting and tender.",
      mysterious: "Transform this dream into a mysterious, dark fairy tale with shadows, secrets, and intriguing plot twists. Keep it engaging but not too scary."
    };

    const systemPrompt = `You are a master storyteller who specializes in transforming dreams into captivating fairy tales. ${tonePrompts[tone] || tonePrompts.whimsical}

Guidelines:
- Create a complete, well-structured fairy tale (beginning, middle, end)
- Length: 300-500 words
- Include vivid descriptions and engaging dialogue
- Make it appropriate for all ages
- Incorporate classic fairy tale elements (magic, transformation, resolution)
- Use the dream as core inspiration but expand creatively`;

    const response = await makeAPICall(`${API_CONFIG.openai.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.openai.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Transform this dream into a fairy tale: "${dreamText}"` }
        ],
        max_tokens: 800,
        temperature: 0.8
      })
    });

    const story = response.choices[0].message.content;
    res.json({ story });

  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

// Image Generation endpoint
app.post('/api/generate-images', imageLimiter, async (req, res) => {
  try {
    const { story, tone = 'whimsical' } = req.body;

    if (!story || story.trim().length === 0) {
      return res.status(400).json({ error: 'Story text is required' });
    }

    if (!API_CONFIG.openai.apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const stylePrompts = {
      whimsical: "whimsical fairy tale illustration, bright colors, Disney-style, magical and playful",
      mystical: "mystical fairy tale artwork, ethereal lighting, fantasy art style, magical realism",
      adventurous: "epic fantasy illustration, adventure book art style, dynamic and heroic",
      gentle: "soft watercolor fairy tale illustration, pastel colors, gentle and peaceful",
      mysterious: "gothic fairy tale illustration, dramatic shadows, mysterious atmosphere"
    };

    const baseStyle = stylePrompts[tone] || stylePrompts.whimsical;
    const commonStyle = `${baseStyle}, children's book illustration, high quality, detailed, storybook art`;

    // Generate 3 different scenes from the story
    const scenes = [
      `Beginning scene: ${story.substring(0, 200)}...`,
      `Middle scene: ${story.substring(Math.floor(story.length * 0.4), Math.floor(story.length * 0.6))}`,
      `Ending scene: ${story.substring(story.length - 200)}`
    ];

    const imagePromises = scenes.map(async (scene, index) => {
      const prompt = `${scene} | ${commonStyle}`;
      
      const response = await makeAPICall(`${API_CONFIG.openai.baseURL}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          size: '1024x1024',
          quality: 'standard',
          n: 1
        })
      });

      return {
        url: response.data[0].url,
        scene: `Scene ${index + 1}`,
        description: scene.substring(0, 100) + '...'
      };
    });

    const images = await Promise.all(imagePromises);
    res.json({ images });

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate images' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    apis: {
      openai: !!API_CONFIG.openai.apiKey,
      stability: !!API_CONFIG.stability.apiKey
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Dream Log Backend running on port ${PORT}`);
  console.log(`OpenAI API: ${API_CONFIG.openai.apiKey ? 'Configured' : 'Not configured'}`);
  console.log(`Stability API: ${API_CONFIG.stability.apiKey ? 'Configured' : 'Not configured'}`);
});