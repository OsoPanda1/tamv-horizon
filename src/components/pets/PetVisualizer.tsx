import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { 
  Heart, Zap, Star, Sparkles, ShieldCheck, 
  Fingerprint, Activity, Flame, Droplets, Wind, 
  Orbit, Atom, BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- TIPOS Y CONSTANTES SOBERANAS ---
type EntityMood = "Eufórico" | "Sincronizado" | "Inhibido" | "Degradado" | "Crítico";
type EntityRarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic" | "Sovereign";

interface Entity {
  id: string;
  name: string;
  species: string;
  rarity: EntityRarity;
  level: number;
  happiness: number;
  energy: number;
  xp: number;
  integrity: number; // Nueva métrica TAMV
}

// Configuración de Especies con Lógica Civilizatoria
const ENTITY_SPECIES: Record<string, any> = {
  dragon: {
    icon: <Flame className="w-full h-full" />,
    color: "from-orange-600 via-red-500 to-amber-400",
    glow: "shadow-[0_0_50px_rgba(239,68,68,0.4)]",
    particleColor: "text-orange-500",
    accent: "text-red-400",
    theme: "Igneo",
    orbitalSpeed: 8
  },
  phoenix: {
    icon: <Orbit className="w-full h-full" />,
    color: "from-yellow-400 via-orange-500 to-rose-500",
    glow: "shadow-[0_0_50px_rgba(245,158,11,0.4)]",
    particleColor: "text-yellow-400",
    accent: "text-orange-300",
    theme: "Solar",
    orbitalSpeed: 12
  },
  unicorn: {
    icon: <Atom className="w-full h-full" />,
    color: "from-fuchsia-500 via-purple-600 to-indigo-400",
    glow: "shadow-[0_0_60px_rgba(192,38,211,0.4)]",
    particleColor: "text-fuchsia-300",
    accent: "text-purple-300",
    theme: "Éter",
    orbitalSpeed: 15
  },
  cyber_wolf: {
    icon: <ShieldCheck className="w-full h-full" />,
    color: "from-cyan-500 via-blue-600 to-emerald-400",
    glow: "shadow-[0_0_50px_rgba(6,182,212,0.4)]",
    particleColor: "text-cyan-400",
    accent: "text-blue-300",
    theme: "Cripto-Nodal",
    orbitalSpeed: 10
  }
};

const RARITY_SCHEMA: Record<EntityRarity, any> = {
  Common: { border: "border-zinc-700", bg: "bg-zinc-900/50", label: "text-zinc-400" },
  Rare: { border: "border-blue-500/50", bg: "bg-blue-900/20", label: "text-blue-400" },
  Epic: { border: "border-purple-500/50", bg: "bg-purple-900/20", label: "text-purple-400" },
  Legendary: { border: "border-amber-500/60", bg: "bg-amber-900/20", label: "text-amber-400 animate-pulse" },
  Mythic: { border: "border-red-500/70", bg: "bg-red-900/30", label: "text-red-500 font-bold" },
  Sovereign: { border: "border-primary", bg: "bg-primary/10", label: "text-primary animate-glow-pulse font-black" }
};

// --- COMPONENTE PRINCIPAL ---
export default function TAMVEntityVisualizer({ 
  entity, 
  size = "md",
  onAction 
}: { 
  entity: Entity, 
  size?: "sm" | "md" | "lg",
  onAction?: (type: string) => void 
}) {
  const [mood, setMood] = useState<EntityMood>("Sincronizado");
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimationControls();
  
  const species = ENTITY_SPECIES[entity.species] || ENTITY_SPECIES.dragon;
  const rarity = RARITY_SCHEMA[entity.rarity];

  // Escalamiento Dinámico
  const dimensions = {
    sm: "w-32 h-32",
    md: "w-56 h-56",
    lg: "w-80 h-80"
  }[size];

  // Lógica de Mood Isabella AI
  useEffect(() => {
    const avg = (entity.happiness + entity.energy + entity.integrity) / 3;
    if (avg > 85) setMood("Eufórico");
    else if (avg > 60) setMood("Sincronizado");
    else if (avg > 40) setMood("Inhibido");
    else if (avg > 15) setMood("Degradado");
    else setMood("Crítico");
  }, [entity]);

  // Animación de Latido
  useEffect(() => {
    controls.start({
      scale: [1, 1.03, 1],
      transition: { duration: mood === "Eufórico" ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }
    });
  }, [mood, controls]);

  return (
    <div className="relative group flex flex-col items-center p-6 select-none">
      
      {/* 1. ANILLOS ORBITALES (Física Cuántica) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.div 
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 0.2, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ duration: species.orbitalSpeed, repeat: Infinity, ease: "linear" }}
                className={cn("absolute rounded-full border border-dashed", dimensions)}
                style={{ borderColor: species.accent }}
              />
              <motion.div 
                initial={{ opacity: 0, rotate: 360 }}
                animate={{ opacity: 0.1, rotate: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: species.orbitalSpeed * 1.5, repeat: Infinity, ease: "linear" }}
                className={cn("absolute rounded-full border border-dotted scale-125", dimensions)}
                style={{ borderColor: species.accent }}
              />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CONTENEDOR DE LA ENTIDAD */}
      <motion.div
        animate={controls}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "relative rounded-[2.5rem] p-1 overflow-visible cursor-crosshair transition-all duration-700",
          dimensions,
          isHovered ? "scale-105" : "scale-100"
        )}
      >
        {/* Glow de Fondo */}
        <div className={cn(
          "absolute inset-0 rounded-[2.5rem] blur-[30px] transition-opacity duration-1000",
          species.glow,
          isHovered ? "opacity-100" : "opacity-40"
        )} />

        {/* Cuerpo Principal */}
        <div className={cn(
          "relative w-full h-full rounded-[2.2rem] border-2 backdrop-blur-xl flex items-center justify-center overflow-hidden z-10",
          rarity.border,
          rarity.bg
        )}>
          {/* Scanlines y Grano (Estética TAMV) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          {/* Icono de Especie Reactivo */}
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              filter: isHovered ? "brightness(1.2) saturate(1.2)" : "brightness(1) saturate(1)"
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={cn("w-2/3 h-2/3 transition-colors duration-500", species.accent)}
          >
            {species.icon}
          </motion.div>

          {/* HUD de Integridad Interno */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-orbitron text-white/30 tracking-widest uppercase">Sync_Rate</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={cn(
                      "h-1 w-3 rounded-full",
                      i < (entity.integrity / 20) ? "bg-primary shadow-[0_0_5px_#00ffc8]" : "bg-white/10"
                    )} />
                  ))}
                </div>
             </div>
             <Fingerprint className="w-4 h-4 text-white/20" />
          </div>
        </div>

        {/* Badge de Nivel Volante */}
        <div className="absolute -top-3 -right-3 w-12 h-12 bg-black border border-primary/50 rounded-2xl flex items-center justify-center shadow-2xl z-20">
          <span className="font-orbitron text-primary text-sm font-bold">L.{entity.level}</span>
        </div>
      </motion.div>

      {/* 3. PANEL DE INFORMACIÓN (Isabella AI Interface) */}
      <div className="mt-8 w-full max-w-xs space-y-4">
        <div className="text-center space-y-1">
          <h3 className="font-orbitron text-xl text-white tracking-tighter uppercase italic">
            {entity.name}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse bg-primary")} />
            <span className={cn("text-[10px] tracking-[0.3em] uppercase", rarity.label)}>
              {entity.rarity} {species.theme} Entity
            </span>
          </div>
        </div>

        {/* Stats de Precisión */}
        <div className="grid grid-cols-1 gap-3 p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
          {/* Happiness / Estabilidad Emocional */}
          <StatBar icon={<Heart size={12}/>} label="Estabilidad" value={entity.happiness} color="bg-rose-500" />
          {/* Energy / Reserva Cuántica */}
          <StatBar icon={<Zap size={12}/>} label="Reserva" value={entity.energy} color="bg-amber-400" />
          {/* XP / Evolución Neuronal */}
          <StatBar icon={<BrainCircuit size={12}/>} label="Evolución" value={entity.xp % 100} color="bg-primary" />
        </div>

        {/* Controles de Acción (Solo si es interactivo) */}
        <div className="flex justify-center gap-4">
          <ActionButton onClick={() => onAction?.('sync')} icon={<Activity size={18}/>} label="Sincronizar" />
          <ActionButton onClick={() => onAction?.('feed')} icon={<Droplets size={18}/>} label="Nutrir" />
          <ActionButton onClick={() => onAction?.('train')} icon={<Wind size={18}/>} label="Optimizar" />
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTES ATÓMICOS ---

function StatBar({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[9px] font-orbitron text-zinc-500 uppercase tracking-wider">
        <span className="flex items-center gap-1">{icon} {label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={cn("h-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", color)}
        />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="group relative flex flex-col items-center gap-2"
    >
      <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
        <div className="text-zinc-500 group-hover:text-primary transition-colors">
          {icon}
        </div>
      </div>
      <span className="text-[8px] font-orbitron text-zinc-600 group-hover:text-white uppercase tracking-tighter transition-colors">
        {label}
      </span>
    </motion.button>
  );
}
