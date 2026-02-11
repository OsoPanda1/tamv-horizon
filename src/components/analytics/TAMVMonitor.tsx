import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

// ECG Pattern types for TAMV emotional telemetry
export type EcgPattern = "stable" | "focused" | "overloaded" | "scattered";

export interface TAMVCrum {
  id: string;
  timestamp: Date;
  module: string;
  action: string;
  impact: { credits: number; socialIndex: number };
  ecgContext: {
    pattern: EcgPattern;
    intensity: number;
    sessionDuration: number;
  };
  metadata: Record<string, unknown>;
}

interface TAMVMonitorProps {
  data: TAMVCrum[];
  height?: number;
}

interface ChartPoint {
  time: string;
  intensity: number;
  pattern: EcgPattern | string;
  impact: number;
  module: string;
}

const PATTERNS: EcgPattern[] = ["stable", "focused", "overloaded", "scattered"];

const getPatternColor = (pattern: EcgPattern | string): string => {
  switch (pattern) {
    case "focused":
      return "hsl(210, 15%, 72%)"; // silver
    case "overloaded":
      return "hsl(0, 72%, 55%)"; // destructive
    case "scattered":
      return "hsl(270, 60%, 55%)"; // purple
    case "stable":
    default:
      return "hsl(186, 80%, 50%)"; // cyan
  }
};

export const TAMVMonitor: React.FC<TAMVMonitorProps> = ({ data, height = 260 }) => {
  const chartData = useMemo<ChartPoint[]>(
    () =>
      data.map((crum) => ({
        time: new Date(crum.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        intensity: Math.min(100, Math.max(0, crum.ecgContext.intensity * 100)),
        pattern: crum.ecgContext.pattern,
        impact: crum.impact.credits,
        module: crum.module,
      })),
    [data]
  );

  const dominantPattern = useMemo<EcgPattern>(() => {
    if (!data.length) return "stable";
    const counts: Record<string, number> = {};
    for (const c of data) {
      counts[c.ecgContext.pattern] = (counts[c.ecgContext.pattern] ?? 0) + 1;
    }
    return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "stable") as EcgPattern;
  }, [data]);

  const strokeColor = getPatternColor(dominantPattern);

  if (!chartData.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-tamv p-6 flex flex-col items-center justify-center gap-3"
        style={{ height }}
      >
        <Activity className="h-8 w-8 text-muted-foreground animate-pulse" />
        <p className="text-sm text-muted-foreground text-center">
          Aún no hay huella viva registrada en esta sesión.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-tamv p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-accent" />
            ECG Emocional del Sistema
          </h3>
          <p className="text-xs text-muted-foreground">
            Lectura de huella viva en tiempo real
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {PATTERNS.map((p) => (
            <span key={p} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getPatternColor(p) }}
              />
              {p}
            </span>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="ecgGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215, 15%, 35%)" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(215, 15%, 35%)" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as ChartPoint;
                return (
                  <div className="card-tamv p-3 text-xs space-y-1 border border-border">
                    <p className="font-semibold text-foreground">{item.module}</p>
                    <p>
                      Estado:{" "}
                      <span style={{ color: getPatternColor(item.pattern) }}>
                        {item.pattern}
                      </span>
                    </p>
                    <p>Intensidad: {item.intensity.toFixed(0)}%</p>
                    <p>Impacto: +{item.impact} MSR</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine y={80} stroke="hsl(0, 72%, 55%)" strokeDasharray="3 3" label="" />
          <Area
            type="monotone"
            dataKey="intensity"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#ecgGradient)"
            dot={false}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TAMVMonitor;
