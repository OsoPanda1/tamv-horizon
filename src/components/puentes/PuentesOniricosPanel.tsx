import { Users, Sparkles, MessageCircle, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { COLLABORATION_MATCHES, MOCK_USERS } from "@/data/mockData";
import { initiateConnection } from "@/modules/puentesOniricos/matching";

export default function PuentesOniricosPanel() {
  const handleConnect = (matchId: string) => {
    initiateConnection(matchId);
    // In production, this would open a chat or group creation flow
  };

  return (
    <section id="tamv-puentes" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <div>
            <h2 className="font-bold text-lg">Puentes Oníricos</h2>
            <p className="text-xs text-muted-foreground">Conexiones que transforman ideas en realidad</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Ver más
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Collaboration Matches */}
      <div className="space-y-4">
        {COLLABORATION_MATCHES.map((match) => (
          <div key={match.id} className="card-tamv-featured p-4">
            {/* Match Score */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium px-2 py-1 bg-accent/20 text-accent rounded-full">
                {match.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-bold text-primary">{match.matchScore}%</span>
                <span className="text-xs text-muted-foreground">compatibilidad</span>
              </div>
            </div>

            {/* Users */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {match.users.map((user, index) => (
                <div key={user.id} className="flex flex-col items-center">
                  <Avatar className="h-16 w-16 border-2 border-primary/30">
                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-sm mt-2">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                  
                  {index < match.users.length - 1 && (
                    <div className="absolute">
                      <div className="w-8 h-px bg-gradient-to-r from-primary to-accent" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Complementary Skills */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Habilidades complementarias:</p>
              <div className="flex flex-wrap gap-2">
                {match.complementarySkills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-2 py-1 text-xs bg-muted rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Project */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 mb-4">
              <p className="text-xs text-muted-foreground mb-1">Proyecto sugerido:</p>
              <p className="text-sm font-medium">{match.suggestedProject}</p>
            </div>

            {/* Action */}
            <Button 
              className="w-full btn-tamv-cyan"
              onClick={() => handleConnect(match.id)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Conectar y crear proyecto
            </Button>
          </div>
        ))}
      </div>

      {/* Your Profile Summary for Matching */}
      <div className="card-tamv p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={MOCK_USERS[0].avatar} alt="Tu perfil" />
            <AvatarFallback>TU</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Tu perfil de colaboración</p>
            <p className="text-xs text-muted-foreground">Optimiza para mejores matches</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Perfil completo</span>
              <span className="text-primary">75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          <div className="flex flex-wrap gap-2">
            {MOCK_USERS[0].skills.slice(0, 4).map((skill) => (
              <span key={skill} className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full mt-4 btn-tamv-ghost">
          Mejorar perfil
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </section>
  );
}
