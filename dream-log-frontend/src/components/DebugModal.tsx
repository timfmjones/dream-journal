// src/components/DebugModal.tsx - Simple test modal

import React from 'react';
import { createPortal } from 'react-dom';

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
  
  // Test 1: Simple div without portal
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

  // Test 2: Portal version
  const portalModal = createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 255, 0, 0.8)', // Green background for portal
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
        PORTAL DEBUG MODAL IS VISIBLE!
        <br />
        Click anywhere to close
      </div>
    </div>,
    document.body
  );

  console.log('DebugModal returning content');
  
  // Try the simple version first
  return simpleModal;
  
  // If simple works, uncomment this line and comment out the return above:
  // return portalModal;
};

export default DebugModal;