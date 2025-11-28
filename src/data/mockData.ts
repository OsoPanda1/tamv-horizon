import {
  QALiveEvent,
  RecommendationItem,
  Challenge,
  DailyMission,
  ReferralLevel,
  SensoryConcert,
  Auction,
  DreamSpace,
  TamvGroup,
  TamvChannel,
  DigitalPet,
  TamvUserProfile,
  CollaborationMatch,
  WalletTransaction,
  WalletBalance
} from "@/types/tamv";

// ==================== Q&A EVENTS ====================

export const QA_EVENTS: QALiveEvent[] = [
  {
    id: "qa-001",
    title: "Cómo monetizar tu arte digital",
    host: "Isabella Villaseñor",
    hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    startTime: new Date(Date.now() + 3600000).toISOString(),
    topic: "Monetización",
    attendees: 234,
    isLive: false
  },
  {
    id: "qa-002",
    title: "Introducción a DreamSpaces XR",
    host: "Carlos Mendoza",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    startTime: new Date(Date.now() + 7200000).toISOString(),
    topic: "Tecnología",
    attendees: 189,
    isLive: false
  },
  {
    id: "qa-003",
    title: "Sesión en vivo: Preguntas de la comunidad",
    host: "Anubis Villaseñor",
    hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    startTime: new Date().toISOString(),
    topic: "Comunidad",
    attendees: 567,
    isLive: true
  }
];

// ==================== RECOMMENDATIONS ====================

export const RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: "rec-001",
    type: "creator",
    title: "María Luna",
    subtitle: "Artista digital · 15K seguidores",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    followers: 15000
  },
  {
    id: "rec-002",
    type: "dreamspace",
    title: "Templo Azteca Digital",
    subtitle: "Experiencia inmersiva XR",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200",
    rating: 4.9
  },
  {
    id: "rec-003",
    type: "concert",
    title: "Noche de Sintetizadores",
    subtitle: "Concierto sensorial · Sábado",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200"
  },
  {
    id: "rec-004",
    type: "group",
    title: "Desarrolladores LATAM",
    subtitle: "2.3K miembros activos",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200",
    followers: 2300
  },
  {
    id: "rec-005",
    type: "channel",
    title: "Tech & Futuro",
    subtitle: "Noticias de tecnología",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200",
    followers: 8700
  },
  {
    id: "rec-006",
    type: "auction",
    title: "Arte Generativo #247",
    subtitle: "Subasta activa · 2.5 ETH",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339bbe3c84?w=200"
  }
];

// ==================== CHALLENGES ====================

export const CHALLENGES: Challenge[] = [
  {
    id: "ch-001",
    name: "Creador Novato",
    shortDescription: "Publica tu primer contenido y recibe feedback de la comunidad",
    reward: "100 TAMV + Badge Creador",
    rewardAmount: 100,
    endDate: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
    progressPercent: 0,
    participants: 1250,
    category: "creative"
  },
  {
    id: "ch-002",
    name: "Conector Social",
    shortDescription: "Conecta con 10 nuevos creadores esta semana",
    reward: "250 TAMV + XP Doble",
    rewardAmount: 250,
    endDate: new Date(Date.now() + 5 * 24 * 3600000).toISOString(),
    progressPercent: 30,
    participants: 890,
    category: "social"
  },
  {
    id: "ch-003",
    name: "Explorador de DreamSpaces",
    shortDescription: "Visita 5 DreamSpaces diferentes y deja reseñas",
    reward: "150 TAMV + Acceso Beta",
    rewardAmount: 150,
    endDate: new Date(Date.now() + 10 * 24 * 3600000).toISOString(),
    progressPercent: 60,
    participants: 2100,
    category: "learning"
  },
  {
    id: "ch-004",
    name: "Primer Ingreso",
    shortDescription: "Realiza tu primera transacción en el ecosistema TAMV",
    reward: "50 TAMV + Tutorial Premium",
    rewardAmount: 50,
    endDate: new Date(Date.now() + 14 * 24 * 3600000).toISOString(),
    progressPercent: 0,
    participants: 3400,
    category: "economic"
  }
];

// ==================== DAILY MISSION ====================

