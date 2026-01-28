// TAMV Social Feed - Hooks

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { FeedPost, FeedFilters, FeedComment } from './types';

export function useFeed(filters: FeedFilters = { type: 'all' }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchPosts = useCallback(async (pageNum: number = 0) => {
    setLoading(true);
    try {
      const limit = 20;
      const offset = pageNum * limit;

      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.hashtag) {
        query = query.contains('hashtags', [filters.hashtag]);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const formattedPosts: FeedPost[] = (data || []).map(post => ({
        id: post.id,
        userId: post.user_id,
        content: post.content || '',
        mediaUrls: post.media_urls || [],
        mediaTypes: (post.media_types || []) as ('image' | 'video' | 'audio')[],
        hashtags: post.hashtags || [],
        mentions: post.mentions || [],
        likesCount: post.likes_count || 0,
        commentsCount: post.comments_count || 0,
        sharesCount: post.shares_count || 0,
        savesCount: post.saves_count || 0,
        viewsCount: post.views_count || 0,
        visibility: (post.visibility || 'public') as 'public' | 'followers' | 'private',
        isPinned: post.is_pinned || false,
        isEdited: post.is_edited || false,
        createdAt: post.created_at || new Date().toISOString(),
        updatedAt: post.updated_at || new Date().toISOString()
      }));

      if (pageNum === 0) {
        setPosts(formattedPosts);
      } else {
        setPosts(prev => [...prev, ...formattedPosts]);
      }

      setHasMore(formattedPosts.length === limit);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch
  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('posts_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            fetchPosts(0);
          } else if (payload.eventType === 'DELETE') {
            setPosts(prev => prev.filter(p => p.id !== (payload.old as { id: string }).id));
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as { id: string };
            setPosts(prev => prev.map(p => 
              p.id === updated.id ? { ...p, ...updated } : p
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  }, [loading, hasMore, page, fetchPosts]);

  const refresh = useCallback(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
}

export function usePost(postId: string) {
  const [post, setPost] = useState<FeedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (fetchError) throw fetchError;

        setPost({
          id: data.id,
          userId: data.user_id,
          content: data.content || '',
          mediaUrls: data.media_urls || [],
          mediaTypes: (data.media_types || []) as ('image' | 'video' | 'audio')[],
          hashtags: data.hashtags || [],
          mentions: data.mentions || [],
          likesCount: data.likes_count || 0,
          commentsCount: data.comments_count || 0,
          sharesCount: data.shares_count || 0,
          savesCount: data.saves_count || 0,
          viewsCount: data.views_count || 0,
          visibility: (data.visibility || 'public') as 'public' | 'followers' | 'private',
          isPinned: data.is_pinned || false,
          isEdited: data.is_edited || false,
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString()
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch post'));
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return { post, loading, error };
}

export function usePostComments(postId: string) {
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const { data, error } = await supabase
          .from('post_comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setComments((data || []).map(c => ({
          id: c.id,
          postId: c.post_id,
          userId: c.user_id,
          parentCommentId: c.parent_comment_id || undefined,
          content: c.content,
          likesCount: c.likes_count || 0,
          createdAt: c.created_at || new Date().toISOString()
        })));
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return { comments, loading };
}

export function usePostActions() {
  const { user } = useAuth();

  const likePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;
      return true;
    } catch {
      return false;
    }
  }, [user]);

  const unlikePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch {
      return false;
    }
  }, [user]);

  const savePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('post_saves')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;
      return true;
    } catch {
      return false;
    }
  }, [user]);

  const addComment = useCallback(async (postId: string, content: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({ post_id: postId, user_id: user.id, content });

      if (error) throw error;
      return true;
    } catch {
      return false;
    }
  }, [user]);

  return {
    likePost,
    unlikePost,
    savePost,
    addComment
  };
}
