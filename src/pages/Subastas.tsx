import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { logAuctionEvent } from "@/lib/api/audit";
import TopToolbar from "@/components/layout/TopToolbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Gavel, Plus, Clock, Users, TrendingUp, 
  Flame, Eye, ArrowUp, Timer, Sparkles 
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Auction = Tables<"auctions">;

export default function Subastas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState(0);
  
  const [newAuction, setNewAuction] = useState({
    title: "",
    description: "",
    starting_price: 100,
    reserve_price: 0,
    start_time: "",
    end_time: "",
    category: "arte-digital"
  });

  useEffect(() => {
    fetchAuctions();
    
    // Subscribe to real-time bid updates
    const channel = supabase
      .channel("auction_bids")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "auction_bids" },
        (payload) => {
          // Refresh auction data when new bid comes in
          fetchAuctions();
          toast.info("¡Nueva puja recibida!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAuctions = async () => {
    const { data, error } = await supabase
      .from("auctions")
      .select("*")
      .neq("status", "draft")
      .order("end_time", { ascending: true });

    if (error) {
      console.error("Error fetching auctions:", error);
    } else {
      setAuctions(data || []);
    }
    setLoading(false);
  };

  const createAuction = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear una subasta");
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("auctions")
      .insert({
        ...newAuction,
        creator_id: user.id,
        status: "upcoming",
        commission_percent: 18
      })
      .select()
      .single();

    if (error) {
      toast.error("Error al crear la subasta");
      console.error(error);
    } else {
      toast.success("¡Subasta creada exitosamente!");
      logAuctionEvent(data.id, "auction_created", { 
        title: data.title, 
        creator: user.id,
        starting_price: data.starting_price
      });
      setCreateOpen(false);
      fetchAuctions();
    }
  };

  const placeBid = async () => {
    if (!user || !selectedAuction) {
      toast.error("Debes iniciar sesión para pujar");
      navigate("/auth");
      return;
    }

    const minBid = (selectedAuction.current_bid || selectedAuction.starting_price) * 1.05;
    if (bidAmount < minBid) {
      toast.error(`La puja mínima es ${minBid.toFixed(2)} TAMV`);
      return;
    }

    const { data, error } = await supabase
      .from("auction_bids")
      .insert({
        auction_id: selectedAuction.id,
        bidder_id: user.id,
        amount: bidAmount,
        is_winning: true
      })
      .select()
      .single();

    if (error) {
      toast.error("Error al realizar la puja");
      console.error(error);
    } else {
      // Update auction current bid
      await supabase
        .from("auctions")
        .update({ 
          current_bid: bidAmount,
          bid_count: (selectedAuction.bid_count || 0) + 1
        })
        .eq("id", selectedAuction.id);

      toast.success("¡Puja realizada con éxito!");
      logAuctionEvent(selectedAuction.id, "bid_placed", {
        bidId: data.id,
        bidderId: user.id,
        amount: bidAmount
      });
      setBidDialogOpen(false);
      fetchAuctions();
    }
  };

  const getTimeLeft = (endTime: string) => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return "Finalizada";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const getStatusBadge = (status: string | null, endTime: string) => {
    const ended = new Date(endTime).getTime() < Date.now();
    if (ended) return <Badge variant="outline">Finalizada</Badge>;
    
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      upcoming: { label: "Próximamente", variant: "secondary" },
      active: { label: "En curso", variant: "destructive" },
      ended: { label: "Finalizada", variant: "default" }
    };
    const s = statusMap[status || "active"];
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
                <Gavel className="h-8 w-8 text-primary" />
                Subastas XR
              </h1>
              <p className="text-muted-foreground mt-1">
                Arte digital, NFTs y experiencias únicas
              </p>
            </div>
            
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="btn-tamv-gold">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Subasta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Subasta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Título</Label>
                    <Input 
                      value={newAuction.title}
                      onChange={(e) => setNewAuction({...newAuction, title: e.target.value})}
                      placeholder="Nombre del item"
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={newAuction.description}
                      onChange={(e) => setNewAuction({...newAuction, description: e.target.value})}
                      placeholder="Describe tu item..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Precio inicial (TAMV)</Label>
                      <Input 
                        type="number"
                        value={newAuction.starting_price}
                        onChange={(e) => setNewAuction({...newAuction, starting_price: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Precio reserva</Label>
                      <Input 
                        type="number"
                        value={newAuction.reserve_price}
                        onChange={(e) => setNewAuction({...newAuction, reserve_price: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Inicio</Label>
                      <Input 
                        type="datetime-local"
                        value={newAuction.start_time}
                        onChange={(e) => setNewAuction({...newAuction, start_time: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Fin</Label>
                      <Input 
                        type="datetime-local"
                        value={newAuction.end_time}
                        onChange={(e) => setNewAuction({...newAuction, end_time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    <p className="text-muted-foreground">
                      Comisión TAMV: <span className="text-foreground font-medium">18%</span>
                    </p>
                  </div>
                  <Button onClick={createAuction} className="w-full btn-tamv-gold">
                    Crear Subasta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{auctions.filter(a => a.status === "active").length}</p>
                  <p className="text-xs text-muted-foreground">En curso</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {auctions.reduce((acc, a) => acc + (a.current_bid || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">TAMV en pujas</p>
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
                    {auctions.reduce((acc, a) => acc + (a.bid_count || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Pujas totales</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-tamv">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{auctions.length}</p>
                  <p className="text-xs text-muted-foreground">Total subastas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Auction Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="card-tamv animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : auctions.length === 0 ? (
            <Card className="card-tamv p-12 text-center">
              <Gavel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay subastas activas</h3>
              <p className="text-muted-foreground mb-6">
                ¡Crea la primera subasta y comienza a vender arte digital!
              </p>
              <Button onClick={() => setCreateOpen(true)} className="btn-tamv-gold">
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primera subasta
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <Card key={auction.id} className="card-tamv-featured overflow-hidden group">
                  <div className="relative h-48 bg-gradient-to-br from-primary/30 to-accent/30">
                    {auction.image_url ? (
                      <img 
                        src={auction.image_url} 
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gavel className="h-16 w-16 text-primary/50" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(auction.status, auction.end_time)}
                    </div>
                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {getTimeLeft(auction.end_time)}
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-lg line-clamp-1">{auction.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {auction.description || "Arte digital único"}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Puja actual</p>
                        <p className="text-xl font-bold text-primary">
                          {(auction.current_bid || auction.starting_price).toLocaleString()} TAMV
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Pujas</p>
                        <p className="font-semibold">{auction.bid_count || 0}</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full btn-tamv-cyan"
                      onClick={() => {
                        setSelectedAuction(auction);
                        setBidAmount((auction.current_bid || auction.starting_price) * 1.1);
                        setBidDialogOpen(true);
                      }}
                      disabled={new Date(auction.end_time).getTime() < Date.now()}
                    >
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Pujar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bid Dialog */}
      <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Realizar Puja</DialogTitle>
          </DialogHeader>
          {selectedAuction && (
            <div className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Subastando:</p>
                <p className="font-bold">{selectedAuction.title}</p>
                <p className="text-sm mt-2">
                  Puja actual: <span className="text-primary font-bold">
                    {(selectedAuction.current_bid || selectedAuction.starting_price).toLocaleString()} TAMV
                  </span>
                </p>
              </div>
              
              <div>
                <Label>Tu puja (TAMV)</Label>
                <Input 
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={(selectedAuction.current_bid || selectedAuction.starting_price) * 1.05}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo: {((selectedAuction.current_bid || selectedAuction.starting_price) * 1.05).toFixed(2)} TAMV
                </p>
              </div>
              
              <Button onClick={placeBid} className="w-full btn-tamv-gold">
                Confirmar Puja
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
