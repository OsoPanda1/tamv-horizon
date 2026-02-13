import { useState, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Users, Sparkles, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RECOMMENDATIONS } from "@/data/mockData";

export default function RecommendedCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
    scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setCanScrollLeft(scrollRef.current.scrollLeft > 0);
    setCanScrollRight(
      scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
    );
  };

  return (
    <section className="relative py-8 px-2">
      {/* Header Civilizatorio */}
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-8 bg-primary shadow-[0_0_10px_#00ffc8] rounded-full" />
            <h2 className="font-orbitron font-bold text-xl tracking-tighter text-white uppercase italic">
              Nexo de Recomendaciones
            </h2>
          </div>
          <p className="text-xs text-primary/60 font-mono flex items-center gap-1.5 uppercase tracking-widest">
            <BrainCircuit className="h-3 w-3 animate-pulse" /> Sincronizado por Isabella AI™
          </p>
        </div>

        <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-white/5 backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-primary hover:bg-primary/10"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="w-[1px] bg-white/10 my-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-primary hover:bg-primary/10"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Carrusel de Dimensiones */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-10 -mx-4 px-4 mask-fade-edges"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {RECOMMENDATIONS.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative flex-shrink-0 w-64 group bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 hover:border-primary/50"
            style={{ scrollSnapAlign: "center" }}
          >
            {/* Overlay de Carga de Datos (Visual Only) */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-scan" />

            {/* Media Wrapper */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
              
              {/* Badge Dinámico */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-orbitron text-white uppercase tracking-tighter">
                  {item.type}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-3">
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base truncate group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs text-white/40 font-medium truncate italic">
                  {item.subtitle}
                </p>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-3">
                  {item.followers && (
                    <div className="flex items-center gap-1 text-[10px] text-primary/80 font-mono">
                      <Users className="h-3 w-3" />
                      {item.followers >= 1000 ? `${(item.followers / 1000).toFixed(1)}K` : item.followers}
                    </div>
                  )}
                  {item.rating && (
                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-mono">
                      <Star className="h-3 w-3 fill-yellow-500" />
                      {item.rating}
                    </div>
                  )}
                </div>
                
                {/* Botón de Interacción Instantánea */}
                <button className="p-2 bg-white/5 hover:bg-primary/20 rounded-lg transition-colors border border-white/5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        @keyframes scan {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </section>
  );
}
