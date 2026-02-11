import { useState, useEffect } from "react";
import { TrendingUp, Users, Radio, Sparkles, ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DailyMissionWidget from "@/components/home/DailyMissionWidget";
import AnubisSentinelMonitor from "@/components/security/AnubisSentinelMonitor";
import MSRPulse from "@/components/economy/MSRPulse";
import { useAnubisSecurity } from "@/hooks/useAnubisSecurity";
import { useMSREconomy } from "@/hooks/useMSREconomy";
import { MOCK_USERS, TAMV_GROUPS, TAMV_CHANNELS, DREAMSPACES } from "@/data/mockData";
import { cn } from "@/lib/utils";

const SIDEBAR_KEY = "tamv_right_sidebar_open";

interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function AccordionSection({ title, icon, defaultOpen = false, children }: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full py-2.5 px-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
      >
        {icon}
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        open ? "max-h-[600px] opacity-100 pb-3" : "max-h-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );
}

export default function RightSidebar() {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY);
    return saved !== "false";
  });

  const { state: anubisState } = useAnubisSecurity();
  const { balance, lastTx, loading, error } = useMSREconomy();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(isOpen));
  }, [isOpen]);

  const trends = [
    { tag: "#ConciertosXR", posts: 1250 },
    { tag: "#ArteTAMV", posts: 890 },
    { tag: "#DreamSpaces", posts: 756 },
    { tag: "#ColaboraciónLATAM", posts: 543 },
    { tag: "#IsabellaIA", posts: 421 },
  ];

  const onlineContacts = MOCK_USERS.filter((u) => u.isOnline).slice(0, 4);
  const activeGroups = TAMV_GROUPS.slice(0, 3);
  const featuredChannels = TAMV_CHANNELS.slice(0, 3);
  const featuredSpaces = DREAMSPACES.slice(0, 2);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "hidden xl:flex fixed z-40 top-20 items-center justify-center",
          "w-6 h-12 bg-card border border-border rounded-l-md",
          "hover:bg-muted transition-all",
          isOpen ? "right-80" : "right-0"
        )}
      >
        {isOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      <aside
        className={cn(
          "hidden xl:block fixed right-0 top-16 bottom-0 w-80 bg-sidebar border-l border-sidebar-border overflow-y-auto",
          "transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-3 space-y-1">
          {/* Security Sentinel */}
          <AccordionSection
            title="Seguridad"
            icon={<Sparkles className="h-3 w-3 text-accent" />}
            defaultOpen
          >
            <AnubisSentinelMonitor state={anubisState} />
          </AccordionSection>

          {/* Economy */}
          <AccordionSection
            title="Economía MSR"
            icon={<Sparkles className="h-3 w-3 text-primary" />}
            defaultOpen
          >
            <MSRPulse balance={balance} lastTx={lastTx} loading={loading} error={error} />
          </AccordionSection>

          {/* Daily Mission */}
          <AccordionSection
            title="Misión Diaria"
            icon={<Sparkles className="h-3 w-3 text-accent" />}
          >
            <DailyMissionWidget />
          </AccordionSection>

          {/* Trends */}
          <AccordionSection
            title="Tendencias"
            icon={<TrendingUp className="h-3 w-3 text-primary" />}
            defaultOpen
          >
            <div className="space-y-1.5">
              {trends.map((trend, index) => (
                <button
                  key={trend.tag}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                    <div className="text-left">
                      <p className="font-medium text-xs text-foreground group-hover:text-primary transition-colors">
                        {trend.tag}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {trend.posts.toLocaleString()} posts
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </AccordionSection>

          {/* Online Contacts */}
          <AccordionSection
            title="En línea"
            icon={<Users className="h-3 w-3 text-accent" />}
          >
            <div className="space-y-1">
              {onlineContacts.map((contact) => (
                <button
                  key={contact.id}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar} alt={contact.displayName} />
                      <AvatarFallback>{contact.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 status-online" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-xs">{contact.displayName}</p>
                    <p className="text-[10px] text-muted-foreground">@{contact.username}</p>
                  </div>
                </button>
              ))}
            </div>
          </AccordionSection>

          {/* Groups */}
          <AccordionSection
            title="Grupos Activos"
            icon={<Users className="h-3 w-3 text-primary" />}
          >
            <div className="space-y-1">
              {activeGroups.map((group) => (
                <button
                  key={group.id}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={group.avatar} alt={group.name} />
                    <AvatarFallback>{group.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-xs">{group.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {group.memberCount.toLocaleString()} miembros
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </AccordionSection>

          {/* Channels */}
          <AccordionSection
            title="Canales Destacados"
            icon={<Radio className="h-3 w-3 text-accent" />}
          >
            <div className="space-y-1">
              {featuredChannels.map((channel) => (
                <button
                  key={channel.id}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={channel.avatar} alt={channel.name} />
                    <AvatarFallback>{channel.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-xs">{channel.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {channel.subscriberCount.toLocaleString()} suscriptores
                    </p>
                  </div>
                  {channel.isPremium && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/15 text-primary rounded-full">
                      PRO
                    </span>
                  )}
                </button>
              ))}
            </div>
          </AccordionSection>

          {/* DreamSpaces */}
          <AccordionSection
            title="DreamSpaces"
            icon={<Sparkles className="h-3 w-3 text-accent" />}
          >
            <div className="space-y-2">
              {featuredSpaces.map((space) => (
                <div
                  key={space.id}
                  className="card-tamv overflow-hidden cursor-pointer hover:border-primary/25 transition-colors"
                >
                  <img
                    src={space.coverImage}
                    alt={space.name}
                    className="w-full h-16 object-cover"
                    loading="lazy"
                  />
                  <div className="p-2">
                    <p className="font-medium text-xs">{space.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {space.visitors.toLocaleString()} visitantes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* CTA */}
          <div className="card-tamv-featured p-3 mt-2">
            <h4 className="font-semibold text-xs mb-1.5">Liga de Embajadores</h4>
            <p className="text-[10px] text-muted-foreground mb-2">
              Invita amigos y gana hasta 1 año de Premium
            </p>
            <Button size="sm" className="w-full btn-tamv-silver text-xs h-8">
              Ver mi progreso
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
