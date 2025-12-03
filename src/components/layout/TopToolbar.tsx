import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, HelpCircle, Menu, X, LogIn, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import tamvLogo from "@/assets/tamv-logo.png";
import WalletIconButton from "@/components/wallet/WalletIconButton";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TopToolbarProps {
  onMenuToggle?: () => void;
  onHelpClick?: () => void;
  isSidebarOpen?: boolean;
}

export default function TopToolbar({ onMenuToggle, onHelpClick, isSidebarOpen }: TopToolbarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
    } else {
      toast.success("Sesión cerrada");
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
      
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
          
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src={tamvLogo} 
              alt="TAMV Online" 
              className="h-8 w-auto object-contain"
            />
            <span className="hidden md:block text-lg font-bold text-glow-gold">
              TAMV
            </span>
          </button>
        </div>

        {/* Center Section - Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden sm:block">
          <div className={`relative transition-all duration-300 ${searchFocused ? "scale-105" : ""}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar creadores, grupos, DreamSpaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`pl-10 bg-secondary/50 border-border transition-all duration-300 ${
                searchFocused 
                  ? "border-primary ring-2 ring-primary/20 shadow-gold" 
                  : "focus:border-primary"
              }`}
            />
            {searchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg p-2 z-50">
                <p className="text-xs text-muted-foreground px-2">
                  Presiona Enter para buscar "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden"
            onClick={() => navigate("/explorar")}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <NotificationCenter />

          {/* Help / Tutorials */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/tutoriales")}
            className="hover:text-primary"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Wallet */}
          <WalletIconButton />

          {/* User Avatar / Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {user.email?.[0]?.toUpperCase() || "T"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Miembro TAMV</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/banco")}>
                  <User className="h-4 w-4 mr-2" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/banco")}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Banco TAMV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/auth")}
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden md:inline">Entrar</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
