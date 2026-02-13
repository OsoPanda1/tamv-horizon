/**
 * 📡 TAMV SIGNAL INTELLIGENCE CENTER - VERSIÓN MAESTRA DIAMANTE
 * Arquitectura: 7 Federaciones / Protocolo Isabella / Ledger de Señales
 * Ubicación: @/components/notifications/NotificationCenter.tsx
 */

import { useState, useEffect, useMemo } from "react";
import { 
  Bell, ShieldCheck, Zap, Globe, Heart, 
  Coins, Award, AlertOctagon, Fingerprint, 
  Sparkles, Check, Trash2, Settings2, Eye,
  Info, Scale, Radio
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- TIPOS EXTENDIDOS PARA LA CIVILIZACIÓN TAMV ---

type Federation = 'ALFA' | 'BETA' | 'GAMMA' | 'DELTA' | 'EPSILON' | 'ZETA' | 'OMEGA';

interface SignalNotification {
  id: string;
  title: string;
  message: string;
  type: "achievement" | "social" | "economic" | "security" | "governance" | "isabella" | "system";
  federation?: Federation;
  isRead: boolean;
  createdAt: string | Date;
  actionUrl?: string;
  evidenceHash?: string; // Trazabilidad BookPI
  priority: 1 | 2 | 3; // 1: Crítico, 2: Importante, 3: Informativo
  metadata?: Record<string, any>;
}

export default function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<string | "all">("all");

  // --- LÓGICA DE FILTRADO CIVILIZATORIO ---
  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((n: any) => n.type === filter);
  }, [notifications, filter]);

  // --- MAPEO DE ICONOS Y COLORES POR FEDERACIÓN ---
  const getSignalMeta = (notification: SignalNotification) => {
    const types = {
      achievement: { icon: <Award className="text-amber-400" />, bg: "bg-amber-400/10" },
      social: { icon: <Heart className="text-rose-400" />, bg: "bg-rose-400/10" },
      economic: { icon: <Coins className="text-emerald-400" />, bg: "bg-emerald-400/10" },
      security: { icon: <ShieldCheck className="text-blue-400" />, bg: "bg-blue-400/10" },
      governance: { icon: <Scale className="text-purple-400" />, bg: "bg-purple-400/10" },
      isabella: { icon: <Sparkles className="text-primary" />, bg: "bg-primary/10" },
      system: { icon: <Radio className="text-zinc-400" />, bg: "bg-zinc-400/10" },
    };

    return types[notification.type as keyof typeof types] || types.system;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative group transition-all duration-500 hover:bg-primary/5 rounded-2xl"
        >
          <div className="absolute inset-0 rounded-2xl bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500 blur-xl" />
          <Bell className={cn(
            "h-5 w-5 transition-transform duration-300 group-hover:rotate-12",
            unreadCount > 0 ? "text-primary animate-pulse" : "text-zinc-400"
          )} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <Badge 
                className="relative h-5 w-5 p-0 flex items-center justify-center bg-primary text-black text-[10px] font-bold border-none"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-[420px] bg-zinc-950/95 border-white/5 backdrop-blur-2xl rounded-[2rem] p-0 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
      >
        {/* HEADER DE SEÑALES */}
        <div className="p-6 bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-orbitron text-sm tracking-widest text-white flex items-center gap-2">
                SIGNAL INTELLIGENCE <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase">
                Protocolo de Memoria: Active_Sync
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-zinc-500 hover:text-white">
                <Settings2 size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-xl text-zinc-500 hover:text-primary"
                onClick={() => {
                  markAllAsRead();
                  toast.success("Nexo sincronizado: Todas las señales leídas");
                }}
              >
                <Check size={16} />
              </Button>
            </div>
          </div>

          {/* FILTROS DE CATEGORÍA TAMV */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['all', 'isabella', 'economic', 'security', 'governance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-orbitron transition-all border",
                  filter === cat 
                    ? "bg-primary text-black border-primary" 
                    : "bg-white/5 text-zinc-500 border-white/5 hover:border-white/10"
                )}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* LISTADO DE SEÑALES */}
        <ScrollArea className="h-[450px]">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full p-12 text-center"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                  <Radio className="h-12 w-12 text-zinc-800 relative z-10" />
                </div>
                <p className="text-zinc-500 font-orbitron text-[10px] tracking-widest uppercase">
                  Frecuencia Limpia: Sin Señales Entrantes
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification: any, idx: number) => {
                const meta = getSignalMeta(notification);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <DropdownMenuItem
                      className={cn(
                        "p-5 cursor-pointer border-b border-white/[0.02] flex flex-col items-start gap-3 focus:bg-white/[0.03] transition-colors",
                        !notification.isRead && "bg-primary/[0.02]"
                      )}
                      onClick={() => {
                        if (!notification.isRead) markAsRead(notification.id);
                        if (notification.actionUrl) window.location.href = notification.actionUrl;
                      }}
                    >
                      <div className="flex gap-4 w-full">
                        {/* ICONO CON EFECTO DE FEDERACIÓN */}
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/5 shadow-inner", meta.bg)}>
                          {meta.icon}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-primary tracking-tighter uppercase font-mono">
                              {notification.type} // {notification.federation || 'GLOBAL'}
                            </span>
                            <span className="text-[9px] text-zinc-600 font-mono">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
                            </span>
                          </div>
                          
                          <h4 className="font-semibold text-sm text-zinc-100 leading-tight">
                            {notification.title}
                          </h4>
                          
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>

                          {/* FOOTER DE LA SEÑAL (INFO TÉCNICA) */}
                          <div className="flex items-center gap-4 pt-2">
                            {notification.evidenceHash && (
                              <div className="flex items-center gap-1 text-[8px] text-zinc-600 font-mono bg-white/5 px-2 py-0.5 rounded">
                                <Fingerprint size={10} />
                                {notification.evidenceHash.substring(0, 12)}
                              </div>
                            )}
                            {notification.priority === 1 && (
                              <div className="flex items-center gap-1 text-[8px] text-red-500 font-bold uppercase animate-pulse">
                                <AlertOctagon size={10} /> CRITICAL_SIGNAL
                              </div>
                            )}
                          </div>
                        </div>

                        {/* INDICADOR DE LECTURA */}
                        {!notification.isRead && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)] flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* ACCIONES GLOBALES */}
        <div className="p-4 bg-zinc-900/50 flex items-center justify-between border-t border-white/5">
          <Button variant="ghost" className="text-[10px] font-orbitron text-zinc-500 hover:text-white gap-2">
            <Eye size={14} /> VER ARCHIVO COMPLETO
          </Button>
          <div className="flex items-center gap-1 opacity-30 text-[8px] font-mono text-white italic">
            <ShieldCheck size={10} /> TAMV_ENCRYPT_ON
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
