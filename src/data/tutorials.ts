import { VideoTutorial } from "@/types/tamv";

export const VIDEO_TUTORIALS: VideoTutorial[] = [
  // INICIO
  {
    id: "tut-001",
    title: "Bienvenido a TAMV Online",
    description: "Descubre la primera arquitectura civilizatoria digital de LATAM. Aprende a navegar y comenzar tu viaje.",
    category: "inicio",
    videoUrl: "https://example.com/tutorials/welcome",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225",
    durationSeconds: 480,
    level: "basico"
  },
  {
    id: "tut-002",
    title: "Configura tu perfil TAMV",
    description: "Personaliza tu identidad digital, añade habilidades e intereses para mejores conexiones.",
    category: "inicio",
    videoUrl: "https://example.com/tutorials/profile",
    thumbnailUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=225",
    durationSeconds: 360,
    level: "basico"
  },
  // CREACIÓN DE CONTENIDO
  {
    id: "tut-003",
    title: "Crea tu primer post",
    description: "Comparte ideas, imágenes y contenido multimedia con la comunidad TAMV.",
    category: "creacionContenido",
    videoUrl: "https://example.com/tutorials/first-post",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225",
    durationSeconds: 300,
    level: "basico"
  },
  {
    id: "tut-004",
    title: "Organiza un Concierto Sensorial",
    description: "Guía completa para crear experiencias musicales inmersivas con audio 3D y visuales.",
    category: "creacionContenido",
    videoUrl: "https://example.com/tutorials/sensory-concert",
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=225",
    durationSeconds: 720,
    level: "intermedio"
  },
  // EXPERIENCIAS
  {
    id: "tut-005",
    title: "Explora los DreamSpaces",
    description: "Navega por espacios virtuales inmersivos y descubre mundos creados por la comunidad.",
    category: "experiencias",
    videoUrl: "https://example.com/tutorials/dreamspaces",
    thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225",
    durationSeconds: 540,
    level: "basico"
  },
  {
    id: "tut-006",
    title: "Crea tu DreamSpace",
    description: "Diseña y construye tu propio espacio virtual con herramientas intuitivas.",
    category: "experiencias",
    videoUrl: "https://example.com/tutorials/create-dreamspace",
    thumbnailUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=225",
    durationSeconds: 900,
    level: "avanzado"
  },
  // PUENTES ONÍRICOS
  {
    id: "tut-007",
    title: "Puentes Oníricos: Conecta talentos",
    description: "Descubre cómo el sistema de matching te conecta con colaboradores ideales.",
    category: "puentesOniricos",
    videoUrl: "https://example.com/tutorials/puentes-oniricos",
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=225",
    durationSeconds: 480,
    level: "intermedio"
  },
  {
    id: "tut-008",
    title: "Inicia un proyecto colaborativo",
    description: "Crea equipos multidisciplinarios y gestiona proyectos con herramientas integradas.",
    category: "puentesOniricos",
    videoUrl: "https://example.com/tutorials/collaborative-projects",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225",
    durationSeconds: 600,
    level: "intermedio"
  },
  // MONETIZACIÓN
  {
    id: "tut-009",
    title: "Monetiza tu contenido",
    description: "Aprende las múltiples formas de generar ingresos en TAMV: membresías, tips, ventas.",
    category: "monetizacion",
    videoUrl: "https://example.com/tutorials/monetization",
    thumbnailUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=225",
    durationSeconds: 660,
    level: "intermedio"
  },
  {
    id: "tut-010",
    title: "Banco TAMV y Wallet",
    description: "Gestiona tus activos digitales, retira fondos y entiende las comisiones.",
    category: "monetizacion",
    videoUrl: "https://example.com/tutorials/banco-tamv",
    thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=225",
    durationSeconds: 540,
    level: "basico"
  },
  // CONCURSOS
  {
    id: "tut-011",
    title: "Participa en retos TAMV",
    description: "Únete a desafíos creativos, gana recompensas y destaca en la comunidad.",
    category: "concursos",
    videoUrl: "https://example.com/tutorials/challenges",
    thumbnailUrl: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=400&h=225",
    durationSeconds: 420,
    level: "basico"
  },
  {
    id: "tut-012",
    title: "Liga de Embajadores",
    description: "Invita amigos, sube de nivel y desbloquea beneficios exclusivos.",
    category: "concursos",
    videoUrl: "https://example.com/tutorials/ambassadors",
    thumbnailUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=225",
    durationSeconds: 360,
    level: "basico"
  },
  // SEGURIDAD
  {
    id: "tut-013",
    title: "Protege tu cuenta TAMV",
    description: "Configura autenticación de dos factores y mejores prácticas de seguridad.",
    category: "seguridad",
    videoUrl: "https://example.com/tutorials/security",
    thumbnailUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225",
    durationSeconds: 480,
    level: "basico"
  },
  {
    id: "tut-014",
    title: "Privacidad y consentimiento",
    description: "Controla quién ve tu contenido y gestiona permisos de datos.",
    category: "seguridad",
    videoUrl: "https://example.com/tutorials/privacy",
    thumbnailUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=225",
    durationSeconds: 420,
    level: "intermedio"
  }
];

export const TUTORIAL_CATEGORIES = {
  inicio: {
    name: "Inicio",
    description: "Primeros pasos en TAMV",
    icon: "Rocket"
  },
  creacionContenido: {
    name: "Creación de Contenido",
    description: "Crea y comparte tu arte",
    icon: "Palette"
  },
  experiencias: {
    name: "Experiencias",
    description: "DreamSpaces y conciertos",
    icon: "Sparkles"
  },
  puentesOniricos: {
    name: "Puentes Oníricos",
    description: "Colaboración inteligente",
    icon: "Users"
  },
  monetizacion: {
    name: "Monetización",
    description: "Genera ingresos",
    icon: "Coins"
  },
  concursos: {
    name: "Concursos",
    description: "Retos y recompensas",
    icon: "Trophy"
  },
  seguridad: {
    name: "Seguridad",
    description: "Protege tu cuenta",
    icon: "Shield"
  }
};
