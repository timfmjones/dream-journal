// src/components/settings/AccountSection.tsx

import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AccountSectionProps {
  onShowAuth: () => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({ onShowAuth }) => {
  const { user, isGuest, logout } = useAuth();

  return (
    <div className="border-b pb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Account</h3>
      {user && !isGuest ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{user.displayName || 'User'}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
          <p className="text-sm text-gray-600">Your dreams are synced across all your devices</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">
            {isGuest ? "You're in guest mode. Dreams are saved locally only." : "Sign in to sync your dreams across devices"}
          </p>
          <button
            onClick={onShowAuth}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountSection;