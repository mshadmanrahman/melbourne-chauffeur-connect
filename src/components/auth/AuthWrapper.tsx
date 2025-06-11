
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupFlow from './SignupFlow';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setAuthMode(null);
  };

  const handleSignupComplete = () => {
    setIsAuthenticated(true);
    setAuthMode(null);
  };

  const handleCancel = () => {
    setAuthMode(null);
  };

  // Show auth forms if not authenticated and auth mode is set
  if (!isAuthenticated && authMode) {
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
  if (!isAuthenticated) {
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
