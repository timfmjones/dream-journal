// src/components/common/Logo.tsx

import React from 'react';

interface LogoProps {
  size?: 'small' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'small' }) => (
  <div className={`logo-container ${size === 'large' ? 'large' : ''}`}>
    <div className={`logo-icon ${size === 'large' ? 'large' : ''}`} />
  </div>
);

export default Logo;