export const DAILY_MISSIONS: DailyMission[] = [
  {
    id: "dm-001",
    title: "Explora un DreamSpace",
    description: "Visita cualquier DreamSpace y pasa al menos 2 minutos explorando",
    reward: "25 TAMV",
    rewardAmount: 25,
    action: "navigate",
    actionTarget: "/dreamspaces",
    completed: false
  },
  {
    id: "dm-002",
    title: "Conecta con alguien nuevo",
    description: "Envía un mensaje o solicitud de conexión a otro usuario",
    reward: "15 TAMV",
    rewardAmount: 15,
    action: "modal",
    actionTarget: "connect-modal",
    completed: false
  },
  {
    id: "dm-003",
    title: "Publica algo",
    description: "Comparte una idea, imagen o reflexión con la comunidad",
    reward: "30 TAMV",
    rewardAmount: 30,
    action: "create",
    actionTarget: "composer",
    completed: false
  }
];

// ==================== REFERRAL LEVELS ====================

export const REFERRAL_LEVELS: ReferralLevel[] = [
  {
    minReferrals: 500,
    maxReferrals: 1000,
    rewardMonths: 1,
    rewardDescription: "1 mes de membresía Premium gratis",
    tier: "bronze"
  },
  {
    minReferrals: 1001,
    maxReferrals: 3000,
    rewardMonths: 2,
    rewardDescription: "2 meses de membresía Premium gratis",
    tier: "silver"
  },
  {
    minReferrals: 3001,
    maxReferrals: 5000,
    rewardMonths: 4,
    rewardDescription: "4 meses de membresía Premium gratis",
    tier: "gold"
  },
  {
    minReferrals: 5001,
    maxReferrals: 10000,
    rewardMonths: 6,
    rewardDescription: "6 meses de membresía Premium gratis",
    tier: "platinum"
  },
  {
    minReferrals: 10001,
    maxReferrals: Infinity,
    rewardMonths: 12,
    rewardDescription: "1 año de membresía Premium gratis + Badge Legendario",
    tier: "diamond"
  }
];

// ==================== MOCK USERS ====================

export const MOCK_USERS: TamvUserProfile[] = [
  {
    id: "user-001",
    username: "juan_dev",
    displayName: "Juan García",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    bio: "Desarrollador full-stack apasionado por la tecnología y el arte digital",
    skills: ["React", "TypeScript", "Node.js", "Web3"],
    interests: ["IA", "Blockchain", "Música electrónica"],
    goals: ["Crear una app de salud", "Colaborar con artistas"],
    level: 12,
    xp: 2450,
    followers: 1250,
    following: 340,
    badges: [],
    memberSince: "2024-01-15",
    isOnline: true,
    lastActive: new Date().toISOString()
  },
  {
    id: "user-002",
    username: "dra_ramirez",
    displayName: "Dra. Ana Ramírez",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200",
    bio: "Médica especialista en telemedicina, buscando innovar en salud digital",
    skills: ["Medicina", "Telemedicina", "Investigación", "Docencia"],
    interests: ["Salud digital", "IA en medicina", "Startups de salud"],
    goals: ["App para pacientes crónicos", "Plataforma de consultas"],
    level: 8,
    xp: 1800,
    followers: 890,
    following: 210,
    badges: [],
    memberSince: "2024-03-20",
    isOnline: true,
    lastActive: new Date().toISOString()
  },
  {
    id: "user-003",
    username: "maria_art",
    displayName: "María Luna",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    bio: "Artista digital y creadora de experiencias XR inmersivas",
    skills: ["Arte digital", "3D", "XR", "Animación"],
    interests: ["Arte generativo", "NFTs", "Realidad virtual"],
    goals: ["Galería virtual", "Colaboración con músicos"],
    level: 15,
    xp: 3200,
    followers: 15000,
    following: 450,
    badges: [],
    memberSince: "2023-11-05",
    isOnline: false,
    lastActive: new Date(Date.now() - 3600000).toISOString()
  }
];

// ==================== COLLABORATION MATCHES ====================

