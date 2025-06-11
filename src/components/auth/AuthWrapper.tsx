
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupFlow from './SignupFlow';
import { useAuth } from '@/contexts/AuthContext';

interface AuthWrapperProps {
  children: React.ReactNode;
  authMode?: 'login' | 'signup' | null;
  setAuthMode?: (mode: 'login' | 'signup' | null) => void;
}

const AuthWrapper = ({ children, authMode: externalAuthMode, setAuthMode: externalSetAuthMode }: AuthWrapperProps) => {
  const { user } = useAuth();
  const [internalAuthMode, setInternalAuthMode] = useState<'login' | 'signup' | null>(null);

  // Use external auth mode if provided, otherwise use internal
  const authMode = externalAuthMode !== undefined ? externalAuthMode : internalAuthMode;
  const setAuthMode = externalSetAuthMode || setInternalAuthMode;

  const handleLogin = () => {
    setAuthMode(null);
  };

  const handleSignupComplete = () => {
    setAuthMode(null);
  };

  const handleCancel = () => {
    setAuthMode(null);
  };

  // Show auth forms if not authenticated and auth mode is set
  if (!user && authMode) {
    if (authMode === 'login') {
      return (
        <LoginForm
          onLogin={handleLogin}
          onSignup={() => setAuthMode('signup')}
          onCancel={handleCancel}
        />
      );
    }
    
    if (authMode === 'signup') {
      return (
        <SignupFlow
          onComplete={handleSignupComplete}
          onCancel={() => setAuthMode('login')}
        />
      );
    }
  }

  // Show main app with auth buttons if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50">
        {/* Auth buttons overlay */}
        <div className="fixed top-4 right-4 z-50 space-x-2">
          <button
            onClick={() => setAuthMode('login')}
            className="bg-white text-chauffer-black px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            Log In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className="bg-chauffer-mint text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            Sign Up
          </button>
        </div>
        
        {children}
      </div>
    );
  }

  // Show main app if authenticated
  return <>{children}</>;
};

export default AuthWrapper;
