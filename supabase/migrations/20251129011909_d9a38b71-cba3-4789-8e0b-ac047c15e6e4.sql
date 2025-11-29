-- =====================================================
-- TAMV ONLINE - ESQUEMA DE BASE DE DATOS COMPLETO
-- Arquitectura Civilizatoria Digital
-- =====================================================

-- Roles de usuario
CREATE TYPE public.app_role AS ENUM ('user', 'creator', 'moderator', 'admin', 'superadmin');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense', 'transfer', 'commission', 'refund', 'withdrawal');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE public.currency_type AS ENUM ('TAMV', 'ETH', 'USD', 'MXN');
CREATE TYPE public.auction_status AS ENUM ('draft', 'upcoming', 'active', 'ended', 'cancelled');
CREATE TYPE public.concert_status AS ENUM ('draft', 'scheduled', 'live', 'ended', 'cancelled');
CREATE TYPE public.pet_rarity AS ENUM ('common', 'rare', 'epic', 'legendary', 'mythic');
CREATE TYPE public.notification_type AS ENUM ('info', 'success', 'warning', 'achievement', 'social', 'economic');

-- =====================================================
-- TABLA DE PERFILES DE USUARIO
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(200),
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  goals TEXT[] DEFAULT '{}',
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  is_online BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  member_since TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles de usuario (separado por seguridad)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID,
  UNIQUE (user_id, role)
);

-- =====================================================
-- WALLET Y ECONOMÍA
-- =====================================================
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance_tamv NUMERIC(18,4) DEFAULT 1000.0000,
  balance_eth NUMERIC(18,8) DEFAULT 0.00000000,
  balance_usd NUMERIC(18,2) DEFAULT 0.00,
  balance_mxn NUMERIC(18,2) DEFAULT 0.00,
  total_earned NUMERIC(18,4) DEFAULT 0.0000,
  total_spent NUMERIC(18,4) DEFAULT 0.0000,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  amount NUMERIC(18,4) NOT NULL,
  currency currency_type NOT NULL DEFAULT 'TAMV',
  description TEXT,
  module VARCHAR(50),
  reference_id UUID,
  reference_type VARCHAR(50),
  platform_fee NUMERIC(18,4) DEFAULT 0,
  creator_amount NUMERIC(18,4) DEFAULT 0,
  status transaction_status NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  bookpi_hash VARCHAR(256),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =====================================================
-- CONCIERTOS SENSORIALES
-- =====================================================
CREATE TABLE public.concerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 60,
  ticket_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency currency_type DEFAULT 'TAMV',
  max_attendees INT DEFAULT 1000,
  current_attendees INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  status concert_status DEFAULT 'draft',
  has_xr BOOLEAN DEFAULT TRUE,
  commission_percent NUMERIC(5,2) DEFAULT 15.00,
  total_revenue NUMERIC(18,4) DEFAULT 0,
  platform_earnings NUMERIC(18,4) DEFAULT 0,
  creator_earnings NUMERIC(18,4) DEFAULT 0,
  dreamspace_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.concert_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concert_id UUID REFERENCES public.concerts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  ticket_type VARCHAR(50) DEFAULT 'standard',
  price_paid NUMERIC(12,2) NOT NULL,
  currency currency_type DEFAULT 'TAMV',
  transaction_id UUID REFERENCES public.transactions(id),
  is_used BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUBASTAS NFT
