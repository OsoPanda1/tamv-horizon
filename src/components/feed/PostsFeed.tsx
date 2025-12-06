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
  MoreHorizontal, Play, Volume2 
} from "lucide-react";
import VirtualGifts from "@/components/gifts/VirtualGifts";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  content: string;
  media_urls: string[];
  media_types: string[];
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

interface PostsFeedProps {
  refreshTrigger?: number;
}

export default function PostsFeed({ refreshTrigger }: PostsFeedProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    try {
      const limit = 10;
      const from = pageNum * limit;
      
      // Fetch posts from database
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .range(from, from + limit - 1);

      if (postsError) {
        console.error("Error fetching posts:", postsError);
        throw postsError;
      }

      if (!postsData || postsData.length === 0) {
        if (!append) setPosts([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(postsData.map(p => p.user_id))];

      // Fetch profiles for all post authors
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url, level")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      // Check which posts the current user has liked
      let likedPostIds: Set<string> = new Set();
      let savedPostIds: Set<string> = new Set();

      if (user) {
        const postIds = postsData.map(p => p.id);
        
        const [likesResult, savesResult] = await Promise.all([
          supabase
            .from("post_likes")
            .select("post_id")
            .eq("user_id", user.id)
            .in("post_id", postIds),
          supabase
            .from("post_saves")
            .select("post_id")
            .eq("user_id", user.id)
            .in("post_id", postIds)
        ]);

        likedPostIds = new Set(likesResult.data?.map(l => l.post_id) || []);
        savedPostIds = new Set(savesResult.data?.map(s => s.post_id) || []);
      }

      // Transform posts with author info
      const transformedPosts: Post[] = postsData.map(post => {
        const profile = profileMap.get(post.user_id);
        return {
          id: post.id,
          content: post.content || "",
          media_urls: post.media_urls || [],
          media_types: post.media_types || [],
          user_id: post.user_id,
          likes_count: post.likes_count || 0,
          comments_count: post.comments_count || 0,
          shares_count: post.shares_count || 0,
          created_at: post.created_at,
          author: {
            username: profile?.username || "usuario",
            display_name: profile?.display_name || "Usuario TAMV",
            avatar_url: profile?.avatar_url || "",
            level: profile?.level || 1
          },
          is_liked: likedPostIds.has(post.id),
          is_saved: savedPostIds.has(post.id)
        };
      });

      if (append) {
        setPosts(prev => [...prev, ...transformedPosts]);
      } else {
        setPosts(transformedPosts);
      }
      
      setHasMore(postsData.length === limit);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error al cargar publicaciones");
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  // Refetch when trigger changes
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      setPage(0);
      fetchPosts(0);
    }
  }, [refreshTrigger, fetchPosts]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('posts-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        () => {
          // Refetch to get the new post with author info
          fetchPosts(0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error("Inicia sesión para dar me gusta");
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.is_liked;

    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          is_liked: !isLiked,
          likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1
        };
      }
      return p;
    }));

    try {
      if (isLiked) {
        // Remove like
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);
      } else {
        // Add like
        await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: user.id });
      }

      // Update post counter
      await supabase.rpc("increment_post_counter", {
        _post_id: postId,
        _counter_name: "likes_count",
        _increment: isLiked ? -1 : 1
      });
    } catch (error) {
      // Revert on error
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, is_liked: isLiked, likes_count: post.likes_count };
        }
        return p;
      }));
      console.error("Error toggling like:", error);
    }
  };

  const handleSave = async (postId: string) => {
    if (!user) {
      toast.error("Inicia sesión para guardar");
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isSaved = post.is_saved;

    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, is_saved: !isSaved };
      }
      return p;
    }));

    try {
      if (isSaved) {
        await supabase
          .from("post_saves")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);
        toast.success("Publicación removida de guardados");
      } else {
        await supabase
          .from("post_saves")
          .insert({ post_id: postId, user_id: user.id });
        toast.success("Publicación guardada");
      }
    } catch (error) {
      // Revert on error
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, is_saved: isSaved };
        }
        return p;
      }));
      console.error("Error toggling save:", error);
    }
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
      fetchPosts(nextPage, true);
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

  if (posts.length === 0) {
    return (
      <Card className="card-tamv p-8 text-center">
        <p className="text-muted-foreground mb-4">
          Aún no hay publicaciones. ¡Sé el primero en compartir!
        </p>
        <p className="text-sm text-primary">
          Comienza a crear contenido y conecta con la comunidad TAMV 🌟
        </p>
      </Card>
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
              <div className={cn(
                "mt-3 rounded-xl overflow-hidden border border-border",
                post.media_urls.length > 1 && "grid grid-cols-2 gap-1"
              )}>
                {post.media_urls.map((url, idx) => {
                  const type = post.media_types?.[idx] || "image";
                  
                  if (type === "image") {
                    return (
                      <img 
                        key={idx}
                        src={url} 
                        alt="Post media"
                        className="w-full max-h-96 object-cover"
                      />
                    );
                  }
                  
                  if (type === "video") {
                    return (
                      <div key={idx} className="relative aspect-video bg-black">
                        <video 
                          src={url}
                          className="w-full h-full"
                          controls
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center">
                            <Play className="h-8 w-8 text-primary-foreground ml-1" />
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  if (type === "audio") {
                    return (
                      <div key={idx} className="p-4 bg-muted/50 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Volume2 className="h-6 w-6 text-primary" />
                        </div>
                        <audio src={url} controls className="flex-1" />
                      </div>
                    );
                  }
                  
                  return null;
                })}
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