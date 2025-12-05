import { useEffect, useState, useCallback } from "react";
import tamvLogo from "@/assets/tamv-logo.png";

interface WelcomeAnimationProps {
  onComplete: () => void;
}

// Aztec glyphs and symbols
const AZTEC_SYMBOLS = ["𐃆", "𐂀", "𐂃", "𐂄", "☀", "◈", "◆", "⬡", "⬢", "⬣", "✧", "✦"];
const SACRED_WORDS = [
  "Tlāloc", "Quetzal", "Tonatiuh", "Xōchitl", 
  "Coatl", "Cipactli", "Ehecatl", "Mictlan"
];

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [phase, setPhase] = useState<"glyphs" | "logo" | "text" | "manifest" | "fade">("glyphs");
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; symbol: string; delay: number }>>([]);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      symbol: AZTEC_SYMBOLS[Math.floor(Math.random() * AZTEC_SYMBOLS.length)],
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("logo"), 1200),
      setTimeout(() => setPhase("text"), 2800),
      setTimeout(() => setPhase("manifest"), 4500),
      setTimeout(() => setPhase("fade"), 7000),
      setTimeout(() => onComplete(), 8000)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-opacity duration-1500 ${
        phase === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at center, hsl(var(--background)) 0%, hsl(220 20% 5%) 100%)"
      }}
    >
      {/* Animated sacred geometry background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Central mandala */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full animate-spin" style={{ animationDuration: "60s" }}>
            {Array.from({ length: 8 }, (_, i) => (
              <g key={i} transform={`rotate(${i * 45} 200 200)`}>
                <path
                  d="M200 50 L220 180 L200 200 L180 180 Z"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
                <circle cx="200" cy="100" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" />
              </g>
            ))}
            {Array.from({ length: 12 }, (_, i) => (
              <circle 
                key={`ring-${i}`}
                cx="200" 
                cy="200" 
                r={50 + i * 25} 
                fill="none" 
                stroke="hsl(var(--primary))"
                strokeWidth="0.3"
                opacity={1 - i * 0.07}
              />
            ))}
          </svg>
        </div>

        {/* Floating particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute text-primary animate-float opacity-20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              fontSize: `${12 + Math.random() * 16}px`
            }}
          >
            {p.symbol}
          </div>
        ))}

        {/* Golden rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-[2px] origin-bottom"
              style={{
                height: phase !== "glyphs" ? "400px" : "0px",
                transform: `rotate(${i * 30}deg)`,
                background: "linear-gradient(to top, hsl(var(--primary) / 0.3), transparent)",
                transition: "height 2s ease-out",
                transitionDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>

        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 text-4xl text-primary/20 animate-pulse">◈</div>
        <div className="absolute top-8 right-8 text-4xl text-primary/20 animate-pulse" style={{ animationDelay: "0.5s" }}>◈</div>
        <div className="absolute bottom-8 left-8 text-4xl text-primary/20 animate-pulse" style={{ animationDelay: "1s" }}>◈</div>
        <div className="absolute bottom-8 right-8 text-4xl text-primary/20 animate-pulse" style={{ animationDelay: "1.5s" }}>◈</div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        
        {/* Glyphs Phase */}
        <div className={`transition-all duration-1000 ${phase === "glyphs" ? "opacity-100 scale-100" : "opacity-0 scale-50 absolute"}`}>
          <div className="flex justify-center gap-4 mb-8">
            {SACRED_WORDS.slice(0, 4).map((word, i) => (
              <span 
                key={word}
                className="text-primary/60 text-xl font-light tracking-widest animate-fade-in"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {word}
              </span>
            ))}
          </div>
          <div className="text-6xl md:text-8xl text-primary animate-pulse">
            ☀
          </div>
        </div>

        {/* Logo Phase */}
        <div className={`transition-all duration-1000 ${phase !== "glyphs" ? "opacity-100" : "opacity-0"}`}>
          <div className="relative inline-block mb-8">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full animate-pulse" />
            
            <img 
              src={tamvLogo} 
              alt="TAMV Online"
              className={`relative h-28 md:h-40 w-auto mx-auto transition-all duration-1000 ${
                phase !== "glyphs" ? "animate-glow-pulse" : ""
              }`}
              style={{
                filter: "drop-shadow(0 0 40px hsl(var(--primary) / 0.5))"
              }}
            />
          </div>

          {/* Text Phase */}
          <div className={`transition-all duration-1000 ${
            phase === "text" || phase === "manifest" || phase === "fade" 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          }`}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-glow-gold">Bienvenido al </span>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                TAMV
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
              La primera arquitectura civilizatoria digital de 
              <span className="text-primary font-semibold"> Latinoamérica</span>
            </p>
          </div>

          {/* Manifest Phase */}
          <div className={`transition-all duration-1000 delay-500 ${
            phase === "manifest" || phase === "fade"
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          }`}>
            <div className="bg-gradient-to-r from-transparent via-primary/10 to-transparent p-6 rounded-xl border border-primary/20 max-w-3xl mx-auto">
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed italic">
                "Somos el grito de un pueblo sediento de resiliencia, apoyo, reconocimiento y empoderamiento. 
                Cada línea de código dignifica la humanidad. 
                <span className="text-primary font-semibold"> Bienvenido pionero</span>, 
                estás creando historia."
              </p>
              <div className="mt-4 text-xs text-muted-foreground">
                — Codex Mexa • TAMV 2026
              </div>
            </div>

            {/* Sacred geometry divider */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="flex gap-2">
                <div className="w-2 h-2 rotate-45 bg-primary animate-pulse" />
                <div className="w-3 h-3 rotate-45 bg-primary/80" />
                <div className="w-2 h-2 rotate-45 bg-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
              <div className="h-px w-24 bg-gradient-to-l from-transparent via-primary to-transparent" />
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className={`mt-8 transition-opacity duration-500 ${
          phase === "manifest" ? "opacity-100" : "opacity-0"
        }`}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">Iniciando universo</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/5"
      >
        Saltar intro →
      </button>

      {/* Animated border */}
      <div className="absolute inset-4 border border-primary/10 rounded-3xl pointer-events-none">
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), transparent)`,
            animation: "shimmer 3s linear infinite"
          }}
        />
      </div>
    </div>
  );
}
