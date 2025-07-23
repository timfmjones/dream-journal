// src/components/layout/Header.tsx

import React from 'react';
import { Sparkles, Book, Settings, User } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../contexts/AuthContext';
import type { ViewType } from '../../types';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onAuthClick }) => {
  const { user, isGuest } = useAuth();

  const navItems = [
    { id: 'create' as ViewType, label: 'Create', icon: Sparkles },
    { id: 'journal' as ViewType, label: 'Journal', icon: Book },
    { id: 'settings' as ViewType, label: 'Settings', icon: Settings }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="w-full px-4">
        <div className="max-w-6xl mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo />
              <h1 className="text-xl font-bold text-gray-800">Dream Log</h1>
            </div>
            
            <nav className="flex items-center space-x-2">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    currentView === id 
                      ? 'bg-purple-100 text-purple-700 shadow-sm' 
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}

              <div className="ml-4 pl-4 border-l border-gray-300">
                {user && !isGuest ? (
                  <button
                    onClick={() => onViewChange('settings')}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={onAuthClick}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isGuest ? 'Sign In' : 'Get Started'}
                    </span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;