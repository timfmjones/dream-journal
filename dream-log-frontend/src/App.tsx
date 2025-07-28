// src/App.tsx - Complete updated version with mobile support
import React, { useState, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useMobileDetect } from './hooks/useMobileDetect';
import LoadingSpinner from './components/common/LoadingSpinner';
import FloatingHelpButton from './components/common/FloatingHelpButton';
import ErrorBoundary from './components/common/ErrorBoundary';
import type { ViewType } from './types';

// Lazy load components for better performance
const CreateView = lazy(() => import('./components/create/CreateView'));
const MobileCreateView = lazy(() => import('./components/create/MobileCreateView'));
const JournalView = lazy(() => import('./components/journal/JournalView'));
const SettingsView = lazy(() => import('./components/settings/SettingsView'));
const Header = lazy(() => import('./components/layout/Header'));
const MobileHeader = lazy(() => import('./components/layout/MobileHeader'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const HelpModal = lazy(() => import('./components/HelpModal'));

const DreamLogApp = () => {
  const { loading } = useAuth();
  const { isMobile } = useMobileDetect();
  const [currentView, setCurrentView] = useState<ViewType>('create');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center main-gradient-bg">
        <LoadingSpinner message="Loading Dream Log..." />
      </div>
    );
  }

  const HeaderComponent = isMobile ? MobileHeader : Header;
  const CreateComponent = isMobile ? MobileCreateView : CreateView;

  return (
    <div className="min-h-screen main-gradient-bg">
      <Suspense fallback={<LoadingSpinner />}>
        <HeaderComponent 
          currentView={currentView} 
          onViewChange={setCurrentView}
          onAuthClick={handleAuthClick}
        />
        
        <main className={isMobile ? "" : "content-container"}>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          }>
            {currentView === 'create' && (
              <CreateComponent onNavigateToJournal={() => setCurrentView('journal')} />
            )}
            {currentView === 'journal' && <JournalView />}
            {currentView === 'settings' && (
              <SettingsView onShowAuth={handleAuthClick} />
            )}
          </Suspense>
        </main>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleCloseModal}
        />
        
        <HelpModal 
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />
        
        <FloatingHelpButton onClick={() => setShowHelpModal(true)} />
      </Suspense>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DreamLogApp />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;