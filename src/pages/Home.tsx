
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedJobsSection from '@/components/home/FeaturedJobsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CTASection from '@/components/home/CTASection';
import Jobs from '@/pages/Jobs';
import { useAuth } from '@/contexts/AuthContext';

interface HomeProps {
  onAuthRequired?: () => void;
  setActiveTab?: (tab: string) => void;
}

const Home = ({ onAuthRequired, setActiveTab }: HomeProps) => {
  const { user } = useAuth();

  // If user is logged in, show the Jobs page instead of marketing homepage
  if (user) {
    return <Jobs onAuthRequired={onAuthRequired} />;
  }

  // Prefer index-driven tab change; fallback to hash as last resort
  const handleViewAllJobs = () => {
    if (setActiveTab) setActiveTab('jobs');
    else window.location.hash = '#jobs';
  };

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <HeroSection 
        onAuthRequired={onAuthRequired} 
        onViewAllJobs={handleViewAllJobs} 
      />
      <StatsSection />
      <FeaturedJobsSection 
        onAuthRequired={onAuthRequired} 
        onViewAllJobs={handleViewAllJobs} 
      />
      <HowItWorksSection />
      <CTASection 
        onAuthRequired={onAuthRequired} 
        onViewAllJobs={handleViewAllJobs} 
      />
    </div>
  );
};

export default Home;
