// src/components/common/DreamLogIcon.tsx

import React from 'react';

interface DreamLogIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const DreamLogIcon: React.FC<DreamLogIconProps> = ({ 
  width = 100, 
  height = 100, 
  color = '#6B46C1' 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Book shape with rounded corners */}
      <rect
        x="15"
        y="10"
        width="70"
        height="80"
        rx="8"
        ry="8"
        fill={color}
      />
      
      {/* Book spine/binding */}
      <rect
        x="15"
        y="10"
        width="12"
        height="80"
        rx="6"
        ry="6"
        fill={color}
        opacity="0.8"
      />
      
      {/* Inner page/content area */}
      <rect
        x="25"
        y="20"
        width="50"
        height="60"
        rx="4"
        ry="4"
        fill="white"
      />
      
      {/* Moon */}
      <path
        d="M 55 40 
           C 55 30, 48 25, 40 30
           C 42 25, 50 25, 55 32
           C 60 40, 58 48, 50 52
           C 58 50, 55 45, 55 40"
        fill={color}
      />
      
      {/* Stars */}
      <g fill={color}>
        {/* Star 1 */}
        <path d="M 35 35 L 36.5 38 L 40 38.5 L 37 41 L 37.5 44.5 L 35 42.5 L 32.5 44.5 L 33 41 L 30 38.5 L 33.5 38 Z" />
        
        {/* Star 2 - smaller */}
        <g transform="translate(28, 48) scale(0.7)">
          <path d="M 0 0 L 1.5 3 L 5 3.5 L 2 6 L 2.5 9.5 L 0 7.5 L -2.5 9.5 L -2 6 L -5 3.5 L -1.5 3 Z" />
        </g>
      </g>
    </svg>
  );
};

export default DreamLogIcon;