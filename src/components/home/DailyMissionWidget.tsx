import { useState, useEffect } from "react";
import { Target, Check, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DAILY_MISSIONS } from "@/data/mockData";
import { DailyMission } from "@/types/tamv";

const MISSION_STORAGE_KEY = "tamv_daily_mission_state";

export default function DailyMissionWidget() {
  const [currentMission, setCurrentMission] = useState<DailyMission | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check localStorage for today's mission state
    const today = new Date().toDateString();
    const stored = localStorage.getItem(MISSION_STORAGE_KEY);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.date === today) {
          setCurrentMission(data.mission);
          setIsCompleted(data.completed);
          return;
        }
      } catch {
        // Invalid data, reset
      }
    }
    
    // Select random mission for today
    const randomMission = DAILY_MISSIONS[Math.floor(Math.random() * DAILY_MISSIONS.length)];
    setCurrentMission(randomMission);
    localStorage.setItem(MISSION_STORAGE_KEY, JSON.stringify({
      date: today,
      mission: randomMission,
      completed: false
    }));
  }, []);

  const handleCompleteMission = () => {
    if (!currentMission) return;
    
    setIsCompleted(true);
    localStorage.setItem(MISSION_STORAGE_KEY, JSON.stringify({
      date: new Date().toDateString(),
      mission: currentMission,
      completed: true
    }));

    // In production, this would call the backend to award rewards
    console.log("[AUDIT] Daily mission completed:", currentMission.id);
  };

  if (!currentMission) return null;

  return (
    <div className="card-tamv-featured p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-primary/20">
          <Target className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Misión del día</h3>
          <p className="text-xs text-muted-foreground">
            {isCompleted ? "¡Completada!" : "Completa para ganar"}
          </p>
        </div>
      </div>

      <div className={`p-3 rounded-lg mb-3 ${isCompleted ? "bg-accent/10" : "bg-muted/30"}`}>
        <h4 className="font-medium text-sm mb-1">{currentMission.title}</h4>
        <p className="text-xs text-muted-foreground">{currentMission.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            {currentMission.reward}
          </span>
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-2 text-accent">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Completada</span>
          </div>
        ) : (
          <Button 
            size="sm" 
            className="btn-tamv-gold"
            onClick={handleCompleteMission}
          >
            Cumplir
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
