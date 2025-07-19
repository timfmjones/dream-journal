// src/components/common/LoadingSpinner.tsx

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => (
  <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
    <p className="text-gray-600">{message}</p>
  </div>
);

export default LoadingSpinner;