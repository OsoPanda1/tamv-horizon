import { VideoTutorial } from "@/types/tamv";

/**
 * 🎨 SISTEMA VISUAL TAMV – SILVER CORE
 * Silver = base elegante
 * Accent = se suma, nunca reemplaza
 */

export type TutorialVisualStyle = {
  gradient: string;
  glow: string;
  accent: string;
};

export const TUTORIAL_LEVEL_STYLES: Record<
  VideoTutorial["level"],
  TutorialVisualStyle
> = {
  basico: {
    gradient: "from-slate-200/20 via-silver-300/10 to-transparent",
    glow: "shadow-[0_0_30px_rgba(192,192,192,0.25)]",
    accent: "text-slate-200"
  },
  intermedio: {
    gradient: "from-silver-300/30 via-cyan-400/10 to-transparent",
    glow: "shadow-[0_0_35px_rgba(120,200,255,0.25)]",
    accent: "text-cyan-300"
  },
  avanzado: {
    gradient: "from-silver-400/40 via-violet-400/15 to-transparent",
    glow: "shadow-[0_0_40px_rgba(180,140,255,0.35)]",
    accent: "text-violet-300"
  }
};

export const VIDEO_TUTORIALS: (VideoTutorial & {
  visualStyle: TutorialVisualStyle;
  cinematicIntro?: boolean;
  recommended?: boolean;
})[] = [
  // ───────────────────────── INICIO ─────────────────────────
  {
    id: "tut-001",
    title: "Bienvenido a TAMV Online",
    description:
      "Descubre la primera arquitectura civilizatoria digital de LATAM y da tus primeros pasos.",
    category: "inicio",
    videoUrl: "https://example.com/tutorials/welcome",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225",
    durationSeconds: 480,
    level: "basico",
    cinematicIntro: true,
    recommended: true,
    visualStyle: TUTORIAL_LEVEL_STYLES.basico
  },
  {
    id: "tut-002",
    title: "Configura tu perfil TAMV",
    description:
      "Personaliza tu identidad digital y optimiza tu presencia dentro del ecosistema.",
    category: "inicio",
    videoUrl: "https://example.com/tutorials/profile",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=225",
    durationSeconds: 360,
    level: "basico",
    visualStyle: TUTORIAL_LEVEL_STYLES.basico
  },

  // ───────────────────── CREACIÓN DE CONTENIDO ─────────────────────
  {
    id: "tut-003",
    title: "Crea tu primer post",
    description:
      "Publica ideas, imágenes y contenido multimedia dentro de TAMV.",
    category: "creacionContenido",
    videoUrl: "https://example.com/tutorials/first-post",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225",
    durationSeconds: 300,
    level: "basico",
    visualStyle: TUTORIAL_LEVEL_STYLES.basico
  },
  {
    id: "tut-004",
    title: "Organiza un Concierto Sensorial",
    description:
      "Crea experiencias musicales inmersivas con audio 3D y visuales avanzados.",
    category: "creacionContenido",
    videoUrl: "https://example.com/tutorials/sensory-concert",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=225",
    durationSeconds: 720,
    level: "intermedio",
    cinematicIntro: true,
    visualStyle: TUTORIAL_LEVEL_STYLES.intermedio
  },

  // ───────────────────────── EXPERIENCIAS ─────────────────────────
  {
    id: "tut-005",
    title: "Explora los DreamSpaces",
    description:
      "Viaja por espacios virtuales creados por la comunidad TAMV.",
    category: "experiencias",
    videoUrl: "https://example.com/tutorials/dreamspaces",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225",
    durationSeconds: 540,
    level: "basico",
    visualStyle: TUTORIAL_LEVEL_STYLES.basico
  },
  {
    id: "tut-006",
    title: "Crea tu DreamSpace",
    description:
      "Diseña y construye espacios virtuales únicos con herramientas intuitivas.",
    category: "experiencias",
    videoUrl: "https://example.com/tutorials/create-dreamspace",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=225",
    durationSeconds: 900,
    level: "avanzado",
    visualStyle: TUTORIAL_LEVEL_STYLES.avanzado
  },

  // ───────────────────── PUENTES ONÍRICOS ─────────────────────
  {
    id: "tut-007",
    title: "Puentes Oníricos: Conecta talentos",
    description:
      "El sistema inteligente que une perfiles creativos compatibles.",
    category: "puentesOniricos",
    videoUrl: "https://example.com/tutorials/puentes-oniricos",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=225",
    durationSeconds: 480,
    level: "intermedio",
    visualStyle: TUTORIAL_LEVEL_STYLES.intermedio
  },
  {
    id: "tut-008",
    title: "Inicia un proyecto colaborativo",
    description:
      "Crea equipos multidisciplinarios y gestiona proyectos creativos.",
    category: "puentesOniricos",
    videoUrl: "https://example.com/tutorials/collaborative-projects",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225",
    durationSeconds: 600,
    level: "intermedio",
    visualStyle: TUTORIAL_LEVEL_STYLES.intermedio
  },

  // ───────────────────────── MONETIZACIÓN ─────────────────────────
  {
    id: "tut-009",
    title: "Monetiza tu contenido",
    description:
      "Activa membresías, tips y ventas dentro del ecosistema TAMV.",
    category: "monetizacion",
    videoUrl: "https://example.com/tutorials/monetization",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=225",
    durationSeconds: 660,
    level: "intermedio",
    recommended: true,
    visualStyle: TUTORIAL_LEVEL_STYLES.intermedio
  },
  {
    id: "tut-010",
    title: "Banco TAMV y Wallet",
    description:
      "Gestiona activos digitales, retiros y comisiones de forma segura.",
    category: "monetizacion",
    videoUrl: "https://example.com/tutorials/banco-tamv",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=225",
    durationSeconds: 540,
    level: "basico",
    visualStyle: TUTORIAL_LEVEL_STYLES.basico
  }
];