-- =====================================================
CREATE TABLE public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  starting_price NUMERIC(18,4) NOT NULL,
  reserve_price NUMERIC(18,4),
  current_bid NUMERIC(18,4) DEFAULT 0,
  currency currency_type DEFAULT 'TAMV',
  bid_count INT DEFAULT 0,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status auction_status DEFAULT 'draft',
  winner_id UUID REFERENCES auth.users(id),
  winning_bid NUMERIC(18,4),
  commission_percent NUMERIC(5,2) DEFAULT 18.00,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  nft_contract_address VARCHAR(255),
  nft_token_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE NOT NULL,
  bidder_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  amount NUMERIC(18,4) NOT NULL,
  currency currency_type DEFAULT 'TAMV',
  is_winning BOOLEAN DEFAULT FALSE,
  is_auto_bid BOOLEAN DEFAULT FALSE,
  max_auto_bid NUMERIC(18,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DREAMSPACES
-- =====================================================
CREATE TABLE public.dreamspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image TEXT,
  space_type VARCHAR(50) DEFAULT 'personal',
  is_public BOOLEAN DEFAULT TRUE,
  entry_price NUMERIC(12,2) DEFAULT 0,
  currency currency_type DEFAULT 'TAMV',
  visitors_count INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  ratings_count INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  has_xr BOOLEAN DEFAULT TRUE,
  scene_config JSONB DEFAULT '{}',
  commission_percent NUMERIC(5,2) DEFAULT 25.00,
  total_revenue NUMERIC(18,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.dreamspace_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dreamspace_id UUID REFERENCES public.dreamspaces(id) ON DELETE CASCADE NOT NULL,
  visitor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  entry_fee_paid NUMERIC(12,2) DEFAULT 0,
  transaction_id UUID REFERENCES public.transactions(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INT DEFAULT 0
);

-- =====================================================
-- GRUPOS Y CANALES
-- =====================================================
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_image TEXT,
  category VARCHAR(100),
  is_private BOOLEAN DEFAULT FALSE,
  is_paid BOOLEAN DEFAULT FALSE,
  price NUMERIC(12,2) DEFAULT 0,
  currency currency_type DEFAULT 'TAMV',
  member_count INT DEFAULT 1,
  max_members INT DEFAULT 10000,
  commission_percent NUMERIC(5,2) DEFAULT 25.00,
  total_revenue NUMERIC(18,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_expires_at TIMESTAMPTZ,
  UNIQUE (group_id, user_id)
);

CREATE TABLE public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  category VARCHAR(100),
  is_premium BOOLEAN DEFAULT FALSE,
  price NUMERIC(12,2) DEFAULT 0,
  currency currency_type DEFAULT 'TAMV',
  subscriber_count INT DEFAULT 0,
  commission_percent NUMERIC(5,2) DEFAULT 20.00,
  total_revenue NUMERIC(18,4) DEFAULT 0,
  last_post_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.channel_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_expires_at TIMESTAMPTZ,
  UNIQUE (channel_id, user_id)
);

-- =====================================================
-- MASCOTAS DIGITALES (QUANTUM PETS)
-- =====================================================
CREATE TABLE public.digital_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  happiness INT DEFAULT 100 CHECK (happiness >= 0 AND happiness <= 100),
  energy INT DEFAULT 100 CHECK (energy >= 0 AND energy <= 100),
  abilities TEXT[] DEFAULT '{}',
  rarity pet_rarity DEFAULT 'common',
  born_at TIMESTAMPTZ DEFAULT NOW(),
  last_fed_at TIMESTAMPTZ DEFAULT NOW(),
  last_played_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.pet_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC(12,2) NOT NULL,
  currency currency_type DEFAULT 'TAMV',
  accessory_type VARCHAR(50),
  rarity pet_rarity DEFAULT 'common',
  stats_boost JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.pet_owned_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.digital_pets(id) ON DELETE CASCADE NOT NULL,
  accessory_id UUID REFERENCES public.pet_accessories(id) ON DELETE CASCADE NOT NULL,
  equipped BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (pet_id, accessory_id)
);

-- =====================================================
-- PUENTES ONÍRICOS (MATCHING COLABORATIVO)
-- =====================================================
CREATE TABLE public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_idea TEXT,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  match_score NUMERIC(5,2),
  complementary_skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- =====================================================
-- REFERIDOS Y EMBAJADORES
-- =====================================================
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  reward_claimed BOOLEAN DEFAULT FALSE,
  reward_amount NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  UNIQUE (referrer_id, referred_id)
);

CREATE TABLE public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  tier VARCHAR(50) NOT NULL,
  total_referrals INT DEFAULT 0,
  active_referrals INT DEFAULT 0,
  reward_months INT DEFAULT 0,
  earned_amount NUMERIC(18,4) DEFAULT 0,
  rank INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ISABELLA AI (SESIONES Y MENSAJES)
-- =====================================================
CREATE TABLE public.isabella_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  context TEXT,
  emotion_state VARCHAR(50) DEFAULT 'neutral',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  message_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.isabella_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.isabella_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'isabella')),
  content TEXT NOT NULL,
  emotion VARCHAR(50) DEFAULT 'neutral',
  attachments TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICACIONES
-- =====================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL DEFAULT 'info',
  title VARCHAR(200) NOT NULL,
  message TEXT,
  action_url TEXT,
  icon VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDIT LOG (BOOKPI - TRAZABILIDAD)
-- =====================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  prev_state JSONB,
  new_state JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  bookpi_hash VARCHAR(256),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RECOMENDACIONES Y ML
