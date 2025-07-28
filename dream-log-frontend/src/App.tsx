// src/App.tsx - Updated to include floating help button

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import CreateView from './components/create/CreateView';
import JournalView from './components/journal/JournalView';
import SettingsView from './components/settings/SettingsView';
import Header from './components/layout/Header';
import LoadingSpinner from './components/common/LoadingSpinner';
import FloatingHelpButton from './components/common/FloatingHelpButton';
import HelpModal from './components/HelpModal';
import type { ViewType } from './types';

const DreamLogApp = () => {
  const { loading } = useAuth();
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

  return (
    <div className="min-h-screen main-gradient-bg">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onAuthClick={handleAuthClick}
      />
      
      <main className="content-container">
        {currentView === 'create' && <CreateView onNavigateToJournal={() => setCurrentView('journal')} />}
        {currentView === 'journal' && <JournalView />}
        {currentView === 'settings' && <SettingsView onShowAuth={handleAuthClick} />}
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
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <DreamLogApp />
    </AuthProvider>
  );
};

export default App;