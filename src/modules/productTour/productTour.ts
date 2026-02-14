import { ProductTourStep, TourStepId } from "@/types/tamv";

export interface ProductTourState {
  isActive: boolean;
  currentStepIndex: number;
}

const STORAGE_KEY = "tamv_onboarding_status";

export const TAMV_TOUR_STEPS: ProductTourStep[] = [
  {
    id: "composer",
    targetSelector: "#tamv-composer",
    title: "Crea contenido en segundos",
    description: "Comparte ideas, imágenes, videos y más con la comunidad TAMV. Tu voz importa.",
    position: "top center"
  },
  {
    id: "experiences",
    targetSelector: "#tamv-experiences",
    title: "Experiencias inmersivas",
    description: "Explora conciertos sensoriales, DreamSpaces y subastas de arte digital único.",
    position: "right"
  },
  {
    id: "puentesOniricos",
    targetSelector: "#tamv-puentes",
    title: "Puentes Oníricos",
    description: "Conecta con talentos complementarios. Nuestro sistema de matching te ayuda a encontrar colaboradores ideales.",
    position: "right"
  },
  {
    id: "wallet",
    targetSelector: "#tamv-wallet",
    title: "Tu Banco TAMV",
    description: "Gestiona tus activos digitales, ganancias y realiza transacciones de forma segura.",
    position: "top center"
  },
  {
    id: "challenges",
    targetSelector: "#tamv-challenges",
    title: "Retos y recompensas",
    description: "Participa en desafíos creativos, completa misiones diarias y gana tokens TAMV.",
    position: "left"
  },
  {
    id: "grupos",
    targetSelector: "#tamv-grupos",
    title: "grupos sociales",
    description: "Crea grupos sociales y conecta con tu comunidad.",
    position: "left"
  }
];

export function shouldShowTour(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return true;
  try {
    const state = JSON.parse(stored);
    return !state.completed;
  } catch {
    return true;
  }
}

export function startTour(): ProductTourState {
  const newState: ProductTourState = { isActive: true, currentStepIndex: 0 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
}

export function nextStep(currentState: ProductTourState): ProductTourState {
  const nextIndex = currentState.currentStepIndex + 1;
  if (nextIndex >= TAMV_TOUR_STEPS.length) {
    return completeTour();
  }
  const newState: ProductTourState = { isActive: true, currentStepIndex: nextIndex };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
}

export function prevStep(currentState: ProductTourState): ProductTourState {
  const prevIndex = Math.max(0, currentState.currentStepIndex - 1);
  const newState: ProductTourState = { isActive: true, currentStepIndex: prevIndex };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
}

export function skipTour(): ProductTourState {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: true, skipped: true }));
  return { isActive: false, currentStepIndex: 0 };
}

export function completeTour(): ProductTourState {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: true, completedAt: new Date().toISOString() }));
  return { isActive: false, currentStepIndex: TAMV_TOUR_STEPS.length };
}

export function getCurrentStep(state: ProductTourState): ProductTourStep | null {
  if (!state.isActive || state.currentStepIndex >= TAMV_TOUR_STEPS.length) return null;
  return TAMV_TOUR_STEPS[state.currentStepIndex];
}

export function getStepProgress(state: ProductTourState): { current: number; total: number } {
  return { current: state.currentStepIndex + 1, total: TAMV_TOUR_STEPS.length };
}
