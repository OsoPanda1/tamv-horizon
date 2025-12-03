import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import TopToolbar from "@/components/layout/TopToolbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search, Filter, Music, Gavel, Sparkles, Users, Radio, 
  PawPrint, TrendingUp, Star, Clock, MapPin
} from "lucide-react";

interface ExploreItem {
  id: string;
  type: "concert" | "auction" | "dreamspace" | "group" | "channel" | "creator";
  title: string;
  description: string;
  image: string;
  stats: { label: string; value: string }[];
  tags: string[];
  isLive?: boolean;
  isFeatured?: boolean;
}

const EXPLORE_CATEGORIES = [
  { id: "all", label: "Todo", icon: TrendingUp },
  { id: "concerts", label: "Conciertos", icon: Music },
  { id: "auctions", label: "Subastas", icon: Gavel },
  { id: "dreamspaces", label: "DreamSpaces", icon: Sparkles },
  { id: "groups", label: "Grupos", icon: Users },
  { id: "channels", label: "Canales", icon: Radio },
  { id: "creators", label: "Creadores", icon: Star },
];

export default function Explorar() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [exploreItems, setExploreItems] = useState<ExploreItem[]>([]);

  useEffect(() => {
    loadExploreContent();
  }, [activeCategory]);

  const loadExploreContent = async () => {
    setLoading(true);
    
    const items: ExploreItem[] = [];

    // Load concerts
    if (activeCategory === "all" || activeCategory === "concerts") {
      const { data: concerts } = await supabase
        .from("concerts")
        .select("*")
        .order("start_time", { ascending: true })
        .limit(6);

      if (concerts) {
        items.push(...concerts.map(c => ({
          id: c.id,
          type: "concert" as const,
          title: c.title,
          description: c.description || "",
          image: c.cover_image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400",
          stats: [
            { label: "Precio", value: `${c.ticket_price} TAMV` },
            { label: "Asistentes", value: `${c.current_attendees || 0}` }
          ],
          tags: c.tags || [],
          isLive: c.status === "live",
          isFeatured: true
        })));
      }
    }

    // Load auctions
    if (activeCategory === "all" || activeCategory === "auctions") {
      const { data: auctions } = await supabase
        .from("auctions")
        .select("*")
        .eq("status", "active")
        .order("end_time", { ascending: true })
        .limit(6);

      if (auctions) {
        items.push(...auctions.map(a => ({
          id: a.id,
          type: "auction" as const,
          title: a.title,
          description: a.description || "",
          image: a.image_url || "https://images.unsplash.com/photo-1569437061241-a848be43cc82?w=400",
          stats: [
            { label: "Puja actual", value: `${a.current_bid || a.starting_price} TAMV` },
            { label: "Pujas", value: `${a.bid_count || 0}` }
          ],
          tags: a.tags || [],
          isFeatured: (a.current_bid || 0) > 100
        })));
      }
    }

    // Load dreamspaces
    if (activeCategory === "all" || activeCategory === "dreamspaces") {
      const { data: dreamspaces } = await supabase
        .from("dreamspaces")
        .select("*")
        .eq("is_public", true)
        .order("visitors_count", { ascending: false })
        .limit(6);

      if (dreamspaces) {
        items.push(...dreamspaces.map(d => ({
          id: d.id,
          type: "dreamspace" as const,
          title: d.name,
          description: d.description || "",
          image: d.cover_image || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
          stats: [
            { label: "Visitantes", value: `${d.visitors_count || 0}` },
            { label: "Rating", value: `${d.rating?.toFixed(1) || "N/A"}⭐` }
          ],
          tags: d.tags || [],
          isFeatured: (d.rating || 0) >= 4.5
        })));
      }
    }

    // Load groups
    if (activeCategory === "all" || activeCategory === "groups") {
      const { data: groups } = await supabase
        .from("groups")
        .select("*")
        .order("member_count", { ascending: false })
        .limit(6);

      if (groups) {
        items.push(...groups.map(g => ({
          id: g.id,
          type: "group" as const,
          title: g.name,
          description: g.description || "",
          image: g.cover_image || g.avatar_url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
          stats: [
            { label: "Miembros", value: `${g.member_count || 0}` },
            { label: "Tipo", value: g.is_paid ? `${g.price} TAMV/mes` : "Gratis" }
          ],
          tags: [g.category || "General"],
          isFeatured: (g.member_count || 0) > 100
        })));
      }
    }

    // Load channels
    if (activeCategory === "all" || activeCategory === "channels") {
      const { data: channels } = await supabase
        .from("channels")
        .select("*")
        .order("subscriber_count", { ascending: false })
        .limit(6);

      if (channels) {
        items.push(...channels.map(ch => ({
          id: ch.id,
          type: "channel" as const,
          title: ch.name,
          description: ch.description || "",
          image: ch.avatar_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400",
          stats: [
            { label: "Suscriptores", value: `${ch.subscriber_count || 0}` },
            { label: "Tipo", value: ch.is_premium ? "Premium" : "Gratis" }
          ],
          tags: [ch.category || "General"],
          isFeatured: ch.is_premium
        })));
      }
    }

    // Load creators (from profiles)
    if (activeCategory === "all" || activeCategory === "creators") {
      const { data: creators } = await supabase
        .from("profiles")
        .select("*")
        .order("followers_count", { ascending: false })
        .limit(6);

      if (creators) {
        items.push(...creators.map(cr => ({
          id: cr.id,
          type: "creator" as const,
          title: cr.display_name || cr.username || "Creador TAMV",
          description: cr.bio || "Creador del metaverso TAMV",
          image: cr.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
          stats: [
            { label: "Seguidores", value: `${cr.followers_count || 0}` },
            { label: "Nivel", value: `${cr.level || 1}` }
          ],
          tags: cr.skills?.slice(0, 3) || ["Creador"],
          isFeatured: (cr.level || 0) >= 10
        })));
      }
    }

    setExploreItems(items);
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "concert": return <Music className="h-4 w-4" />;
      case "auction": return <Gavel className="h-4 w-4" />;
      case "dreamspace": return <Sparkles className="h-4 w-4" />;
      case "group": return <Users className="h-4 w-4" />;
      case "channel": return <Radio className="h-4 w-4" />;
      case "creator": return <Star className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getTypeRoute = (type: string, id: string) => {
    switch (type) {
      case "concert": return `/conciertos?id=${id}`;
      case "auction": return `/subastas?id=${id}`;
      case "dreamspace": return `/dreamspaces?id=${id}`;
      case "group": return `/grupos?id=${id}`;
      case "channel": return `/canales?id=${id}`;
      case "creator": return `/perfil/${id}`;
      default: return "/";
    }
  };

  const filteredItems = exploreItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <TopToolbar 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onHelpClick={() => {}}
        isSidebarOpen={sidebarOpen}
      />
      <LeftSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-glow-gold flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                Explorar TAMV
              </h1>
              <p className="text-muted-foreground mt-1">
                Descubre experiencias, creadores y comunidades
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conciertos, subastas, creadores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {EXPLORE_CATEGORIES.map(cat => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className={activeCategory === cat.id ? "btn-tamv-gold" : ""}
              >
                <cat.icon className="h-4 w-4 mr-2" />
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Featured Banner */}
          <Card className="card-tamv-featured overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Badge className="mb-2 bg-primary/20 text-primary">Destacado</Badge>
                  <h2 className="text-2xl font-bold">Festival TAMV 2025</h2>
                  <p className="text-muted-foreground mt-1">Experiencias inmersivas XR en vivo</p>
                  <Button className="mt-4 btn-tamv-gold">
                    Explorar Evento
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Results Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="card-tamv animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-40 bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <Card className="card-tamv p-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
              <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <Card 
                  key={`${item.type}-${item.id}`}
                  className="card-tamv overflow-hidden cursor-pointer hover:border-primary/50 transition-all group"
                  onClick={() => navigate(getTypeRoute(item.type, item.id))}
                >
                  <CardContent className="p-0">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {getTypeIcon(item.type)}
                          {item.type}
                        </Badge>
                        {item.isLive && (
                          <Badge className="bg-red-500 text-white animate-pulse">
                            EN VIVO
                          </Badge>
                        )}
                        {item.isFeatured && !item.isLive && (
                          <Badge className="bg-primary/20 text-primary">
                            <Star className="h-3 w-3 mr-1" />
                            Destacado
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>

                      {/* Stats */}
                      <div className="flex gap-4 text-xs">
                        {item.stats.map(stat => (
                          <div key={stat.label}>
                            <span className="text-muted-foreground">{stat.label}: </span>
                            <span className="font-medium">{stat.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="flex gap-1 flex-wrap">
                        {item.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
