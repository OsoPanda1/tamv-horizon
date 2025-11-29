import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Algoritmo de matching colaborativo para Puentes Oníricos
function calculateMatchScore(
  userA: { skills: string[]; interests: string[]; goals: string[] },
  userB: { skills: string[]; interests: string[]; goals: string[] }
): {
  score: number;
  complementarySkills: string[];
  commonInterests: string[];
  alignedGoals: string[];
} {
  // Skills complementarios (A tiene lo que B no tiene)
  const complementarySkills = userB.skills.filter(
    skill => !userA.skills.includes(skill)
  );
  
  // Intereses comunes
  const commonInterests = userA.interests.filter(
    interest => userB.interests.includes(interest)
  );
  
  // Goals alineados
  const alignedGoals = userA.goals.filter(
    goal => userB.goals.some(bGoal => 
      bGoal.toLowerCase().includes(goal.toLowerCase()) ||
      goal.toLowerCase().includes(bGoal.toLowerCase())
    )
  );

  // Calcular score (0-100)
  const complementScore = Math.min(complementarySkills.length * 15, 40);
  const interestScore = Math.min(commonInterests.length * 10, 30);
  const goalScore = Math.min(alignedGoals.length * 15, 30);
  
  const totalScore = complementScore + interestScore + goalScore;

  return {
    score: Math.min(totalScore, 100),
    complementarySkills,
    commonInterests,
    alignedGoals
  };
}

