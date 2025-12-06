-- ================================================
-- TABLA POSTS: Publicaciones de usuarios con multimedia
-- ================================================
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT,
  media_urls TEXT[] DEFAULT '{}',
  media_types TEXT[] DEFAULT '{}',
  hashtags TEXT[] DEFAULT '{}',
  mentions UUID[] DEFAULT '{}',
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  reply_to_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  repost_of_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  location_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Posts públicos son visibles para todos"
ON public.posts FOR SELECT
USING (visibility = 'public' OR auth.uid() = user_id);

CREATE POLICY "Usuarios autenticados pueden crear posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar sus propios posts"
ON public.posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios posts"
ON public.posts FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- TABLA POST_LIKES: Likes de posts
-- ================================================
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes visibles para todos"
ON public.post_likes FOR SELECT
USING (true);

CREATE POLICY "Usuarios pueden dar like"
ON public.post_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden quitar su like"
ON public.post_likes FOR DELETE
USING (auth.uid() = user_id);

-- ================================================
-- TABLA POST_COMMENTS: Comentarios en posts
-- ================================================
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  parent_comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comentarios visibles para todos"
ON public.post_comments FOR SELECT
USING (true);

CREATE POLICY "Usuarios pueden comentar"
ON public.post_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar sus comentarios"
ON public.post_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus comentarios"
ON public.post_comments FOR DELETE
USING (auth.uid() = user_id);

-- ================================================
-- TABLA POST_SAVES: Posts guardados
-- ================================================
CREATE TABLE public.post_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus guardados"
ON public.post_saves FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden guardar posts"
ON public.post_saves FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden quitar guardados"
ON public.post_saves FOR DELETE
USING (auth.uid() = user_id);

-- ================================================
-- ÍNDICES PARA PERFORMANCE
-- ================================================
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_visibility ON public.posts(visibility);
CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);

-- ================================================
-- FUNCIÓN PARA INCREMENTAR CONTADORES
-- ================================================
CREATE OR REPLACE FUNCTION public.increment_post_counter(
  _post_id UUID,
  _counter_name TEXT,
  _increment INTEGER DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE format('UPDATE public.posts SET %I = COALESCE(%I, 0) + $1 WHERE id = $2', 
    _counter_name, _counter_name)
  USING _increment, _post_id;
END;
$$;

-- ================================================
-- RLS para storage bucket posts
-- ================================================
CREATE POLICY "Users can upload posts media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view posts media"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts');

CREATE POLICY "Users can delete own posts media"
ON storage.objects FOR DELETE
USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;