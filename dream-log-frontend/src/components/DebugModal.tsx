// src/components/DebugModal.tsx - Fixed version

import React from 'react';

interface DebugModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DebugModal: React.FC<DebugModalProps> = ({ isOpen, onClose }) => {
  console.log('DebugModal render - isOpen:', isOpen);
  
  if (!isOpen) {
    console.log('DebugModal not rendering - isOpen is false');
    return null;
  }

  console.log('DebugModal about to render content');
  
  // Simple div without portal
  const simpleModal = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 0, 0, 0.8)', // Red background to make it obvious
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
      }}
      onClick={onClose}
    >
      <div>
        DEBUG MODAL IS VISIBLE!
        <br />
        Click anywhere to close
      </div>
    </div>
  );

  console.log('DebugModal returning content');
  
  // Return the simple version
  return simpleModal;
};

export default DebugModal;