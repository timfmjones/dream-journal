// src/components/AuthModal.tsx - Fixed version using inline styles

import React from 'react';
import { User, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Logo Component
const DreamLogLogo: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'small' }) => (
  <div 
    style={{
      width: size === 'large' ? '64px' : '32px',
      height: size === 'large' ? '64px' : '32px',
      background: 'linear-gradient(135deg, #6b46c1 0%, #7c3aed 100%)',
      borderRadius: size === 'large' ? '20px' : '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}
  >
    <div 
      style={{
        width: size === 'large' ? '36px' : '20px',
        height: size === 'large' ? '36px' : '20px',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg fill='white'%3E%3Crect x='10' y='15' width='80' height='70' rx='8' ry='8' fill='none' stroke='white' stroke-width='3'/%3E%3Cpath d='M25 35 L35 45 L25 55 M45 55 L75 55' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='30' cy='25' r='2' fill='white'/%3E%3Ccircle cx='40' cy='25' r='2' fill='white'/%3E%3Ccircle cx='50' cy='25' r='2' fill='white'/%3E%3Cpath d='M20 8 Q30 3 40 8 Q50 3 60 8 Q70 3 80 8' stroke='white' stroke-width='2' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    />
  </div>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, continueAsGuest } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  console.log('AuthModal render - isOpen:', isOpen);

  if (!isOpen) {
    console.log('AuthModal not rendering - isOpen is false');
    return null;
  }

  console.log('AuthModal rendering modal content');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please allow pop-ups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Sign in cancelled.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign in window was closed.');
      } else {
        setError(error.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    try {
      continueAsGuest();
      onClose();
    } catch (error) {
      console.error('Guest mode error:', error);
      setError('Failed to continue as guest. Please try again.');
    }
  };

  // Use the same style approach as the working debug modal
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '448px',
          width: '100%',
          padding: '32px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: '#9CA3AF',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#6B7280'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
        >
          <X style={{ width: '24px', height: '24px' }} />
        </button>

        <div style={{ textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <DreamLogLogo size="large" />
          </div>

          {/* Title */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px', margin: 0 }}>
              Welcome to Dream Log
            </h2>
            <p style={{ color: '#6B7280', margin: 0 }}>
              Sign in to save your dreams across devices
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '24px'
            }}>
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ marginBottom: '24px' }}>
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: 'white',
                border: '2px solid #D1D5DB',
                color: '#374151',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                transition: 'all 0.2s',
                marginBottom: '12px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = '#9CA3AF';
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = '#D1D5DB';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #6B7280',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ position: 'relative', margin: '16px 0' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', borderTop: '1px solid #D1D5DB' }} />
              </div>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '14px' }}>
                <span style={{ padding: '0 8px', backgroundColor: 'white', color: '#6B7280' }}>or</span>
              </div>
            </div>

            {/* Guest Button */}
            <button
              onClick={handleGuestMode}
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                transition: 'all 0.2s',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }
              }}
            >
              <User style={{ width: '20px', height: '20px' }} />
              <span>Continue as Guest</span>
            </button>
          </div>

          {/* Footer text */}
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
            Guest mode saves dreams locally on this device only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;