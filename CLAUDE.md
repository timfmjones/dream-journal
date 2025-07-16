# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Dream Journal application with a React frontend and Express.js backend that uses AI to transform dreams into fairy tales and generate images.

**Frontend**: `dream-log-frontend/` - React + TypeScript + Vite + Tailwind CSS
**Backend**: `dream-log-backend/` - Express.js + OpenAI API integration

## Development Commands

### Frontend (dream-log-frontend/)
```bash
npm run dev          # Start development server (localhost:5173)
npm run build        # Build for production (TypeScript compile + Vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend (dream-log-backend/)
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
npm test             # No tests configured yet
```

## Environment Setup

The backend requires API keys configured in `.env` file (copy from `.env.example`):
- `OPENAI_API_KEY` - Required for story generation and image creation
- `STABILITY_API_KEY` - Optional alternative for image generation
- `PORT` - Backend port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: localhost:5173)

## Architecture Overview

### Frontend Architecture
- Single-page React application with three main views: Create, Journal, Settings
- State management using React hooks (useState, useEffect)
- Local storage for dream persistence
- WebRTC MediaRecorder API for voice memo recording
- Tailwind CSS for styling with Lucide React icons

### Backend Architecture
- RESTful API with three main endpoints:
  - `POST /api/transcribe` - Speech-to-text using OpenAI Whisper
  - `POST /api/generate-story` - Story generation using GPT-4
  - `POST /api/generate-images` - Image generation using DALL-E 3
- Security middleware: Helmet, CORS, rate limiting
- File upload handling with Multer (audio files, 10MB limit)
- No database - currently stateless

### Data Flow
1. User inputs dream (text or voice memo)
2. Voice memos are transcribed via OpenAI Whisper API
3. Dream text is sent to GPT-4 with tone-specific prompts
4. Generated story is sent to DALL-E 3 for three scene images
5. Results are displayed and can be saved to local storage

## Key Files
- `dream-log-frontend/src/App.tsx` - Main React component with all UI logic
- `dream-log-backend/server.js` - Express server with all API endpoints
- `dream-log-frontend/package.json` - Frontend dependencies and scripts
- `dream-log-backend/package.json` - Backend dependencies and scripts

## Development Notes
- Frontend development server runs on port 5173 (Vite default)
- Backend server runs on port 3001
- No test framework is currently configured
- Images are generated but not persisted - only URLs stored temporarily
- Dreams are stored in browser localStorage, not a persistent database