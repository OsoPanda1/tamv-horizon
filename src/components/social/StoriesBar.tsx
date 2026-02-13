import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// --- DATOS SOBERANOS (Definición obligatoria para evitar ReferenceError) ---
interface Story {
  id: string;
  username: string;
  avatar: string;
  hasNew: boolean;
  mediaUrl: string;
  mediaType: "image" | "video";
}

const MOCK_STORIES: Story[] = [
  { id: "s1", username: "ArteLATAM", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800", mediaType: "image" },
  { id: "s2", username: "Isabella_AI", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", mediaType: "image" },
  { id: "s3", username: "MSR_Vault", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", mediaType: "image" },
  { id: "s4", username: "Pionero_7", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80", hasNew: false, mediaUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800", mediaType: "image" },
];

function StoriesBar() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Fallback de seguridad: Si por algún motivo MOCK_STORIES es undefined, Isabella evita el crash.
  const stories = MOCK_STORIES || [];

  return (
    <div className="relative w-full overflow-hidden bg-black/20 backdrop-blur-md border-y border-white/5">
      {/* Background Glow sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="flex gap-6 overflow-x-auto scrollbar-hide py-8 px-6 items-start">
        
        {/* Nodo de Creación (Tu Historia) */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-3 flex-shrink-0 group relative"
        >
          <div className="relative p-[2px] rounded-full">
            <div className="h-16 w-16 rounded-full bg-zinc-900 border border-dashed border-primary/40 flex items-center justify-center group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(0,255,200,0.2)] transition-all duration-300">
              <Plus className="h-8 w-8 text-primary/60 group-hover:text-primary group-hover:rotate-90 transition-all" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-black rounded-full p-1 shadow-lg">
              <Zap className="h-3 w-3 fill-current" />
            </div>
          </div>
          <span className="font-orbitron text-[9px] tracking-[0.2em] text-primary/40 group-hover:text-primary uppercase transition-colors">
            Ignición
          </span>
        </motion.button>

        {/* Mapeo de Historias */}
        {stories.map((story) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedStory(story)}
            className="flex flex-col items-center gap-3 flex-shrink-0 group relative"
          >
            <div className={cn(
              "p-[3px] rounded-full transition-all duration-700 relative",
              story.hasNew 
                ? "bg-gradient-to-tr from-primary via-accent to-primary animate-pulse shadow-[0_0_20px_rgba(0,255,200,0.15)]" 
                : "bg-zinc-800"
            )}>
              <div className="absolute inset-0 rounded-full bg-black m-[2px]" />
              <Avatar className="h-16 w-16 relative z-10 border-[1px] border-black">
                <AvatarImage src={story.avatar} className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <AvatarFallback className="font-orbitron text-xs bg-zinc-900">{story.username[0]}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <span className="font-orbitron text-[10px] text-zinc-400 group-hover:text-white transition-colors tracking-tighter">
                {story.username}
              </span>
              {story.hasNew && (
                <motion.div layoutId="active-dot" className="h-1 w-1 bg-primary rounded-full shadow-[0_0_5px_#00ffc8]" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Visualizador Inmersivo */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-lg p-0 bg-transparent border-none shadow-none outline-none overflow-hidden">
          <AnimatePresence>
            {selectedStory && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, filter: "blur(40px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                className="relative aspect-[9/16] w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl"
              >
                <img src={selectedStory.mediaUrl} alt="" className="w-full h-full object-cover" />
                
                {/* HUD de Isabella AI */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/90 p-8 flex flex-col justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary shadow-[0_0_15px_rgba(0,255,200,0.4)]">
                      <AvatarImage src={selectedStory.avatar} />
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="font-orbitron text-white text-sm flex items-center gap-2 tracking-widest">
                        {selectedStory.username}
                        <ShieldCheck className="h-4 w-4 text-primary" />
                      </h4>
                      <span className="text-[10px] font-mono text-primary/70 uppercase tracking-[0.3em]">
                        Enlace Soberano Activo
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "100%" }} 
                        transition={{ duration: 5, ease: "linear" }}
                        className="h-full bg-primary shadow-[0_0_10px_#00ffc8]" 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default memo(StoriesBar);
