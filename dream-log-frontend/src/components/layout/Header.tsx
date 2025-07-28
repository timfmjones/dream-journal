// src/components/layout/Header.tsx

import React from 'react';
import { Home, Book, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';
import type { ViewType } from '../../types';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onAuthClick }) => {
  const { user, isGuest } = useAuth();

  const navItems = [
    { id: 'create' as ViewType, label: 'Home', icon: Home },
    { id: 'journal' as ViewType, label: 'Journal', icon: Book },
    { id: 'settings' as ViewType, label: 'Settings', icon: Settings }
  ];

  return (
    <header className="header-container">
      <div className="content-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Logo size="small" showText={true} />
          </div>
          
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`nav-button ${currentView === id ? 'active' : ''}`}
              >
                <Icon style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '6px' }} />
                {label}
              </button>
            ))}

            <div style={{ marginLeft: '16px' }}>
              {user && !isGuest ? (
                <button
                  onClick={() => onViewChange('settings')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </div>
                </button>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="sign-in-button"
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;