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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setIsGuest(false);
      }
      setLoading(false);
    });

    // Check if user has chosen guest mode before
    const guestMode = localStorage.getItem('dreamLogGuestMode');
    if (guestMode === 'true' && !user) {
      setIsGuest(true);
    }

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsGuest(false);
      localStorage.removeItem('dreamLogGuestMode');
    } catch (error) {
      console.error('Error signing in with Google:', error);
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