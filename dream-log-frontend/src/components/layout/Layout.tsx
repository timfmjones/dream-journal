// src/components/layout/Layout.tsx

import React from 'react';
import Header from './Header';
import type { ViewType } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAuthClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, onAuthClick }) => {
  return (
    <div className="min-h-screen main-gradient-bg">
      <Header 
        currentView={currentView} 
        onViewChange={onViewChange} 
        onAuthClick={onAuthClick} 
      />
      <main>{children}</main>
    </div>
  );
};

export default Layout;