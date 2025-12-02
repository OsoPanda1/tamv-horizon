import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  xpReward: number;
  unlockedAt?: Date;
}

export interface UserLevel {
  level: number;
  xp: number;
  xpToNext: number;
  title: string;
}

export interface HoyoNegroStats {
  reposAbsorbed: number;
  codeQuality: number;
  contributionStreak: number;
  innovationScore: number;
}

export function useGamification(userId?: string) {
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    title: "Aprendiz TAMV"
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [hoyoNegroStats, setHoyoNegroStats] = useState<HoyoNegroStats>({
    reposAbsorbed: 0,
    codeQuality: 0,
    contributionStreak: 0,
    innovationScore: 0,
  });
  const { toast } = useToast();

  const calculateLevel = useCallback((totalXp: number) => {
    // Fórmula exponencial para niveles
    const level = Math.floor(Math.sqrt(totalXp / 50)) + 1;
    const xpForCurrentLevel = Math.pow(level - 1, 2) * 50;
    const xpForNextLevel = Math.pow(level, 2) * 50;
    const xpToNext = xpForNextLevel - totalXp;

    const titles = [
      "Aprendiz TAMV",
      "Explorador Digital",
      "Arquitecto de Mundos",
      "Maestro Creativo",
      "Leyenda TAMV",
      "Guardián del Nexus",
      "Sabio del Metaverso",
      "Creador Supremo"
    ];

    return {
      level,
      xp: totalXp,
      xpToNext,
      title: titles[Math.min(level - 1, titles.length - 1)]
    };
  }, []);

  const addXP = useCallback(async (amount: number, reason: string) => {
    if (!userId) return;

    try {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("xp")
        .eq("user_id", userId)
        .single();

      if (fetchError) throw fetchError;

      const currentXp = profile?.xp || 0;
      const newXp = currentXp + amount;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ xp: newXp })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      const oldLevel = calculateLevel(currentXp);
      const newLevel = calculateLevel(newXp);

      setUserLevel(newLevel);

      // Notificación de XP ganado
      toast({
        title: `+${amount} XP`,
        description: reason,
      });

      // Si subió de nivel
      if (newLevel.level > oldLevel.level) {
        toast({
          title: "¡Nivel Alcanzado! 🎉",
          description: `Ahora eres ${newLevel.title} (Nivel ${newLevel.level})`,
        });

        // Crear notificación de nivel
        await supabase.from("notifications").insert([{
          user_id: userId,
          title: `¡Nivel ${newLevel.level} Alcanzado!`,
          message: `Ahora eres ${newLevel.title}`,
          type: "achievement",
          icon: "🎉"
        }]);
      }
    } catch (error) {
      console.error("Error adding XP:", error);
    }
  }, [userId, calculateLevel, toast]);

  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (!userId) return;

    try {
      // Verificar si ya está desbloqueado
      const existing = achievements.find(a => a.id === achievementId && a.unlockedAt);
      if (existing) return;

      // Aquí iría la lógica de desbloqueo real
      // Por ahora simulamos
      const achievement: Achievement = {
        id: achievementId,
        name: "Primer Paso",
        description: "Completaste tu primer tutorial",
        icon: "🏆",
        rarity: "common",
        xpReward: 50,
        unlockedAt: new Date()
      };

      setAchievements(prev => [...prev, achievement]);
      
      toast({
        title: "¡Logro Desbloqueado! 🏆",
        description: achievement.name,
      });

      await addXP(achievement.xpReward, `Logro: ${achievement.name}`);

      // Crear notificación
      await supabase.from("notifications").insert([{
        user_id: userId,
        title: `¡Logro Desbloqueado!`,
        message: achievement.name,
        type: "achievement",
        icon: achievement.icon
      }]);
    } catch (error) {
      console.error("Error unlocking achievement:", error);
    }
  }, [userId, achievements, addXP, toast]);

  const updateHoyoNegroStats = useCallback((stats: Partial<HoyoNegroStats>) => {
    setHoyoNegroStats(prev => ({ ...prev, ...stats }));
  }, []);

  useEffect(() => {
    if (userId) {
      // Cargar stats del usuario
      supabase
        .from("profiles")
        .select("xp, level")
        .eq("user_id", userId)
        .single()
        .then(({ data }) => {
          if (data) {
            setUserLevel(calculateLevel(data.xp || 0));
          }
        });
    }
  }, [userId, calculateLevel]);

  return {
    userLevel,
    achievements,
    hoyoNegroStats,
    addXP,
    unlockAchievement,
    updateHoyoNegroStats,
  };
}
