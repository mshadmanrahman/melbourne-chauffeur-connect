
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
    <div className="py-20 bg-gradient-to-br from-chauffer-gray-50 via-white to-chauffer-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-chauffer-mint/5 to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-chauffer-mint/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-chauffer-mint/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-chauffer-black mb-6 leading-tight">
          Ready to Start Earning?
        </h2>
        <p className="text-xl text-chauffer-gray-500 mb-10 max-w-2xl mx-auto">
          Join Melbourne's most trusted chauffeur network today and start earning with flexible schedules
        </p>
        
        {!user ? (
          <Button 
            size="lg" 
            className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={onAuthRequired}
          >
            Sign Up Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Button 
            size="lg" 
            className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