export const COLLABORATION_MATCHES: CollaborationMatch[] = [
  {
    id: "match-001",
    users: [MOCK_USERS[0], MOCK_USERS[1]],
    matchScore: 92,
    complementarySkills: ["Desarrollo de apps", "Conocimiento médico"],
    suggestedProject: "App de seguimiento de salud con IA",
    category: "Salud Digital"
  },
  {
    id: "match-002",
    users: [MOCK_USERS[0], MOCK_USERS[2]],
    matchScore: 87,
    complementarySkills: ["Desarrollo Web3", "Arte digital"],
    suggestedProject: "Galería NFT interactiva con experiencias XR",
    category: "Arte & Tecnología"
  }
];

// ==================== SENSORY CONCERTS ====================

export const SENSORY_CONCERTS: SensoryConcert[] = [
  {
    id: "concert-001",
    title: "Noche de Sintetizadores",
    artist: "Elektra MX",
    artistAvatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200",
    description: "Experiencia inmersiva de música electrónica con visuales 3D y audio espacial",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    startTime: new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
    duration: 120,
    ticketPrice: 50,
    currency: "TAMV",
    attendees: 234,
    maxAttendees: 500,
    tags: ["Electrónica", "XR", "Audio 3D"],
    isLive: false,
    hasXR: true,
    commissionPercent: 15
  },
  {
    id: "concert-002",
    title: "Raíces Digitales",
    artist: "Colectivo Azteca",
    artistAvatar: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200",
    description: "Fusión de música tradicional mexicana con beats electrónicos y visuales ceremoniales",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    startTime: new Date(Date.now() + 5 * 24 * 3600000).toISOString(),
    duration: 90,
    ticketPrice: 75,
    currency: "TAMV",
    attendees: 456,
    maxAttendees: 1000,
    tags: ["Fusión", "Tradicional", "Ceremonial"],
    isLive: false,
    hasXR: true,
    commissionPercent: 12
  }
];

// ==================== AUCTIONS ====================

export const AUCTIONS: Auction[] = [
  {
    id: "auction-001",
    title: "Quetzalcóatl Digital #001",
    description: "Arte generativo inspirado en la serpiente emplumada, edición única",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339bbe3c84?w=600",
    creator: MOCK_USERS[2],
    startingPrice: 1.5,
    currentBid: 2.8,
    currency: "ETH",
    bidCount: 12,
    startTime: new Date(Date.now() - 24 * 3600000).toISOString(),
    endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
    status: "active",
    commissionPercent: 15,
    category: "Arte Digital"
  },
  {
    id: "auction-002",
    title: "Mascota Legendaria: Xólotl",
    description: "Mascota digital mítica con habilidades únicas y evolución especial",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
    creator: MOCK_USERS[0],
    startingPrice: 500,
    currentBid: 1250,
    currency: "TAMV",
    bidCount: 28,
    startTime: new Date(Date.now() - 12 * 3600000).toISOString(),
    endTime: new Date(Date.now() + 36 * 3600000).toISOString(),
    status: "active",
    commissionPercent: 12,
    category: "Mascotas Digitales"
  }
];

// ==================== DREAMSPACES ====================

export const DREAMSPACES: DreamSpace[] = [
  {
    id: "ds-001",
    name: "Templo Azteca Digital",
    description: "Reconstrucción inmersiva de un templo azteca con elementos interactivos",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600",
    owner: MOCK_USERS[2],
    type: "public",
    visitors: 12500,
    rating: 4.9,
    tags: ["Historia", "Cultura", "XR"],
    hasXR: true,
    entryPrice: 0
  },
  {
    id: "ds-002",
    name: "Galaxia Neón",
    description: "Espacio de meditación con visuales cósmicos y música ambiental",
    coverImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600",
    owner: MOCK_USERS[0],
    type: "public",
    visitors: 8900,
    rating: 4.7,
    tags: ["Meditación", "Cosmos", "Relajación"],
    hasXR: true,
    entryPrice: 0
  },
  {
    id: "ds-003",
    name: "Estudio Creativo Premium",
    description: "Espacio colaborativo para artistas con herramientas avanzadas",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    owner: MOCK_USERS[2],
    type: "collaborative",
    visitors: 3400,
    rating: 4.8,
    tags: ["Creativo", "Colaboración", "Herramientas"],
    hasXR: true,
    entryPrice: 25
  }
];

