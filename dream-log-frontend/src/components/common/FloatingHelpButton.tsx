// src/components/common/FloatingHelpButton.tsx

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface FloatingHelpButtonProps {
  onClick: () => void;
}

const FloatingHelpButton: React.FC<FloatingHelpButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '28px',
        background: 'linear-gradient(135deg, #6b46c1 0%, #7c3aed 100%)',
        boxShadow: '0 4px 14px rgba(102, 51, 238, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 51, 238, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(102, 51, 238, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
      }}
      title="Help & Support"
      aria-label="Open help menu"
    >
      <HelpCircle 
        style={{ 
          width: '28px', 
          height: '28px', 
          color: 'white',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
        }} 
      />
      
      {/* Pulse animation for attention */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          animation: 'helpPulse 2s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />
      
      <style>
        {`
          @keyframes helpPulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.5;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @media (max-width: 640px) {
            .floating-help-button {
              bottom: 16px !important;
              right: 16px !important;
              width: 48px !important;
              height: 48px !important;
            }
            
            .floating-help-button svg {
              width: 24px !important;
              height: 24px !important;
            }
          }
        `}
      </style>
    </button>
  );
};

export default FloatingHelpButton;