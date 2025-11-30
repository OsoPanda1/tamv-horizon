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
  Users, Plus, Lock, Globe, Crown, UserPlus,
  MessageSquare, Settings, TrendingUp
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Group = Tables<"groups">;

export default function Grupos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "mine" | "joined">("all");
  
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    is_private: false,
    is_paid: false,
    price: 0,
    max_members: 1000,
    category: "general"
  });

  useEffect(() => {
    fetchGroups();
  }, [filter, user]);

  const fetchGroups = async () => {
    let query = supabase
      .from("groups")
      .select("*")
      .order("member_count", { ascending: false });

    if (filter === "mine" && user) {
      query = query.eq("owner_id", user.id);
    } else if (filter === "all") {
      query = query.eq("is_private", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching groups:", error);
    } else {
      setGroups(data || []);
    }
    setLoading(false);
  };

  const createGroup = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear un grupo");
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("groups")
      .insert({
        ...newGroup,
        owner_id: user.id,
        commission_percent: 25
      })
      .select()
      .single();

    if (error) {
      toast.error("Error al crear el grupo");
      console.error(error);
    } else {
      // Auto-join as owner
      await supabase.from("group_members").insert({
        group_id: data.id,
        user_id: user.id,
        role: "owner"
      });

      toast.success("¡Grupo creado exitosamente!");
      setCreateOpen(false);
      fetchGroups();
    }
  };

  const joinGroup = async (group: Group) => {
    if (!user) {
      toast.error("Debes iniciar sesión para unirte");
      navigate("/auth");
      return;
    }

    // Check if already member
    const { data: existing } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", group.id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      toast.info("Ya eres miembro de este grupo");
      return;
    }

    const { error } = await supabase.from("group_members").insert({
      group_id: group.id,
      user_id: user.id,
      role: "member"
    });

    if (error) {
      toast.error("Error al unirse al grupo");
    } else {
      // Update member count
      await supabase
        .from("groups")
        .update({ member_count: (group.member_count || 0) + 1 })
        .eq("id", group.id);

      toast.success(`¡Te has unido a ${group.name}!`);
      fetchGroups();
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
                <Users className="h-8 w-8 text-primary" />
                Grupos
              </h1>
              <p className="text-muted-foreground mt-1">
                Comunidades para conectar, crear y colaborar
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-muted rounded-lg p-1">
                <Button 
                  variant={filter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Explorar
                </Button>
                <Button 
                  variant={filter === "mine" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("mine")}
                  disabled={!user}
                >
                  Mis Grupos
                </Button>
              </div>
              
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-tamv-gold">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Grupo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Grupo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input 
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                        placeholder="Nombre del grupo"
                      />
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                        placeholder="¿De qué trata tu grupo?"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Grupo Privado</Label>
                      <Switch
                        checked={newGroup.is_private}
                        onCheckedChange={(v) => setNewGroup({...newGroup, is_private: v})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Grupo de Paga</Label>
                      <Switch
                        checked={newGroup.is_paid}
                        onCheckedChange={(v) => setNewGroup({...newGroup, is_paid: v})}
                      />
                    </div>
                    {newGroup.is_paid && (
                      <>
                        <div>
                          <Label>Precio mensual (TAMV)</Label>
                          <Input 
                            type="number"
                            value={newGroup.price}
                            onChange={(e) => setNewGroup({...newGroup, price: Number(e.target.value)})}
                            min={2.99}
                            max={299}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Rango: 2.99 - 299 TAMV/mes
                          </p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-sm">
                          <p className="text-muted-foreground">
                            Comisión TAMV: <span className="text-foreground font-medium">25%</span>
                          </p>
                          <p className="text-muted-foreground">
                            Tu ganancia por miembro: <span className="text-accent font-medium">
                              {(newGroup.price * 0.75).toFixed(2)} TAMV/mes
                            </span>
                          </p>
                        </div>
                      </>
                    )}
                    <Button onClick={createGroup} className="w-full btn-tamv-gold">
                      Crear Grupo
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
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groups.length}</p>
                  <p className="text-xs text-muted-foreground">Grupos activos</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {groups.reduce((acc, g) => acc + (g.member_count || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Miembros totales</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groups.filter(g => g.is_paid).length}</p>
                  <p className="text-xs text-muted-foreground">Grupos premium</p>
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
                    {groups.reduce((acc, g) => acc + (g.total_revenue || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">TAMV generados</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Groups Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="card-tamv animate-pulse">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 bg-muted rounded-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : groups.length === 0 ? (
            <Card className="card-tamv p-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay grupos disponibles</h3>
              <p className="text-muted-foreground mb-6">
                ¡Crea el primer grupo y comienza a construir comunidad!
              </p>
              <Button onClick={() => setCreateOpen(true)} className="btn-tamv-gold">
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primer grupo
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="card-tamv-featured overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                        {group.avatar_url ? (
                          <img src={group.avatar_url} alt={group.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          group.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg truncate">{group.name}</h3>
                          {group.is_private && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {group.is_paid ? (
                            <Badge className="bg-amber-500/20 text-amber-500">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Globe className="h-3 w-3 mr-1" />
                              Gratis
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {group.description || "Grupo de la comunidad TAMV"}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {group.member_count?.toLocaleString() || 0} miembros
                      </span>
                      {group.is_paid && (
                        <span className="font-bold text-primary">
                          {group.price} TAMV/mes
                        </span>
                      )}
                    </div>

                    <Button 
                      className="w-full btn-tamv-cyan"
                      onClick={() => joinGroup(group)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Unirse
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
