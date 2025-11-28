// TAMV ONLINE - Global Types
// Civilizatory Digital Architecture Types

// ==================== TOUR & TUTORIALS ====================

export type TourStepId =
  | "composer"
  | "experiences"
  | "puentesOniricos"
  | "wallet"
  | "challenges"
  | "groups"
  | "channels"
  | "dreamspaces"
  | "isabella";

export interface ProductTourStep {
  id: TourStepId;
  targetSelector: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right" | "center";
}

export interface ProductTourState {
  isActive: boolean;
  currentStepIndex: number;
}

export type TutorialCategory =
  | "inicio"
  | "creacionContenido"
  | "experiencias"
  | "puentesOniricos"
  | "monetizacion"
  | "concursos"
  | "seguridad";

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  category: TutorialCategory;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  level: "basico" | "intermedio" | "avanzado";
}

// ==================== Q&A & EVENTS ====================

export interface QALiveEvent {
  id: string;
  title: string;
  host: string;
  hostAvatar: string;
  startTime: string; // ISO
  topic: string;
  attendees: number;
  isLive: boolean;
}

// ==================== RECOMMENDATIONS ====================

export interface RecommendationItem {
  id: string;
  type: "creator" | "dreamspace" | "group" | "channel" | "concert" | "auction";
  title: string;
  subtitle: string;
  imageUrl: string;
  followers?: number;
  rating?: number;
}

// ==================== CHALLENGES & MISSIONS ====================

export interface Challenge {
  id: string;
  name: string;
  shortDescription: string;
  reward: string;
  rewardAmount: number;
  endDate: string; // ISO
  progressPercent: number;
  participants: number;
  category: "creative" | "social" | "economic" | "learning";
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  reward: string;
  rewardAmount: number;
  action: "navigate" | "modal" | "connect" | "create";
  actionTarget: string;
  completed: boolean;
}

// ==================== WALLET & ECONOMICS ====================

export interface WalletTransaction {
  id: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  currency: "TAMV" | "ETH" | "USD";
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  module?: string; // e.g., "auction", "concert", "dreamspace"
}

export interface WalletBalance {
  tamv: number;
  eth: number;
  usd: number;
}

// ==================== USER & PROFILE ====================

export interface TamvUserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  skills: string[];
  interests: string[];
  goals: string[];
  level: number;
  xp: number;
  followers: number;
  following: number;
  badges: Badge[];
  memberSince: string;
  isOnline: boolean;
  lastActive: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

// ==================== PUENTES ONÍRICOS ====================

export interface CollaborationMatch {
  id: string;
  users: TamvUserProfile[];
  matchScore: number;
  complementarySkills: string[];
  suggestedProject: string;
  category: string;
}

// ==================== REFERRALS ====================

export interface ReferralLevel {
  minReferrals: number;
  maxReferrals: number;
  rewardMonths: number;
  rewardDescription: string;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  currentTier: ReferralLevel;
  earnedRewards: number;
  pendingRewards: number;
  rank: number;
}

// ==================== MODULES ====================

// Concerts
export interface SensoryConcert {
  id: string;
  title: string;
  artist: string;
  artistAvatar: string;
  description: string;
  coverImage: string;
  startTime: string;
  duration: number;
  ticketPrice: number;
  currency: "TAMV" | "USD";
  attendees: number;
  maxAttendees: number;
  tags: string[];
  isLive: boolean;
  hasXR: boolean;
  commissionPercent: number;
}

// Auctions
export interface Auction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  creator: TamvUserProfile;
  startingPrice: number;
  currentBid: number;
  currency: "TAMV" | "ETH" | "USD";
  bidCount: number;
  startTime: string;
  endTime: string;
  status: "upcoming" | "active" | "ended";
  winner?: TamvUserProfile;
  commissionPercent: number;
  category: string;
}

// DreamSpaces
export interface DreamSpace {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  owner: TamvUserProfile;
  type: "personal" | "collaborative" | "public";
  visitors: number;
  rating: number;
  tags: string[];
  hasXR: boolean;
  entryPrice?: number;
}

// Groups
export interface TamvGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  isPaid: boolean;
  price?: number;
  admins: string[];
  createdAt: string;
}

// Channels
export interface TamvChannel {
  id: string;
  name: string;
  description: string;
  avatar: string;
  subscriberCount: number;
  category: string;
  isPremium: boolean;
  price?: number;
  owner: TamvUserProfile;
  lastPost: string;
}

// Digital Pets
export interface DigitalPet {
  id: string;
  name: string;
  species: string;
  avatar: string;
  level: number;
  xp: number;
  happiness: number;
  energy: number;
  abilities: string[];
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  owner: string;
  bornAt: string;
}

// ==================== NOTIFICATIONS ====================

export interface TamvNotification {
  id: string;
  type: "info" | "success" | "warning" | "achievement" | "social" | "economic";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  icon?: string;
  sound?: string;
}

// ==================== ISABELLA IA ====================

export interface IsabellaMessage {
  id: string;
  role: "user" | "isabella";
  content: string;
  timestamp: string;
  attachments?: string[];
  emotion?: "neutral" | "happy" | "helpful" | "curious" | "encouraging";
}

export interface IsabellaSession {
  id: string;
  messages: IsabellaMessage[];
  context: string;
  startedAt: string;
}
