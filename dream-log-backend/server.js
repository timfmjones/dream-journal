// server.js - Dream Log Backend
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const fetch = require('node-fetch');
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

const analysisLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit analysis to 5 per minute
  message: 'Dream analysis rate limit exceeded. Please wait a moment.'
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

// Helper function to extract story segments
function extractStorySegments(story) {
  const sentences = story.match(/[^.!?]+[.!?]+/g) || [];
  const totalSentences = sentences.length;
  
  if (totalSentences < 3) {
    return {
      beginning: story,
      middle: story,
      ending: story
    };
  }
  
  const third = Math.floor(totalSentences / 3);
  
  return {
    beginning: sentences.slice(0, third).join(' ').trim(),
    middle: sentences.slice(third, third * 2).join(' ').trim(),
    ending: sentences.slice(third * 2).join(' ').trim()
  };
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
    formData.append('file', new Blob([req.file.buffer], { type: req.file.mimetype }), 'audio.wav');
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

// Title Generation endpoint
app.post('/api/generate-title', storyLimiter, async (req, res) => {
  try {
    const { dreamText } = req.body;

    if (!dreamText || dreamText.trim().length === 0) {
      return res.status(400).json({ error: 'Dream text is required' });
    }

    if (!API_CONFIG.openai.apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const systemPrompt = `You are a creative title generator. Create a short, engaging title (3-6 words) for a fairy tale based on the dream description provided. The title should be magical, whimsical, and capture the essence of the dream. Do not use quotation marks.`;

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
          { role: 'user', content: `Create a fairy tale title for this dream: "${dreamText}"` }
        ],
        max_tokens: 50,
        temperature: 0.8
      })
    });

    const title = response.choices[0].message.content.trim();
    res.json({ title });

  } catch (error) {
    console.error('Title generation error:', error);
    res.status(500).json({ error: 'Failed to generate title' });
  }
});

