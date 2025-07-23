// src/components/journal/EmptyJournal.tsx

import React from 'react';
import { Book } from 'lucide-react';

const EmptyJournal: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Book style={{ width: '64px', height: '64px' }} />
      </div>
      <p className="empty-state-text">No dreams recorded yet</p>
      <p className="empty-state-subtext">Start by creating your first dream story</p>
    </div>
  );
};

export default EmptyJournal;