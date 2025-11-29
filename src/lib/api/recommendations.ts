import { supabase } from "@/integrations/supabase/client";

export interface Recommendation {
  type: "concert" | "dreamspace" | "auction" | "group" | "creator" | "channel";
  id: string;
  score: number;
  reason: string;
  data: Record<string, unknown>;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  totalGenerated: number;
  algorithm: string;
  timestamp: string;
}

// Obtener recomendaciones personalizadas
export async function getRecommendations(
  userId: string,
  type: "all" | "concerts" | "dreamspaces" | "auctions" | "groups" | "creators" = "all",
  limit = 10
): Promise<Recommendation[]> {
  const { data, error } = await supabase.functions.invoke("recommendations", {
    body: { userId, type, limit }
  });

  if (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }

  return data.recommendations || [];
}

// Registrar interacción para mejorar recomendaciones
export async function trackInteraction(
  userId: string,
  entityType: string,
  entityId: string,
  interactionType: "view" | "click" | "like" | "purchase" | "bookmark",
  weight = 1.0
): Promise<void> {
  const { error } = await supabase
    .from("user_interactions")
    .insert({
      user_id: userId,
      entity_type: entityType,
      entity_id: entityId,
      interaction_type: interactionType,
      weight
    });

  if (error) {
    console.error("Error tracking interaction:", error);
  }
}

// Obtener recomendaciones cacheadas
export async function getCachedRecommendations(userId: string): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .order("score", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching cached recommendations:", error);
    return [];
  }

  return (data || []).map(r => ({
    type: r.entity_type as Recommendation["type"],
    id: r.entity_id,
    score: Number(r.score),
    reason: r.reason || "",
    data: {}
  }));
}
