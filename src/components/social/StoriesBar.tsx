import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, ShieldCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasNew: boolean;
  mediaUrl: string;
  mediaType: "image" | "video";
}

// ... MOCK_STORIES se mantiene igual ...

export default function StoriesBar() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <>
      <div className="flex gap-5 overflow-x-auto scrollbar-hide py-6 px-4 mask-fade-right">
        {/* Add Story: Nodo de Creación Personal */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center gap-2.5 flex-shrink-0 group"
        >
          <div className="relative p-[3px] rounded-full border border-dashed border-primary/30 group-hover:border-primary transition-colors">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-black to-zinc-900 flex items-center justify-center shadow-inner">
              <Plus className="h-7 w-7 text-primary group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-[0_0_10px_#00ffc8]">
               <Sparkles className="h-3 w-3 text-black" />
            </div>
          </div>
          <span className="font-orbitron text-[9px] tracking-[0.1em] text-primary/60 uppercase">Crear</span>
        </motion.button>

        {/* Stories: Nodos de Memoria Colectiva */}
        {MOCK_STORIES.map((story) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedStory(story)}
            className="flex flex-col items-center gap-2.5 flex-shrink-0 group relative"
          >
            <div className={cn(
              "p-[2.5px] rounded-full transition-all duration-500 relative",
              story.hasNew
                ? "bg-gradient-to-tr from-[#00ffc8] via-[#0088ff] to-[#00ffc8] animate-spin-slow-custom shadow-[0_0_15px_rgba(0,255,200,0.3)]"
                : "bg-zinc-800"
            )}>
              {/* Ring Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-black m-[2px]" />
              
              <Avatar className="h-16 w-16 relative z-10 p-[1px] bg-black">
                <AvatarImage src={story.avatar} className="object-cover rounded-full filter group-hover:contrast-125 transition-all" />
                <AvatarFallback className="bg-zinc-900 font-orbitron">{story.username[0]}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="font-orbitron text-[10px] text-white/70 group-hover:text-primary transition-colors tracking-tight">
                {story.username}
              </span>
              {story.hasNew && (
                <div className="h-[2px] w-4 bg-primary rounded-full mt-1 shadow-[0_0_5px_#00ffc8]" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Visualizador de Historia Cuántica */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-[450px] p-0 bg-transparent border-none overflow-hidden shadow-none focus-visible:outline-none">
          <AnimatePresence>
            {selectedStory && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                className="relative aspect-[9/16] w-full rounded-[32px] overflow-hidden border border-white/10"
              >
                {/* Image Layer con Overlay Gradiente */}
                <img
                  src={selectedStory.mediaUrl}
                  alt={selectedStory.username}
                  className="w-full h-full object-cover"
                />
                
                {/* HUD de Isabella AI */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-[2px] bg-primary rounded-full">
                        <Avatar className="h-10 w-10 border border-black">
                          <AvatarImage src={selectedStory.avatar} />
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-orbitron text-sm text-white flex items-center gap-1.5">
                          {selectedStory.username}
                          <ShieldCheck className="h-3 w-3 text-primary" />
                        </span>
                        <span className="text-[10px] text-primary/70 font-mono tracking-widest uppercase">
                          Nodo Verificado // BookPI™
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso interactiva */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_#00ffc8]"
                    />
                  </div>
                </div>

                {/* Scanline Effect (Efecto Digital Retro-futurista) */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .mask-fade-right {
          mask-image: linear-gradient(to right, black 85%, transparent);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow-custom {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </>
  );
}