// Generar sugerencia de proyecto basada en skills combinados
function suggestProject(
  skillsA: string[],
  skillsB: string[],
  commonInterests: string[]
): string {
  const allSkills = [...new Set([...skillsA, ...skillsB])];
  
  // Categorías de proyectos basadas en combinaciones de skills
  const projectSuggestions: Record<string, string> = {
    "programación+diseño": "Crear una experiencia XR interactiva para el metaverso TAMV",
    "música+visuales": "Producir un concierto sensorial con visuales generativos",
    "escritura+arte": "Desarrollar una novela gráfica interactiva para DreamSpaces",
    "marketing+tecnología": "Lanzar una campaña de NFTs con storytelling innovador",
    "educación+desarrollo": "Crear un curso interactivo con gamificación en TAMV",
    "finanzas+programación": "Desarrollar herramientas de análisis para el Banco TAMV",
    "salud+tecnología": "Diseñar experiencias de meditación XR inmersivas",
    "default": "Colaborar en un proyecto creativo multidisciplinario en TAMV"
  };

  // Buscar la mejor combinación
  for (const [combo, suggestion] of Object.entries(projectSuggestions)) {
    const comboSkills = combo.split("+");
    if (comboSkills.every(skill => 
      allSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    )) {
      return suggestion;
    }
  }

  // Si hay intereses comunes, personalizar
  if (commonInterests.length > 0) {
    return `Crear una experiencia colaborativa enfocada en ${commonInterests[0]}`;
  }

  return projectSuggestions.default;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, action = "find_matches", targetId, message, projectIdea } = await req.json();

    if (!userId) {
      throw new Error("userId is required");
    }

    // Obtener perfil del usuario
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    if (action === "find_matches") {
      // Buscar usuarios potenciales para matching
      const { data: candidates } = await supabase
        .from("profiles")
        .select("*")
        .neq("user_id", userId)
        .limit(50);

      if (!candidates) {
        return new Response(
          JSON.stringify({ matches: [], message: "No candidates found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Calcular matches
      const matches = candidates
        .map(candidate => {
          const matchResult = calculateMatchScore(
            {
              skills: userProfile.skills || [],
              interests: userProfile.interests || [],
              goals: userProfile.goals || []
            },
            {
              skills: candidate.skills || [],
              interests: candidate.interests || [],
              goals: candidate.goals || []
            }
          );

          const suggestedProject = suggestProject(
            userProfile.skills || [],
            candidate.skills || [],
            matchResult.commonInterests
          );

          return {
            userId: candidate.user_id,
            profile: {
              username: candidate.username,
              displayName: candidate.display_name,
              avatar: candidate.avatar_url,
              skills: candidate.skills,
              interests: candidate.interests,
              level: candidate.level
            },
            matchScore: matchResult.score,
            complementarySkills: matchResult.complementarySkills,
            commonInterests: matchResult.commonInterests,
            alignedGoals: matchResult.alignedGoals,
            suggestedProject
          };
        })
        .filter(match => match.matchScore >= 30) // Solo matches con score >= 30
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10); // Top 10 matches

      console.log(`[PUENTES] User: ${userId.slice(0, 8)}... | Matches found: ${matches.length}`);

      return new Response(
        JSON.stringify({
          matches,
          totalCandidates: candidates.length,
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (action === "send_request") {
      // Enviar solicitud de colaboración
      if (!targetId) {
        throw new Error("targetId is required for send_request");
      }

      // Calcular match score
      const { data: targetProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", targetId)
        .single();

      if (!targetProfile) {
        throw new Error("Target user not found");
      }

      const matchResult = calculateMatchScore(
        {
          skills: userProfile.skills || [],
          interests: userProfile.interests || [],
          goals: userProfile.goals || []
        },
        {
          skills: targetProfile.skills || [],
          interests: targetProfile.interests || [],
          goals: targetProfile.goals || []
        }
      );

      const suggestedProject = projectIdea || suggestProject(
        userProfile.skills || [],
        targetProfile.skills || [],
        matchResult.commonInterests
      );

      // Crear solicitud
      const { data: request, error } = await supabase
        .from("collaboration_requests")
        .insert({
          requester_id: userId,
          target_id: targetId,
          project_idea: suggestedProject,
          message: message || `¡Hola! Me encantaría colaborar contigo en un proyecto. Tu perfil tiene skills que complementan los míos.`,
          match_score: matchResult.score,
          complementary_skills: matchResult.complementarySkills
        })
        .select()
        .single();

      if (error) throw error;

      // Notificar al usuario objetivo
      await supabase.from("notifications").insert({
        user_id: targetId,
        type: "social",
        title: "Nueva solicitud de colaboración",
        message: `${userProfile.display_name || userProfile.username} quiere colaborar contigo en Puentes Oníricos`,
        action_url: `/puentes-oniricos?request=${request.id}`,
        icon: "users"
      });

      console.log(`[PUENTES] Request sent: ${userId.slice(0, 8)}... -> ${targetId.slice(0, 8)}... | Score: ${matchResult.score}`);

      return new Response(
        JSON.stringify({
          success: true,
          requestId: request.id,
          matchScore: matchResult.score,
          suggestedProject,
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (action === "respond_request") {
      // Responder a solicitud (aceptar/rechazar)
      const { requestId, accepted } = await req.json();

      if (!requestId) {
        throw new Error("requestId is required");
      }

      const { data: request, error } = await supabase
        .from("collaboration_requests")
        .update({
          status: accepted ? "accepted" : "rejected",
          responded_at: new Date().toISOString()
        })
        .eq("id", requestId)
        .eq("target_id", userId)
        .select()
        .single();

      if (error) throw error;

      // Notificar al solicitante
      await supabase.from("notifications").insert({
        user_id: request.requester_id,
        type: "social",
        title: accepted ? "¡Colaboración aceptada!" : "Solicitud de colaboración",
        message: accepted 
          ? `${userProfile.display_name || userProfile.username} ha aceptado colaborar contigo`
          : `Tu solicitud de colaboración no fue aceptada esta vez`,
        action_url: accepted ? `/puentes-oniricos?collaboration=${request.id}` : undefined,
        icon: accepted ? "check-circle" : "x-circle"
      });

      return new Response(
        JSON.stringify({
          success: true,
          requestId,
          status: accepted ? "accepted" : "rejected",
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error("Puentes matching error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Matching failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
