/**
 * 📡 TAMV SIGNAL INTELLIGENCE CENTER - VERSIÓN CORREGIDA Y BLINDADA
 * Error Fix: ReferenceError refreshTrigger solved.
 * Arquitectura: Inmutabilidad BookPI / Protocolo Isabella
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Bell, ShieldCheck, Zap, Heart, 
  Coins, Award, AlertOctagon, Fingerprint, 
  Sparkles, Check, Settings2, Radio, Eye, Scale
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- TIPOS DE SEÑAL TAMV ---
type SignalType = "achievement" | "social" | "economic" | "security" | "governance" | "isabella" | "system";

export default function NotificationCenter() {
  // Hook de notificaciones corregido
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  // Estado local para evitar ReferenceErrors en filtros
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [internalRefresh, setInternalRefresh] = useState(0);

  // --- LÓGICA DE FILTRADO SEGURO ---
  const filteredSignals = useMemo(() => {
    if (!notifications) return [];
    if (activeFilter === "all") return notifications;
    return notifications.filter((n: any) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  // --- MAPEO DE IDENTIDAD VISUAL (7 FEDERACIONES) ---
  const getSignalIdentity = useCallback((type: string) => {
    const config: Record<string, { icon: any, color: string, label: string }> = {
      achievement: { icon: Award, color: "text-amber-400", label: "LOGRO_CIVIL" },
      social: { icon: Heart, color: "text-rose-400", label: "NEXUS_SOCIAL" },
      economic: { icon: Coins, color: "text-emerald-400", label: "MSR_TRANSFER" },
      security: { icon: ShieldCheck, color: "text-blue-400", label: "ANUBIS_SHIELD" },
      governance: { icon: Scale, color: "text-purple-400", label: "CITEMESH_VOTE" },
      isabella: { icon: Sparkles, color: "text-primary", label: "ISABELLA_AI" },
      system: { icon: Radio, color: "text-zinc-400", label: "SYSTEM_CORE" },
    };
    return config[type] || config.system;
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative group hover:bg-white/5 rounded-xl h-10 w-10 transition-all duration-300"
        >
          <Bell className={cn(
            "h-5 w-5 transition-all duration-500",
            unreadCount > 0 ? "text-primary scale-110" : "text-zinc-400"
          )} />
          
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 flex h-4 w-4"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <Badge className="relative h-4 w-4 p-0 flex items-center justify-center bg-primary text-[9px] font-black border-none text-black">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-[380px] bg-zinc-950/98 border-white/5 backdrop-blur-3xl rounded-[2rem] p-0 overflow-hidden shadow-2xl mt-2"
      >
        {/* HEADER TÉCNICO */}
        <div className="p-5 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-orbitron text-[11px] tracking-[0.2em] text-white flex items-center gap-2">
                SIGNAL_INTELLIGENCE <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              </h3>
              <p className="text-[8px] font-mono text-zinc-600 mt-1 uppercase">Node: TAMV-CENTRAL-01</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                markAllAsRead();
                setInternalRefresh(prev => prev + 1);
              }}
              className="h-7 text-[9px] font-orbitron text-zinc-500 hover:text-primary hover:bg-primary/5 rounded-lg"
            >
              LIMPIAR SEÑALES
            </Button>
          </div>

          {/* SELECTOR DE FRECUENCIA (FILTROS) */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {['all', 'isabella', 'economic', 'security'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3 py-1 rounded-md text-[8px] font-orbitron transition-all border uppercase",
                  activeFilter === f 
                    ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" 
                    : "bg-white/5 text-zinc-500 border-transparent hover:border-white/10"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ÁREA DE SCROLL DE SEÑALES */}
        <ScrollArea className="h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredSignals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] opacity-20">
                <Radio className="h-10 w-10 mb-2" />
                <span className="font-orbitron text-[9px] tracking-widest">SIN ACTIVIDAD EN EL NEXO</span>
              </div>
            ) : (
              filteredSignals.map((sig: any, idx: number) => {
                const identity = getSignalIdentity(sig.type);
                const Icon = identity.icon;
                
                return (
                  <motion.div
                    key={sig.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <DropdownMenuItem
                      className={cn(
                        "p-4 cursor-pointer flex items-start gap-4 border-b border-white/[0.03] focus:bg-white/[0.04] transition-all",
                        !sig.isRead && "bg-primary/[0.01]"
                      )}
                      onClick={() => {
                        if (!sig.isRead) markAsRead(sig.id);
                        if (sig.actionUrl) window.location.href = sig.actionUrl;
                      }}
                    >
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5", !sig.isRead ? "bg-primary/10" : "bg-zinc-900")}>
                        <Icon size={18} className={identity.color} />
                      </div>

                      <div className="flex-1 space-y-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black font-mono text-zinc-500 uppercase tracking-tighter">
                            {identity.label}
                          </span>
                          <span className="text-[8px] text-zinc-700 font-mono">
                            {formatDistanceToNow(new Date(sig.createdAt || Date.now()), { addSuffix: true, locale: es })}
                          </span>
                        </div>
                        <h4 className={cn("text-xs font-bold leading-tight truncate", !sig.isRead ? "text-white" : "text-zinc-400")}>
                          {sig.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed font-light">
                          {sig.message}
                        </p>
                        
                        {/* FOOTER DE SEÑAL (MÉTRICAS) */}
                        {!sig.isRead && (
                          <div className="flex items-center gap-2 pt-1">
                            <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                            <span className="text-[7px] font-mono text-primary/70 tracking-widest uppercase">High_Priority_Signal</span>
                          </div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* FOOTER DE SISTEMA */}
        <div className="p-4 bg-zinc-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint size={12} className="text-zinc-600" />
            <span className="text-[8px] font-mono text-zinc-600 uppercase">BookPI Immutable Log Enabled</span>
          </div>
          <Settings2 size={12} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
