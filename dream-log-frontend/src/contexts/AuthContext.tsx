// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if user has chosen guest mode before
    const guestMode = localStorage.getItem('dreamLogGuestMode');
    if (guestMode === 'true') {
      setIsGuest(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setUser(user);
      if (user) {
        // User is signed in, clear guest mode
        setIsGuest(false);
        localStorage.removeItem('dreamLogGuestMode');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign in successful:', result.user.email);
      setIsGuest(false);
      localStorage.removeItem('dreamLogGuestMode');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/popup-blocked') {
        error.message = 'Pop-up blocked. Please allow pop-ups for this site.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        error.message = 'Sign in cancelled.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        error.message = 'Sign in window was closed.';
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsGuest(false);
      localStorage.removeItem('dreamLogGuestMode');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const continueAsGuest = () => {
    console.log('Continuing as guest...');
    setIsGuest(true);
    localStorage.setItem('dreamLogGuestMode', 'true');
  };

  const value = {
    user,
    loading,
    isGuest,
    signInWithGoogle,
    logout,
    continueAsGuest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};