// src/components/settings/DataManagementSection.tsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface DataManagementSectionProps {
  dreamCount: number;
  onClearDreams: () => void;
}

const DataManagementSection: React.FC<DataManagementSectionProps> = ({ dreamCount, onClearDreams }) => {
  const { isGuest } = useAuth();

  const handleClearDreams = () => {
    if (confirm('Are you sure you want to clear all dreams? This cannot be undone.')) {
      onClearDreams();
    }
  };

  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
      <div className="space-y-4">
        <p className="text-gray-600">Total dreams saved: {dreamCount}</p>
        {isGuest && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 flex items-center space-x-2">
              <span>⚠️</span>
              <span>Guest mode: Dreams are only saved on this device</span>
            </p>
          </div>
        )}
        <button
          onClick={handleClearDreams}
          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          Clear All Dreams
        </button>
      </div>
    </div>
  );
};

export default DataManagementSection;