// Story Generation endpoint
app.post('/api/generate-story', storyLimiter, async (req, res) => {
  try {
    const { dreamText, tone = 'whimsical', length = 'medium' } = req.body;

    if (!dreamText || dreamText.trim().length === 0) {
      return res.status(400).json({ error: 'Dream text is required' });
    }

    if (!API_CONFIG.openai.apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const tonePrompts = {
      whimsical: "Transform this dream into a whimsical, playful fairy tale with magical creatures, rainbow colors, and joyful adventures. Make it feel like a Disney story with wonder and delight.",
      mystical: "Transform this dream into a mystical, magical fairy tale with ancient wisdom, ethereal beings, and spiritual undertones. Include elements of wonder, mystery, and enlightenment.",
      adventurous: "Transform this dream into an adventurous, bold fairy tale with brave heroes, epic quests, and thrilling challenges. Make it exciting and action-packed with courage and triumph.",
      gentle: "Transform this dream into a gentle, soothing fairy tale with kind characters, peaceful settings, and heartwarming moments. Make it comforting, tender, and full of love.",
      mysterious: "Transform this dream into a mysterious, dark fairy tale with shadows, secrets, and intriguing plot twists. Keep it atmospheric and engaging but not too scary.",
      comedy: "Transform this dream into a mysterious, dark fairy tale with sarcastic humor, dramatic secrets, and absurd plot twists. Keep it atmospheric and intriguing, but make it funny, more spooky comedy than actual horror."
    };

    const lengthPrompts = {
      short: "150-250 words",
      medium: "300-500 words", 
      long: "600-800 words"
    };

    const systemPrompt = `You are a master storyteller who specializes in transforming dreams into captivating fairy tales. ${tonePrompts[tone] || tonePrompts.whimsical}

Guidelines:
- Create a complete, well-structured fairy tale with a clear beginning, middle, and end
- Length: ${lengthPrompts[length] || lengthPrompts.medium}
- Include vivid descriptions and engaging dialogue
- Make it appropriate for all ages
- Incorporate classic fairy tale elements (magic, transformation, resolution)
- Use the dream as core inspiration but expand creatively
- Structure the story with clear scene transitions that can be illustrated`;

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
        max_tokens: length === 'long' ? 1200 : (length === 'short' ? 400 : 800),
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

// Dream Analysis endpoint
app.post('/api/analyze-dream', analysisLimiter, async (req, res) => {
  try {
    const { dreamText } = req.body;

    if (!dreamText || dreamText.trim().length === 0) {
      return res.status(400).json({ error: 'Dream text is required' });
    }

    if (!API_CONFIG.openai.apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const systemPrompt = `You are a compassionate dream analyst with expertise in psychology and symbolism. Analyze the provided dream and offer insights into its potential meanings, symbols, and emotional significance.

Guidelines:
- Provide a thoughtful, empathetic analysis (200-300 words)
- Identify key symbols and their possible meanings
- Discuss potential emotional themes or life situations it might reflect
- Offer constructive insights without being prescriptive
- Use accessible language, avoiding excessive jargon
- Be supportive and encouraging
- Remember this is for self-reflection, not clinical diagnosis`;

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
          { role: 'user', content: `Please analyze this dream: "${dreamText}"` }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const analysis = response.choices[0].message.content;
    res.json({ analysis });

  } catch (error) {
    console.error('Dream analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze dream' });
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
      whimsical: "whimsical fairy tale illustration, bright vibrant colors, Disney-style animation, magical and playful, soft lighting",
      mystical: "mystical fairy tale artwork, ethereal lighting, fantasy art style, magical realism, dreamy atmosphere",
      adventurous: "epic fantasy illustration, adventure book art style, dynamic composition, heroic and bold",
      gentle: "soft watercolor fairy tale illustration, pastel colors, gentle and peaceful, children's book style",
      mysterious: "gothic fairy tale illustration, dramatic shadows, mysterious atmosphere, dark fantasy art"
    };

    const baseStyle = stylePrompts[tone] || stylePrompts.whimsical;
    const commonStyle = `${baseStyle}, high quality, detailed artwork, storybook illustration, beautiful composition, no text, no words, no letters, no writing, text-free illustration`;

    // Extract story segments for different scenes
    const segments = extractStorySegments(story);
    
    const scenes = [
      {
        name: "Scene 1",
        description: "Beginning of the story",
        prompt: `Illustrate this scene: ${segments.beginning} | Make it feel like the start of a fairy tale: introduce the main character(s) and setting clearly. | Style: ${commonStyle} | Composition: wide establishing shot, cinematic lighting, detailed storybook artwork. IMPORTANT: Do not include any text, words, letters, or writing in the image.`
      },
      {
        name: "Scene 2", 
        description: "Middle of the story",
        prompt: `Illustrate this scene: ${segments.middle} | Focus on the main action or conflict—show drama, movement, and emotions. | Style: ${commonStyle} | Composition: mid-shot or dynamic angle, detailed character expressions, high-quality fairy tale illustration. IMPORTANT: Do not include any text, words, letters, or writing in the image.`
      },
      {
        name: "Scene 3",
        description: "End of the story",
        prompt: `Illustrate this scene: ${segments.ending} | Show the resolution or magical transformation—make it feel satisfying and final. | Style: ${commonStyle}, composition: full scene, warm and complete storybook atmosphere, polished illustration. IMPORTANT: Do not include any text, words, letters, or writing in the image.`
      }
    ];

    const imagePromises = scenes.map(async (scene) => {
      try {
        const response = await makeAPICall(`${API_CONFIG.openai.baseURL}/images/generations`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_CONFIG.openai.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: scene.prompt,
            size: '1024x1024',
            quality: 'standard',
            n: 1
          })
        });

        return {
          url: response.data[0].url,
          scene: scene.name,
          description: scene.description
        };
      } catch (error) {
        console.error(`Error generating image for ${scene.name}:`, error);
        return {
          url: null,
          scene: scene.name,
          description: scene.description,
          error: true
        };
      }
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