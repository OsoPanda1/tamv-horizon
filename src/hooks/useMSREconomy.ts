import { useState, useEffect, useCallback } from "react";

interface MSRBalance {
  msr: number;
  impact: number;
}

interface MSRTx {
  id: string;
  type: "LOTTERY" | "GIFT" | "PURCHASE" | "REWARD";
  amount: number;
  integrity_hash: string;
  created_at: string;
}

/**
 * Hook for MSR Economy state.
 * Uses mock data; ready for Supabase/Edge Function backend.
 */
export const useMSREconomy = () => {
  const [balance, setBalance] = useState<MSRBalance>({ msr: 1250, impact: 340 });
  const [lastTx, setLastTx] = useState<MSRTx | null>({
    id: "tx-001",
    type: "REWARD",
    amount: 50,
    integrity_hash: "a3f2b8c91d4e7f0012abcdef",
    created_at: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Connect to /api/v1/economy/balance via Supabase Edge Function
      // Mock: simulate slight balance change
      setBalance((prev) => ({
        msr: prev.msr + Math.floor(Math.random() * 10),
        impact: prev.impact + Math.floor(Math.random() * 5),
      }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(refresh, 30000);
    return () => window.clearInterval(id);
  }, [refresh]);

  return { balance, lastTx, loading, error, refresh };
};
