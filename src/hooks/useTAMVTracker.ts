import { useState, useRef, useCallback } from "react";
import type { TAMVCrum, EcgPattern } from "@/components/analytics/TAMVMonitor";

interface UseTAMVTrackerOptions {
  maxHistory?: number;
}

function calculateEcgPattern(navCount: number, durationMs: number): EcgPattern {
  const actionsPerMinute = durationMs > 0 ? (navCount / (durationMs / 60000)) : 0;
  if (actionsPerMinute > 20) return "overloaded";
  if (actionsPerMinute > 12) return "scattered";
  if (actionsPerMinute > 4) return "focused";
  return "stable";
}

export const useTAMVTracker = (
  currentModule: string,
  options: UseTAMVTrackerOptions = {}
) => {
  const { maxHistory = 32 } = options;
  const [history, setHistory] = useState<TAMVCrum[]>([]);
  const [navCount, setNavCount] = useState(0);
  const startTimeRef = useRef(Date.now());

  const trackAction = useCallback(
    (action: string, impactCredits = 0) => {
      const now = new Date();
      const duration = now.getTime() - startTimeRef.current;
      const pattern = calculateEcgPattern(navCount, duration);
      const intensity = Math.min(1, Math.max(0, Math.random()));

      const newCrum: TAMVCrum = {
        id: typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        timestamp: now,
        module: currentModule,
        action,
        impact: { credits: impactCredits, socialIndex: 0.1 },
        ecgContext: { pattern, intensity, sessionDuration: duration, neuralSync: Math.random() },
        metadata: {},
      };

      setHistory((prev) => {
        const next = [...prev, newCrum];
        return next.length > maxHistory ? next.slice(-maxHistory) : next;
      });
      setNavCount((n) => n + 1);
    },
    [currentModule, maxHistory, navCount]
  );

  return { history, trackAction };
};
