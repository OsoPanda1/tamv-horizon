import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import TopToolbar from "@/components/layout/TopToolbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Radio, Plus, Bell, Crown, Users,
  TrendingUp, Zap, BellRing
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Channel = Tables<"channels">;

export default function Canales() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  
  const [newChannel, setNewChannel] = useState({
    name: "",
    description: "",
    is_premium: false,
    price: 0,
    category: "general"
  });

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .order("subscriber_count", { ascending: false });

    if (error) {
      console.error("Error fetching channels:", error);
    } else {
      setChannels(data || []);
    }
    setLoading(false);
  };

  const createChannel = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear un canal");
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("channels")
      .insert({
        ...newChannel,
        owner_id: user.id,
        commission_percent: 20
      })
      .select()
      .single();

    if (error) {
      toast.error("Error al crear el canal");
      console.error(error);
    } else {
      toast.success("¡Canal creado exitosamente!");
      setCreateOpen(false);
      fetchChannels();
    }
  };

  const subscribeToChannel = async (channel: Channel) => {
    if (!user) {
      toast.error("Debes iniciar sesión para suscribirte");
      navigate("/auth");
      return;
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("channel_subscribers")
      .select("id")
      .eq("channel_id", channel.id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      toast.info("Ya estás suscrito a este canal");
      return;
    }

    const { error } = await supabase.from("channel_subscribers").insert({
      channel_id: channel.id,
      user_id: user.id
    });

    if (error) {
      toast.error("Error al suscribirse");
    } else {
      // Update subscriber count
      await supabase
        .from("channels")
        .update({ subscriber_count: (channel.subscriber_count || 0) + 1 })
        .eq("id", channel.id);

      toast.success(`¡Te has suscrito a ${channel.name}!`);
      fetchChannels();
    }
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
                <Radio className="h-8 w-8 text-primary" />
                Canales
              </h1>
              <p className="text-muted-foreground mt-1">
                Broadcast y contenido exclusivo de creadores
              </p>
            </div>
            
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="btn-tamv-gold">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Canal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Canal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input 
                      value={newChannel.name}
                      onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                      placeholder="Nombre del canal"
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={newChannel.description}
                      onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
                      placeholder="¿Qué contenido publicarás?"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Canal Premium</Label>
                    <Switch
                      checked={newChannel.is_premium}
                      onCheckedChange={(v) => setNewChannel({...newChannel, is_premium: v})}
                    />
                  </div>
                  {newChannel.is_premium && (
                    <>
                      <div>
                        <Label>Precio mensual (TAMV)</Label>
                        <Input 
                          type="number"
                          value={newChannel.price}
                          onChange={(e) => setNewChannel({...newChannel, price: Number(e.target.value)})}
                          min={0}
                        />
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg text-sm">
                        <p className="text-muted-foreground">
                          Comisión TAMV: <span className="text-foreground font-medium">20%</span>
                        </p>
                        <p className="text-muted-foreground">
                          Tu ganancia por suscriptor: <span className="text-accent font-medium">
                            {(newChannel.price * 0.80).toFixed(2)} TAMV/mes
                          </span>
                        </p>
                      </div>
                    </>
                  )}
                  <Button onClick={createChannel} className="w-full btn-tamv-gold">
                    Crear Canal
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
                  <Radio className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{channels.length}</p>
                  <p className="text-xs text-muted-foreground">Canales</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {channels.reduce((acc, c) => acc + (c.subscriber_count || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Suscriptores</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{channels.filter(c => c.is_premium).length}</p>
                  <p className="text-xs text-muted-foreground">Premium</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {channels.reduce((acc, c) => acc + (c.total_revenue || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">TAMV generados</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Channels Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="card-tamv animate-pulse">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 bg-muted rounded-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : channels.length === 0 ? (
            <Card className="card-tamv p-12 text-center">
              <Radio className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay canales</h3>
              <p className="text-muted-foreground mb-6">
                ¡Crea tu canal y comienza a compartir contenido!
              </p>
              <Button onClick={() => setCreateOpen(true)} className="btn-tamv-gold">
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primer canal
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channels.map((channel) => (
                <Card key={channel.id} className="card-tamv-featured overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        {channel.avatar_url ? (
                          <img src={channel.avatar_url} alt={channel.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Radio className="h-6 w-6 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{channel.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {channel.is_premium ? (
                            <Badge className="bg-amber-500/20 text-amber-500">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Gratis</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {channel.description || "Canal de contenido TAMV"}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <BellRing className="h-4 w-4" />
                        {channel.subscriber_count?.toLocaleString() || 0} suscriptores
                      </span>
                      {channel.is_premium && channel.price > 0 && (
                        <span className="font-bold text-primary">
                          {channel.price} TAMV/mes
                        </span>
                      )}
                    </div>

                    <Button 
                      className="w-full btn-tamv-cyan"
                      onClick={() => subscribeToChannel(channel)}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Suscribirse
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
