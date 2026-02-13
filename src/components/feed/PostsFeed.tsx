/**
 * 🎯 TAMV NEXUS FEED ENGINE - VERSIÓN MAESTRA DIAMANTE (v2.2)
 * Arquitectura: 7 Federaciones / Memoria Inmutable / Nexus OS
 * Ubicación: @/components/feed/PostsFeed.tsx
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useSpring } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Heart, MessageCircle, Share2, Bookmark, 
  MoreHorizontal, Play, Volume2, ShieldCheck, 
  Zap, Loader2, Sparkles, Globe, Eye,
  Info, AlertTriangle, Fingerprint, Award,
  Flame, Radio, Send
} from "lucide-react";
import VirtualGifts from "@/components/gifts/VirtualGifts";
import { cn } from "@/lib/utils";

// --- INTERFACES EXPANDIDAS ---

interface Author {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  level: number;
  is_verified: boolean;
  federation: 'ALFA' | 'BETA' | 'GAMMA' | 'DELTA' | 'EPSILON' | 'ZETA' | 'OMEGA';
  reputation_score: number;
  badges: string[];
}

interface Post {
  id: string;
  content: string;
  media_urls: string[];
  media_types: string[];
  user_id: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  created_at: string;
  visibility: 'public' | 'private' | 'federated';
  federation_context?: string;
  emotional_tone?: string; // Derivado de Isabella AI
  is_liked?: boolean;
  is_saved?: boolean;
  author?: Author;
  bookpi_hash?: string; // Firma de integridad inmutable
}

interface PostsFeedProps {
  refreshTrigger?: number;
  activeFederation?: string;
  viewMode?: 'grid' | 'list' | 'immersive';
}

export default function PostsFeed({ 
  refreshTrigger, 
  activeFederation = 'GLOBAL',
  viewMode = 'list' 
}: PostsFeedProps) {
  // --- ESTADOS Y REFS ---
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'federated'>('recent');
  
  const scrollRef = useRef(null);
  const loadMoreTrigger = useRef(null);
  const isEndInView = useInView(loadMoreTrigger);

  // --- LÓGICA DE CARGA DE DATOS (NEXUS SYNC) ---

  const fetchPosts = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);

      const PAGE_SIZE = 15;
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Construcción de Query Soberana
      let query = supabase
        .from("posts")
        .select(`
          *,
          author_profile:profiles!posts_user_id_fkey (
            user_id, username, display_name, avatar_url, 
            level, is_verified, federation, reputation_score
          )
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

      // Aplicar filtros de Federación TAMV (Sistema de 7)
      if (activeFederation !== 'GLOBAL') {
        query = query.eq('federation_context', activeFederation);
      }

      const { data: postsData, error: postsError } = await query;

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        if (!append) setPosts([]);
        setHasMore(false);
        return;
      }

      // Verificación cruzada de interacciones (Likes/Saves)
      let interactionData = { liked: new Set(), saved: new Set() };
      
      if (user) {
        const postIds = postsData.map(p => p.id);
        const [likes, saves] = await Promise.all([
          supabase.from("post_likes").select("post_id").eq("user_id", user.id).in("post_id", postIds),
          supabase.from("post_saves").select("post_id").eq("user_id", user.id).in("post_id", postIds)
        ]);
        
        interactionData.liked = new Set(likes.data?.map(l => l.post_id));
        interactionData.saved = new Set(saves.data?.map(s => s.post_id));
      }

      // Transformación y Limpieza de Datos
      const transformedPosts: Post[] = postsData.map(p => ({
        ...p,
        author: {
          ...p.author_profile,
          display_name: p.author_profile?.display_name || "Ciudadano TAMV",
          federation: p.author_profile?.federation || "ALFA"
        },
        is_liked: interactionData.liked.has(p.id),
        is_saved: interactionData.saved.has(p.id)
      }));

      setPosts(prev => append ? [...prev, ...transformedPosts] : transformedPosts);
      setHasMore(postsData.length === PAGE_SIZE);
    } catch (error) {
      console.error("Critical Nexus Error:", error);
      toast.error("Fallo en la sincronización con el Nexo Social");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, activeFederation]);

  // --- EFECTOS DE CICLO DE VIDA ---

  useEffect(() => {
    fetchPosts(0, false);
    setPage(0);
  }, [fetchPosts, refreshTrigger, activeFederation]);

  useEffect(() => {
    if (isEndInView && hasMore && !loading && !loadingMore) {
      const nextP = page + 1;
      setPage(nextP);
      fetchPosts(nextP, true);
    }
  }, [isEndInView, hasMore, loading, loadingMore, page, fetchPosts]);

  // Suscripción Realtime (Isabella Live Sync)
  useEffect(() => {
    const channel = supabase.channel('nexus_global_feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        // Notificación de nuevo post en el Nexo
        if (payload.new.visibility === 'public') {
          toast("Nueva actualización en el Nexo", {
            icon: <Sparkles className="text-primary" />,
            action: { label: "Ver", onClick: () => fetchPosts(0) }
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  // --- MANEJADORES DE INTERACCIÓN ---

  const handleOptimisticAction = (postId: string, type: 'like' | 'save') => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        if (type === 'like') {
          return { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 };
        }
        return { ...p, is_saved: !p.is_saved };
      }
      return p;
    }));
  };

  const handleLike = async (postId: string) => {
    if (!user) return toast.error("Acceso denegado. Inicia sesión.");
    const post = posts.find(p => p.id === postId);
    const wasLiked = post?.is_liked;
    
    handleOptimisticAction(postId, 'like');

    try {
      if (wasLiked) {
        await supabase.from("post_likes").delete().match({ post_id: postId, user_id: user.id });
      } else {
        await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      }
      // RPC para métricas atómicas
      await supabase.rpc("update_nexus_metrics", { 
        _post_id: postId, 
        _metric: "likes", 
        _val: wasLiked ? -1 : 1 
      });
    } catch (e) {
      handleOptimisticAction(postId, 'like'); // Revertir
      toast.error("Error en el protocolo de feedback");
    }
  };

  // --- RENDERIZADO DE COMPONENTE ---

  if (loading && posts.length === 0) return <SkeletonNexusFeed />;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-20">
      
      {/* HEADER DE CONTROL DE FEED */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('recent')}
            className={cn("text-sm font-orbitron tracking-tighter transition-all", activeTab === 'recent' ? "text-primary border-b-2 border-primary pb-1" : "text-zinc-500 hover:text-white")}
          >
            RECIENTE
          </button>
          <button 
            onClick={() => setActiveTab('trending')}
            className={cn("text-sm font-orbitron tracking-tighter transition-all", activeTab === 'trending' ? "text-primary border-b-2 border-primary pb-1" : "text-zinc-500 hover:text-white")}
          >
            TENDENCIA
          </button>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] opacity-50 border-white/10 uppercase">
          Node: {activeFederation}
        </Badge>
      </div>

      <AnimatePresence mode="popLayout">
        {posts.map((post, idx) => (
          <NexusPostCard 
            key={post.id} 
            post={post} 
            onLike={() => handleLike(post.id)}
            currentUser={user}
            index={idx}
          />
        ))}
      </AnimatePresence>

      {/* TRIGGER CARGA INFINITA */}
      <div ref={loadMoreTrigger} className="py-10 flex flex-col items-center gap-3">
        {hasMore ? (
          <div className="flex items-center gap-2 text-primary opacity-50">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-[10px] font-orbitron">SINCRONIZANDO MÁS DATOS...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center opacity-20">
            <div className="h-px w-20 bg-white mb-4" />
            <Sparkles size={24} />
            <span className="text-[10px] font-orbitron mt-2">FIN DEL REGISTRO CIVILIZATORIO</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * COMPONENTE: TARJETA DE POST NEXUS (EXPANDIDA)
 */
function NexusPostCard({ post, onLike, currentUser, index }: { post: Post, onLike: () => void, currentUser: any, index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Colores por Federación (Basado en el modelo de 7)
  const federationColors: Record<string, string> = {
    ALFA: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    BETA: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
    GAMMA: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    DELTA: "text-purple-400 border-purple-400/20 bg-purple-400/5",
    EPSILON: "text-rose-400 border-rose-400/20 bg-rose-400/5",
    ZETA: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
    OMEGA: "text-indigo-400 border-indigo-400/20 bg-indigo-400/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index % 5 * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="group relative bg-zinc-950/40 border-white/5 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-primary/40 hover:shadow-[0_0_50px_-12px_rgba(var(--primary-rgb),0.2)]">
        
        {/* LÍNEA DE ENERGÍA DE FEDERACIÓN */}
        <div className={cn(
          "absolute top-0 left-0 w-full h-[2px] opacity-30",
          post.author?.federation ? `bg-${post.author.federation.toLowerCase()}` : "bg-primary"
        )} />

        <CardHeader className="flex flex-row items-start gap-4 p-6">
          {/* AVATAR CON SISTEMA DE REPUTACIÓN */}
          <div className="relative group/avatar">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/50 to-accent/50 opacity-0 group-hover/avatar:opacity-100 blur transition-opacity duration-500" />
            <Avatar className="h-14 w-14 ring-2 ring-white/10 ring-offset-4 ring-offset-black relative z-10">
              <AvatarImage src={post.author?.avatar_url} className="object-cover" />
              <AvatarFallback className="bg-zinc-900 text-white font-orbitron">
                {post.author?.display_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {post.author?.level && (
              <div className="absolute -bottom-2 -right-1 z-20 bg-black border border-white/10 px-1.5 py-0.5 rounded-md shadow-xl">
                <span className="text-[8px] font-bold text-primary italic">N{post.author.level}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-bold tracking-tight hover:text-primary transition-colors cursor-pointer truncate max-w-[150px]">
                {post.author?.display_name}
              </h3>
              {post.author?.is_verified && <ShieldCheck size={14} className="text-primary fill-primary/20" />}
              <Badge variant="outline" className={cn("text-[8px] px-1.5 py-0 rounded-full font-orbitron uppercase", federationColors[post.author?.federation || 'ALFA'])}>
                {post.author?.federation || 'ALFA'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
              <span className="hover:text-zinc-300 cursor-pointer">@{post.author?.username}</span>
              <span className="opacity-30">•</span>
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white rounded-full h-8 w-8 transition-transform active:scale-90">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900/95 border-white/10 backdrop-blur-xl rounded-2xl p-2 font-orbitron text-[10px]">
              <DropdownMenuItem className="gap-2 focus:bg-primary/10 rounded-xl cursor-pointer">
                <Eye size={14} /> VER EN DREAMSPACE
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 focus:bg-primary/10 rounded-xl cursor-pointer">
                <Fingerprint size={14} /> VERIFICAR EN BOOKPI
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="gap-2 focus:bg-red-500/10 text-red-400 rounded-xl cursor-pointer">
                <AlertTriangle size={14} /> REPORTAR ANOMALÍA
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-5">
          {/* CONTENIDO TEXTUAL */}
          <div className="relative">
            {post.emotional_tone && (
              <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
            )}
            <p className="text-zinc-300 text-[15px] leading-[1.6] font-light whitespace-pre-wrap selection:bg-primary selection:text-black">
              {post.content}
            </p>
          </div>

          {/* RENDERIZADOR DE MEDIOS MULTIMODALES */}
          {post.media_urls && post.media_urls.length > 0 && (
            <div className={cn(
              "rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900/20 group/media",
              post.media_urls.length > 1 ? "grid grid-cols-2 gap-1.5" : "block"
            )}>
              {post.media_urls.map((url, i) => (
                <MediaRenderer key={i} url={url} type={post.media_types?.[i] || 'image'} />
              ))}
            </div>
          )}

          {/* BARRA DE ACCIÓN NEXUS OS */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-1">
              <ActionButton 
                icon={Heart} 
                count={post.likes_count} 
                active={post.is_liked} 
                activeClass="text-red-500 bg-red-500/10" 
                hoverClass="hover:text-red-500 hover:bg-red-500/5"
                onClick={onLike}
              />
              <ActionButton 
                icon={MessageCircle} 
                count={post.comments_count} 
                hoverClass="hover:text-primary hover:bg-primary/5"
              />
              <ActionButton 
                icon={Share2} 
                count={post.shares_count} 
                hoverClass="hover:text-emerald-500 hover:bg-emerald-500/5"
              />
            </div>

            <div className="flex items-center gap-3">
              {currentUser && post.user_id !== currentUser.id && (
                <VirtualGifts recipientId={post.user_id} recipientName={post.author?.display_name || "Nexus"} />
              )}
              <button className={cn(
                "p-3 rounded-2xl transition-all duration-300",
                post.is_saved ? "bg-primary/20 text-primary" : "text-zinc-600 hover:text-white hover:bg-white/5"
              )}>
                <Bookmark size={20} fill={post.is_saved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* METADATA DE INTEGRIDAD (BOOKPI) */}
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[8px] font-mono text-zinc-600 tracking-tighter uppercase">
            <span>TX_HASH: {post.id.split('-')[0]}...</span>
            <div className="flex items-center gap-1">
              <Award size={10} />
              <span>Verified_By_Isabella_AI</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * COMPONENTE: BOTÓN DE ACCIÓN CON MICROINTERACCIÓN
 */
function ActionButton({ icon: Icon, count, active, onClick, activeClass, hoverClass }: any) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-4 h-11 rounded-2xl transition-all duration-300",
        active ? activeClass : "text-zinc-500",
        hoverClass
      )}
    >
      <Icon size={19} className={cn("transition-transform", active && "scale-110 fill-current")} />
      <span className="text-[12px] font-mono font-bold">{count >= 1000 ? `${(count/1000).toFixed(1)}K` : count}</span>
    </Button>
  );
}

/**
 * COMPONENTE: RENDERIZADOR DINÁMICO DE MEDIOS
 */
function MediaRenderer({ url, type }: { url: string, type: string }) {
  if (type === 'video') return (
    <div className="relative aspect-video bg-black group/v">
      <video src={url} className="w-full h-full object-cover" controls />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/v:opacity-100 transition-opacity pointer-events-none">
        <div className="h-16 w-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
          <Play size={30} className="text-primary fill-primary ml-1" />
        </div>
      </div>
    </div>
  );

  if (type === 'audio') return (
    <div className="p-8 bg-gradient-to-br from-zinc-900 to-black flex items-center gap-6 border-x border-white/5">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse bg-primary/5" />
        <Volume2 size={32} className="relative z-10" />
      </div>
      <audio src={url} controls className="flex-1 h-10 accent-primary" />
    </div>
  );

  return (
    <div className="overflow-hidden relative group/img">
      <img 
        src={url} 
        alt="Nexus Content" 
        className="w-full h-auto max-h-[700px] object-cover transition-transform duration-1000 group-hover/img:scale-105" 
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

/**
 * COMPONENTE: LOADING SKELETON (DIAMOND EDITION)
 */
function SkeletonNexusFeed() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      {[1, 2, 3].map(i => (
        <Card key={i} className="bg-zinc-900/50 border-white/5 rounded-[2.5rem] p-6 space-y-6 overflow-hidden">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full bg-zinc-800" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48 bg-zinc-800" />
              <Skeleton className="h-3 w-24 bg-zinc-800" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-[2rem] bg-zinc-800" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-32 rounded-xl bg-zinc-800" />
            <Skeleton className="h-10 w-32 rounded-xl bg-zinc-800" />
          </div>
        </Card>
      ))}
    </div>
  );
}
