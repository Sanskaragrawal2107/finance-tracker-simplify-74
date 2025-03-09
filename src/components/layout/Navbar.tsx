
import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onMenuClick: () => void;
  pageTitle?: string;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  pageTitle,
  className
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <header className={cn("h-16 border-b bg-background/50 backdrop-blur-md sticky top-0 z-10", className)}>
      <div className="h-full container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="p-2"
          >
            <Home className="h-5 w-5 text-muted-foreground" />
          </Button>
          {pageTitle && !isMobile && (
            <h1 className="text-lg font-medium">{pageTitle}</h1>
          )}
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Logo image */}
            <img 
              src="/lovable-uploads/74a5a478-2c11-4188-88b3-76b7897376a9.png" 
              alt="MEW Logo" 
              className="h-8 md:h-12 object-contain" 
            />
            {/* Company name image */}
            <img 
              src="/lovable-uploads/1d876bba-1f25-45bf-9f5b-8f81f72d4880.png" 
              alt="MAURICE ENGINEERING WORKS" 
              className="h-7 md:h-10 object-contain" 
            />
          </div>
        </div>
        
        <div className="w-10 md:w-20">
          {/* Empty div for layout balance */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
