import { ChevronLeft, ChevronRight, Star, Users, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RECOMMENDATIONS } from "@/data/mockData";

export default function RecommendedCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 300;
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth"
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    setCanScrollLeft(scrollRef.current.scrollLeft > 0);
    setCanScrollRight(
      scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      creator: "Creador",
      dreamspace: "DreamSpace",
      concert: "Concierto",
      group: "Grupo",
      channel: "Canal",
      auction: "Subasta"
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    if (type === "dreamspace") return <Sparkles className="h-3 w-3" />;
    if (type === "creator" || type === "group") return <Users className="h-3 w-3" />;
    return <Star className="h-3 w-3" />;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-lg">Recomendado para ti</h2>
          <p className="text-sm text-muted-foreground">Basado en tus intereses y actividad</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {RECOMMENDATIONS.map((item) => (
          <div
            key={item.id}
            className="card-tamv flex-shrink-0 w-48 overflow-hidden cursor-pointer hover:border-primary/30 transition-all group"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Image */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              
              {/* Type Badge */}
              <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full">
                {getTypeIcon(item.type)}
                {getTypeLabel(item.type)}
              </span>
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {item.subtitle}
              </p>
              
              {/* Stats */}
              {(item.followers || item.rating) && (
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  {item.followers && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {item.followers >= 1000 
                        ? `${(item.followers / 1000).toFixed(1)}K` 
                        : item.followers}
                    </span>
                  )}
                  {item.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {item.rating}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
