import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Heart, MessageCircle, Share2, Bookmark, 
  MoreHorizontal, Play, Image, Volume2 
} from "lucide-react";
import VirtualGifts from "@/components/gifts/VirtualGifts";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  content: string;
  media_urls: string[];
  media_type: "image" | "video" | "audio" | null;
  user_id: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  author?: {
    username: string;
    display_name: string;
    avatar_url: string;
    level: number;
  };
  is_liked?: boolean;
  is_saved?: boolean;
}

export default function PostsFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNum: number = 0) => {
    try {
      const limit = 10;
      const from = pageNum * limit;
      
      // Simulated posts for now (will be replaced with real data when posts table exists)
      const mockPosts: Post[] = [
        {
          id: "1",
          content: "¡Acabo de crear mi primer DreamSpace! 🌟 Es un espacio inspirado en los templos aztecas con elementos de realidad virtual. ¡Vengan a explorarlo!",
          media_urls: [],
          media_type: null,
          user_id: "mock-user-1",
          likes_count: 42,
          comments_count: 7,
          shares_count: 3,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          author: {
            username: "creador_cosmico",
            display_name: "Luna Xochitl",
            avatar_url: "",
            level: 12
          },
          is_liked: false,
          is_saved: false
        },
        {
          id: "2",
          content: "Mi mascota digital acaba de subir al nivel 10 🐉✨ Los Quantum Pets son increíbles, tienen personalidad propia.",
          media_urls: [],
          media_type: null,
          user_id: "mock-user-2",
          likes_count: 89,
          comments_count: 15,
          shares_count: 8,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          author: {
            username: "dragon_master",
            display_name: "Carlos Tonatiuh",
            avatar_url: "",
            level: 25
          },
          is_liked: true,
          is_saved: false
        },
        {
          id: "3",
          content: "La subasta de arte digital termina en 2 horas. ¡Quedan piezas increíbles de artistas mexicanos! 🎨 #ArteTAMV #NFT",
          media_urls: [],
          media_type: null,
          user_id: "mock-user-3",
          likes_count: 156,
          comments_count: 23,
          shares_count: 45,
          created_at: new Date(Date.now() - 10800000).toISOString(),
          author: {
            username: "arte_digital_mx",
            display_name: "Galería Quetzal",
            avatar_url: "",
            level: 30
          },
          is_liked: false,
          is_saved: true
        }
      ];

      if (pageNum === 0) {
        setPosts(mockPosts);
      } else {
        setPosts(prev => [...prev, ...mockPosts.map(p => ({...p, id: p.id + '-' + pageNum}))]);
      }
      
      setHasMore(pageNum < 3);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error al cargar publicaciones");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error("Inicia sesión para dar me gusta");
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          is_liked: !p.is_liked,
          likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1
        };
      }
      return p;
    }));
  };

  const handleSave = async (postId: string) => {
    if (!user) {
      toast.error("Inicia sesión para guardar");
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, is_saved: !p.is_saved };
      }
      return p;
    }));
    
    toast.success("Publicación guardada");
  };

  const handleShare = async (postId: string) => {
    try {
      await navigator.share({
        title: "TAMV Post",
        url: `${window.location.origin}/post/${postId}`
      });
    } catch {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
      toast.success("Enlace copiado");
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="card-tamv">
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <Card key={post.id} className="card-tamv overflow-hidden">
          {/* Post Header */}
          <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                <AvatarImage src={post.author?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  {post.author?.display_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold hover:underline cursor-pointer">
                    {post.author?.display_name}
                  </span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    Nv. {post.author?.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>@{post.author?.username}</span>
                  <span>·</span>
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), { 
                      addSuffix: true,
                      locale: es 
                    })}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Post Content */}
          <CardContent className="px-4 pb-2">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>

            {/* Media Preview */}
            {post.media_urls && post.media_urls.length > 0 && (
              <div className="mt-3 rounded-xl overflow-hidden border border-border">
                {post.media_type === "image" && (
                  <img 
                    src={post.media_urls[0]} 
                    alt="Post media"
                    className="w-full max-h-96 object-cover"
                  />
                )}
                {post.media_type === "video" && (
                  <div className="relative aspect-video bg-black">
                    <video 
                      src={post.media_urls[0]}
                      className="w-full h-full"
                      controls
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center">
                        <Play className="h-8 w-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                )}
                {post.media_type === "audio" && (
                  <div className="p-4 bg-muted/50 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Volume2 className="h-6 w-6 text-primary" />
                    </div>
                    <audio src={post.media_urls[0]} controls className="flex-1" />
                  </div>
                )}
              </div>
            )}
          </CardContent>

          {/* Post Actions */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-border/50">
            <div className="flex items-center gap-1">
              {/* Like */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleLike(post.id)}
                className={cn(
                  "gap-2 hover:text-red-500 hover:bg-red-500/10",
                  post.is_liked && "text-red-500"
                )}
              >
                <Heart className={cn("h-5 w-5", post.is_liked && "fill-current")} />
                <span className="text-sm">{post.likes_count}</span>
              </Button>

              {/* Comments */}
              <Button variant="ghost" size="sm" className="gap-2 hover:text-primary hover:bg-primary/10">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">{post.comments_count}</span>
              </Button>

              {/* Share */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleShare(post.id)}
                className="gap-2 hover:text-green-500 hover:bg-green-500/10"
              >
                <Share2 className="h-5 w-5" />
                <span className="text-sm">{post.shares_count}</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              {/* Virtual Gift */}
              {user && post.user_id !== user.id && (
                <VirtualGifts 
                  recipientId={post.user_id}
                  recipientName={post.author?.display_name || "Usuario"}
                  contextType="profile"
                />
              )}

              {/* Save */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleSave(post.id)}
                className={cn(
                  "hover:text-primary hover:bg-primary/10",
                  post.is_saved && "text-primary"
                )}
              >
                <Bookmark className={cn("h-5 w-5", post.is_saved && "fill-current")} />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Load More */}
      {hasMore && (
        <div className="text-center py-4">
          <Button 
            variant="outline" 
            onClick={loadMore}
            disabled={loading}
            className="w-full max-w-xs"
          >
            {loading ? "Cargando..." : "Cargar más"}
          </Button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-muted-foreground py-4">
          Has llegado al final del feed ✨
        </p>
      )}
    </div>
  );
}
