import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/useGamification";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, Zap, Trophy, Target, Sparkles, 
  ChevronRight, Crown, Flame, Shield 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Achievements definition
const ACHIEVEMENTS = [
  { id: "first_post", name: "Primera Voz", description: "Publica tu primer contenido", icon: Star, xp: 50, rarity: "common" },
  { id: "social_butterfly", name: "Mariposa Social", description: "Haz 10 amigos", icon: Sparkles, xp: 100, rarity: "rare" },
  { id: "dream_creator", name: "Creador de Sueños", description: "Crea tu primer DreamSpace", icon: Zap, xp: 200, rarity: "epic" },
  { id: "concert_master", name: "Maestro de Conciertos", description: "Organiza un concierto sensorial", icon: Crown, xp: 500, rarity: "legendary" },
  { id: "auction_winner", name: "Coleccionista", description: "Gana tu primera subasta", icon: Trophy, xp: 150, rarity: "rare" },
  { id: "pet_parent", name: "Padre de Mascotas", description: "Adopta tu primera mascota digital", icon: Flame, xp: 75, rarity: "common" },
  { id: "bridge_builder", name: "Constructor de Puentes", description: "Completa 5 colaboraciones", icon: Shield, xp: 300, rarity: "epic" },
];

const LEVEL_TITLES = [
  "Iniciado Cósmico",
  "Explorador Astral", 
  "Viajero Onírico",
  "Guardián del Sueño",
  "Arquitecto de Realidades",
  "Maestro Dimensional",
  "Sabio Ancestral",
  "Avatar Cuántico",
  "Codificador del Cosmos",
  "Leyenda TAMV"
];

const RARITY_STYLES: Record<string, string> = {
  common: "border-gray-400 bg-gray-500/10",
  rare: "border-blue-400 bg-blue-500/10",
  epic: "border-purple-400 bg-purple-500/10",
  legendary: "border-amber-400 bg-amber-500/10 animate-pulse"
};

export default function HoyoNegroWidget() {
  const { user } = useAuth();
  const { userLevel, addXP } = useGamification();
  const [expanded, setExpanded] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(["first_post"]);
  const [animateAbsorb, setAnimateAbsorb] = useState(false);

  // Calculate progress to next level
  const xpProgress = useMemo(() => {
    if (!userLevel) return 0;
    const level = userLevel.level || 1;
    const xpForLevel = level * 100;
    const currentXP = (userLevel as any).xp || (level * 50);
    return Math.min((currentXP / xpForLevel) * 100, 100);
  }, [userLevel]);

  // Get current title
  const currentTitle = useMemo(() => {
    const level = userLevel?.level || 1;
    const titleIndex = Math.min(Math.floor((level - 1) / 5), LEVEL_TITLES.length - 1);
    return LEVEL_TITLES[titleIndex];
  }, [userLevel]);

  // Simulate absorption animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateAbsorb(true);
      setTimeout(() => setAnimateAbsorb(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <Card className={cn(
      "card-tamv overflow-hidden relative",
      "border-primary/30 hover:border-primary/50 transition-colors"
    )}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-64 h-64 rounded-full",
          "bg-gradient-radial from-primary/20 via-primary/5 to-transparent",
          animateAbsorb && "animate-pulse scale-110",
          "transition-transform duration-1000"
        )} />
        
        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
            style={{
              top: "50%",
              left: "50%",
              animation: `orbit ${3 + i}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
              transformOrigin: `${20 + i * 15}px 0`
            }}
          />
        ))}
      </div>

      <CardContent className="p-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Black hole icon */}
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-primary via-accent to-primary",
              "shadow-lg shadow-primary/30",
              animateAbsorb && "animate-spin"
            )} style={{ animationDuration: "2s" }}>
              <div className="w-6 h-6 rounded-full bg-background" />
            </div>
            
            <div>
              <h3 className="font-bold text-glow-gold flex items-center gap-2">
                Hoyo Negro TAMV
                <Badge variant="outline" className="text-xs">
                  Nv. {userLevel?.level || 1}
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">{currentTitle}</p>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-1"
          >
            {expanded ? "Menos" : "Ver logros"}
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-90"
            )} />
          </Button>
        </div>

        {/* XP Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso al siguiente nivel</span>
            <span className="font-medium text-primary">
              {(userLevel?.level || 1) * 50} / {(userLevel?.level || 1) * 100} XP
            </span>
          </div>
          <div className="relative">
            <Progress value={xpProgress} className="h-3" />
            <div 
              className="absolute top-0 h-3 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full animate-pulse"
              style={{ width: `${xpProgress}%`, opacity: 0.5 }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{unlockedAchievements.length}</div>
            <div className="text-xs text-muted-foreground">Logros</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-accent">{userLevel?.level || 1}</div>
            <div className="text-xs text-muted-foreground">Nivel</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-amber-500">{(userLevel?.level || 1) * 50}</div>
            <div className="text-xs text-muted-foreground">XP Total</div>
          </div>
        </div>

        {/* Expanded Achievements */}
        {expanded && (
          <div className="space-y-3 pt-4 border-t border-border/50">
            <h4 className="font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Logros ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </h4>
            
            <div className="grid gap-2">
              {ACHIEVEMENTS.map(achievement => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                const Icon = achievement.icon;
                
                return (
                  <div
                    key={achievement.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all",
                      isUnlocked 
                        ? RARITY_STYLES[achievement.rarity]
                        : "border-border/50 bg-muted/20 opacity-60"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isUnlocked ? "bg-primary/20" : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        isUnlocked ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium",
                          !isUnlocked && "text-muted-foreground"
                        )}>
                          {achievement.name}
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-sm font-bold",
                        isUnlocked ? "text-primary" : "text-muted-foreground"
                      )}>
                        +{achievement.xp} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>

      {/* CSS for orbit animation */}
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(30px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
        }
      `}</style>
    </Card>
  );
}
