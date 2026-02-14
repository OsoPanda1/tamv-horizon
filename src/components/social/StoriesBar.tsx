import { useState, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, ShieldCheck, Zap, Fingerprint } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ----------------------------------------------------------------
// PROTOCOLO DE DATOS INTEGRADO (Evita ReferenceError)
// ----------------------------------------------------------------
interface Story {
  id: string;
  username: string;
  avatar: string;
  hasNew: boolean;
  mediaUrl: string;
  mediaType: "image" | "video";
}

const CONFIG_STORIES_TAMV: Story[] = [
  { id: "s1", username: "ArteLATAM", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800", mediaType: "image" },
  { id: "s2", username: "Isabella_AI", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", mediaType: "image" },
  { id: "s3", username: "MSR_Vault", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", mediaType: "image" },
  { id: "s4", username: "Pionero_7", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80", hasNew: false, mediaUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800", mediaType: "image" },
  { id: "s5", username: "CodexMex", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800", mediaType: "image" },
];

// ----------------------------------------------------------------
// COMPONENTE: STORIES BAR (DEDALO DM-X4 EDITION)
// ----------------------------------------------------------------
const StoriesBar = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Memorización para evitar re-renders innecesarios y asegurar disponibilidad
  const stories = useMemo(() => CONFIG_STORIES_TAMV, []);

  if (!stories || stories.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#050505]/60 backdrop-blur-2xl border-y border-white/5 py-8">
      {/* Luz de fondo cinética */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-64 h-64 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="flex gap-7 overflow-x-auto scrollbar-hide px-8 items-start mask-linear-fade">
        
        {/* NODO DE IGNICIÓN (CREAR) */}
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-3.5 flex-shrink-0 group"
        >
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(0,255,200,0.2)] transition-all duration-500 overflow-hidden">
              <Plus className="h-9 w-9 text-zinc-500 group-hover:text-primary transition-all duration-300" />
              {/* Efecto de barrido láser */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-black border border-white/10 rounded-full p-1.5 shadow-2xl">
              <Fingerprint className="h-3.5 w-3.5 text-primary" />
            </div>
          </div>
          <span className="font-orbitron text-[9px] tracking-[0.25em] text-zinc-500 group-hover:text-primary uppercase transition-colors italic">
            Ignition
          </span>
        </motion.button>

        {/* LISTADO DE NODOS SOBERANOS */}
        {stories.map((story) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -6 }}
            onClick={() => setSelectedStory(story)}
            className="flex flex-col items-center gap-3.5 flex-shrink-0 group"
          >
            <div className={cn(
              "p-[3.5px] rounded-full transition-all duration-1000 relative overflow-hidden",
              story.hasNew 
                ? "bg-gradient-to-tr from-primary via-[#00d2ff] to-primary shadow-[0_0_25px_rgba(0,255,200,0.1)]" 
                : "bg-white/5"
            )}>
              {/* Overlay de Rotación para el Anillo */}
              {story.hasNew && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-[spin_4s_linear_infinite]" />
              )}
              
              <div className="absolute inset-0 rounded-full bg-black m-[2.5px]" />
              
              <Avatar className="h-20 w-20 relative z-10 border-[1.5px] border-black">
                <AvatarImage src={story.avatar} className="object-cover group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110" />
                <AvatarFallback className="font-orbitron text-xs bg-zinc-900 text-white">
                  {story.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-orbitron text-[10px] text-zinc-400 group-hover:text-white transition-colors tracking-tight">
                {story.username}
              </span>
              {story.hasNew && (
                <div className="h-1 w-1 bg-primary rounded-full shadow-[0_0_8px_#00ffc8] animate-pulse" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* VISUALIZADOR DE REALIDAD (DIALOG) */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-[480px] p-0 bg-transparent border-none shadow-none outline-none overflow-hidden">
          <AnimatePresence>
            {selectedStory && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                className="relative aspect-[9/16] w-full rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
              >
                <img src={selectedStory.mediaUrl} alt="" className="w-full h-full object-cover" />
                
                {/* HUD TÁCTICO ISABELLA AI */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-1 bg-primary/20 rounded-full backdrop-blur-md border border-primary/30">
                        <Avatar className="h-14 w-14 border-2 border-black">
                          <AvatarImage src={selectedStory.avatar} />
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-orbitron text-white text-base flex items-center gap-2.5">
                          {selectedStory.username}
                          <ShieldCheck className="h-4 w-4 text-primary fill-primary/10" />
                        </h4>
                        <span className="text-[9px] font-mono text-primary/80 uppercase tracking-[0.4em] animate-pulse">
                          Transmisión Encriptada
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Barra de Progreso Bio-Digital */}
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-[8px] font-orbitron text-white/40 uppercase tracking-widest">
                        <span>Data Link: Active</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-xl border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: "100%" }} 
                          transition={{ duration: 6, ease: "linear" }}
                          onAnimationComplete={() => setSelectedStory(null)}
                          className="h-full bg-gradient-to-r from-primary via-[#00d2ff] to-primary shadow-[0_0_15px_#00ffc8]" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Scanline Post-Process */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]" />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Scrollbar styles handled via Tailwind/global CSS */}
    </section>
  );
};

export default memo(StoriesBar);
