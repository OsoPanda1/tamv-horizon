import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import {
  Home,
  Compass,
  Music,
  Gavel,
  Sparkles,
  Users,
  Radio,
  PawPrint,
  Landmark,
  ChevronDown,
  ChevronRight,
  Zap,
  Trophy,
  BookOpen,
  Settings,
  FileText,
  Shield,
  Vote
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    ]
  },
  {
    title: "Experiencias",
    defaultOpen: true,
    items: [
      { icon: Music, label: "Conciertos Sensoriales", path: "/conciertos", isLive: true, id: "tamv-experiences" },
      { icon: Sparkles, label: "DreamSpaces", path: "/dreamspaces" },
      { icon: Gavel, label: "Subastas", path: "/subastas", badge: "12" },
    ]
  },
  {
    title: "Comunidad",
    defaultOpen: true,
    items: [
      { icon: Users, label: "Grupos", path: "/grupos" },
      { icon: Radio, label: "Canales", path: "/canales" },
      { icon: PawPrint, label: "Mascotas Digitales", path: "/mascotas" },
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
    title: "Gobernanza",
    defaultOpen: false,
    items: [
      { icon: Vote, label: "DAO Governance", path: "/dao" },
      { icon: FileText, label: "Documentos", path: "/documentos" },
      { icon: Shield, label: "Protocolos", path: "/protocolos" },
    ]
  },
  {
    title: "Recursos",
    defaultOpen: false,
    items: [
      { icon: BookOpen, label: "Tutoriales", path: "/tutoriales" },
      { icon: Settings, label: "Configuración", path: "/configuracion" },
    ]
  }
];

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function LeftSidebar({ isOpen = true, onClose }: LeftSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    sidebarSections.reduce((acc, section) => ({
      ...acc,
      [section.title]: section.defaultOpen ?? false
    }), {})
  );

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

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
          "fixed left-0 top-16 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-40",
          "overflow-y-auto scrollbar-thin transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="p-3 space-y-1">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-2">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
              >
                <span>{section.title}</span>
                {openSections[section.title] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Section Items */}
              {openSections[section.title] && (
                <div className="mt-1 space-y-1 animate-fade-up">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      id={item.id}
                      className="sidebar-nav-item group"
                      activeClassName="active"
                      onClick={onClose}
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="flex-1">{item.label}</span>
                      
                      {item.isLive && (
                        <span className="status-live" />
                      )}
                      
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section - User Stats */}
        <div className="p-4 mt-auto border-t border-sidebar-border">
          <div className="card-tamv p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Nivel</span>
              <span className="font-semibold text-primary">12</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                style={{ width: "65%" }}
              />
            </div>
            <p className="text-xs text-muted-foreground">2,450 / 3,000 XP</p>
          </div>
        </div>
      </aside>
    </>
  );
}
