// src/App.tsx - Final version with working AuthModal

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal'; // Back to the real modal
import Layout from './components/layout/Layout';
import CreateView from './components/create/CreateView';
import JournalView from './components/journal/JournalView';
import SettingsView from './components/settings/SettingsView';
import LoadingSpinner from './components/common/LoadingSpinner';
import type { ViewType } from './types';

const DreamLogApp = () => {
  const { loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('create');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    console.log('Auth button clicked, opening modal...');
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing auth modal...');
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
    <>
      <Layout 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onAuthClick={handleAuthClick}
      >
        {currentView === 'create' && <CreateView onNavigateToJournal={() => setCurrentView('journal')} />}
        {currentView === 'journal' && <JournalView />}
        {currentView === 'settings' && <SettingsView onShowAuth={handleAuthClick} />}
      </Layout>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseModal}
      />
    </>
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