/**
 * 📱 TAMV SOCIAL NEXUS - FEED CENTRAL SOBERANO
 * Solución de Error: Eliminación de refreshTrigger huérfano.
 * Integración: BookPI, 7 Federaciones, Isabella AI Feedback.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  ShieldCheck, Share2, MessageSquare, Heart, 
  MoreVertical, Zap, Fingerprint, Globe,
  RefreshCw, TrendingUp, Sparkles, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// --- INTERFACES EXPANDIDAS TAMV ---
interface TAMVPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    federation: string; // Una de las 7 federaciones
    isVerified: boolean;
  };
  content: string;
  mediaUrl?: string;
  type: "text" | "video" | "xr_space" | "msr_transaction";
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    impactScore: number; // Métrica civilizatoria
  };
  evidenceHash: string; // Trazabilidad BookPI
  createdAt: string;
}

export default function MainFeed() {
  // Estados para manejo de datos y UI
  const [posts, setPosts] = useState<TAMVPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nexusStatus, setNexusStatus] = useState("SYNCED");

  // --- LÓGICA DE CARGA SOBERANA (Reemplaza refreshTrigger) ---
  const syncWithNexus = useCallback(async () => {
    setIsRefreshing(true);
    setNexusStatus("SYNCING");
    try {
      // Simulación de fetch a la API TAMV DM-X4
      // En producción: await api.get('/posts/nexus')
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPosts: TAMVPost[] = [
        {
          id: "1",
          author: { 
            name: "Anubis Villaseñor", 
            avatar: "/avatars/anubis.jpg", 
            federation: "ALFA", 
            isVerified: true 
          },
          content: "La soberanía digital no se pide, se construye. El Ledger BookPI está operando al 100% de capacidad en la Federación Alfa. #TAMV #Soberania",
          type: "text",
          metrics: { likes: 1250, comments: 45, shares: 89, impactScore: 9.8 },
          evidenceHash: "0x882a...f92c",
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          author: { 
            name: "Isabella AI", 
            avatar: "/isabella-avatar.png", 
            federation: "OMEGA", 
            isVerified: true 
          },
          content: "He analizado los flujos económicos del Plan 500. La redistribución ética en los nodos de LATAM muestra un crecimiento del 15% esta semana.",
          type: "msr_transaction",
          metrics: { likes: 3400, comments: 120, shares: 500, impactScore: 10 },
          evidenceHash: "0x441b...e31a",
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      setPosts(mockPosts);
      setNexusStatus("SYNCED");
      toast.success("Nexo Social Sincronizado");
    } catch (error) {
      setNexusStatus("ERROR");
      toast.error("Error en la señal del Nexo");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Efecto de inicialización
  useEffect(() => {
    syncWithNexus();
  }, [syncWithNexus]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* COMPOSER SIMPLIFICADO (EXPANDIBLE) */}
      <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl rounded-[1.5rem] overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src="/user-avatar.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-zinc-300 placeholder:text-zinc-600 resize-none h-12"
                placeholder="¿Qué señal deseas transmitir al Nexo?"
              />
              <div className="flex justify-between items-center border-t border-white/5 pt-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-primary">
                    <Globe size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-primary">
                    <Fingerprint size={16} />
                  </Button>
                </div>
                <Button size="sm" className="rounded-full bg-primary text-black font-bold text-[10px] px-4">
                  TRANSMITIR
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FEED DE SEÑALES */}
      <AnimatePresence>
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-zinc-950/40 border-white/5 backdrop-blur-md rounded-[2rem] overflow-hidden group hover:border-primary/10 transition-all duration-500">
              <CardContent className="p-6">
                {/* HEADER DEL POST */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-11 w-11 border border-white/10 group-hover:border-primary/50 transition-colors">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      {post.author.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-black rounded-full p-0.5 border-2 border-black">
                          <ShieldCheck size={10} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-100">{post.author.name}</span>
                        <Badge variant="outline" className="text-[8px] py-0 border-primary/20 text-primary font-mono">
                          {post.author.federation}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-zinc-600">
                    <MoreVertical size={18} />
                  </Button>
                </div>

                {/* CONTENIDO */}
                <p className="text-sm text-zinc-300 leading-relaxed mb-4 font-light">
                  {post.content}
                </p>

                {/* VISUALIZADOR DE IMPACTO CIVILIZATORIO */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-[1px] bg-white/5" />
                  <div className="flex items-center gap-2 text-[9px] font-orbitron text-primary/60 tracking-widest uppercase">
                    <Sparkles size={12} /> Impact Score: {post.metrics.impactScore}
                  </div>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                {/* ACCIONES */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-zinc-500 hover:text-rose-400 transition-colors group/btn">
                      <div className="p-2 rounded-full group-hover/btn:bg-rose-400/10 transition-all">
                        <Heart size={18} />
                      </div>
                      <span className="text-xs font-mono">{post.metrics.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-zinc-500 hover:text-blue-400 transition-colors group/btn">
                      <div className="p-2 rounded-full group-hover/btn:bg-blue-400/10 transition-all">
                        <MessageSquare size={18} />
                      </div>
                      <span className="text-xs font-mono">{post.metrics.comments}</span>
                    </button>
                  </div>

                  {/* TRAZABILIDAD BOOKPI */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full">
                    <Fingerprint size={12} className="text-zinc-600" />
                    <span className="text-[9px] font-mono text-zinc-600">{post.evidenceHash}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* BOTÓN DE SINCRONIZACIÓN FLOTANTE */}
      <button 
        onClick={syncWithNexus}
        className={cn(
          "fixed bottom-24 right-8 h-12 w-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 z-50 border border-primary/20",
          isRefreshing ? "bg-primary animate-spin" : "bg-black hover:bg-primary group"
        )}
      >
        <RefreshCw size={20} className={isRefreshing ? "text-black" : "text-primary group-hover:text-black"} />
      </button>
    </div>
  );
}
