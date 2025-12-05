import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Zap, Star, Sparkles, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Pet = Tables<"digital_pets">;

interface PetVisualizerProps {
  pet: Pet;
  size?: "sm" | "md" | "lg";
  showStats?: boolean;
  interactive?: boolean;
  onInteract?: (action: "pet" | "feed" | "play") => void;
}

// Species visual configurations
const SPECIES_CONFIG: Record<string, {
  emoji: string;
  primaryColor: string;
  secondaryColor: string;
  animation: string;
  particles: string[];
  aura: string;
}> = {
  dragon: {
    emoji: "🐉",
    primaryColor: "from-orange-500 to-red-600",
    secondaryColor: "orange",
    animation: "animate-bounce",
    particles: ["🔥", "✨", "💫"],
    aura: "shadow-orange-500/50"
  },
  phoenix: {
    emoji: "🔥",
    primaryColor: "from-yellow-400 to-orange-500",
    secondaryColor: "yellow",
    animation: "animate-pulse",
    particles: ["✨", "🌟", "💛"],
    aura: "shadow-yellow-500/50"
  },
  unicorn: {
    emoji: "🦄",
    primaryColor: "from-pink-400 to-purple-500",
    secondaryColor: "pink",
    animation: "animate-float",
    particles: ["⭐", "🌈", "💜"],
    aura: "shadow-pink-500/50"
  },
  wolf: {
    emoji: "🐺",
    primaryColor: "from-blue-500 to-indigo-600",
    secondaryColor: "blue",
    animation: "animate-pulse",
    particles: ["🌙", "✨", "💙"],
    aura: "shadow-blue-500/50"
  },
  cat: {
    emoji: "🐱",
    primaryColor: "from-purple-400 to-pink-500",
    secondaryColor: "purple",
    animation: "animate-bounce",
    particles: ["⭐", "💜", "✨"],
    aura: "shadow-purple-500/50"
  },
  owl: {
    emoji: "🦉",
    primaryColor: "from-amber-500 to-yellow-600",
    secondaryColor: "amber",
    animation: "animate-pulse",
    particles: ["🌙", "⭐", "✨"],
    aura: "shadow-amber-500/50"
  }
};

const RARITY_GLOW: Record<string, string> = {
  common: "ring-2 ring-gray-400/50",
  rare: "ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/30",
  epic: "ring-2 ring-purple-400/50 shadow-lg shadow-purple-500/30",
  legendary: "ring-2 ring-amber-400/50 shadow-xl shadow-amber-500/40 animate-pulse",
  mythic: "ring-4 ring-gradient-to-r from-pink-500 to-cyan-500 shadow-2xl animate-glow-pulse"
};

const SIZE_CONFIG = {
  sm: { container: "w-20 h-20", emoji: "text-3xl", ring: "p-2" },
  md: { container: "w-32 h-32", emoji: "text-5xl", ring: "p-3" },
  lg: { container: "w-48 h-48", emoji: "text-7xl", ring: "p-4" }
};

