
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Jobs from '@/pages/Jobs';
import PostJob from '@/pages/PostJob';
import Wallet from '@/pages/Wallet';
import Profile from '@/pages/Profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Jobs />;
      case 'post':
        return <PostJob />;
      case 'wallet':
        return <Wallet />;
      case 'profile':
        return <Profile />;
      default:
        return <Jobs />;
    }
  };

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      {renderActiveTab()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
