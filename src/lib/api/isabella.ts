import { supabase } from "@/integrations/supabase/client";

export interface IsabellaMessage {
  id: string;
  role: "user" | "isabella";
  content: string;
  emotion?: string;
  timestamp: string;
}

export interface IsabellaChatResponse {
  response: string;
  emotion: string;
  sessionId: string;
  timestamp: string;
}

export interface IsabellaSession {
  id: string;
  context?: string;
  emotion_state: string;
  message_count: number;
  is_active: boolean;
}

// Crear o obtener sesión activa
export async function getOrCreateSession(userId: string): Promise<IsabellaSession | null> {
  // Buscar sesión activa
  const { data: existingSession } = await supabase
    .from("isabella_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("last_activity", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSession) {
    return existingSession as IsabellaSession;
  }

  // Crear nueva sesión
  const { data: newSession, error } = await supabase
    .from("isabella_sessions")
    .insert({
      user_id: userId,
      context: "home",
      emotion_state: "neutral",
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating Isabella session:", error);
    return null;
  }

  return newSession as IsabellaSession;
}

// Enviar mensaje a Isabella
export async function sendMessageToIsabella(
  message: string,
  sessionId?: string,
  userId?: string,
  context?: string,
  quickAction?: string
): Promise<IsabellaChatResponse> {
  const { data, error } = await supabase.functions.invoke("isabella-chat", {
    body: {
      message,
      sessionId,
      userId,
      context,
      quickAction
    }
  });

  if (error) {
    console.error("Error calling Isabella:", error);
    throw new Error(error.message || "Error comunicándose con Isabella");
  }

  return data as IsabellaChatResponse;
}

// Obtener historial de mensajes
export async function getSessionMessages(sessionId: string): Promise<IsabellaMessage[]> {
  const { data, error } = await supabase
    .from("isabella_messages")
    .select("id, role, content, emotion, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return (data || []).map(msg => ({
    id: msg.id,
    role: msg.role as "user" | "isabella",
    content: msg.content,
    emotion: msg.emotion || "neutral",
    timestamp: msg.created_at
  }));
}

// Acciones rápidas disponibles
export const QUICK_ACTIONS = [
  { id: "challenge_idea", label: "Generar idea de reto", icon: "lightbulb" },
  { id: "collaboration", label: "Sugerir colaboración", icon: "users" },
  { id: "concert_help", label: "Ayuda con concierto", icon: "music" },
  { id: "dreamspace_idea", label: "Ideas DreamSpace", icon: "sparkles" },
  { id: "auction_guide", label: "Guía de subastas", icon: "gavel" },
  { id: "pet_advice", label: "Consejos mascotas", icon: "heart" }
];
