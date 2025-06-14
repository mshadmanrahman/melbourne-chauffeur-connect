import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJobNotifications } from "@/hooks/useJobNotifications";

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
}

const Header = ({ title, showNotifications = true }: HeaderProps) => {
  const { hasUnread, markAsRead } = useJobNotifications();

  return (
    <header className="sticky top-0 bg-white border-b border-chauffer-gray-200 z-40">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-semibold text-chauffer-black">{title}</h1>
        </div>
        {showNotifications && (
          <button
            type="button"
            className="relative p-2"
            onClick={markAsRead}
            aria-label="Notifications"
          >
            {/* Bell icon */}
            <span className="sr-only">Notifications</span>
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={hasUnread ? "#21C4B5" : "#9CA3AF"}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bell"
            >
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11.5a6.5 6.5 0 0 0-13 0v2.658c0 .538-.214 1.055-.595 1.437L3 17h5"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {/* Notification badge */}
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-chauffer-mint rounded-full animate-pulse border-2 border-white" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
