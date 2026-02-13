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
  const [phase, setPhase] = useState<"dark" | "reveal" | "text" | "logo" | "fade">("dark");
  const [activeSubsystem, setActiveSubsystem] = useState("");

  const handleSkip = useCallback(() => {
    setPhase("fade");
    setTimeout(onComplete, 800);
  }, [onComplete]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [
      setTimeout(() => setPhase("reveal"), 500),
      setTimeout(() => { setPhase("text"); setCurrentLine(0); }, 1500),
      ...VOICEOVER_LINES.map((line, i) =>
        setTimeout(() => {
          setCurrentLine(i);
          setActiveSubsystem(SUBSYSTEMS[i % SUBSYSTEMS.length]);
        }, line.delay + 1500)
      ),
      setTimeout(() => setPhase("logo"), 15000),
      setTimeout(() => setPhase("fade"), 18000),
      setTimeout(onComplete, 19500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "fade" && (
        <motion.div
          className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "brightness(2) blur(20px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Background con Efecto de Profundidad Cuántica */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.5, filter: "grayscale(1) blur(10px)" }}
            animate={{ 
              scale: phase === "logo" ? 1.05 : 1.2, 
              opacity: phase === "dark" ? 0 : 0.3,
              filter: phase === "logo" ? "grayscale(0) blur(0px)" : "grayscale(0.8) blur(2px)"
            }}
            transition={{ duration: 10, ease: "linear" }}
          >
            <img src={heroCityscape} alt="" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          </motion.div>

          {/* Grid de Datos Isométrico (Capa de Realidad) */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: `linear-gradient(#00ffc8 1px, transparent 1px), linear-gradient(90deg, #00ffc8 1px, transparent 1px)`, backgroundSize: '50px 50px' }}
          />

          {/* Monitor de Estado de IA */}
          <div className="absolute top-10 left-10 hidden md:block">
            <p className="font-mono text-[10px] text-primary/50 tracking-tighter uppercase">
              {activeSubsystem} status: <span className="text-primary animate-pulse">Online</span><br />
              Secure_Handshake: PQC-Kyber-1024<br />
              Latencia_Nexo: 8.4ms
            </p>
          </div>

          {/* Contenedor de Texto Central */}
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
                  <p className="text-3xl md:text-5xl font-bold tracking-tight text-white font-orbitron leading-tight">
                    {VOICEOVER_LINES[currentLine].text}
                  </p>
                  <div className="h-1 w-24 bg-primary mx-auto rounded-full shadow-[0_0_15px_#00ffc8]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logo Reveal Final (Impacto Civilizatorio) */}
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
                        className="absolute inset-0 border border-primary/20 rounded-full scale-150" 
                    />
                    <img src={tamvLogo} alt="TAMV" className="h-32 md:h-48 w-auto relative z-10 drop-shadow-[0_0_50px_rgba(0,255,200,0.4)]" />
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black font-orbitron bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mb-2">
                  TAMV ONLINE
                </h1>
                <p className="text-primary tracking-[0.5em] font-light text-sm md:text-xl uppercase opacity-80">
                  Infraestructura Civilizatoria
                </p>
              </motion.div>
            )}
          </div>

          {/* Controles de Salto */}
          <button 
            onClick={handleSkip} 
            className="absolute bottom-12 px-8 py-3 text-[10px] font-orbitron uppercase tracking-widest text-primary/60 hover:text-primary border border-primary/20 hover:border-primary/60 transition-all rounded-sm backdrop-blur-md z-[600]"
          >
            Interrumpir Secuencia // Esc
          </button>

          {/* Barra de Progreso de Sincronización */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-primary shadow-[0_0_15px_#00ffc8]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 18, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(CinematicIntro);
