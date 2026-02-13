/**
 * 📱 TAMV SOCIAL NEXUS - MAIN FEED ENGINE (v3.0 MASTER)
 * Fix: Eliminación definitiva de refreshTrigger externo.
 * Sistema: 7 Federaciones / Memoria Inmutable / Isabella Sync.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, Sparkles, Fingerprint, ShieldCheck, 
  TrendingUp, Zap, Globe, Plus, Search, 
  MessageSquare, Heart, Share2, MoreHorizontal
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// --- MOTOR DE DATOS INTERNO (AUTÓNOMO) ---

export default function MainFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState("TODOS");

  // Reemplazo de refreshTrigger por un motor de sincronización local
  const executeNexusSync = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setSyncing(true);
    
    try {
      // Simulación de latencia de red en el Nexo TAMV
      await new Promise(r => setTimeout(r, 1200));
      
      // Mock de datos con la arquitectura de 7 Federaciones
      const nexusData = [
        {
          id: "tx-77821",
          author: { name: "Anubis Villaseñor", federation: "ALFA", isVerified: true, avatar: "" },
          content: "Protocolo de Soberanía Digital activado. La Federación Alfa reporta integridad total en el Ledger de hoy.",
          impact: 9.8,
          hash: "0x882...f92",
          timestamp: new Date().toISOString()
        },
        {
          id: "tx-77822",
          author: { name: "Isabella AI", federation: "OMEGA", isVerified: true, avatar: "" },
          content: "Analizando patrones de flujo MSR. La equidad algorítmica ha subido un 12% en el nodo Delta.",
          impact: 10,
          hash: "0x441...e31",
          timestamp: new Date(Date.now() - 5000000).toISOString()
        }
      ];

      setPosts(nexusData);
      if (!isSilent) toast.success("Nexo Sincronizado");
    } catch (e) {
      toast.error("Fallo en la señal del Nexo");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  // Efecto de vida: Se ejecuta al montar, ignorando triggers externos rotos
  useEffect(() => {
    executeNexusSync();
  }, [executeNexusSync]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pt-4 pb-24">
      
      {/* BARRA DE ESTADO DEL NEXO */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className={cn("h-2 w-2 rounded-full animate-pulse", syncing ? "bg-primary" : "bg-emerald-500")} />
          <span className="text-[10px] font-orbitron tracking-widest text-zinc-400 uppercase">
            {syncing ? "Sincronizando Frecuencias..." : "Nexo Estable"}
          </span>
        </div>
        <div className="flex gap-2">
          {["TODOS", "FEDERADOS", "MSR"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-[9px] font-bold px-3 py-1 rounded-lg transition-all",
                activeTab === tab ? "bg-primary text-black" : "text-zinc-500 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* COMPOSER DE SEÑALES */}
      <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-2xl rounded-[2rem] overflow-hidden border-t-primary/20">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12 border border-white/10 shadow-2xl">
              <AvatarFallback className="bg-zinc-900 text-primary font-orbitron">ID</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-zinc-300 placeholder:text-zinc-600 resize-none h-16 pt-2"
                placeholder="Transmite una señal al Nexo..."
              />
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <div className="flex gap-2 text-zinc-500">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Globe size={16} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Fingerprint size={16} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Zap size={16} /></Button>
                </div>
                <Button className="rounded-full bg-primary text-black font-black text-[10px] px-6 h-9 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
                  TRANSMITIR SEÑAL
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RENDERIZADO DE POSTS */}
      <AnimatePresence mode="popLayout">
        {loading ? (
          <SkeletonNexus />
        ) : (
          posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-zinc-950/40 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group hover:border-primary/20 transition-all duration-700">
                <CardContent className="p-7">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 border border-white/10 group-hover:border-primary/40 transition-all">
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-primary text-black rounded-full p-0.5 border-2 border-black">
                          <ShieldCheck size={10} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white tracking-tight">{post.author.name}</h4>
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-orbitron">
                            {post.author.federation}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true, locale: es })}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white rounded-full"><MoreHorizontal size={20} /></Button>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed font-light mb-6 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex gap-6">
                      <button className="flex items-center gap-2 text-zinc-500 hover:text-rose-500 transition-colors">
                        <Heart size={18} />
                        <span className="text-[10px] font-mono font-bold">4.2K</span>
                      </button>
                      <button className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors">
                        <MessageSquare size={18} />
                        <span className="text-[10px] font-mono font-bold">128</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-[8px] text-zinc-600 font-mono leading-none">BOOKPI_HASH</p>
                        <p className="text-[9px] text-zinc-400 font-mono tracking-tighter">{post.hash}</p>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-500 hover:text-primary transition-all">
                        <Share2 size={16} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </AnimatePresence>

      {/* BOTÓN DE SINCRONIZACIÓN MANUAL FLOTANTE */}
      <button 
        onClick={() => executeNexusSync()}
        className={cn(
          "fixed bottom-8 right-8 h-14 w-14 rounded-[1.5rem] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10 transition-all z-50 overflow-hidden group",
          syncing ? "bg-primary animate-spin" : "bg-zinc-900 hover:bg-zinc-800"
        )}
      >
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <RefreshCw size={24} className={syncing ? "text-black" : "text-primary"} />
      </button>
    </div>
  );
}

// --- UTILIDADES ---
function cn(...classes: any[]) { return classes.filter(Boolean).join(' '); }

function SkeletonNexus() {
  return (
    <div className="space-y-6">
      {[1, 2].map(i => (
        <Card key={i} className="bg-zinc-900/40 border-white/5 rounded-[2.5rem] p-8">
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-12 w-12 rounded-full bg-zinc-800" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-zinc-800" />
              <Skeleton className="h-3 w-20 bg-zinc-800" />
            </div>
          </div>
          <Skeleton className="h-20 w-full bg-zinc-800 rounded-xl mb-6" />
          <div className="flex justify-between">
            <Skeleton className="h-8 w-24 bg-zinc-800" />
            <Skeleton className="h-8 w-24 bg-zinc-800" />
          </div>
        </Card>
      ))}
    </div>
  );
}
