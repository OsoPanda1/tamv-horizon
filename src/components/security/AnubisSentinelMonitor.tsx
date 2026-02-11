import React, { useMemo } from "react";
import { ShieldAlert, ShieldCheck, Lock, Activity } from "lucide-react";
import { motion } from "framer-motion";

export type AnubisStatus = "CLEAN" | "WARNING" | "CRITICAL" | "LOCKDOWN";

export interface AnubisState {
  status: AnubisStatus;
  threatLevel: number; // 0-100
  blockedIPs: number;
  lastEvent: string;
}

interface AnubisSentinelMonitorProps {
  state?: AnubisState;
}

const DEFAULT_STATE: AnubisState = {
  status: "CLEAN",
  threatLevel: 0,
  blockedIPs: 0,
  lastEvent: "Sovereign Pulse Stable",
};

export const AnubisSentinelMonitor: React.FC<AnubisSentinelMonitorProps> = ({
  state = DEFAULT_STATE,
}) => {
  const statusClass = useMemo(() => {
    switch (state.status) {
      case "CRITICAL": return "sentinel-critical";
      case "WARNING": return "sentinel-warning";
      case "LOCKDOWN": return "sentinel-lockdown";
      default: return "sentinel-clean";
    }
  }, [state.status]);

  const pulseDuration = state.status === "CRITICAL" ? 1 : state.status === "WARNING" ? 2 : 3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`card-tamv p-4 border ${statusClass} space-y-3`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {state.status === "CLEAN" ? (
            <ShieldCheck className="h-5 w-5" />
          ) : state.status === "LOCKDOWN" ? (
            <Lock className="h-5 w-5" />
          ) : (
            <ShieldAlert className="h-5 w-5" />
          )}
          <div>
            <h4 className="text-sm font-semibold">Sentinel ANUBIS</h4>
            <p className="text-xs text-muted-foreground">
              Estado: {state.status}
            </p>
          </div>
        </div>
        <div className="text-right">
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: pulseDuration, repeat: Infinity }}
            className="text-lg font-bold"
          >
            {state.threatLevel}%
          </motion.span>
          <p className="text-[10px] text-muted-foreground">Risk Index</p>
        </div>
      </div>

      {/* Event */}
      <div className="flex items-center gap-2 text-xs">
        <Activity className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground truncate">{state.lastEvent}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-2 rounded-md bg-muted/30">
          <p className="text-[10px] text-muted-foreground">Bloqueos IP</p>
          <p className="text-sm font-bold">{state.blockedIPs}</p>
        </div>
        <div className="text-center p-2 rounded-md bg-muted/30">
          <p className="text-[10px] text-muted-foreground">Uptime Ledger</p>
          <p className="text-sm font-bold">99.999%</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnubisSentinelMonitor;