export default function PetVisualizer({ 
  pet, 
  size = "md", 
  showStats = true,
  interactive = true,
  onInteract
}: PetVisualizerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [mood, setMood] = useState<"happy" | "neutral" | "tired">("neutral");

  const config = SPECIES_CONFIG[pet.species] || SPECIES_CONFIG.dragon;
  const sizeConfig = SIZE_CONFIG[size];
  const rarityGlow = RARITY_GLOW[pet.rarity || "common"];

  // Determine mood based on stats
  useEffect(() => {
    const happiness = pet.happiness || 50;
    const energy = pet.energy || 50;
    
    if (happiness > 70 && energy > 50) {
      setMood("happy");
    } else if (energy < 30 || happiness < 30) {
      setMood("tired");
    } else {
      setMood("neutral");
    }
  }, [pet.happiness, pet.energy]);

  // Random particle burst
  useEffect(() => {
    if (isHovered) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      symbol: config.particles[i % config.particles.length],
      angle: (i / 8) * 360,
      delay: i * 0.1
    }));
  }, [config.particles]);

  return (
    <div className="relative inline-flex flex-col items-center gap-3">
      {/* Main pet container */}
      <motion.div
        className={cn(
          "relative rounded-full cursor-pointer",
          sizeConfig.container,
          rarityGlow,
          interactive && "hover:scale-110 transition-transform duration-300"
        )}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => onInteract?.("pet")}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background glow */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-50 transition-opacity",
            `bg-gradient-to-br ${config.primaryColor}`,
            isHovered ? "opacity-70" : "opacity-30"
          )}
        />

        {/* Aura rings */}
        {(pet.rarity === "legendary" || pet.rarity === "mythic") && (
          <>
            <div className={cn(
              "absolute inset-[-8px] rounded-full border-2 border-dashed animate-spin opacity-30",
              `border-${config.secondaryColor}-400`
            )} style={{ animationDuration: "10s" }} />
            <div className={cn(
              "absolute inset-[-16px] rounded-full border border-dashed animate-spin opacity-20",
              `border-${config.secondaryColor}-400`
            )} style={{ animationDuration: "15s", animationDirection: "reverse" }} />
          </>
        )}

        {/* Pet emoji container */}
        <div className={cn(
          "relative w-full h-full rounded-full flex items-center justify-center",
          `bg-gradient-to-br ${config.primaryColor} bg-opacity-20`,
          sizeConfig.ring
        )}>
          <span className={cn(
            sizeConfig.emoji,
            config.animation,
            mood === "tired" && "grayscale-[30%] opacity-80"
          )}>
            {config.emoji}
          </span>

          {/* Mood indicator */}
          <div className="absolute -top-1 -right-1">
            {mood === "happy" && <span className="text-lg animate-bounce">😊</span>}
            {mood === "tired" && <span className="text-lg">😴</span>}
          </div>

          {/* Level badge */}
          <div className="absolute -bottom-1 -right-1 bg-background border-2 border-primary rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-primary">
            {pet.level}
          </div>
        </div>

        {/* Floating particles */}
        <AnimatePresence>
          {showParticles && particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-lg pointer-events-none"
              initial={{ 
                opacity: 0, 
                scale: 0.5,
                x: 0,
                y: 0
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0.5, 1, 0.5],
                x: Math.cos(p.angle * Math.PI / 180) * 50,
                y: Math.sin(p.angle * Math.PI / 180) * 50
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: p.delay,
                ease: "easeOut"
              }}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)"
              }}
            >
              {p.symbol}
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pet name */}
      <div className="text-center">
        <h4 className="font-bold text-foreground">{pet.name}</h4>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full capitalize",
          pet.rarity === "mythic" && "bg-gradient-to-r from-pink-500 to-cyan-500 text-white",
          pet.rarity === "legendary" && "bg-amber-500/20 text-amber-400",
          pet.rarity === "epic" && "bg-purple-500/20 text-purple-400",
          pet.rarity === "rare" && "bg-blue-500/20 text-blue-400",
          pet.rarity === "common" && "bg-gray-500/20 text-gray-400"
        )}>
          {pet.rarity}
        </span>
      </div>

      {/* Stats bars */}
      {showStats && (
        <div className="w-full space-y-2 max-w-[150px]">
          {/* Happiness */}
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-400" />
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pet.happiness || 0}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8">{pet.happiness}%</span>
          </div>

          {/* Energy */}
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pet.energy || 0}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8">{pet.energy}%</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((pet.xp || 0) / ((pet.level || 1) * 100)) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8">{pet.xp}/{(pet.level || 1) * 100}</span>
          </div>
        </div>
      )}

      {/* Interactive buttons */}
      {interactive && isHovered && (
        <motion.div 
          className="flex gap-2 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button 
            onClick={() => onInteract?.("feed")}
            className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
            title="Alimentar"
          >
            <Heart className="h-4 w-4 text-red-400" />
          </button>
          <button 
            onClick={() => onInteract?.("play")}
            className="p-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
            title="Jugar"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
