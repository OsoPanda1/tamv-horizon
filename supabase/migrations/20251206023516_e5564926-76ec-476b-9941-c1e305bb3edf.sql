-- ================================================
-- TABLA GAMIFICATION_ACHIEVEMENTS: Logros desbloqueables
-- (CREADA PRIMERO para que user_achievements pueda referenciarla)
-- ================================================
CREATE TABLE public.gamification_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 100,
  tamv_reward NUMERIC DEFAULT 0,
  category VARCHAR DEFAULT 'general',
  tier INTEGER DEFAULT 1,
  is_secret BOOLEAN DEFAULT false,
  requirements JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.gamification_achievements ENABLE ROW LEVEL SECURITY;

-- ================================================
-- TABLA USER_ACHIEVEMENTS: Logros de usuarios
-- ================================================
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.gamification_achievements(id),
  progress INTEGER DEFAULT 0,
  max_progress INTEGER DEFAULT 100,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus logros"
ON public.user_achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Sistema puede crear logros"
ON public.user_achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sistema puede actualizar logros"
ON public.user_achievements FOR UPDATE
USING (auth.uid() = user_id);

-- Ahora la policy de achievements puede referenciar user_achievements
CREATE POLICY "Logros visibles para todos excepto secretos"
ON public.gamification_achievements FOR SELECT
USING (is_secret = false OR EXISTS (
  SELECT 1 FROM public.user_achievements ua 
  WHERE ua.achievement_id = gamification_achievements.id AND ua.user_id = auth.uid()
));

-- ================================================
-- TABLA VIRTUAL_GIFTS: Catálogo de regalos virtuales
-- ================================================
CREATE TABLE public.virtual_gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  icon_url TEXT,
  animation_url TEXT,
  price NUMERIC NOT NULL DEFAULT 10,
  currency currency_type DEFAULT 'TAMV',
  rarity pet_rarity DEFAULT 'common',
  category VARCHAR DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.virtual_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Regalos visibles para todos"
ON public.virtual_gifts FOR SELECT
USING (is_active = true);

-- ================================================
-- TABLA GIFT_TRANSACTIONS: Historial de regalos enviados
-- ================================================
CREATE TABLE public.gift_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id UUID NOT NULL REFERENCES public.virtual_gifts(id),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  message TEXT,
  context_type VARCHAR DEFAULT 'profile',
  context_id UUID,
  transaction_id UUID REFERENCES public.transactions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus transacciones de regalos"
ON public.gift_transactions FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Usuarios pueden enviar regalos"
ON public.gift_transactions FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- ================================================
-- TABLA ISABELLA_VAULT: Bóveda de memorias de Isabella
-- ================================================
CREATE TABLE public.isabella_vault (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  memory_type VARCHAR NOT NULL CHECK (memory_type IN ('preference', 'insight', 'emotion', 'goal', 'interaction', 'dream')),
  content JSONB NOT NULL,
  importance INTEGER DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  emotion_context VARCHAR,
  related_entities UUID[] DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.isabella_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver su bóveda"
ON public.isabella_vault FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Sistema puede agregar memorias"
ON public.isabella_vault FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sistema puede actualizar memorias"
ON public.isabella_vault FOR UPDATE
USING (auth.uid() = user_id);

-- ================================================
-- TABLA BOOKPI_EVENTS: Eventos de observabilidad BookPI
-- ================================================
CREATE TABLE public.bookpi_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR NOT NULL,
  level VARCHAR DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warn', 'error', 'critical')),
  module VARCHAR NOT NULL,
  domain VARCHAR,
  user_id UUID,
  session_id UUID,
  latency_ms INTEGER,
  error_code VARCHAR,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.bookpi_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo admins pueden ver eventos BookPI"
ON public.bookpi_events FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Sistema puede insertar eventos BookPI"
ON public.bookpi_events FOR INSERT
WITH CHECK (true);

-- ================================================
-- ÍNDICES PARA PERFORMANCE
-- ================================================
CREATE INDEX idx_bookpi_events_created_at ON public.bookpi_events(created_at DESC);
CREATE INDEX idx_bookpi_events_module ON public.bookpi_events(module);
CREATE INDEX idx_isabella_vault_user_id ON public.isabella_vault(user_id);
CREATE INDEX idx_gift_transactions_recipient ON public.gift_transactions(recipient_id);
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);

-- ================================================
-- INSERTAR REGALOS VIRTUALES INICIALES
-- ================================================
INSERT INTO public.virtual_gifts (name, description, price, rarity, category, icon_url) VALUES
('Corazón de Oro', 'Un corazón dorado brillante', 10, 'common', 'love', '💛'),
('Estrella Cósmica', 'Una estrella del universo TAMV', 25, 'rare', 'cosmic', '⭐'),
('Quetzal Divino', 'El ave sagrada de Mesoamérica', 50, 'epic', 'cultural', '🦅'),
('Dragón de Fuego', 'Poder ancestral del dragón', 100, 'legendary', 'power', '🐉'),
('Pirámide Sagrada', 'Símbolo de la civilización', 75, 'epic', 'cultural', '🏛️'),
('Obsidiana Mística', 'Piedra de poder y visión', 30, 'rare', 'mystic', '🔮'),
('Sol Azteca', 'El poderoso Tonatiuh', 150, 'legendary', 'cultural', '☀️'),
('Luna de Plata', 'Luz nocturna de guía', 40, 'rare', 'cosmic', '🌙'),
('Jaguar Guardián', 'Espíritu protector', 200, 'mythic', 'power', '🐆'),
('Flor de Cempasúchil', 'Conexión con los ancestros', 20, 'common', 'spiritual', '🌼');

-- ================================================
-- INSERTAR LOGROS INICIALES
-- ================================================
INSERT INTO public.gamification_achievements (code, name, description, xp_reward, tamv_reward, category, tier) VALUES
('first_post', 'Primera Publicación', 'Comparte tu primer contenido con la comunidad', 50, 5, 'social', 1),
('first_like', 'Primer Me Gusta', 'Da tu primer like a una publicación', 10, 1, 'social', 1),
('first_pet', 'Primer Quantum Pet', 'Adopta tu primera mascota digital', 100, 10, 'pets', 1),
('first_dreamspace', 'Arquitecto Onírico', 'Crea tu primer DreamSpace', 200, 25, 'creation', 2),
('first_concert', 'Asistente Sensorial', 'Asiste a tu primer concierto sensorial', 150, 15, 'events', 2),
('first_auction', 'Subastador', 'Participa en tu primera subasta', 100, 10, 'economy', 2),
('level_5', 'Aprendiz TAMV', 'Alcanza el nivel 5', 250, 50, 'progression', 1),
('level_10', 'Explorador TAMV', 'Alcanza el nivel 10', 500, 100, 'progression', 2),
('level_25', 'Maestro TAMV', 'Alcanza el nivel 25', 1000, 250, 'progression', 3),
('collector_5', 'Coleccionista', 'Colecciona 5 items únicos', 300, 30, 'collection', 2),
('social_butterfly', 'Mariposa Social', 'Conecta con 10 creadores', 200, 20, 'social', 2),
('pioneer', 'Pionero Latinoamericano', 'Usuario de la primera generación TAMV', 500, 100, 'special', 3);