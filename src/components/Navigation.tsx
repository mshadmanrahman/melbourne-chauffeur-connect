
import React from 'react';
import { Home, Plus, User, Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showLogout?: boolean;
  onLogout?: () => void;
}

const Navigation = ({ activeTab, onTabChange, showLogout, onLogout }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'post', label: 'Post', icon: Plus },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-chauffer-gray-200 z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-2 h-auto min-w-[60px] ${
                isActive 
                  ? 'text-chauffer-mint' 
                  : 'text-chauffer-gray-500 hover:text-chauffer-black'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
        {/* Logout button on mobile */}
        {showLogout && onLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            aria-label="Logout"
            className="flex flex-col items-center justify-center p-2 h-auto min-w-[60px] text-red-500"
          >
            <LogOut size={20} className="mb-1" />
            <span className="text-xs font-medium">Logout</span>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
