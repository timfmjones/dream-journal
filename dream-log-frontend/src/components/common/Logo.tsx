// src/components/common/Logo.tsx

import React from 'react';
import DreamLogIcon from './DreamLogIcon';

interface LogoProps {
  size?: 'small' | 'large';
  showText?: boolean;
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'small', 
  showText = false,
  orientation = 'horizontal',
  color = '#422163',
  textColor = '#1a1a1a'
}) => {
  const iconSize = size === 'large' ? 80 : 32;
  const fontSize = size === 'large' ? '28px' : '20px';
  const gap = size === 'large' ? '16px' : '12px';
  
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: showText ? gap : 0
      }}
    >
      <DreamLogIcon width={iconSize} color={color} />
      {showText && !showText && ( // Hide text since it's now part of the logo
        <div style={{ 
          fontSize: fontSize, 
          fontWeight: '700', 
          color: textColor,
          letterSpacing: '0.5px',
          lineHeight: 1.2,
          textAlign: orientation === 'vertical' ? 'center' : 'left'
        }}>
          DREAM LOG
        </div>
      )}
    </div>
  );
};

export default Logo;