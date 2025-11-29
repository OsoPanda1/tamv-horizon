import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Algoritmo de Collaborative Filtering simplificado
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, type = "all", limit = 10 } = await req.json();

    if (!userId) {
      throw new Error("userId is required");
    }

    // Obtener interacciones del usuario
    const { data: userInteractions } = await supabase
      .from("user_interactions")
      .select("entity_type, entity_id, interaction_type, weight")
      .eq("user_id", userId);

    // Obtener perfil del usuario
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("skills, interests, goals")
      .eq("user_id", userId)
      .single();

    const recommendations: Array<{
      type: string;
      id: string;
      score: number;
      reason: string;
      data: Record<string, unknown>;
    }> = [];

    // 1. Recomendaciones de Conciertos
    if (type === "all" || type === "concerts") {
      const { data: concerts } = await supabase
        .from("concerts")
        .select("id, title, description, cover_image, start_time, ticket_price, tags, current_attendees, creator_id")
        .in("status", ["scheduled", "live"])
        .order("start_time", { ascending: true })
        .limit(20);

      if (concerts) {
        for (const concert of concerts) {
          let score = 0.5; // Base score
          
          // Boost por tags coincidentes con intereses
          if (userProfile?.interests && concert.tags) {
            const matchingTags = concert.tags.filter((tag: string) => 
              userProfile.interests.some((i: string) => i.toLowerCase().includes(tag.toLowerCase()))
            );
            score += matchingTags.length * 0.1;
          }
          
          // Boost por popularidad
          score += Math.min(concert.current_attendees / 1000, 0.2);
          
          // Boost por proximidad temporal (próximas 48h)
          const hoursUntil = (new Date(concert.start_time).getTime() - Date.now()) / (1000 * 60 * 60);
          if (hoursUntil > 0 && hoursUntil < 48) {
            score += 0.15;
          }

          recommendations.push({
            type: "concert",
            id: concert.id,
            score: Math.min(score, 1),
            reason: "Basado en tus intereses musicales",
            data: concert
          });
        }
      }
    }

    // 2. Recomendaciones de DreamSpaces
    if (type === "all" || type === "dreamspaces") {
      const { data: spaces } = await supabase
        .from("dreamspaces")
        .select("id, name, description, cover_image, entry_price, visitors_count, rating, tags, owner_id")
        .eq("is_public", true)
        .order("visitors_count", { ascending: false })
        .limit(20);

      if (spaces) {
        for (const space of spaces) {
          let score = 0.4;
          
          // Boost por rating
          score += (space.rating || 0) * 0.1;
          
          // Boost por tags coincidentes
          if (userProfile?.interests && space.tags) {
            const matchingTags = space.tags.filter((tag: string) =>
              userProfile.interests.some((i: string) => i.toLowerCase().includes(tag.toLowerCase()))
            );
            score += matchingTags.length * 0.1;
          }

          recommendations.push({
            type: "dreamspace",
            id: space.id,
            score: Math.min(score, 1),
            reason: "Espacio virtual popular",
            data: space
          });
        }
      }
    }

    // 3. Recomendaciones de Subastas
    if (type === "all" || type === "auctions") {
      const { data: auctions } = await supabase
        .from("auctions")
        .select("id, title, description, image_url, starting_price, current_bid, end_time, category, tags, bid_count")
        .eq("status", "active")
        .order("end_time", { ascending: true })
        .limit(20);

      if (auctions) {
        for (const auction of auctions) {
          let score = 0.4;
          
          // Boost por actividad de pujas
          score += Math.min(auction.bid_count / 50, 0.2);
          
          // Boost por categoría coincidente con intereses
          if (userProfile?.interests && auction.category) {
            if (userProfile.interests.some((i: string) => i.toLowerCase().includes(auction.category.toLowerCase()))) {
              score += 0.2;
            }
          }

          recommendations.push({
            type: "auction",
            id: auction.id,
            score: Math.min(score, 1),
            reason: "Subasta activa que podría interesarte",
            data: auction
          });
        }
      }
    }

    // 4. Recomendaciones de Grupos
    if (type === "all" || type === "groups") {
      const { data: groups } = await supabase
        .from("groups")
        .select("id, name, description, avatar_url, category, member_count, is_paid, price")
        .eq("is_private", false)
        .order("member_count", { ascending: false })
        .limit(20);

      if (groups) {
        for (const group of groups) {
          let score = 0.3;
          
          // Boost por popularidad
          score += Math.min(group.member_count / 10000, 0.3);
          
          // Boost por categoría
          if (userProfile?.interests && group.category) {
            if (userProfile.interests.some((i: string) => i.toLowerCase().includes(group.category.toLowerCase()))) {
              score += 0.25;
            }
          }

          recommendations.push({
            type: "group",
            id: group.id,
            score: Math.min(score, 1),
            reason: "Comunidad activa en tu área de interés",
            data: group
          });
        }
      }
    }

    // 5. Recomendaciones de Creadores (para Puentes Oníricos)
    if (type === "all" || type === "creators") {
      const { data: creators } = await supabase
        .from("profiles")
        .select("id, user_id, username, display_name, avatar_url, skills, interests, followers_count, level")
        .neq("user_id", userId)
        .order("followers_count", { ascending: false })
        .limit(30);

      if (creators && userProfile) {
        for (const creator of creators) {
          let score = 0.3;
          
          // Calcular complementariedad de skills
          if (userProfile.skills && creator.skills) {
            const complementarySkills = creator.skills.filter((s: string) => 
              !userProfile.skills.includes(s)
            );
            score += Math.min(complementarySkills.length * 0.1, 0.3);
          }
          
          // Boost por intereses similares
          if (userProfile.interests && creator.interests) {
            const commonInterests = creator.interests.filter((i: string) =>
              userProfile.interests.includes(i)
            );
            score += Math.min(commonInterests.length * 0.05, 0.2);
          }
          
          // Boost por nivel
          score += Math.min((creator.level || 1) * 0.02, 0.1);

          if (score > 0.4) {
            recommendations.push({
              type: "creator",
              id: creator.user_id,
              score: Math.min(score, 1),
              reason: "Colaborador potencial con skills complementarios",
              data: creator
            });
          }
        }
      }
    }

    // Ordenar por score y limitar
    recommendations.sort((a, b) => b.score - a.score);
    const finalRecommendations = recommendations.slice(0, limit);

    // Guardar recomendaciones en BD para análisis
    if (finalRecommendations.length > 0) {
      const toInsert = finalRecommendations.map(r => ({
        user_id: userId,
        entity_type: r.type,
        entity_id: r.id,
        score: r.score,
        reason: r.reason,
        algorithm: "collaborative_filtering_v1",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }));

      await supabase.from("recommendations").upsert(toInsert, { onConflict: "user_id,entity_type,entity_id" });
    }

    console.log(`[RECOMMENDATIONS] User: ${userId.slice(0, 8)}... | Generated: ${finalRecommendations.length}`);

    return new Response(
      JSON.stringify({
        recommendations: finalRecommendations,
        totalGenerated: recommendations.length,
        algorithm: "collaborative_filtering_v1",
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Recommendations error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error generating recommendations" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
