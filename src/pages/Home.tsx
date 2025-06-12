
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedJobsSection from '@/components/home/FeaturedJobsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CTASection from '@/components/home/CTASection';

interface HomeProps {
  onAuthRequired?: () => void;
}

const Home = ({ onAuthRequired }: HomeProps) => {
  const handleViewAllJobs = () => {
    // This will be handled by the parent component's navigation
    window.location.hash = '#jobs';
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
