// src/contexts/AuthContext.tsx - Fixed for React 19 compatibility
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

    // Only set up auth listener if auth is initialized
    if (!auth) {
      console.warn('Firebase Auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth, 
      (user) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'No user');
        setUser(user);
        if (user) {
          // User is signed in, clear guest mode
          setIsGuest(false);
          localStorage.removeItem('dreamLogGuestMode');
        }
        setLoading(false);
      },
      (error) => {
        // Handle auth state error
        console.warn('Auth state error:', error?.message || 'Unknown error');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error('Firebase Auth not initialized. Please check your configuration.');
    }

    try {
      console.log('Attempting Google sign in...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign in successful:', result.user.email);
      setIsGuest(false);
      localStorage.removeItem('dreamLogGuestMode');
    } catch (error: any) {
      console.warn('Error signing in with Google:', error?.message || 'Unknown error');
      
      // Create a clean error object for React 19
      const cleanError = new Error(
        error?.code === 'auth/popup-blocked' ? 'Pop-up blocked. Please allow pop-ups for this site.' :
        error?.code === 'auth/cancelled-popup-request' ? 'Sign in cancelled.' :
        error?.code === 'auth/popup-closed-by-user' ? 'Sign in window was closed.' :
        error?.message || 'Failed to sign in. Please try again.'
      );
      
      throw cleanError;
    }
  };

  const logout = async () => {
    if (!auth) {
      console.warn('Firebase Auth not initialized');
      return;
    }

    try {
      await signOut(auth);
      setIsGuest(false);
      localStorage.removeItem('dreamLogGuestMode');
    } catch (error: any) {
      console.warn('Error signing out:', error?.message || 'Unknown error');
      throw new Error('Failed to sign out. Please try again.');
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