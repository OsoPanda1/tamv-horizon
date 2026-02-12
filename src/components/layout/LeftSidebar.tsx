import { useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { useGamification } from "@/hooks/useGamification";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import {
  Home, Compass, Music, Gavel, Sparkles, Users, Radio, PawPrint, 
  Landmark, ChevronDown, ChevronRight, Zap, Trophy, BookOpen, 
  Settings, FileText, Shield, Vote, X, ChevronLeft,
  ShoppingBag, Palette, GraduationCap, Headphones, Image, Globe, Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarSection {
  title: string;
  items: SidebarItem[];
  defaultOpen?: boolean;
}

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
  isLive?: boolean;
  id?: string;
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Principal",
    defaultOpen: true,
    items: [
      { icon: Home, label: "Inicio", path: "/" },
      { icon: Compass, label: "Explorar", path: "/explorar" },
      { icon: Zap, label: "Puentes Oníricos", path: "/puentes-oniricos", id: "tamv-puentes" },
      { icon: Globe, label: "Feed Global", path: "/explorar", badge: "LIVE" },
    ]
  },
  {
    title: "Social",
    defaultOpen: true,
    items: [
      { icon: Users, label: "Grupos", path: "/grupos" },
      { icon: Radio, label: "Canales", path: "/canales" },
      { icon: Image, label: "Reels & Stories", path: "/explorar" },
      { icon: Headphones, label: "Música", path: "/conciertos" },
    ]
  },
  {
    title: "Experiencias",
    defaultOpen: true,
    items: [
      { icon: Music, label: "Conciertos Sensoriales", path: "/conciertos", isLive: true, id: "tamv-experiences" },
      { icon: Sparkles, label: "DreamSpaces", path: "/dreamspaces" },
      { icon: Gavel, label: "Subastas", path: "/subastas", badge: "12" },
      { icon: Palette, label: "Galerías de Arte", path: "/subastas" },
    ]
  },
  {
    title: "Marketplace",
    defaultOpen: false,
    items: [
      { icon: ShoppingBag, label: "Tienda Digital", path: "/subastas" },
      { icon: PawPrint, label: "Mascotas & CGifts", path: "/mascotas" },
      { icon: Ticket, label: "Tickets & Eventos", path: "/conciertos" },
    ]
  },
  {
    title: "Economía",
    defaultOpen: false,
    items: [
      { icon: Landmark, label: "Banco TAMV", path: "/banco" },
      { icon: Trophy, label: "Retos y Concursos", path: "/retos", id: "tamv-challenges" },
    ]
  },
  {
    title: "Aprendizaje",
    defaultOpen: false,
    items: [
      { icon: GraduationCap, label: "Universidad TAMV", path: "/tutoriales" },
      { icon: BookOpen, label: "Tutoriales", path: "/tutoriales" },
    ]
  },
  {
    title: "Gobernanza",
    defaultOpen: false,
    items: [
      { icon: Vote, label: "DAO Governance", path: "/dao" },
      { icon: FileText, label: "Documentos", path: "/documentos" },
      { icon: Shield, label: "Protocolos", path: "/protocolos" },
    ]
  },
  {
    title: "Configuración",
    defaultOpen: false,
    items: [
      { icon: Settings, label: "Ajustes", path: "/configuracion" },
    ]
  }
];
interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function LeftSidebar({ isOpen = true, onClose }: LeftSidebarProps) {
  const { user } = useAuth();
  const { userLevel } = useGamification(user?.id);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    sidebarSections.reduce((acc, section) => ({
      ...acc,
      [section.title]: section.defaultOpen ?? false
    }), {})
  );

  const toggleSection = (title: string) => {
    if (isCollapsed) return;
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      // Collapse all sections when collapsing sidebar
      setOpenSections(sidebarSections.reduce((acc, section) => ({
        ...acc,
        [section.title]: false
      }), {}));
    }
  };

  // Calculate XP progress
  const xpProgress = userLevel ? 
    ((userLevel.xp || 0) / ((userLevel.xp || 0) + (userLevel.xpToNext || 100))) * 100 : 65;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-sidebar border-r border-sidebar-border z-40",
          "overflow-y-auto scrollbar-thin transition-all duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Collapse Toggle */}
        <div className="hidden lg:flex justify-end p-2 border-b border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8 hover:bg-muted"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Mobile Close */}
        <div className="lg:hidden flex justify-end p-2 border-b border-sidebar-border">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className={cn("p-2 space-y-1", isCollapsed && "px-1")}>
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-2">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-xs font-semibold",
                  "text-muted-foreground uppercase tracking-wider",
                  "hover:text-foreground transition-colors rounded-md hover:bg-muted/50",
                  isCollapsed && "justify-center px-2"
                )}
              >
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{section.title}</span>
                    {openSections[section.title] ? (
                      <ChevronDown className="h-3 w-3 transition-transform" />
                    ) : (
                      <ChevronRight className="h-3 w-3 transition-transform" />
                    )}
                  </>
                )}
                {isCollapsed && (
                  <span className="text-[10px]">{section.title[0]}</span>
                )}
              </button>

              {/* Section Items - Accordion Animation */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openSections[section.title] || isCollapsed 
                    ? "max-h-96 opacity-100" 
                    : "max-h-0 opacity-0"
                )}
              >
                <div className="mt-1 space-y-0.5">
                  {section.items.map((item, idx) => (
                    <NavLink
                      key={item.id || `${section.title}-${item.path}-${idx}`}
                      to={item.path}
                      id={item.id}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg",
                        "text-muted-foreground hover:text-foreground",
                        "hover:bg-muted/50 transition-all duration-200",
                        "group relative",
                        isCollapsed && "justify-center px-2"
                      )}
                      activeClassName="bg-primary/10 text-primary border-l-2 border-primary"
                      onClick={onClose}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 flex-shrink-0",
                        "group-hover:text-primary transition-colors"
                      )} />
                      
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-sm">{item.label}</span>
                          
                          {item.isLive && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                            </span>
                          )}
                          
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className={cn(
                          "absolute left-full ml-2 px-2 py-1 rounded-md",
                          "bg-popover text-popover-foreground text-sm whitespace-nowrap",
                          "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                          "transition-all duration-200 z-50 shadow-lg border border-border"
                        )}>
                          {item.label}
                          {item.badge && (
                            <span className="ml-2 text-xs text-primary">({item.badge})</span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* User Stats - Bottom Section */}
        {!isCollapsed && (
          <div className="p-3 mt-auto border-t border-sidebar-border">
            <div className="card-tamv p-3 space-y-2 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Nivel</span>
                <span className="font-semibold text-glow-gold">{userLevel?.level || 1}</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {userLevel?.xp || 0} / {(userLevel?.xp || 0) + (userLevel?.xpToNext || 100)} XP
              </p>
              <p className="text-xs text-primary font-medium">{userLevel?.title || "Aprendiz TAMV"}</p>
            </div>
          </div>
        )}

        {/* Mini Stats for Collapsed */}
        {isCollapsed && (
          <div className="p-2 mt-auto border-t border-sidebar-border">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-primary">Nv</span>
              <span className="text-lg font-bold text-glow-gold">{userLevel?.level || 1}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
