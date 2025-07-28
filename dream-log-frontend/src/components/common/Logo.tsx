// src/components/common/Logo.tsx

import React from 'react';

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
  color = '#6B46C1',
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
        gap: showText ? gap : 0,
        background: 'transparent'
      }}
    >
      <img 
        src="/dream-log-icon.svg" 
        alt="Dream Log" 
        width={iconSize} 
        height={iconSize}
        style={{ 
          display: 'block',
          background: 'transparent'
        }}
      />
      {showText && (
        <div style={{ 
          fontSize: fontSize, 
          fontWeight: '700', 
          color: textColor,
          letterSpacing: '0.5px',
          lineHeight: 1.2,
          textAlign: orientation === 'vertical' ? 'center' : 'left'
        }}>
          DreamSprout
        </div>
      )}
    </div>
  );
};

export default Logo;