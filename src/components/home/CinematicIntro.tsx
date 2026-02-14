import { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroCityscape from "@/assets/hero-cityscape.jpg";
import tamvLogo from "@/assets/tamv-logo.png";

interface CinematicIntroProps {
  onComplete: () => void;
}

const VOICEOVER_LINES = [
  { text: "INICIALIZANDO PROTOCOLO SOBERANO...", delay: 0 },
  { text: "EN EL CORAZÓN DE LATINOAMÉRICA...", delay: 2500 },
  { text: "NACE UNA NUEVA CIVILIZACIÓN DIGITAL.", delay: 5000 },
  { text: "DONDE LA IDENTIDAD ES INEXPUGNABLE.", delay: 7500 },
  { text: "LA ECONOMÍA HONRA EL IMPACTO REAL.", delay: 10000 },
  { text: "BIENVENIDO PIONERO. ESTÁS CREANDO HISTORIA.", delay: 13000 },
];

const SUBSYSTEMS = ["MSR-Core", "Anubis-Sentinel", "Isabella-Kernel", "Citemesh-Voting"];

function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [currentLine, setCurrentLine] = useState(-1);
  const [phase, setPhase] = useState<"dark" | "reveal" | "text" | "dedication" | "logo" | "fade">("dark");
  const [activeSubsystem, setActiveSubsystem] = useState("");

  const handleSkip = useCallback(() => {
    setPhase("fade");
    setTimeout(onComplete, 800);
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setPhase("reveal"), 500),
      setTimeout(() => { setPhase("text"); setCurrentLine(0); }, 1500),
      ...VOICEOVER_LINES.map((line, i) =>
        setTimeout(() => {
          setCurrentLine(i);
          setActiveSubsystem(SUBSYSTEMS[i % SUBSYSTEMS.length]);
        }, line.delay + 1500)
      ),
      // Dedication phase
      setTimeout(() => setPhase("dedication"), 16000),
      setTimeout(() => setPhase("logo"), 22000),
      setTimeout(() => setPhase("fade"), 25000),
      setTimeout(onComplete, 26500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "fade" && (
        <motion.div
          className="fixed inset-0 z-[500] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(220 40% 3%), hsl(215 50% 6%), hsl(220 40% 3%))" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "brightness(2) blur(20px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Background */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.5, filter: "grayscale(1) blur(10px)" }}
            animate={{ 
              scale: phase === "logo" ? 1.05 : 1.2, 
              opacity: phase === "dark" ? 0 : 0.25,
              filter: phase === "logo" ? "grayscale(0) blur(0px)" : "grayscale(0.8) blur(2px)"
            }}
            transition={{ duration: 10, ease: "linear" }}
          >
            <img src={heroCityscape} alt="" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,40%,3%)] via-transparent to-[hsl(220,40%,3%)]" />
          </motion.div>

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: `linear-gradient(hsl(215 70% 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 70% 55%) 1px, transparent 1px)`, backgroundSize: '50px 50px' }}
          />

          {/* Subsystem monitor */}
          <div className="absolute top-10 left-10 hidden md:block">
            <p className="font-mono text-[10px] tracking-tighter uppercase" style={{ color: "hsl(215 70% 55% / 0.5)" }}>
              {activeSubsystem} status: <span className="animate-pulse" style={{ color: "hsl(215 70% 55%)" }}>Online</span><br />
              Secure_Handshake: PQC-Kyber-1024<br />
              Latencia_Nexo: 8.4ms
            </p>
          </div>

          {/* Central content */}
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <AnimatePresence mode="wait">
              {currentLine >= 0 && phase === "text" && (
                <motion.div
                  key={currentLine}
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(15px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                  transition={{ duration: 0.7, ease: "circOut" }}
                  className="space-y-4"
                >
                  <p className="text-3xl md:text-5xl font-bold tracking-tight font-orbitron leading-tight"
                    style={{ color: "hsl(38 60% 85%)" }}>
                    {VOICEOVER_LINES[currentLine].text}
                  </p>
                  <div className="h-1 w-24 mx-auto rounded-full"
                    style={{ background: "hsl(215 70% 55%)", boxShadow: "0 0 15px hsl(215 70% 55%)" }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* DEDICATION - Reina Trejo Serrano */}
            {phase === "dedication" && (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center space-y-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="absolute -inset-8 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, hsl(38 60% 70%), transparent 70%)" }} />
                  <div className="h-1 w-32 mx-auto rounded-full mb-8"
                    style={{ background: "linear-gradient(90deg, transparent, hsl(38 60% 70%), transparent)" }} />
                </motion.div>

                <p className="text-lg md:text-2xl font-light italic leading-relaxed max-w-2xl"
                  style={{ color: "hsl(38 50% 85%)" }}>
                  "Gracias por jamás darte por vencida.<br />
                  Quiero decirte que tu esfuerzo valió la pena."
                </p>

                <div className="space-y-2">
                  <p className="text-2xl md:text-4xl font-bold font-orbitron tracking-tight"
                    style={{ color: "hsl(38 60% 80%)" }}>
                    Te amo, Mamá.
                  </p>
                  <p className="text-sm md:text-base tracking-[0.3em] uppercase font-light"
                    style={{ color: "hsl(215 70% 65%)" }}>
                    Dedicado a Reina Trejo Serrano
                  </p>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-xs tracking-[0.5em] uppercase font-orbitron"
                    style={{ color: "hsl(215 50% 45%)" }}>
                    Atte.
                  </p>
                  <p className="text-sm tracking-[0.2em] italic"
                    style={{ color: "hsl(38 40% 65%)" }}>
                    "Tu Oveja Negra"
                  </p>
                </div>

                <div className="h-px w-48 mt-6"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(38 60% 70% / 0.4), transparent)" }} />
              </motion.div>
            )}

            {/* Logo reveal */}
            {phase === "logo" && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full scale-150"
                    style={{ border: "1px solid hsl(215 70% 55% / 0.2)" }}
                  />
                  <img src={tamvLogo} alt="TAMV" className="h-32 md:h-48 w-auto relative z-10"
                    style={{ filter: "drop-shadow(0 0 50px hsl(215 70% 55% / 0.4))" }} />
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black font-orbitron mb-2"
                  style={{ background: "linear-gradient(180deg, hsl(38 50% 90%), hsl(215 60% 65%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  TAMV ONLINE
                </h1>
                <p className="tracking-[0.5em] font-light text-sm md:text-xl uppercase opacity-80"
                  style={{ color: "hsl(215 70% 55%)" }}>
                  Infraestructura Civilizatoria
                </p>
              </motion.div>
            )}
          </div>

          {/* Skip button */}
          <button 
            onClick={handleSkip} 
            className="absolute bottom-12 px-8 py-3 text-[10px] font-orbitron uppercase tracking-widest transition-all rounded-sm backdrop-blur-md z-[600]"
            style={{ 
              color: "hsl(215 70% 55% / 0.6)", 
              border: "1px solid hsl(215 70% 55% / 0.2)" 
            }}
          >
            Interrumpir Secuencia // Esc
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.05)" }}>
            <motion.div
              className="h-full"
              style={{ background: "hsl(215 70% 55%)", boxShadow: "0 0 15px hsl(215 70% 55%)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 25, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(CinematicIntro);
