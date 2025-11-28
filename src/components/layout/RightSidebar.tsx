import { useState } from "react";
import { TrendingUp, Users, Radio, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DailyMissionWidget from "@/components/home/DailyMissionWidget";
import { MOCK_USERS, TAMV_GROUPS, TAMV_CHANNELS, DREAMSPACES } from "@/data/mockData";

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState<"trends" | "contacts" | "spaces">("trends");

  const trends = [
    { tag: "#ConciertosXR", posts: 1250 },
    { tag: "#ArteTAMV", posts: 890 },
    { tag: "#DreamSpaces", posts: 756 },
    { tag: "#ColaboraciónLATAM", posts: 543 },
    { tag: "#IsabellaIA", posts: 421 }
  ];

  const onlineContacts = MOCK_USERS.filter(u => u.isOnline).slice(0, 5);
  const featuredSpaces = DREAMSPACES.slice(0, 3);
  const activeGroups = TAMV_GROUPS.slice(0, 3);
  const featuredChannels = TAMV_CHANNELS.slice(0, 3);

  return (
    <aside className="hidden xl:block fixed right-0 top-16 bottom-0 w-80 bg-sidebar border-l border-sidebar-border overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Daily Mission Widget */}
        <DailyMissionWidget />

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab("trends")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "trends" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "contacts" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            En línea
          </button>
          <button
            onClick={() => setActiveTab("spaces")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "spaces" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Spaces
          </button>
        </div>

        {/* Trends Tab */}
        {activeTab === "trends" && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Tendencias TAMV</span>
            </div>
            <div className="space-y-3">
              {trends.map((trend, index) => (
                <button
                  key={trend.tag}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="text-left">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {trend.tag}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trend.posts.toLocaleString()} posts
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Online Contacts Tab */}
        {activeTab === "contacts" && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-accent" />
              <span>Contactos en línea</span>
            </div>
            <div className="space-y-2">
              {onlineContacts.map((contact) => (
                <button
                  key={contact.id}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} alt={contact.displayName} />
                      <AvatarFallback>{contact.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 status-online" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{contact.displayName}</p>
                    <p className="text-xs text-muted-foreground">@{contact.username}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Groups */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Users className="h-4 w-4 text-primary" />
                <span>Grupos activos</span>
              </div>
              <div className="space-y-2">
                {activeGroups.map((group) => (
                  <button
                    key={group.id}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={group.avatar} alt={group.name} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{group.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {group.memberCount.toLocaleString()} miembros
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Spaces Tab */}
        {activeTab === "spaces" && (
          <div className="space-y-4 animate-fade-up">
            {/* DreamSpaces */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>DreamSpaces destacados</span>
              </div>
              <div className="space-y-3">
                {featuredSpaces.map((space) => (
                  <div
                    key={space.id}
                    className="card-tamv overflow-hidden cursor-pointer hover:border-primary/30 transition-colors"
                  >
                    <img 
                      src={space.coverImage} 
                      alt={space.name}
                      className="w-full h-20 object-cover"
                    />
                    <div className="p-3">
                      <p className="font-medium text-sm">{space.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {space.visitors.toLocaleString()} visitantes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Radio className="h-4 w-4 text-primary" />
                <span>Canales destacados</span>
              </div>
              <div className="space-y-2">
                {featuredChannels.map((channel) => (
                  <button
                    key={channel.id}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={channel.avatar} alt={channel.name} />
                      <AvatarFallback>{channel.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{channel.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {channel.subscriberCount.toLocaleString()} suscriptores
                      </p>
                    </div>
                    {channel.isPremium && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                        Premium
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="card-tamv-featured p-4">
          <h4 className="font-semibold text-sm mb-2">Liga de Embajadores</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Invita amigos y gana hasta 1 año de Premium gratis
          </p>
          <Button size="sm" className="w-full btn-tamv-gold">
            Ver mi progreso
          </Button>
        </div>
      </div>
    </aside>
  );
}
