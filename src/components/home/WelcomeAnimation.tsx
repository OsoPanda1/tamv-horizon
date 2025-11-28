import { useEffect, useState } from "react";
import tamvLogo from "@/assets/tamv-logo.png";

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [phase, setPhase] = useState<"logo" | "text" | "fade">("logo");

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase("text"), 1500);
    const textTimer = setTimeout(() => setPhase("fade"), 3500);
    const completeTimer = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background aztec-pattern transition-opacity duration-1000 ${
        phase === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Aztec decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8">
        {/* Logo */}
        <div className={`transition-all duration-1000 ${phase === "logo" ? "animate-ceremonial" : ""}`}>
          <img 
            src={tamvLogo} 
            alt="TAMV Online"
            className="h-24 md:h-32 w-auto mx-auto mb-6 animate-glow-pulse"
          />
        </div>

        {/* Welcome Text */}
        <div className={`transition-all duration-1000 ${phase === "text" || phase === "fade" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h1 className="text-2xl md:text-4xl font-bold mb-4 text-glow-gold">
            Bienvenido al <span className="text-primary">TAMV</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            La primera arquitectura civilizatoria digital de LATAM, creada para dignificar la humanidad en cada línea de código.
          </p>
          
          {/* Decorative line */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
            <div className="w-2 h-2 rotate-45 bg-primary" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
          </div>
        </div>

        {/* Loading indicator */}
        <div className={`mt-8 transition-opacity duration-500 ${phase === "text" ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Saltar intro
      </button>
    </div>
  );
}
