import { useState } from "react";
import { Search, HelpCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import tamvLogo from "@/assets/tamv-logo.png";
import WalletIconButton from "@/components/wallet/WalletIconButton";
import NotificationCenter from "@/components/notifications/NotificationCenter";

interface TopToolbarProps {
  onMenuToggle?: () => void;
  onHelpClick?: () => void;
  isSidebarOpen?: boolean;
}

export default function TopToolbar({ onMenuToggle, onHelpClick, isSidebarOpen }: TopToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section - Logo & Menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <img 
              src={tamvLogo} 
              alt="TAMV Online" 
              className="h-8 w-auto object-contain"
            />
            <span className="hidden md:block text-lg font-bold text-glow-gold text-primary">
              TAMV
            </span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-xl mx-4 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar creadores, grupos, DreamSpaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <NotificationCenter />

          {/* Help / Tutorials */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onHelpClick}
            className="hover:text-primary"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Wallet */}
          <WalletIconButton />

          {/* User Avatar */}
          <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" 
              alt="Usuario"
              className="h-8 w-8 rounded-full object-cover"
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
