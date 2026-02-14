import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  Dot
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Zap, 
  ShieldAlert, 
  BrainCircuit, 
  Fingerprint, 
  Waves, 
  Lock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PROTOCOLO SOBERANO DE TELEMETRÍA EMOCIONAL
 * Definición de estados neuronales para la infraestructura civilizatoria TAMV.
 */
export type EcgPattern = "stable" | "focused" | "overloaded" | "scattered" | "quantum_leap";

export interface TAMVCrum {
  id: string;
  timestamp: Date;
  module: string;
  action: string;
  impact: { credits: number; socialIndex: number };
  ecgContext: {
    pattern: EcgPattern;
    intensity: number; // 0.0 a 1.0
    sessionDuration: number;
    neuralSync: number; // Nuevo: porcentaje de sincronización con Isabella AI
  };
  metadata: Record<string, unknown>;
}

interface TAMVMonitorProps {
  data: TAMVCrum[];
  height?: number;
  isLive?: boolean;
}

const PATTERN_METADATA: Record<EcgPattern, { color: string; icon: any; label: string; description: string }> = {
  stable: { 
    color: "#00ffc8", 
    icon: Waves, 
    label: "Sincronía Base", 
    description: "Flujo laminar de datos. Sistema en equilibrio civilizatorio." 
  },
  focused: { 
    color: "#ffffff", 
    icon: BrainCircuit, 
    label: "Estado de Flujo", 
    description: "Concentración máxima de recursos en un solo nodo." 
  },
  overloaded: { 
    color: "#ff3e3e", 
    icon: ShieldAlert, 
    label: "Estrés de Nodo", 
    description: "Saturación crítica detectada. Activando protocolos de enfriamiento." 
  },
  scattered: { 
    color: "#bd00ff", 
    icon: Activity, 
    label: "Dispersión", 
    description: "Actividad multi-modular sin eje de coordinación." 
  },
  quantum_leap: { 
    color: "#00d1ff", 
    icon: Zap, 
    label: "Salto Cuántico", 
    description: "Evolución instantánea de la huella digital detectada." 
  }
};

/**
 * COMPONENTE: TAMV QUANTUM MONITOR (DM-X4)
 * Evolucionado para representar la interconexión entre la economía (MSR) y la emoción.
 */
