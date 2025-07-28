// src/config/firebase.ts - Fixed for React 19 compatibility

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if environment variables are loaded
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  console.warn('Missing Firebase configuration variables:', missingVars.join(', '));
  console.warn('Make sure you have a .env file with all required Firebase configuration');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Log config status (without sensitive data)
console.log('Firebase config status:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain || 'NOT_SET'
});

let app;
let auth;
let googleProvider;
let db;

try {
  // Initialize Firebase only if we have the required config
  if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Add scopes if needed
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    
    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);
    
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase not initialized due to missing configuration');
  }
} catch (error) {
  // Handle error without causing React 19 issues
  console.warn('Error initializing Firebase:', error instanceof Error ? error.message : 'Unknown error');
}

export { auth, googleProvider, db };
export default app;