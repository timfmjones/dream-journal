# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Dream Journal application with a React frontend and Express.js backend that uses AI to transform dreams into fairy tales and generate images.

**Frontend**: `dream-log-frontend/` - React + TypeScript + Vite + Tailwind CSS
**Backend**: `dream-log-backend/` - Express.js + Prisma ORM + PostgreSQL + OpenAI API integration

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
npm run db:migrate   # Run Prisma migrations
npm run db:deploy    # Deploy migrations to production
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database (if configured)
```

## Environment Setup

The backend requires API keys configured in `.env` file (copy from `.env.example`):
- `OPENAI_API_KEY` - Required for story generation, transcription, and image creation
- `STABILITY_API_KEY` - Optional alternative for image generation
- `PORT` - Backend port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: localhost:5173)
- `DATABASE_URL` - PostgreSQL connection string
- `FIREBASE_PROJECT_ID` - Firebase project ID for authentication
- `FIREBASE_PRIVATE_KEY` - Firebase admin private key
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email

## Architecture Overview

### Frontend Architecture
- Single-page React application with three main views: Create, Journal, Settings
- State management using React hooks (useState, useEffect, custom hooks)
- Authentication via Firebase with Google Sign-in and Guest mode
- Local storage for guest users, PostgreSQL for authenticated users
- WebRTC MediaRecorder API for voice memo recording
- Tailwind CSS for styling with custom gradient themes

### Backend Architecture
- RESTful API with authentication middleware
- Endpoints:
  - `POST /api/transcribe` - Speech-to-text using OpenAI Whisper
  - `POST /api/generate-title` - Generate dream titles using GPT-4
  - `POST /api/generate-story` - Story generation using GPT-4
  - `POST /api/generate-images` - Image generation using DALL-E 3
  - `POST /api/analyze-dream` - Dream analysis using GPT-4
  - `POST /api/text-to-speech` - Text-to-speech using OpenAI TTS
  - `GET /api/dreams` - Fetch user dreams with filtering and pagination
  - `POST /api/dreams` - Save new dream
  - `PUT /api/dreams/:id` - Update existing dream
  - `PATCH /api/dreams/:id/favorite` - Toggle dream favorite status
  - `DELETE /api/dreams/:id` - Delete dream
  - `GET /api/stats` - Get user statistics
  - `GET /api/health` - Health check endpoint
- Security middleware: Helmet, CORS, rate limiting
- File upload handling with Multer (audio files, 10MB limit)
- Prisma ORM for PostgreSQL database operations

### Database Schema (PostgreSQL)
- **User**: Stores user information from Firebase
- **Dream**: Main dream entries with content, metadata, and relationships
  - Includes `isFavorite` boolean field for favoriting functionality
- **DreamImage**: Stores generated images for dreams
- **DreamAnalysis**: Stores AI-generated dream analyses
- Indexes on foreign keys, dates, and favorite status for performance

### Data Flow
1. User inputs dream (text or voice memo)
2. Voice memos are transcribed via OpenAI Whisper API
3. Dream title is auto-generated using GPT-4
4. User can choose to:
   - Generate a fairy tale with optional illustrations
   - Generate dream analysis
   - Just save the dream
5. Generated content is displayed and can be saved
6. Dreams can be favorited for easy access
7. All data syncs across devices for authenticated users

## Key Features
- **Dream Recording**: Text input or voice memo with transcription
- **AI Story Generation**: Transform dreams into fairy tales with customizable tone and length
- **AI Image Generation**: Create up to 3 illustrations per story
- **Dream Analysis**: Get psychological insights about dreams
- **Text-to-Speech**: Read stories and analyses aloud with multiple voice options
- **Favorites System**: Mark special dreams as favorites for quick access
- **Search & Filter**: Find dreams by content, favorites, date, mood, etc.
- **Authentication**: Google Sign-in or Guest mode
- **Cross-device Sync**: Dreams sync across devices for authenticated users

## API Integration Details

### OpenAI API Usage
- **Whisper**: Audio transcription for voice memos
- **GPT-4**: Title generation, story creation, and dream analysis
- **DALL-E 3**: Image generation for story illustrations
- **TTS-1**: Text-to-speech for reading content aloud

### Rate Limiting
- General API: 100 requests per 15 minutes per IP
- Story generation: 5 per minute
- Image generation: 3 per minute
- Dream analysis: 5 per minute
- Text-to-speech: 10 per minute

## Development Notes
- Frontend uses Vite for fast development and optimized builds
- Backend uses nodemon for auto-reloading in development
- Prisma migrations handle database schema changes
- Firebase Admin SDK validates authentication tokens
- All generated content is optional - users can save dreams without AI features
- Guest mode data is stored in localStorage only
- Authenticated user data is stored in PostgreSQL
- Voice recordings are processed in-memory, not stored permanently
- Images are generated on-demand and URLs are stored, not the files
- The app supports customizable story tone, length, and image generation preferences

## Recent Updates
- Added favorite functionality to mark and filter special dreams
- Implemented text-to-speech for stories and analyses with multiple voice options
- Added comprehensive filtering and search capabilities
- Improved UI with animations and better visual feedback
- Enhanced error handling and loading states

## Future Enhancements
- Tags and categories for dreams
- Mood tracking and analytics
- Dream patterns and insights over time
- Export functionality for dreams and stories
- Collaborative dream sharing features
- Mobile app versions