export const TAMVMonitor: React.FC<TAMVMonitorProps> = ({ 
  data, 
  height = 320,
  isLive = true 
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  const chartData = useMemo(() =>
    data.map((crum) => ({
      ...crum,
      time: new Date(crum.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      intensity: Math.round(crum.ecgContext.intensity * 100),
      neuralSync: Math.round(crum.ecgContext.neuralSync * 100),
      impactValue: crum.impact.credits,
    })), [data]
  );

  const stats = useMemo(() => {
    if (!data.length) return { avgSync: 0, peakImpact: 0, primaryPattern: "stable" as EcgPattern };
    const counts = data.reduce((acc, c) => {
      acc[c.ecgContext.pattern] = (acc[c.ecgContext.pattern] || 0) + 1;
      return acc;
    }, {} as any);
    
    return {
      avgSync: Math.round(data.reduce((a, b) => a + b.ecgContext.neuralSync, 0) / data.length * 100),
      peakImpact: Math.max(...data.map(d => d.impact.credits)),
      primaryPattern: Object.entries(counts).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0] as EcgPattern
    };
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-950/50 p-12 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-30" />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="relative flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="relative">
            <Fingerprint className="h-16 w-16 text-zinc-800 animate-pulse" />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-primary/20 rounded-full" 
            />
          </div>
          <div className="space-y-2">
            <h4 className="font-orbitron text-white text-lg tracking-widest uppercase">Esperando Identidad</h4>
            <p className="text-zinc-500 text-xs max-w-[240px] leading-relaxed">
              No se ha detectado pulso bio-digital. Por favor, interactúe con el ecosistema para iniciar la telemetría.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentPattern = PATTERN_METADATA[stats.primaryPattern];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col gap-6 p-6 rounded-[2.5rem] bg-black border border-white/10 shadow-2xl overflow-hidden"
    >
      {/* 1. HEADER TÁCTICO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 relative">
            <Activity className="h-6 w-6 text-primary animate-pulse" />
            <div className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full blur-[2px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-orbitron text-sm text-white tracking-widest uppercase">ECG Emocional DM-X4</h3>
              {isLive && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[8px] text-primary font-bold animate-pulse">
                   LIVE FEED
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase italic">
              ID_NODE: {chartData[0]?.id.substring(0, 8)} // Isabella_Sync: {stats.avgSync}%
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {Object.entries(PATTERN_METADATA).map(([key, meta]) => (
            <div 
              key={key}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-500",
                stats.primaryPattern === key ? "bg-white/5 border-white/20" : "bg-transparent border-transparent opacity-30 grayscale"
              )}
            >
              <meta.icon size={12} style={{ color: meta.color }} />
              <span className="text-[9px] font-orbitron text-white uppercase tracking-tighter">{meta.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ÁREA DE GRÁFICO EXPANSIVO */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm">
        {/* Grilla de Fondo Estilo Radar */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_#333_1px,_transparent_1px)] bg-[length:24px_24px]" />
        
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData} onMouseMove={(e: any) => e.activePayload && setHoveredPoint(e.activePayload[0].payload)}>
            <defs>
              <linearGradient id="quantumFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentPattern.color} stopOpacity={0.4} />
                <stop offset="60%" stopColor={currentPattern.color} stopOpacity={0.1} />
                <stop offset="100%" stopColor={currentPattern.color} stopOpacity={0} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="5 5" />
            <XAxis 
              dataKey="time" 
              hide 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fill: "#666", fontFamily: "monospace" }} 
            />
            <YAxis hide domain={[0, 110]} />
            
            <Tooltip
              cursor={{ stroke: currentPattern.color, strokeWidth: 1, strokeDasharray: "4 4" }}
              content={() => null} // Custom HUD abajo
            />

            <ReferenceLine y={stats.peakImpact > 50 ? 85 : 95} stroke="#ff3e3e" strokeDasharray="10 10" opacity={0.3} />
            
            <Area
              type="monotoneX"
              dataKey="intensity"
              stroke={currentPattern.color}
              strokeWidth={3}
              fill="url(#quantumFill)"
              filter="url(#glow)"
              animationDuration={1500}
              isAnimationActive={true}
            />
            
            <Area
              type="monotoneX"
              dataKey="neuralSync"
              stroke="#ffffff"
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="transparent"
              opacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 3. FOOTER HUD: DETALLE DEL PUNTO SELECCIONADO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 p-5 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col justify-between">
           <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                 <Lock size={14} className="text-primary" />
              </div>
              <span className="text-[10px] font-orbitron text-zinc-400 uppercase tracking-widest">Protocolo Dinámico</span>
           </div>
           <div className="mt-4">
              <div className="text-2xl font-orbitron text-white leading-none">+{stats.peakImpact} <span className="text-xs text-primary">MSR</span></div>
              <p className="text-[9px] text-zinc-500 uppercase mt-2">Pico de impacto en sesión</p>
           </div>
        </div>

        <div className="col-span-1 md:col-span-2 p-5 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col justify-between relative overflow-hidden">
           <AnimatePresence mode="wait">
             {hoveredPoint ? (
               <motion.div 
                 key={hoveredPoint.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex flex-col h-full justify-between"
               >
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <h4 className="text-xs font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                         {hoveredPoint.module} <ChevronRight size={10} className="text-primary" /> {hoveredPoint.action}
                       </h4>
                       <p className="text-[10px] text-zinc-400 font-mono italic">TS: {hoveredPoint.time}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-lg font-orbitron text-primary">{hoveredPoint.intensity}%</span>
                       <p className="text-[8px] text-zinc-500 uppercase">Intensidad Bio</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Estado</span>
                       <span className="text-[10px] font-bold" style={{ color: PATTERN_METADATA[hoveredPoint.ecgContext.pattern].color }}>
                         {PATTERN_METADATA[hoveredPoint.ecgContext.pattern].label}
                       </span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Sync</span>
                       <span className="text-[10px] text-white font-mono">{hoveredPoint.neuralSync}%</span>
                    </div>
                    <div className="ml-auto px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                       <Zap size={10} className="text-amber-400" />
                       <span className="text-[10px] font-bold text-white">+{hoveredPoint.impactValue} CREDITS</span>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="flex items-center justify-center h-full opacity-30 italic text-[10px] text-zinc-500 tracking-widest uppercase">
                  Deslice para analizar la huella digital
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Estilos Globales para Recharts en el Ecosistema */}
      {/* Styles applied via className instead of jsx style tag */}
    </motion.div>
  );
};

export default TAMVMonitor;
