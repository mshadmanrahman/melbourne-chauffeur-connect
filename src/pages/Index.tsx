
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import Jobs from '@/pages/Jobs';
import PostJob from '@/pages/PostJob';
import Wallet from '@/pages/Wallet';
import Profile from '@/pages/Profile';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { Home as HomeIcon, Briefcase, Plus, Wallet as WalletIcon, User } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  const handleAuthRequired = () => {
    setAuthMode('login');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home onAuthRequired={handleAuthRequired} />;
      case 'jobs':
        return <Jobs onAuthRequired={handleAuthRequired} />;
      case 'post':
        return <PostJob />;
      case 'wallet':
        return <Wallet />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onAuthRequired={handleAuthRequired} />;
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
                  { id: 'home', label: 'Home', icon: HomeIcon },
                  { id: 'jobs', label: 'Jobs', icon: Briefcase },
                  { id: 'post', label: 'Post a Job', icon: Plus },
                  { id: 'wallet', label: 'Wallet', icon: WalletIcon },
                  { id: 'profile', label: 'Profile', icon: User },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-chauffer-mint text-white'
                          : 'text-chauffer-gray-700 hover:bg-chauffer-gray-100'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Desktop Main Content */}
          <div className="flex-1 ml-64 flex flex-col min-h-screen">
            <div className="flex-1">
              {renderActiveTab()}
            </div>
            
            {/* Desktop Footer */}
            <footer className="bg-white border-t border-chauffer-gray-200 py-4 px-8">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-chauffer-gray-500">
                <div className="flex items-center space-x-1">
                  <span>© 2024 ChaufferLink. All rights reserved.</span>
                </div>
                <div className="flex items-center space-x-6 mt-2 md:mt-0">
                  <a href="#" className="hover:text-chauffer-black transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-chauffer-black transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-chauffer-black transition-colors">Support</a>
                </div>
              </div>
            </footer>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col min-h-screen">
          <div className="flex-1">
            {renderActiveTab()}
          </div>
          
          {/* Mobile Footer */}
          <footer className="bg-white border-t border-chauffer-gray-200 py-3 px-4 pb-20">
            <div className="text-center text-xs text-chauffer-gray-500">
              © 2024 ChaufferLink. All rights reserved.
            </div>
          </footer>
          
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Index;
