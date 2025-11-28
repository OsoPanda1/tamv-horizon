import { Trophy, Clock, Users, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CHALLENGES } from "@/data/mockData";

export default function ChallengesSection() {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      creative: "bg-purple-500/20 text-purple-400",
      social: "bg-blue-500/20 text-blue-400",
      economic: "bg-green-500/20 text-green-400",
      learning: "bg-orange-500/20 text-orange-400"
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      creative: "Creativo",
      social: "Social",
      economic: "Económico",
      learning: "Aprendizaje"
    };
    return labels[category] || category;
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 1) return `${days} días`;
    if (days === 1) return "1 día";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} horas`;
    
    return "Terminando pronto";
  };

  return (
    <section id="tamv-challenges" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-lg">Retos y Concursos</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Ver todos
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CHALLENGES.map((challenge, index) => (
          <div 
            key={challenge.id}
            className={`card-tamv p-4 transition-all hover:border-primary/30 ${
              index === 0 ? "animate-glow-pulse" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(challenge.category)}`}>
                {getCategoryLabel(challenge.category)}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {getTimeRemaining(challenge.endDate)}
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="font-semibold mb-1">{challenge.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {challenge.shortDescription}
            </p>

            {/* Progress */}
            {challenge.progressPercent > 0 && (
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Tu progreso</span>
                  <span className="text-primary font-medium">{challenge.progressPercent}%</span>
                </div>
                <Progress value={challenge.progressPercent} className="h-2" />
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {challenge.participants.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Sparkles className="h-3 w-3" />
                  {challenge.reward}
                </span>
              </div>
              
              <Button size="sm" className={challenge.progressPercent > 0 ? "btn-tamv-ghost" : "btn-tamv-gold"}>
                {challenge.progressPercent > 0 ? "Continuar" : "Unirme"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
