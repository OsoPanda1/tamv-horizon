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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  PawPrint, Plus, Heart, Zap, Star, 
  ShoppingBag, Sparkles, Play
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Pet = Tables<"digital_pets">;
type Accessory = Tables<"pet_accessories">;

const SPECIES = [
  { value: "dragon", label: "Dragón", emoji: "🐉" },
  { value: "phoenix", label: "Fénix", emoji: "🔥" },
  { value: "unicorn", label: "Unicornio", emoji: "🦄" },
  { value: "wolf", label: "Lobo Cósmico", emoji: "🐺" },
  { value: "cat", label: "Gato Estelar", emoji: "🐱" },
  { value: "owl", label: "Búho Místico", emoji: "🦉" },
];

const RARITY_COLORS: Record<string, string> = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-amber-500",
  mythic: "bg-gradient-to-r from-pink-500 to-cyan-500"
};

export default function Mascotas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  
  const [newPet, setNewPet] = useState({
    name: "",
    species: "dragon"
  });

  useEffect(() => {
    fetchPets();
    fetchAccessories();
  }, [user]);

  const fetchPets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("digital_pets")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pets:", error);
    } else {
      setPets(data || []);
    }
    setLoading(false);
  };

  const fetchAccessories = async () => {
    const { data, error } = await supabase
      .from("pet_accessories")
      .select("*")
      .order("price", { ascending: true });

    if (!error) {
      setAccessories(data || []);
    }
  };

  const createPet = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para adoptar una mascota");
      navigate("/auth");
      return;
    }

    // Random rarity based on probability
    const rarityRoll = Math.random();
    let rarity: "common" | "rare" | "epic" | "legendary" | "mythic" = "common";
    if (rarityRoll > 0.99) rarity = "mythic";
    else if (rarityRoll > 0.95) rarity = "legendary";
    else if (rarityRoll > 0.85) rarity = "epic";
    else if (rarityRoll > 0.60) rarity = "rare";

    const { data, error } = await supabase
      .from("digital_pets")
      .insert({
        name: newPet.name,
        species: newPet.species,
        owner_id: user.id,
        rarity,
        level: 1,
        xp: 0,
        happiness: 100,
        energy: 100
      })
      .select()
      .single();

    if (error) {
      toast.error("Error al adoptar la mascota");
      console.error(error);
    } else {
      toast.success(`¡${data.name} se ha unido a tu familia! Rareza: ${rarity.toUpperCase()}`);
      setCreateOpen(false);
      setNewPet({ name: "", species: "dragon" });
      fetchPets();
    }
  };

  const feedPet = async (pet: Pet) => {
    const newEnergy = Math.min((pet.energy || 0) + 20, 100);
    const newHappiness = Math.min((pet.happiness || 0) + 10, 100);
    const newXp = (pet.xp || 0) + 5;
    
    // Level up check
    const xpForNextLevel = (pet.level || 1) * 100;
    const newLevel = newXp >= xpForNextLevel ? (pet.level || 1) + 1 : pet.level;

    await supabase
      .from("digital_pets")
      .update({
        energy: newEnergy,
        happiness: newHappiness,
        xp: newXp >= xpForNextLevel ? newXp - xpForNextLevel : newXp,
        level: newLevel,
        last_fed_at: new Date().toISOString()
      })
      .eq("id", pet.id);

    if (newLevel > (pet.level || 1)) {
      toast.success(`¡${pet.name} subió al nivel ${newLevel}!`);
    } else {
      toast.success(`¡${pet.name} está feliz!`);
    }
    
    fetchPets();
  };

  const playWithPet = async (pet: Pet) => {
    if ((pet.energy || 0) < 10) {
      toast.error(`${pet.name} está muy cansado para jugar`);
      return;
    }

    const newEnergy = Math.max((pet.energy || 0) - 10, 0);
    const newHappiness = Math.min((pet.happiness || 0) + 20, 100);
    const newXp = (pet.xp || 0) + 15;

    const xpForNextLevel = (pet.level || 1) * 100;
    const newLevel = newXp >= xpForNextLevel ? (pet.level || 1) + 1 : pet.level;

    await supabase
      .from("digital_pets")
      .update({
        energy: newEnergy,
        happiness: newHappiness,
        xp: newXp >= xpForNextLevel ? newXp - xpForNextLevel : newXp,
        level: newLevel,
        last_played_at: new Date().toISOString()
      })
      .eq("id", pet.id);

    if (newLevel > (pet.level || 1)) {
      toast.success(`¡${pet.name} subió al nivel ${newLevel}!`);
    } else {
      toast.success(`¡${pet.name} se divirtió jugando!`);
    }
    
    fetchPets();
  };

  const buyAccessory = async (accessory: Accessory) => {
    if (!user || !selectedPet) {
      toast.error("Selecciona una mascota primero");
      return;
    }

    const { error } = await supabase
      .from("pet_owned_accessories")
      .insert({
        pet_id: selectedPet.id,
        accessory_id: accessory.id
      });

    if (error) {
      toast.error("Error al comprar accesorio");
    } else {
      toast.success(`¡${accessory.name} comprado para ${selectedPet.name}!`);
      setShopOpen(false);
    }
  };

  const getSpeciesEmoji = (species: string) => {
    return SPECIES.find(s => s.value === species)?.emoji || "🐾";
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
                <PawPrint className="h-8 w-8 text-primary" />
                Mascotas Digitales
              </h1>
              <p className="text-muted-foreground mt-1">
                Quantum Pets - Compañeros virtuales únicos
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShopOpen(true)}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Tienda
              </Button>
              
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-tamv-gold">
                    <Plus className="h-4 w-4 mr-2" />
                    Adoptar Mascota
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adoptar Nueva Mascota</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input 
                        value={newPet.name}
                        onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                        placeholder="Nombre de tu mascota"
                      />
                    </div>
                    <div>
                      <Label>Especie</Label>
                      <Select 
                        value={newPet.species}
                        onValueChange={(v) => setNewPet({...newPet, species: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SPECIES.map(species => (
                            <SelectItem key={species.value} value={species.value}>
                              {species.emoji} {species.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Probabilidades de rareza:</p>
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        <div className="text-center">
                          <div className="w-6 h-6 rounded-full bg-gray-500 mx-auto mb-1" />
                          <span>Común 40%</span>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 rounded-full bg-blue-500 mx-auto mb-1" />
                          <span>Rara 25%</span>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 rounded-full bg-purple-500 mx-auto mb-1" />
                          <span>Épica 20%</span>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 rounded-full bg-amber-500 mx-auto mb-1" />
                          <span>Legendaria 10%</span>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 mx-auto mb-1" />
                          <span>Mítica 5%</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={createPet} className="w-full btn-tamv-gold" disabled={!newPet.name}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Adoptar (50 TAMV)
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* My Pets */}
          {!user ? (
            <Card className="card-tamv p-12 text-center">
              <PawPrint className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Inicia sesión para ver tus mascotas</h3>
              <Button onClick={() => navigate("/auth")} className="btn-tamv-gold mt-4">
                Iniciar Sesión
              </Button>
            </Card>
          ) : loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="card-tamv animate-pulse">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-24 w-24 bg-muted rounded-full mx-auto" />
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pets.length === 0 ? (
            <Card className="card-tamv p-12 text-center">
              <PawPrint className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tienes mascotas</h3>
              <p className="text-muted-foreground mb-6">
                ¡Adopta tu primer Quantum Pet y comienza la aventura!
              </p>
              <Button onClick={() => setCreateOpen(true)} className="btn-tamv-gold">
                <Plus className="h-4 w-4 mr-2" />
                Adoptar mi primera mascota
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="card-tamv-featured overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-5xl ${RARITY_COLORS[pet.rarity || "common"]} bg-opacity-20`}>
                        {getSpeciesEmoji(pet.species)}
                      </div>
                      <h3 className="font-bold text-xl mt-3">{pet.name}</h3>
                      <Badge className={`mt-1 ${RARITY_COLORS[pet.rarity || "common"]}`}>
                        {pet.rarity?.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex justify-center gap-2 text-sm">
                      <Badge variant="outline">Nivel {pet.level}</Badge>
                      <Badge variant="outline">{pet.xp}/{(pet.level || 1) * 100} XP</Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            Felicidad
                          </span>
                          <span>{pet.happiness}%</span>
                        </div>
                        <Progress value={pet.happiness || 0} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-amber-500" />
                            Energía
                          </span>
                          <span>{pet.energy}%</span>
                        </div>
                        <Progress value={pet.energy || 0} className="h-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => feedPet(pet)}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Alimentar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => playWithPet(pet)}
                        disabled={(pet.energy || 0) < 10}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Jugar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Shop Dialog */}
      <Dialog open={shopOpen} onOpenChange={setShopOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Tienda de Accesorios
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {pets.length > 0 && (
              <div>
                <Label>Selecciona mascota</Label>
                <Select onValueChange={(v) => setSelectedPet(pets.find(p => p.id === v) || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige una mascota" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {getSpeciesEmoji(pet.species)} {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {accessories.map(acc => (
                <Card key={acc.id} className="card-tamv">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">
                      {acc.image_url || "🎀"}
                    </div>
                    <h4 className="font-semibold">{acc.name}</h4>
                    <Badge className={`mt-1 ${RARITY_COLORS[acc.rarity || "common"]}`}>
                      {acc.rarity}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">{acc.description}</p>
                    <p className="font-bold text-primary mt-2">{acc.price} TAMV</p>
                    <Button 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => buyAccessory(acc)}
                      disabled={!selectedPet}
                    >
                      Comprar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              100% de las ventas de accesorios van a TAMV para mantener el ecosistema
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
