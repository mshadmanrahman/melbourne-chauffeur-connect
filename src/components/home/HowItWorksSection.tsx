
import React from 'react';

const HowItWorksSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-chauffer-black mb-4">
            How ChaufferLink Works
          </h2>
          <p className="text-xl text-chauffer-gray-500 max-w-2xl mx-auto">
            Simple, secure, and professional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-chauffer-mint rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-chauffer-black mb-2">Browse Jobs</h3>
            <p className="text-chauffer-gray-500">
              View available transportation requests from verified clients in your area
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-chauffer-mint rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-chauffer-black mb-2">Claim & Complete</h3>
            <p className="text-chauffer-gray-500">
              Accept jobs that fit your schedule and provide premium service
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-chauffer-mint rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-chauffer-black mb-2">Get Paid</h3>
            <p className="text-chauffer-gray-500">
              Receive instant payment after job completion through our secure system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
