import { TamvUserProfile, CollaborationMatch } from "@/types/tamv";
import { MOCK_USERS, COLLABORATION_MATCHES } from "@/data/mockData";

export interface MatchCriteria {
  skills: string[];
  interests: string[];
  goals: string[];
}

export function matchCollaborators(
  user: TamvUserProfile,
  candidates: TamvUserProfile[] = MOCK_USERS
): CollaborationMatch[] {
  const matches: CollaborationMatch[] = [];
  
  // Filter out the current user
  const otherUsers = candidates.filter(u => u.id !== user.id);
  
  for (const candidate of otherUsers) {
    const matchResult = calculateMatchScore(user, candidate);
    
    if (matchResult.score >= 50) {
      matches.push({
        id: `match-${user.id}-${candidate.id}`,
        users: [user, candidate],
        matchScore: matchResult.score,
        complementarySkills: matchResult.complementarySkills,
        suggestedProject: matchResult.suggestedProject,
        category: matchResult.category
      });
    }
  }
  
  // Sort by match score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

function calculateMatchScore(user1: TamvUserProfile, user2: TamvUserProfile): {
  score: number;
  complementarySkills: string[];
  suggestedProject: string;
  category: string;
} {
  let score = 0;
  const complementarySkills: string[] = [];
  
  // Find complementary skills (skills one has that the other doesn't)
  const user1UniqueSkills = user1.skills.filter(s => !user2.skills.includes(s));
  const user2UniqueSkills = user2.skills.filter(s => !user1.skills.includes(s));
  
  // More complementary skills = higher score
  score += Math.min(user1UniqueSkills.length, 3) * 10;
  score += Math.min(user2UniqueSkills.length, 3) * 10;
  
  complementarySkills.push(...user1UniqueSkills.slice(0, 2));
  complementarySkills.push(...user2UniqueSkills.slice(0, 2));
  
  // Find shared interests
  const sharedInterests = user1.interests.filter(i => user2.interests.includes(i));
  score += sharedInterests.length * 15;
  
  // Find aligned goals
  const alignedGoals = user1.goals.filter(g => 
    user2.goals.some(g2 => 
      g.toLowerCase().includes(g2.toLowerCase().split(" ")[0]) ||
      g2.toLowerCase().includes(g.toLowerCase().split(" ")[0])
    )
  );
  score += alignedGoals.length * 20;
  
  // Suggest project based on skills combination
  const { project, category } = suggestProject(user1, user2, sharedInterests);
  
  return {
    score: Math.min(score, 100),
    complementarySkills,
    suggestedProject: project,
    category
  };
}

function suggestProject(
  user1: TamvUserProfile,
  user2: TamvUserProfile,
  sharedInterests: string[]
): { project: string; category: string } {
  const allSkills = [...user1.skills, ...user2.skills].map(s => s.toLowerCase());
  const allGoals = [...user1.goals, ...user2.goals].join(" ").toLowerCase();
  
  // Project suggestions based on skill combinations
  if (allSkills.some(s => s.includes("medicina") || s.includes("salud")) && 
      allSkills.some(s => s.includes("react") || s.includes("desarrollo") || s.includes("node"))) {
    return {
      project: "App de seguimiento de salud con IA",
      category: "Salud Digital"
    };
  }
  
  if (allSkills.some(s => s.includes("arte") || s.includes("3d") || s.includes("animación")) && 
      allSkills.some(s => s.includes("web3") || s.includes("blockchain"))) {
    return {
      project: "Galería NFT interactiva con experiencias XR",
      category: "Arte & Tecnología"
    };
  }
  
  if (allSkills.some(s => s.includes("música") || s.includes("audio")) && 
      allSkills.some(s => s.includes("xr") || s.includes("3d"))) {
    return {
      project: "Concierto sensorial inmersivo con visuales generativos",
      category: "Entretenimiento XR"
    };
  }
  
  if (allGoals.includes("educación") || allGoals.includes("curso") || allGoals.includes("enseñar")) {
    return {
      project: "Plataforma educativa con gamificación",
      category: "Educación"
    };
  }
  
  // Default based on shared interests
  if (sharedInterests.length > 0) {
    return {
      project: `Proyecto colaborativo en ${sharedInterests[0]}`,
      category: sharedInterests[0]
    };
  }
  
  return {
    project: "Explorar oportunidades de colaboración",
    category: "General"
  };
}

export function getTopMatches(userId: string, limit: number = 5): CollaborationMatch[] {
  // In production, this would fetch from API
  // For now, return mock matches filtered by user
  return COLLABORATION_MATCHES
    .filter(m => m.users.some(u => u.id === userId) || true) // Show all for demo
    .slice(0, limit);
}

export function initiateConnection(matchId: string): void {
  // Audit log for connection initiation
  console.log(`[AUDIT] Puentes Oníricos: Connection initiated for match ${matchId}`, {
    timestamp: new Date().toISOString(),
    eventType: "collaboration_connection"
  });
}
