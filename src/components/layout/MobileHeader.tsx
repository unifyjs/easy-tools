import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  title: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ setSidebarOpen, title }) => {
  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-4 h-4" />
      </Button>
      <h1 className="font-semibold">{title}</h1>
      <div className="w-8" />
    </div>
  );
};

export default MobileHeader;