-- =====================================================
CREATE TABLE public.user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  interaction_type VARCHAR(50) NOT NULL,
  weight NUMERIC(5,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  score NUMERIC(8,4) NOT NULL,
  reason TEXT,
  algorithm VARCHAR(100) DEFAULT 'collaborative_filtering',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA RENDIMIENTO
-- =====================================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_concerts_creator_id ON public.concerts(creator_id);
CREATE INDEX idx_concerts_status ON public.concerts(status);
CREATE INDEX idx_concerts_start_time ON public.concerts(start_time);
CREATE INDEX idx_auctions_creator_id ON public.auctions(creator_id);
CREATE INDEX idx_auctions_status ON public.auctions(status);
CREATE INDEX idx_auction_bids_auction_id ON public.auction_bids(auction_id);
CREATE INDEX idx_dreamspaces_owner_id ON public.dreamspaces(owner_id);
CREATE INDEX idx_groups_owner_id ON public.groups(owner_id);
CREATE INDEX idx_channels_owner_id ON public.channels(owner_id);
CREATE INDEX idx_digital_pets_owner_id ON public.digital_pets(owner_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_user_interactions_user_id ON public.user_interactions(user_id);
CREATE INDEX idx_recommendations_user_id ON public.recommendations(user_id);

-- =====================================================
-- FUNCIONES DE SEGURIDAD
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'superadmin')
  )
$$;

-- =====================================================
-- FUNCIÓN PARA ACTUALIZAR TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_concerts_updated_at BEFORE UPDATE ON public.concerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON public.auctions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dreamspaces_updated_at BEFORE UPDATE ON public.dreamspaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON public.channels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_referral_rewards_updated_at BEFORE UPDATE ON public.referral_rewards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- FUNCIÓN PARA CREAR PERFIL Y WALLET AUTOMÁTICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Crear perfil
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'Nuevo Usuario TAMV')
  );
  
  -- Crear wallet con 1000 TAMV de bienvenida
  INSERT INTO public.wallets (user_id, balance_tamv)
  VALUES (NEW.id, 1000.0000);
  
  -- Asignar rol de usuario
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNCIÓN PARA CALCULAR COMISIÓN
-- =====================================================
CREATE OR REPLACE FUNCTION public.calculate_commission(
  _amount NUMERIC,
  _commission_percent NUMERIC
)
RETURNS TABLE (
  creator_amount NUMERIC,
  platform_amount NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT
    ROUND(_amount * (1 - _commission_percent / 100), 4) AS creator_amount,
    ROUND(_amount * (_commission_percent / 100), 4) AS platform_amount;
END;
$$;

-- =====================================================
-- FUNCIÓN PARA REGISTRAR AUDIT LOG
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_audit_event(
  _entity_type VARCHAR,
  _entity_id UUID,
  _action VARCHAR,
  _actor_id UUID,
  _prev_state JSONB DEFAULT NULL,
  _new_state JSONB DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _log_id UUID;
  _hash VARCHAR(256);
BEGIN
  -- Generar hash BookPI
  _hash := encode(sha256((_entity_type || _entity_id::text || _action || NOW()::text)::bytea), 'hex');
  
  INSERT INTO public.audit_logs (entity_type, entity_id, action, actor_id, prev_state, new_state, bookpi_hash, metadata)
  VALUES (_entity_type, _entity_id, _action, _actor_id, _prev_state, _new_state, _hash, _metadata)
  RETURNING id INTO _log_id;
  
  RETURN _log_id;
END;
$$;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concert_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dreamspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dreamspace_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_owned_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Políticas para PROFILES
CREATE POLICY "Los perfiles públicos son visibles para todos" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden insertar su propio perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para USER_ROLES
CREATE POLICY "Los usuarios pueden ver sus propios roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Solo admins pueden gestionar roles" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para WALLETS
CREATE POLICY "Los usuarios pueden ver su propia wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden actualizar su propia wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para TRANSACTIONS
CREATE POLICY "Los usuarios pueden ver sus propias transacciones" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden crear transacciones" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para CONCERTS
CREATE POLICY "Los conciertos públicos son visibles para todos" ON public.concerts FOR SELECT USING (status != 'draft' OR auth.uid() = creator_id);
CREATE POLICY "Los creadores pueden gestionar sus conciertos" ON public.concerts FOR ALL USING (auth.uid() = creator_id);

-- Políticas para CONCERT_TICKETS
CREATE POLICY "Los usuarios pueden ver sus propios tickets" ON public.concert_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden comprar tickets" ON public.concert_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para AUCTIONS
CREATE POLICY "Las subastas activas son visibles para todos" ON public.auctions FOR SELECT USING (status != 'draft' OR auth.uid() = creator_id);
CREATE POLICY "Los creadores pueden gestionar sus subastas" ON public.auctions FOR ALL USING (auth.uid() = creator_id);

-- Políticas para AUCTION_BIDS
CREATE POLICY "Las pujas son visibles para todos" ON public.auction_bids FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden hacer pujas" ON public.auction_bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Políticas para DREAMSPACES
CREATE POLICY "Los dreamspaces públicos son visibles para todos" ON public.dreamspaces FOR SELECT USING (is_public = true OR auth.uid() = owner_id);
CREATE POLICY "Los propietarios pueden gestionar sus dreamspaces" ON public.dreamspaces FOR ALL USING (auth.uid() = owner_id);

-- Políticas para DREAMSPACE_VISITS
CREATE POLICY "Los usuarios pueden ver sus propias visitas" ON public.dreamspace_visits FOR SELECT USING (auth.uid() = visitor_id);
CREATE POLICY "Los usuarios pueden registrar visitas" ON public.dreamspace_visits FOR INSERT WITH CHECK (auth.uid() = visitor_id);

-- Políticas para GROUPS
CREATE POLICY "Los grupos públicos son visibles para todos" ON public.groups FOR SELECT USING (is_private = false OR auth.uid() = owner_id);
CREATE POLICY "Los propietarios pueden gestionar sus grupos" ON public.groups FOR ALL USING (auth.uid() = owner_id);

-- Políticas para GROUP_MEMBERS
CREATE POLICY "Los miembros pueden ver membresías del grupo" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden unirse a grupos" ON public.group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden salir de grupos" ON public.group_members FOR DELETE USING (auth.uid() = user_id);

-- Políticas para CHANNELS
CREATE POLICY "Los canales son visibles para todos" ON public.channels FOR SELECT USING (true);
CREATE POLICY "Los propietarios pueden gestionar sus canales" ON public.channels FOR ALL USING (auth.uid() = owner_id);

-- Políticas para CHANNEL_SUBSCRIBERS
CREATE POLICY "Los suscriptores pueden ver sus suscripciones" ON public.channel_subscribers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden suscribirse" ON public.channel_subscribers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden desuscribirse" ON public.channel_subscribers FOR DELETE USING (auth.uid() = user_id);

-- Políticas para DIGITAL_PETS
CREATE POLICY "Las mascotas son visibles para todos" ON public.digital_pets FOR SELECT USING (true);
CREATE POLICY "Los propietarios pueden gestionar sus mascotas" ON public.digital_pets FOR ALL USING (auth.uid() = owner_id);

-- Políticas para PET_ACCESSORIES
CREATE POLICY "Los accesorios son visibles para todos" ON public.pet_accessories FOR SELECT USING (true);

-- Políticas para PET_OWNED_ACCESSORIES
CREATE POLICY "Los usuarios pueden ver los accesorios de sus mascotas" ON public.pet_owned_accessories FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.digital_pets WHERE id = pet_id AND owner_id = auth.uid()));
CREATE POLICY "Los usuarios pueden comprar accesorios para sus mascotas" ON public.pet_owned_accessories FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.digital_pets WHERE id = pet_id AND owner_id = auth.uid()));

