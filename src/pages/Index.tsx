
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Jobs from '@/pages/Jobs';
import PostJob from '@/pages/PostJob';
import Wallet from '@/pages/Wallet';
import Profile from '@/pages/Profile';
import AuthWrapper from '@/components/auth/AuthWrapper';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  const handleAuthRequired = () => {
    setAuthMode('login');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Jobs onAuthRequired={handleAuthRequired} />;
      case 'post':
        return <PostJob />;
      case 'wallet':
        return <Wallet />;
      case 'profile':
        return <Profile />;
      default:
        return <Jobs onAuthRequired={handleAuthRequired} />;
    }
  };

  return (
    <AuthWrapper authMode={authMode} setAuthMode={setAuthMode}>
      <div className="min-h-screen bg-chauffer-gray-50">
        {/* Desktop Layout */}
        <div className="hidden md:flex">
          {/* Desktop Sidebar */}
          <div className="w-64 bg-white border-r border-chauffer-gray-200 min-h-screen fixed left-0 top-0 z-40">
            <div className="p-6 border-b border-chauffer-gray-200">
              <h1 className="text-2xl font-bold text-chauffer-black">ChaufferLink</h1>
              <p className="text-sm text-chauffer-gray-500 mt-1">Melbourne's Premier Network</p>
            </div>
            
            <nav className="p-4">
              <div className="space-y-2">
                {[
                  { id: 'home', label: 'Available Jobs', icon: '🏠' },
                  { id: 'post', label: 'Post a Job', icon: '➕' },
                  { id: 'wallet', label: 'Wallet', icon: '💰' },
                  { id: 'profile', label: 'Profile', icon: '👤' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-chauffer-mint text-white'
                        : 'text-chauffer-gray-700 hover:bg-chauffer-gray-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Desktop Main Content */}
          <div className="flex-1 ml-64">
            {renderActiveTab()}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {renderActiveTab()}
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Index;
