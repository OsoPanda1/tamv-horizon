import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroCityscape from "@/assets/hero-cityscape.jpg";
import tamvLogo from "@/assets/tamv-logo.png";

interface CinematicIntroProps {
  onComplete: () => void;
}

const VOICEOVER_LINES = [
  { text: "En el corazón de Latinoamérica...", delay: 0 },
  { text: "nace una nueva civilización digital.", delay: 2500 },
  { text: "Donde la identidad es soberana.", delay: 5000 },
  { text: "La economía honra el impacto real.", delay: 7500 },
  { text: "Y la IA es tu aliada, no tu reemplazo.", delay: 10000 },
  { text: "Bienvenido pionero. Estás creando historia.", delay: 13000 },
];

function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [currentLine, setCurrentLine] = useState(-1);
  const [phase, setPhase] = useState<"dark" | "reveal" | "text" | "logo" | "fade">("dark");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("reveal"), 500),
      setTimeout(() => { setPhase("text"); setCurrentLine(0); }, 1500),
      ...VOICEOVER_LINES.map((line, i) =>
        setTimeout(() => setCurrentLine(i), line.delay + 1500)
      ),
      setTimeout(() => setPhase("logo"), 15000),
      setTimeout(() => setPhase("fade"), 17500),
      setTimeout(onComplete, 19000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "fade" ? (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Background image with parallax */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: phase === "dark" ? 0 : 0.4 }}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            <img src={heroCityscape} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          </motion.div>

          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,180,0.03) 2px, rgba(0,200,180,0.03) 4px)" }}
          />

          {/* Voice-over text */}
          <div className="relative z-10 text-center px-8 max-w-3xl">
            <AnimatePresence mode="wait">
              {currentLine >= 0 && phase === "text" && (
                <motion.p
                  key={currentLine}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                  transition={{ duration: 0.8 }}
                  className="text-2xl md:text-4xl font-light text-foreground/90 leading-relaxed tracking-wide"
                >
                  {VOICEOVER_LINES[currentLine].text}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Logo reveal */}
            {phase === "logo" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center gap-6"
              >
                <img src={tamvLogo} alt="TAMV" className="h-24 md:h-32 w-auto" style={{ filter: "drop-shadow(0 0 40px hsl(var(--primary) / 0.6))" }} />
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                >
                  TAMV ONLINE
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-muted-foreground text-lg"
                >
                  El nuevo mundo digital latinoamericano
                </motion.p>
              </motion.div>
            )}
          </div>

          {/* Skip */}
          <button onClick={onComplete} className="absolute bottom-8 px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full border border-border/30 hover:border-primary/50 z-20">
            Saltar intro →
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/20">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 19, ease: "linear" }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default memo(CinematicIntro);
