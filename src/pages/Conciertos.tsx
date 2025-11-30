import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { logConcertEvent } from "@/lib/api/audit";
import TopToolbar from "@/components/layout/TopToolbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Music, Calendar, Users, Ticket, Plus, Play, 
  Clock, MapPin, Sparkles, Eye, TrendingUp 
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Concert = Tables<"concerts">;

export default function Conciertos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newConcert, setNewConcert] = useState({
    title: "",
    description: "",
    ticket_price: 0,
    max_attendees: 100,
    start_time: "",
    duration_minutes: 60
  });

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    const { data, error } = await supabase
      .from("concerts")
      .select("*")
      .neq("status", "draft")
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching concerts:", error);
    } else {
      setConcerts(data || []);
    }
    setLoading(false);
  };

  const createConcert = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear un concierto");
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("concerts")
      .insert({
        ...newConcert,
        creator_id: user.id,
        status: "scheduled",
        has_xr: true,
        commission_percent: 15
      })
      .select()
      .single();

    if (error) {
      toast.error("Error al crear el concierto");
      console.error(error);
    } else {
      toast.success("¡Concierto creado exitosamente!");
      logConcertEvent(data.id, "concert_created", { 
        title: data.title, 
        creator: user.id 
      });
      setCreateOpen(false);
      fetchConcerts();
    }
  };

  const buyTicket = async (concert: Concert) => {
    if (!user) {
      toast.error("Debes iniciar sesión para comprar un ticket");
      navigate("/auth");
      return;
    }

    // Check if already has ticket
    const { data: existing } = await supabase
      .from("concert_tickets")
      .select("id")
      .eq("concert_id", concert.id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      toast.info("Ya tienes un ticket para este concierto");
      return;
    }

    const { data, error } = await supabase
      .from("concert_tickets")
      .insert({
        concert_id: concert.id,
        user_id: user.id,
        price_paid: concert.ticket_price,
        ticket_type: "standard"
      })
      .select()
      .single();

    if (error) {
      toast.error("Error al comprar ticket");
      console.error(error);
    } else {
      toast.success("¡Ticket comprado! Te esperamos en el concierto");
      logConcertEvent(concert.id, "ticket_purchased", {
        ticketId: data.id,
        userId: user.id,
        price: concert.ticket_price
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      scheduled: { label: "Programado", variant: "secondary" },
      live: { label: "EN VIVO", variant: "destructive" },
      ended: { label: "Finalizado", variant: "outline" },
      cancelled: { label: "Cancelado", variant: "outline" }
    };
    const s = statusMap[status || "scheduled"];
    return <Badge variant={s.variant}>{s.label}</Badge>;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-glow-gold flex items-center gap-3">
                <Music className="h-8 w-8 text-primary" />
                Conciertos Sensoriales
              </h1>
              <p className="text-muted-foreground mt-1">
                Experiencias musicales inmersivas en realidad virtual
              </p>
            </div>
            
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="btn-tamv-gold">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Concierto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Concierto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Título</Label>
                    <Input 
                      value={newConcert.title}
                      onChange={(e) => setNewConcert({...newConcert, title: e.target.value})}
                      placeholder="Nombre del concierto"
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={newConcert.description}
                      onChange={(e) => setNewConcert({...newConcert, description: e.target.value})}
                      placeholder="Describe tu concierto..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Precio (TAMV)</Label>
                      <Input 
                        type="number"
                        value={newConcert.ticket_price}
                        onChange={(e) => setNewConcert({...newConcert, ticket_price: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Capacidad</Label>
                      <Input 
                        type="number"
                        value={newConcert.max_attendees}
                        onChange={(e) => setNewConcert({...newConcert, max_attendees: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Fecha y Hora</Label>
                    <Input 
                      type="datetime-local"
                      value={newConcert.start_time}
                      onChange={(e) => setNewConcert({...newConcert, start_time: e.target.value})}
                    />
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    <p className="text-muted-foreground">
                      Comisión TAMV: <span className="text-foreground font-medium">15%</span>
                    </p>
                    <p className="text-muted-foreground">
                      Tu ganancia por ticket: <span className="text-accent font-medium">
                        {(newConcert.ticket_price * 0.85).toFixed(2)} TAMV
                      </span>
                    </p>
                  </div>
                  <Button onClick={createConcert} className="w-full btn-tamv-gold">
                    Crear Concierto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{concerts.filter(c => c.status === "live").length}</p>
                  <p className="text-xs text-muted-foreground">En vivo ahora</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{concerts.filter(c => c.status === "scheduled").length}</p>
                  <p className="text-xs text-muted-foreground">Programados</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {concerts.reduce((acc, c) => acc + (c.current_attendees || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Asistentes totales</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {concerts.reduce((acc, c) => acc + (c.total_revenue || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">TAMV generados</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Concert Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="card-tamv animate-pulse">
                  <div className="h-40 bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : concerts.length === 0 ? (
            <Card className="card-tamv p-12 text-center">
              <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay conciertos programados</h3>
              <p className="text-muted-foreground mb-6">
                ¡Sé el primero en crear una experiencia musical inmersiva!
              </p>
              <Button onClick={() => setCreateOpen(true)} className="btn-tamv-gold">
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primer concierto
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {concerts.map((concert) => (
                <Card key={concert.id} className="card-tamv-featured overflow-hidden group">
                  <div className="relative h-40 bg-gradient-to-br from-primary/30 to-accent/30">
                    {concert.cover_image ? (
                      <img 
                        src={concert.cover_image} 
                        alt={concert.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="h-16 w-16 text-primary/50" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(concert.status)}
                    </div>
                    {concert.has_xr && (
                      <Badge className="absolute top-3 right-3 bg-cyan-500/80">
                        <Sparkles className="h-3 w-3 mr-1" />
                        XR
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-lg line-clamp-1">{concert.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {concert.description || "Experiencia musical inmersiva"}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(concert.start_time).toLocaleDateString("es-MX", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {concert.duration_minutes}min
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Entrada</p>
                        <p className="font-bold text-primary">
                          {concert.ticket_price > 0 ? `${concert.ticket_price} TAMV` : "Gratis"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {concert.current_attendees}/{concert.max_attendees}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full btn-tamv-cyan"
                      onClick={() => buyTicket(concert)}
                      disabled={concert.status === "ended" || concert.status === "cancelled"}
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      {concert.status === "live" ? "Unirse Ahora" : "Obtener Ticket"}
                    </Button>
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
