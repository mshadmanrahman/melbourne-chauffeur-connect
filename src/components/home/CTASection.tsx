
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CTASectionProps {
  onAuthRequired?: () => void;
  onViewAllJobs: () => void;
}

const CTASection = ({ onAuthRequired, onViewAllJobs }: CTASectionProps) => {
  const { user } = useAuth();

  return (
    <div className="py-16 bg-chauffer-black">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Start Earning?
        </h2>
        <p className="text-xl text-chauffer-gray-100 mb-8">
          Join Melbourne's most trusted chauffeur network today
        </p>
        
        {!user ? (
          <Button 
            size="lg" 
            className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white text-lg px-8 py-4 shadow-lg"
            onClick={onAuthRequired}
          >
            Sign Up Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Button 
            size="lg" 
            className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white text-lg px-8 py-4 shadow-lg"
            onClick={onViewAllJobs}
          >
            Start Browsing Jobs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CTASection;
