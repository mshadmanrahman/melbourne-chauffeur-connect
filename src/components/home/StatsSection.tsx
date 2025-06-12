
import React from 'react';
import { Users, Shield, DollarSign } from 'lucide-react';

const StatsSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users size={48} className="text-chauffer-mint mb-4" />
            <h3 className="text-3xl font-bold text-chauffer-black mb-2">500+</h3>
            <p className="text-chauffer-gray-500">Active Chauffeurs</p>
          </div>
          <div className="flex flex-col items-center">
            <Shield size={48} className="text-chauffer-mint mb-4" />
            <h3 className="text-3xl font-bold text-chauffer-black mb-2">98%</h3>
            <p className="text-chauffer-gray-500">Job Success Rate</p>
          </div>
          <div className="flex flex-col items-center">
            <DollarSign size={48} className="text-chauffer-mint mb-4" />
            <h3 className="text-3xl font-bold text-chauffer-black mb-2">$150k+</h3>
            <p className="text-chauffer-gray-500">Paid to Drivers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
