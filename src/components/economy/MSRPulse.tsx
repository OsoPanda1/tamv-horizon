import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowDownRight, ArrowUpRight, ShieldCheck } from "lucide-react";

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

interface MSRPulseProps {
  balance?: MSRBalance;
  lastTx?: MSRTx | null;
  loading?: boolean;
  error?: string | null;
}

export const MSRPulse: React.FC<MSRPulseProps> = ({
  balance = { msr: 0, impact: 0 },
  lastTx = null,
  loading = false,
  error = null,
}) => {
  const isGain = lastTx && lastTx.amount >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-tamv p-4 space-y-3 border border-accent/20"
    >
      <Sparkles className="h-4 w-4 text-accent" />

      <div className="grid grid-cols-2 gap-3">
        {/* MSR Balance */}
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              MSR Balance
            </span>
          </div>
          <p className="text-xl font-bold text-foreground mt-1">
            {loading ? "…" : balance.msr.toLocaleString()}{" "}
            <span className="text-xs text-primary">₲</span>
          </p>
        </div>

        {/* Impact Credits */}
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Impact Credits
          </span>
          <p className="text-xl font-bold text-accent mt-1">
            {loading ? "…" : balance.impact.toLocaleString()}{" "}
            <span className="text-xs text-accent">◈</span>
          </p>
        </div>
      </div>

      {/* Pulse Bar */}
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          animate={{ width: ["0%", "100%", "60%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </div>

      {/* Last Tx */}
      <div className="text-xs">
        {lastTx ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {isGain ? (
                  <ArrowUpRight className="h-3 w-3 text-accent" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <div>
                  <span className="font-semibold">
                    {lastTx.type} {isGain ? "GAIN" : "SPEND"}
                  </span>
                  <span className="text-muted-foreground ml-1.5">
                    {lastTx.amount} ₲ · {new Date(lastTx.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <ShieldCheck className="h-3 w-3" />
              <span className="font-mono text-[10px]">
                {lastTx.integrity_hash.slice(0, 10)}…
              </span>
            </div>
          </>
        ) : error ? (
          <span className="text-destructive">ECONOMY LINK ERROR</span>
        ) : (
          <span className="text-muted-foreground">Esperando primera vibración económica…</span>
        )}
      </div>
    </motion.div>
  );
};

export default MSRPulse;
