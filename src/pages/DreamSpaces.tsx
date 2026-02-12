import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { logDreamSpaceEvent } from "@/lib/api/audit";
import TopToolbar from "@/components/layout/TopToolbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Sparkles, Plus, Eye, Users, Star, Play, Lock, Globe, Palette, Box,
  Layers, Clock, Shield, ShieldAlert, DollarSign, Ticket, Zap,
  Radio, Headphones, Wifi, WifiOff
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import type {
  DreamspaceDimension, DreamspaceVisibility, DreamspaceAccessMode,
  GuardianState, ParticipantPresence, TimeLayer
} from "@/types/dreamspace-api";

type DreamSpace = Tables<"dreamspaces">;

const SPACE_TYPES = [
  { value: "personal", label: "Personal", icon: "🏠" },
  { value: "gallery", label: "Galería", icon: "🖼️" },
  { value: "concert-hall", label: "Sala de Conciertos", icon: "🎵" },
  { value: "social", label: "Social", icon: "👥" },
  { value: "meditation", label: "Meditación", icon: "🧘" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
  { value: "cosmic", label: "Cósmico", icon: "🌌" },
  { value: "temple", label: "Templo", icon: "🏛️" },
];

const DIMENSION_OPTIONS: { value: DreamspaceDimension; label: string; desc: string }[] = [
  { value: "3d", label: "3D Standard", desc: "Escena tridimensional clásica" },
  { value: "4d", label: "4D Temporal", desc: "Capas temporales con memoria viva" },
];

const ACCESS_MODES: { value: DreamspaceAccessMode; label: string }[] = [
  { value: "open", label: "Abierto" },
  { value: "invite_only", label: "Solo invitación" },
  { value: "token_gated", label: "Token-Gated" },
];

// Mock 4D time layers for visualization
const MOCK_TIME_LAYERS: TimeLayer[] = [
  { id: "past", label: "Memoria Ancestral", timeOffsetSeconds: -86400, colorTint: "#8B5CF6", opacity: 0.6 },
  { id: "present", label: "Presente Vivo", timeOffsetSeconds: 0, colorTint: "#10B981", opacity: 1 },
  { id: "future", label: "Visión Profética", timeOffsetSeconds: 86400, colorTint: "#3B82F6", opacity: 0.7 },
];

// Mock participants for session preview
const MOCK_PARTICIPANTS: ParticipantPresence[] = [
  { userId: "u1", avatarId: "av1", displayName: "Xochitl", membershipTier: "creator", position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, isSpeaking: true, lastHeartbeatAt: new Date().toISOString() },
  { userId: "u2", avatarId: "av2", displayName: "Tenoch", membershipTier: "guardian", position: { x: 2, y: 0, z: 1 }, rotation: { x: 0, y: 0, z: 0 }, isSpeaking: false, lastHeartbeatAt: new Date().toISOString() },
  { userId: "u3", avatarId: "av3", displayName: "Citlali", membershipTier: "free", position: { x: -1, y: 0, z: 3 }, rotation: { x: 0, y: 0, z: 0 }, isSpeaking: false, lastHeartbeatAt: new Date().toISOString() },
];

function GuardianPanel() {
  const [guardianState] = useState<GuardianState>({
    isLocked: false,
    lastIncidents: [
      { id: "i1", level: "info", code: "SCAN_OK", message: "Escaneo de rutina completado", createdAt: new Date().toISOString() },
    ],
  });

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Estado de Guardianía
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Estado</span>
          <Badge variant={guardianState.isLocked ? "destructive" : "secondary"}>
            {guardianState.isLocked ? "BLOQUEADO" : "SEGURO"}
          </Badge>
        </div>
        {guardianState.lastIncidents.map((inc) => (
          <div key={inc.id} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-muted/50">
            {inc.level === "critical" ? (
              <ShieldAlert className="h-3 w-3 text-destructive mt-0.5" />
            ) : (
              <Shield className="h-3 w-3 text-primary mt-0.5" />
            )}
            <div>
              <span className="font-medium">{inc.code}</span>
              <p className="text-muted-foreground">{inc.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SessionPreview() {
  return (
    <Card className="border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Radio className="h-4 w-4 text-accent" />
          Sesión Activa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Wifi className="h-3 w-3 text-green-500" />
          <span className="text-muted-foreground">3 participantes conectados</span>
        </div>
        <div className="space-y-2">
          {MOCK_PARTICIPANTS.map((p) => (
            <div key={p.userId} className="flex items-center gap-2 text-sm">
              <div className={`h-2 w-2 rounded-full ${p.isSpeaking ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"}`} />
              <span className="flex-1">{p.displayName}</span>
              <Badge variant="outline" className="text-[10px] h-5">
                {p.membershipTier}
              </Badge>
            </div>
          ))}
        </div>
        <Button size="sm" className="w-full" variant="outline">
          <Headphones className="h-3 w-3 mr-2" />
          Unirse a sesión
        </Button>
      </CardContent>
    </Card>
  );
}

function TimeLayers4D() {
  const [activeLayer, setActiveLayer] = useState("present");

  return (
    <Card className="border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-4 w-4 text-accent" />
          Capas Temporales 4D
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {MOCK_TIME_LAYERS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-all ${
              activeLayer === layer.id
                ? "bg-primary/10 border border-primary/30"
                : "bg-muted/30 hover:bg-muted/60"
            }`}
          >
            <div
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: layer.colorTint, opacity: layer.opacity }}
            />
            <div className="text-left flex-1">
              <span className="font-medium">{layer.label}</span>
              <p className="text-xs text-muted-foreground">
                {layer.timeOffsetSeconds === 0
                  ? "Ahora"
                  : layer.timeOffsetSeconds < 0
                  ? `${Math.abs(layer.timeOffsetSeconds / 3600).toFixed(0)}h atrás`
                  : `${(layer.timeOffsetSeconds / 3600).toFixed(0)}h adelante`}
              </p>
            </div>
            <Clock className="h-3 w-3 text-muted-foreground" />
          </button>
        ))}
        <p className="text-xs text-muted-foreground text-center mt-2">
          Interpola entre pasado, presente y futuro del espacio
        </p>
      </CardContent>
    </Card>
  );
}

function EconomyPanel({ space }: { space: DreamSpace | null }) {
  if (!space) return null;

  const entryPrice = space.entry_price || 0;
  const commission = space.commission_percent || 25;
  const totalRevenue = space.total_revenue || 0;
  const creatorShare = totalRevenue * ((100 - commission) / 100);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Economía del Espacio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-primary">{entryPrice > 0 ? `${entryPrice} TAMV` : "Gratis"}</p>
            <p className="text-xs text-muted-foreground">Entrada</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-lg font-bold">{totalRevenue.toFixed(0)} ₲</p>
            <p className="text-xs text-muted-foreground">Revenue total</p>
          </div>
        </div>

        {entryPrice > 0 && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Comisión TAMV</span>
              <span className="font-medium">{commission}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Creador recibe</span>
              <span className="font-medium text-accent">{100 - commission}%</span>
            </div>
            <Progress value={100 - commission} className="h-2" />
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Ticket className="h-3 w-3 mr-1" />
            Tickets
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Zap className="h-3 w-3 mr-1" />
            Propinas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DreamSpaces() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dreamspaces, setDreamspaces] = useState<DreamSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [selectedSpace, setSelectedSpace] = useState<DreamSpace | null>(null);
  const [activeTab, setActiveTab] = useState("explore");

  const [newSpace, setNewSpace] = useState({
    name: "",
    description: "",
    space_type: "personal",
    is_public: true,
    entry_price: 0,
    has_xr: true,
    dimension: "3d" as DreamspaceDimension,
    access_mode: "open" as DreamspaceAccessMode,
  });

  useEffect(() => {
    fetchDreamSpaces();
  }, [filter, user]);

  const fetchDreamSpaces = async () => {
    setLoading(true);
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
        name: newSpace.name,
        description: newSpace.description,
        space_type: newSpace.space_type,
        is_public: newSpace.is_public,
        entry_price: newSpace.entry_price,
        has_xr: newSpace.has_xr,
        owner_id: user.id,
        commission_percent: 25,
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
        type: data.space_type,
        dimension: newSpace.dimension,
        accessMode: newSpace.access_mode,
      });
      setCreateOpen(false);
      setNewSpace({ name: "", description: "", space_type: "personal", is_public: true, entry_price: 0, has_xr: true, dimension: "3d", access_mode: "open" });
      fetchDreamSpaces();
    }
  };

  const visitSpace = async (space: DreamSpace) => {
    if (!user && (space.entry_price ?? 0) > 0) {
      toast.error("Debes iniciar sesión para visitar espacios de paga");
      navigate("/auth");
      return;
    }

    if (user) {
      await supabase.from("dreamspace_visits").insert({
        dreamspace_id: space.id,
        visitor_id: user.id,
        entry_fee_paid: space.entry_price,
      });
      logDreamSpaceEvent(space.id, "space_visited", {
        visitorId: user.id,
        entryFee: space.entry_price,
      });
    }

    setSelectedSpace(space);
    setActiveTab("detail");
    toast.success(`Entrando a ${space.name}...`);
  };

  const getSpaceTypeIcon = (type: string | null) => {
    return SPACE_TYPES.find((t) => t.value === type)?.icon || "🌌";
  };

  const stats = useMemo(() => ({
    total: dreamspaces.length,
    totalVisits: dreamspaces.reduce((a, s) => a + (s.visitors_count || 0), 0),
    avgRating: dreamspaces.length > 0
      ? dreamspaces.reduce((a, s) => a + (s.rating || 0), 0) / dreamspaces.length
      : 0,
    xrCount: dreamspaces.filter((s) => s.has_xr).length,
  }), [dreamspaces]);

  return (
    <div className="min-h-screen bg-background">
      <TopToolbar
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onHelpClick={() => {}}
        isSidebarOpen={sidebarOpen}
      />
      <LeftSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" />
                DreamSpaces
              </h1>
              <p className="text-muted-foreground mt-1">
                Espacios inmersivos 3D/4D · Presencia en tiempo real · Economía soberana
              </p>
            </div>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Espacio
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo DreamSpace</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={newSpace.name}
                      onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
                      placeholder="Mi espacio virtual"
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={newSpace.description}
                      onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
                      placeholder="Describe tu espacio..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo</Label>
                      <Select value={newSpace.space_type} onValueChange={(v) => setNewSpace({ ...newSpace, space_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SPACE_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.icon} {t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Dimensión</Label>
                      <Select value={newSpace.dimension} onValueChange={(v) => setNewSpace({ ...newSpace, dimension: v as DreamspaceDimension })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {DIMENSION_OPTIONS.map((d) => (
                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Modo de acceso</Label>
                    <Select value={newSpace.access_mode} onValueChange={(v) => setNewSpace({ ...newSpace, access_mode: v as DreamspaceAccessMode })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ACCESS_MODES.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Espacio Público</Label>
                    <Switch checked={newSpace.is_public} onCheckedChange={(v) => setNewSpace({ ...newSpace, is_public: v })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Soporte XR</Label>
                    <Switch checked={newSpace.has_xr} onCheckedChange={(v) => setNewSpace({ ...newSpace, has_xr: v })} />
                  </div>
                  <div>
                    <Label>Precio de entrada (TAMV) — 0 = Gratis</Label>
                    <Input
                      type="number"
                      value={newSpace.entry_price}
                      onChange={(e) => setNewSpace({ ...newSpace, entry_price: Number(e.target.value) })}
                      min={0}
                    />
                  </div>
                  {newSpace.entry_price > 0 && (
                    <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Comisión TAMV</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tu ganancia/visita</span>
                        <span className="font-medium text-accent">{(newSpace.entry_price * 0.75).toFixed(2)} TAMV</span>
                      </div>
                    </div>
                  )}
                  <Button onClick={createDreamSpace} className="w-full" disabled={!newSpace.name.trim()}>
                    Crear DreamSpace
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Sparkles, label: "Espacios", value: stats.total, color: "text-primary" },
              { icon: Eye, label: "Visitas", value: stats.totalVisits, color: "text-accent" },
              { icon: Star, label: "Rating", value: stats.avgRating.toFixed(1), color: "text-primary" },
              { icon: Palette, label: "Con XR", value: stats.xrCount, color: "text-accent" },
            ].map((s, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="explore" className="gap-2">
                <Globe className="h-4 w-4" />
                Explorar
              </TabsTrigger>
              <TabsTrigger value="mine" className="gap-2" disabled={!user}>
                <Box className="h-4 w-4" />
                Mis Espacios
              </TabsTrigger>
              {selectedSpace && (
                <TabsTrigger value="detail" className="gap-2">
                  <Play className="h-4 w-4" />
                  {selectedSpace.name}
                </TabsTrigger>
              )}
            </TabsList>

            {/* EXPLORE TAB */}
            <TabsContent value="explore" className="mt-4">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-muted rounded-t-lg" />
                      <CardContent className="p-4 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : dreamspaces.length === 0 ? (
                <Card className="p-12 text-center">
                  <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No hay DreamSpaces públicos</h3>
                  <p className="text-muted-foreground mb-6">¡Crea el primer espacio inmersivo!</p>
                  <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear mi primer DreamSpace
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dreamspaces.map((space) => (
                    <Card
                      key={space.id}
                      className="overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors"
                      onClick={() => visitSpace(space)}
                    >
                      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-muted">
                        {space.cover_image ? (
                          <img src={space.cover_image} alt={space.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">{getSpaceTypeIcon(space.space_type)}</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {space.is_public ? (
                            <Badge variant="secondary"><Globe className="h-3 w-3 mr-1" />Público</Badge>
                          ) : (
                            <Badge variant="outline"><Lock className="h-3 w-3 mr-1" />Privado</Badge>
                          )}
                          {space.has_xr && <Badge variant="secondary">XR</Badge>}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm"><Play className="h-4 w-4 mr-2" />Entrar</Button>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <h3 className="font-bold text-lg line-clamp-1">{space.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{space.description || "Espacio virtual inmersivo"}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{space.visitors_count || 0}</span>
                            <span className="flex items-center gap-1"><Star className="h-4 w-4" />{space.rating?.toFixed(1) || "—"}</span>
                          </div>
                          <span className="font-bold text-primary">
                            {(space.entry_price ?? 0) > 0 ? `${space.entry_price} TAMV` : "Gratis"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* MY SPACES TAB */}
            <TabsContent value="mine" className="mt-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dreamspaces.filter((s) => s.owner_id === user?.id).length === 0 ? (
                  <Card className="col-span-full p-8 text-center">
                    <Box className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Aún no tienes espacios propios</p>
                    <Button onClick={() => setCreateOpen(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />Crear
                    </Button>
                  </Card>
                ) : (
                  dreamspaces
                    .filter((s) => s.owner_id === user?.id)
                    .map((space) => (
                      <Card key={space.id} className="overflow-hidden cursor-pointer hover:border-primary/30 transition-colors" onClick={() => visitSpace(space)}>
                        <div className="relative h-36 bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                          <span className="text-5xl">{getSpaceTypeIcon(space.space_type)}</span>
                          <Badge className="absolute top-2 right-2" variant="secondary">Propietario</Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold line-clamp-1">{space.name}</h3>
                          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                            <span><Users className="h-3 w-3 inline mr-1" />{space.visitors_count || 0} visitas</span>
                            <span className="font-medium text-primary">{(space.entry_price ?? 0) > 0 ? `${space.entry_price} TAMV` : "Gratis"}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>

            {/* DETAIL TAB */}
            <TabsContent value="detail" className="mt-4">
              {selectedSpace && (
                <div className="grid lg:grid-cols-[1fr_320px] gap-6">
                  {/* Main Content */}
                  <div className="space-y-4">
                    {/* Scene Preview */}
                    <Card className="overflow-hidden">
                      <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-muted flex items-center justify-center">
                        {selectedSpace.cover_image ? (
                          <img src={selectedSpace.cover_image} alt={selectedSpace.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <span className="text-8xl block mb-4">{getSpaceTypeIcon(selectedSpace.space_type)}</span>
                            <p className="text-muted-foreground">Vista previa 3D</p>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-xl font-bold">{selectedSpace.name}</h2>
                              <p className="text-sm text-muted-foreground">{selectedSpace.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button><Play className="h-4 w-4 mr-2" />Entrar en 3D</Button>
                              {selectedSpace.has_xr && (
                                <Button variant="outline"><Headphones className="h-4 w-4 mr-2" />Modo XR</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Space Details */}
                    <div className="grid sm:grid-cols-3 gap-3">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Eye className="h-5 w-5 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{selectedSpace.visitors_count || 0}</p>
                          <p className="text-xs text-muted-foreground">Visitantes</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Star className="h-5 w-5 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{selectedSpace.rating?.toFixed(1) || "—"}</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <DollarSign className="h-5 w-5 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{(selectedSpace.total_revenue || 0).toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">Revenue (TAMV)</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Tags */}
                    {selectedSpace.tags && selectedSpace.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedSpace.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sidebar Panels */}
                  <div className="space-y-4">
                    <SessionPreview />
                    <TimeLayers4D />
                    <EconomyPanel space={selectedSpace} />
                    <GuardianPanel />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