-- Políticas para COLLABORATION_REQUESTS
CREATE POLICY "Los usuarios pueden ver sus solicitudes de colaboración" ON public.collaboration_requests 
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = target_id);
CREATE POLICY "Los usuarios pueden crear solicitudes" ON public.collaboration_requests 
  FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Los usuarios pueden actualizar solicitudes que les conciernen" ON public.collaboration_requests 
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = target_id);

-- Políticas para REFERRALS
CREATE POLICY "Los usuarios pueden ver sus referidos" ON public.referrals 
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Los usuarios pueden crear referidos" ON public.referrals 
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Políticas para REFERRAL_REWARDS
CREATE POLICY "Los usuarios pueden ver sus recompensas" ON public.referral_rewards 
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para ISABELLA_SESSIONS
CREATE POLICY "Los usuarios pueden ver sus sesiones de Isabella" ON public.isabella_sessions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden crear sesiones" ON public.isabella_sessions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden actualizar sus sesiones" ON public.isabella_sessions 
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para ISABELLA_MESSAGES
CREATE POLICY "Los usuarios pueden ver sus mensajes de Isabella" ON public.isabella_messages 
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.isabella_sessions WHERE id = session_id AND user_id = auth.uid()
  ));
CREATE POLICY "Los usuarios pueden enviar mensajes" ON public.isabella_messages 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para NOTIFICATIONS
CREATE POLICY "Los usuarios pueden ver sus notificaciones" ON public.notifications 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden actualizar sus notificaciones" ON public.notifications 
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para AUDIT_LOGS
CREATE POLICY "Solo admins pueden ver audit logs" ON public.audit_logs 
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Políticas para USER_INTERACTIONS
CREATE POLICY "Los usuarios pueden ver sus interacciones" ON public.user_interactions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden registrar interacciones" ON public.user_interactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para RECOMMENDATIONS
CREATE POLICY "Los usuarios pueden ver sus recomendaciones" ON public.recommendations 
  FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- HABILITAR REALTIME PARA TABLAS CRÍTICAS
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.auction_bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.isabella_messages;