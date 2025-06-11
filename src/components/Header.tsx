
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
}

const Header = ({ title, showNotifications = true }: HeaderProps) => {
  return (
    <header className="sticky top-0 bg-white border-b border-chauffer-gray-200 z-40">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-semibold text-chauffer-black">{title}</h1>
        </div>
        
        {showNotifications && (
          <Button variant="ghost" size="sm" className="p-2">
            <Bell size={20} className="text-chauffer-gray-500" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
