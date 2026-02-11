import { useState, useCallback } from "react";
import type { AnubisState, AnubisStatus } from "@/components/security/AnubisSentinelMonitor";

/**
 * Hook for ANUBIS Sentinel security state.
 * Currently uses mock state; ready for WebSocket/SSE backend integration.
 */
export const useAnubisSecurity = () => {
  const [state, setState] = useState<AnubisState>({
    status: "CLEAN",
    threatLevel: 0,
    blockedIPs: 0,
    lastEvent: "Sovereign Pulse Stable",
  });

  // Simulate a threat change (for demo / testing)
  const simulateThreat = useCallback((status: AnubisStatus, level: number) => {
    setState({
      status,
      threatLevel: Math.max(0, Math.min(100, level)),
      blockedIPs: status === "CRITICAL" ? 12 : status === "WARNING" ? 3 : 0,
      lastEvent:
        status === "CRITICAL"
          ? "Brute-force detected on /auth endpoint"
          : status === "WARNING"
          ? "Unusual traffic pattern from 3 IPs"
          : status === "LOCKDOWN"
          ? "Phoenix Protocol activated by Creator"
          : "Sovereign Pulse Stable",
    });
  }, []);

  const securityStatus = state.status;
  const isDegraded = securityStatus === "WARNING" || securityStatus === "CRITICAL";
  const isLockdown = securityStatus === "LOCKDOWN";

  return { state, securityStatus, isDegraded, isLockdown, simulateThreat };
};