// ==================== GROUPS ====================

export const TAMV_GROUPS: TamvGroup[] = [
  {
    id: "group-001",
    name: "Desarrolladores LATAM",
    description: "Comunidad de desarrolladores latinoamericanos compartiendo conocimiento",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
    memberCount: 2340,
    category: "Tecnología",
    isPrivate: false,
    isPaid: false,
    admins: ["user-001"],
    createdAt: "2024-01-10"
  },
  {
    id: "group-002",
    name: "Artistas Digitales MX",
    description: "Espacio para artistas digitales mexicanos y latinoamericanos",
    avatar: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200",
    coverImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
    memberCount: 1890,
    category: "Arte",
    isPrivate: false,
    isPaid: false,
    admins: ["user-003"],
    createdAt: "2024-02-15"
  },
  {
    id: "group-003",
    name: "Masterclass Premium",
    description: "Acceso exclusivo a masterclasses y contenido educativo avanzado",
    avatar: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200",
    coverImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600",
    memberCount: 450,
    category: "Educación",
    isPrivate: true,
    isPaid: true,
    price: 100,
    admins: ["user-001", "user-002"],
    createdAt: "2024-03-01"
  }
];

// ==================== CHANNELS ====================

export const TAMV_CHANNELS: TamvChannel[] = [
  {
    id: "channel-001",
    name: "Tech & Futuro",
    description: "Noticias y análisis sobre tecnología emergente",
    avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200",
    subscriberCount: 8700,
    category: "Tecnología",
    isPremium: false,
    owner: MOCK_USERS[0],
    lastPost: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "channel-002",
    name: "Arte Sin Fronteras",
    description: "Explorando el arte digital y sus infinitas posibilidades",
    avatar: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=200",
    subscriberCount: 5600,
    category: "Arte",
    isPremium: false,
    owner: MOCK_USERS[2],
    lastPost: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "channel-003",
    name: "Insights Premium",
    description: "Análisis profundos y contenido exclusivo para creadores",
    avatar: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200",
    subscriberCount: 1200,
    category: "Negocios",
    isPremium: true,
    price: 50,
    owner: MOCK_USERS[1],
    lastPost: new Date(Date.now() - 14400000).toISOString()
  }
];

// ==================== DIGITAL PETS ====================

export const DIGITAL_PETS: DigitalPet[] = [
  {
    id: "pet-001",
    name: "Quetzal",
    species: "Ave Cósmica",
    avatar: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200",
    level: 15,
    xp: 4500,
    happiness: 95,
    energy: 80,
    abilities: ["Vuelo estelar", "Canto sanador", "Visión ancestral"],
    rarity: "legendary",
    owner: "user-001",
    bornAt: "2024-02-01"
  },
  {
    id: "pet-002",
    name: "Obsidiana",
    species: "Jaguar Digital",
    avatar: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=200",
    level: 8,
    xp: 2100,
    happiness: 85,
    energy: 90,
    abilities: ["Sigilo nocturno", "Garra de obsidiana"],
    rarity: "epic",
    owner: "user-002",
    bornAt: "2024-04-15"
  }
];

// ==================== WALLET ====================

export const MOCK_WALLET_BALANCE: WalletBalance = {
  tamv: 2450,
  eth: 0.85,
  usd: 1250.00
};

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "tx-001",
    type: "income",
    amount: 150,
    currency: "TAMV",
    description: "Venta de entrada - Concierto Sensorial",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "completed",
    module: "concert"
  },
  {
    id: "tx-002",
    type: "income",
    amount: 500,
    currency: "TAMV",
    description: "Reto completado: Creador Novato",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: "completed",
    module: "challenge"
  },
  {
    id: "tx-003",
    type: "expense",
    amount: 25,
    currency: "TAMV",
    description: "Entrada DreamSpace Premium",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    status: "completed",
    module: "dreamspace"
  },
  {
    id: "tx-004",
    type: "income",
    amount: 0.15,
    currency: "ETH",
    description: "Venta de NFT - Arte Generativo",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    status: "completed",
    module: "auction"
  }
];
