
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeroSectionProps {
  onAuthRequired?: () => void;
  onViewAllJobs: () => void;
}

const HeroSection = ({ onAuthRequired, onViewAllJobs }: HeroSectionProps) => {
  const { user } = useAuth();

  return (
    <div className="relative bg-white border-b border-chauffer-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-chauffer-black leading-tight">
            Melbourne's Premier
            <br />
            <span className="text-chauffer-mint">Chauffeur Network</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-chauffer-gray-500 max-w-3xl mx-auto leading-relaxed">
            Connect professional chauffeurs with clients who need premium transportation services
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white text-lg px-8 py-4 shadow-lg"
                onClick={onAuthRequired}
              >
                Get Started as Driver
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-chauffer-black text-chauffer-black hover:bg-chauffer-black hover:text-white text-lg px-8 py-4"
                onClick={onAuthRequired}
              >
                Post a Job
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white text-lg px-8 py-4 shadow-lg"
                onClick={onViewAllJobs}
              >
                View Available Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-chauffer-mint/10 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-chauffer-mint/5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-chauffer-mint/10 rounded-full"></div>
      </div>
    </div>
  );
};

export default HeroSection;
