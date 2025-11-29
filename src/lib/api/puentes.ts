import { supabase } from "@/integrations/supabase/client";

export interface CollaboratorMatch {
  userId: string;
  profile: {
    username: string;
    displayName: string;
    avatar: string;
    skills: string[];
    interests: string[];
    level: number;
  };
  matchScore: number;
  complementarySkills: string[];
  commonInterests: string[];
  alignedGoals: string[];
  suggestedProject: string;
}

export interface CollaborationRequest {
  id: string;
  requesterId: string;
  targetId: string;
  projectIdea: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  matchScore: number;
  complementarySkills: string[];
  createdAt: string;
  respondedAt?: string;
}

// Encontrar matches para Puentes Oníricos
export async function findMatches(userId: string): Promise<CollaboratorMatch[]> {
  const { data, error } = await supabase.functions.invoke("puentes-matching", {
    body: { userId, action: "find_matches" }
  });

  if (error) {
    console.error("Error finding matches:", error);
    return [];
  }

  return data.matches || [];
}

// Enviar solicitud de colaboración
export async function sendCollaborationRequest(
  userId: string,
  targetId: string,
  message?: string,
  projectIdea?: string
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke("puentes-matching", {
    body: {
      userId,
      targetId,
      message,
      projectIdea,
      action: "send_request"
    }
  });

  if (error) {
    console.error("Error sending request:", error);
    return { success: false, error: error.message };
  }

  return { success: true, requestId: data.requestId };
}

// Responder a solicitud
export async function respondToRequest(
  userId: string,
  requestId: string,
  accepted: boolean
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase.functions.invoke("puentes-matching", {
    body: {
      userId,
      requestId,
      accepted,
      action: "respond_request"
    }
  });

  if (error) {
    console.error("Error responding to request:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Obtener solicitudes pendientes
export async function getPendingRequests(userId: string): Promise<CollaborationRequest[]> {
  const { data, error } = await supabase
    .from("collaboration_requests")
    .select("*")
    .eq("target_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching requests:", error);
    return [];
  }

  return (data || []).map(r => ({
    id: r.id,
    requesterId: r.requester_id,
    targetId: r.target_id,
    projectIdea: r.project_idea || "",
    message: r.message || "",
    status: r.status as CollaborationRequest["status"],
    matchScore: Number(r.match_score) || 0,
    complementarySkills: r.complementary_skills || [],
    createdAt: r.created_at,
    respondedAt: r.responded_at || undefined
  }));
}

// Obtener colaboraciones activas
export async function getActiveCollaborations(userId: string): Promise<CollaborationRequest[]> {
  const { data, error } = await supabase
    .from("collaboration_requests")
    .select("*")
    .or(`requester_id.eq.${userId},target_id.eq.${userId}`)
    .eq("status", "accepted")
    .order("responded_at", { ascending: false });

  if (error) {
    console.error("Error fetching collaborations:", error);
    return [];
  }

  return (data || []).map(r => ({
    id: r.id,
    requesterId: r.requester_id,
    targetId: r.target_id,
    projectIdea: r.project_idea || "",
    message: r.message || "",
    status: r.status as CollaborationRequest["status"],
    matchScore: Number(r.match_score) || 0,
    complementarySkills: r.complementary_skills || [],
    createdAt: r.created_at,
    respondedAt: r.responded_at || undefined
  }));
}
