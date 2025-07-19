// src/components/journal/EmptyJournal.tsx

import React from 'react';
import Logo from '../common/Logo';

const EmptyJournal: React.FC = () => {
  return (
    <div className="text-center py-16">
      <Logo size="large" />
      <p className="text-gray-500 text-lg mt-4">No dreams recorded yet</p>
      <p className="text-gray-400">Start by creating your first dream story</p>
    </div>
  );
};

export default EmptyJournal;