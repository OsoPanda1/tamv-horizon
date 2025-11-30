import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { logDreamSpaceEvent } from "@/lib/api/audit";
import TopToolbar from "@/components/layout/TopToolbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Sparkles, Plus, Eye, Users, Star, 
  Play, Lock, Globe, Palette, Box
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DreamSpace = Tables<"dreamspaces">;

const SPACE_TYPES = [
  { value: "personal", label: "Personal", icon: "🏠" },
  { value: "gallery", label: "Galería", icon: "🖼️" },
  { value: "concert-hall", label: "Sala de Conciertos", icon: "🎵" },
  { value: "social", label: "Social", icon: "👥" },
  { value: "meditation", label: "Meditación", icon: "🧘" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
];

export default function DreamSpaces() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dreamspaces, setDreamspaces] = useState<DreamSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  
  const [newSpace, setNewSpace] = useState({
    name: "",
    description: "",
    space_type: "personal",
    is_public: true,
    entry_price: 0,
    has_xr: true
  });

  useEffect(() => {
    fetchDreamSpaces();
  }, [filter, user]);

  const fetchDreamSpaces = async () => {
    let query = supabase
      .from("dreamspaces")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "mine" && user) {
      query = query.eq("owner_id", user.id);
    } else {
      query = query.eq("is_public", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching dreamspaces:", error);
    } else {
      setDreamspaces(data || []);
    }
    setLoading(false);
  };

  const createDreamSpace = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear un DreamSpace");
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("dreamspaces")
      .insert({
        ...newSpace,
        owner_id: user.id,
        commission_percent: 25
      })
      .select()
      .single();

    if (error) {
      toast.error("Error al crear el DreamSpace");
      console.error(error);
    } else {
      toast.success("¡DreamSpace creado exitosamente!");
      logDreamSpaceEvent(data.id, "space_created", { 
        name: data.name, 
        owner: user.id,
        type: data.space_type
      });
      setCreateOpen(false);
      fetchDreamSpaces();
    }
  };

  const visitSpace = async (space: DreamSpace) => {
    if (!user && space.entry_price > 0) {
      toast.error("Debes iniciar sesión para visitar espacios de paga");
      navigate("/auth");
      return;
    }

    // Record visit
    if (user) {
      await supabase.from("dreamspace_visits").insert({
        dreamspace_id: space.id,
        visitor_id: user.id,
        entry_fee_paid: space.entry_price
      });

      logDreamSpaceEvent(space.id, "space_visited", {
        visitorId: user.id,
        entryFee: space.entry_price
      });
    }

    toast.success(`Entrando a ${space.name}...`);
    // Here would trigger XR/3D scene
  };

  const getSpaceTypeIcon = (type: string | null) => {
    const found = SPACE_TYPES.find(t => t.value === type);
    return found?.icon || "🌌";
  };

  return (
    <div className="min-h-screen bg-background">
      <TopToolbar 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onHelpClick={() => {}}
        isSidebarOpen={sidebarOpen}
      />
      <LeftSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-glow-gold flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" />
                DreamSpaces
              </h1>
              <p className="text-muted-foreground mt-1">
                Espacios virtuales inmersivos para crear, compartir y monetizar
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-muted rounded-lg p-1">
                <Button 
                  variant={filter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Explorar
                </Button>
                <Button 
                  variant={filter === "mine" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("mine")}
                  disabled={!user}
                >
                  <Box className="h-4 w-4 mr-2" />
                  Mis Espacios
                </Button>
              </div>
              
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-tamv-gold">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Espacio
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo DreamSpace</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input 
                        value={newSpace.name}
                        onChange={(e) => setNewSpace({...newSpace, name: e.target.value})}
                        placeholder="Mi espacio virtual"
                      />
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        value={newSpace.description}
                        onChange={(e) => setNewSpace({...newSpace, description: e.target.value})}
                        placeholder="Describe tu espacio..."
                      />
                    </div>
                    <div>
                      <Label>Tipo de Espacio</Label>
                      <Select 
                        value={newSpace.space_type}
                        onValueChange={(v) => setNewSpace({...newSpace, space_type: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SPACE_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Espacio Público</Label>
                      <Switch
                        checked={newSpace.is_public}
                        onCheckedChange={(v) => setNewSpace({...newSpace, is_public: v})}
                      />
                    </div>
                    <div>
                      <Label>Precio de entrada (TAMV) - 0 = Gratis</Label>
                      <Input 
                        type="number"
                        value={newSpace.entry_price}
                        onChange={(e) => setNewSpace({...newSpace, entry_price: Number(e.target.value)})}
                        min={0}
                      />
                    </div>
                    {newSpace.entry_price > 0 && (
                      <div className="bg-muted/50 p-3 rounded-lg text-sm">
                        <p className="text-muted-foreground">
                          Comisión TAMV: <span className="text-foreground font-medium">25%</span>
                        </p>
                        <p className="text-muted-foreground">
                          Tu ganancia por visita: <span className="text-accent font-medium">
                            {(newSpace.entry_price * 0.75).toFixed(2)} TAMV
                          </span>
                        </p>
                      </div>
                    )}
                    <Button onClick={createDreamSpace} className="w-full btn-tamv-gold">
                      Crear DreamSpace
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dreamspaces.length}</p>
                  <p className="text-xs text-muted-foreground">Espacios</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {dreamspaces.reduce((acc, s) => acc + (s.visitors_count || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Visitas totales</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(dreamspaces.reduce((acc, s) => acc + (s.rating || 0), 0) / (dreamspaces.length || 1)).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating promedio</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dreamspaces.filter(s => s.has_xr).length}</p>
                  <p className="text-xs text-muted-foreground">Con XR</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DreamSpaces Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="card-tamv animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : dreamspaces.length === 0 ? (
            <Card className="card-tamv p-12 text-center">
              <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {filter === "mine" ? "No tienes DreamSpaces" : "No hay DreamSpaces públicos"}
              </h3>
              <p className="text-muted-foreground mb-6">
                ¡Crea tu primer espacio virtual inmersivo!
              </p>
              <Button onClick={() => setCreateOpen(true)} className="btn-tamv-gold">
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primer DreamSpace
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dreamspaces.map((space) => (
                <Card key={space.id} className="card-tamv-featured overflow-hidden group cursor-pointer" onClick={() => visitSpace(space)}>
                  <div className="relative h-48 bg-gradient-to-br from-primary/30 via-accent/20 to-cyan-500/30">
                    {space.cover_image ? (
                      <img 
                        src={space.cover_image} 
                        alt={space.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">{getSpaceTypeIcon(space.space_type)}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {space.is_public ? (
                        <Badge variant="secondary">
                          <Globe className="h-3 w-3 mr-1" />
                          Público
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Lock className="h-3 w-3 mr-1" />
                          Privado
                        </Badge>
                      )}
                      {space.has_xr && (
                        <Badge className="bg-cyan-500/80">XR</Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button className="btn-tamv-cyan">
                        <Play className="h-4 w-4 mr-2" />
                        Entrar
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg line-clamp-1">{space.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {space.description || "Espacio virtual inmersivo"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {space.visitors_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500" />
                          {space.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                      <div className="font-bold text-primary">
                        {space.entry_price > 0 ? `${space.entry_price} TAMV` : "Gratis"}
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
