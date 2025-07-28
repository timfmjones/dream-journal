// src/main.tsx - Updated with service worker registration and console patch
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyConsolePatch } from './utils/consolePatch'
import './index.css'
import App from './App.tsx'

// Apply console patch for React 19 compatibility
applyConsolePatch();

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Prevent pull-to-refresh on mobile
let touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', e => {
  const touchY = e.touches[0].clientY;
  const touchDiff = touchY - touchStartY;
  
  if (touchDiff > 0 && window.scrollY === 0) {
    e.preventDefault();
  }
}, { passive: false });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)