import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { 
  Sparkles, Flame, Compass, GraduationCap, Image as ImageIcon, 
  Cpu, ShieldCheck, Globe, Zap, Layers, Search, Bell, 
  Fingerprint, Command, Activity, Wallet, Radio
} from "lucide-react";

// UI Components con Estándar DM-X4
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// TAMV Core Ecosystem Components
import PostComposer from "@/components/home/PostComposer";
import QALiveCard from "@/components/home/QALiveCard";
import RecommendedCarousel from "@/components/home/RecommendedCarousel";
import ChallengesSection from "@/components/home/ChallengesSection";
import MonetizationOverview from "@/components/home/MonetizationOverview";
import PuentesOniricosPanel from "@/components/puentes/PuentesOniricosPanel";
import ReferralLeague from "@/components/referrals/ReferralLeague";
import EnterVRButton from "@/components/home/EnterVRButton";
import DailyMissionWidget from "@/components/home/DailyMissionWidget";
import PostsFeed from "@/components/feed/PostsFeed";
import HoyoNegroWidget from "@/components/gamification/HoyoNegroWidget";
import StoriesBar from "@/components/social/StoriesBar";
import ReelsGrid from "@/components/social/ReelsGrid";
import TrendingMedia from "@/components/social/TrendingMedia";
import FeaturedCourses from "@/components/social/FeaturedCourses";

/**
 * CONFIGURACIÓN DE LAS 7 FEDERACIONES [Protocolo 2026-02-07]
 */
const FEDERATIONS = [
  { id: "social", label: "Nexus", icon: Globe, color: "#60A5FA", desc: "Red Civilizatoria" },
  { id: "econ", label: "MSR Bank", icon: Wallet, color: "#FBBF24", desc: "Soberanía Financiera" },
  { id: "edu", label: "UTAMV", icon: GraduationCap, color: "#34D399", desc: "Academia Pro" },
  { id: "xr", label: "DreamSpaces", icon: Layers, color: "#A78BFA", desc: "Realidad Híbrida" },
  { id: "ai", label: "Isabella", icon: Cpu, color: "#22D3EE", desc: "Núcleo Cognitivo" },
  { id: "sec", label: "Dekateotl", icon: ShieldCheck, color: "#F87171", desc: "Escudo Cuántico" },
  { id: "art", label: "Art Labs", icon: Sparkles, color: "#F472B6", desc: "Laboratorio Creativo" },
];

export default function MainFeed() {
  const [feedTab, setFeedTab] = useState("foryou");
  const [activeFederation, setActiveFederation] = useState("social");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <main className="flex-1 lg:ml-64 xl:mr-96 min-h-screen bg-[#050505] text-zinc-200 selection:bg-primary/30">
      
      {/* 1. BARRA DE PROGRESO DE LECTURA CUÁNTICA */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[100] origin-left" style={{ scaleX }} />

      {/* 2. HEADER SUPERIOR DINÁMICO (STUCK NAV) */}
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Command size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-orbitron tracking-[0.2em] uppercase">Nexus_OS_v2</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800 hidden md:block" />
          <p className="text-[10px] font-mono text-zinc-500 hidden md:block uppercase tracking-tighter">
            Latencia: 12ms // Sincronía Isabella: 98.4%
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
            <Search size={18} className="text-zinc-400 group-hover:text-primary" />
          </div>
          <div className="relative cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
            <Bell size={18} className="text-zinc-400" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-black" />
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent p-[1px]">
             <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <Fingerprint size={16} className="text-white" />
             </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 relative">
        
        {/* 3. SISTEMA DE HISTORIAS CON EFECTO VIDRIO */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-4 backdrop-blur-md overflow-hidden">
             <div className="flex items-center justify-between px-4 mb-4">
                <h4 className="text-[10px] font-orbitron tracking-widest text-zinc-400 uppercase">Huellas Vivas Online</h4>
                <Radio size={12} className="text-red-500 animate-pulse" />
             </div>
             <StoriesBar />
          </div>
        </section>

        {/* 4. NAV DE FEDERACIONES (DIAMOND GRID) */}
        <TooltipProvider>
          <div className="flex justify-between items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {FEDERATIONS.map((fed) => (
              <Tooltip key={fed.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFederation(fed.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-3xl border transition-all duration-500",
                      activeFederation === fed.id 
                        ? "bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                        : "bg-transparent border-transparent grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
                    )}
                  >
                    <div className="p-3 rounded-2xl bg-zinc-900" style={{ color: fed.color }}>
                      <fed.icon size={20} />
                    </div>
                    <span className="text-[9px] font-orbitron uppercase tracking-tighter text-white">{fed.label}</span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] font-orbitron uppercase">
                  {fed.desc}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* 5. TABS PRINCIPALES CON ANIMACIÓN DE CONTENIDO */}
        <Tabs value={feedTab} onValueChange={setFeedTab} className="w-full">
          <div className="sticky top-[60px] z-40 py-2 bg-black/40 backdrop-blur-lg -mx-4 px-4">
            <TabsList className="w-full h-14 bg-zinc-900/80 border border-white/5 p-1.5 rounded-[1.8rem] grid grid-cols-5">
              {[
                { id: "foryou", icon: Flame, label: "Feed" },
                { id: "explore", icon: Compass, label: "Explore" },
                { id: "reels", icon: ImageIcon, label: "Reels" },
                { id: "media", icon: Sparkles, label: "MSR" },
                { id: "learn", icon: GraduationCap, label: "Univ" },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="rounded-2xl data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-500 font-orbitron text-[9px] tracking-widest uppercase"
                >
                  <tab.icon className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:block">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="foryou" className="space-y-8 mt-8 outline-none border-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-8"
              >
                {/* Composer Evolucionado */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] opacity-0 group-focus-within:opacity-20 transition-opacity" />
                  <PostComposer onPostCreated={() => setRefreshTrigger(n => n + 1)} />
                </div>

                {/* Banner XR Dinámico */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-3">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="h-full card-tamv-featured p-6 flex flex-col justify-between overflow-hidden group min-h-[180px]"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Layers size={80} className="rotate-12" />
                      </div>
                      <div>
                        <Badge className="bg-white/10 text-primary border-none text-[8px] font-orbitron mb-4">XR ACTIVE NODE</Badge>
                        <h3 className="text-xl font-orbitron text-white leading-tight">Acceso Directo a<br/>DreamSpaces™</h3>
                      </div>
                      <EnterVRButton className="w-fit" />
                    </motion.div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                     <DailyMissionWidget />
                     <div className="p-4 rounded-[2rem] bg-zinc-900/50 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Activity size={16} className="text-primary" />
                           <span className="text-[10px] font-orbitron uppercase tracking-widest">Live Sync</span>
                        </div>
                        <span className="text-xs font-mono text-white">98%</span>
                     </div>
                  </div>
                </div>

                {/* Feed de Publicaciones con Separadores Tácticos */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
                    <h2 className="text-[10px] font-orbitron text-zinc-500 uppercase tracking-[0.4em]">Sincronía Colectiva</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
                  </div>
                  <QALiveCard />
                  <PostsFeed refreshTrigger={refreshTrigger} />
                </div>
                
                <RecommendedCarousel />
              </motion.div>
            </TabsContent>

            {/* EXPLORE TAB CON LAYOUT MOSAICO */}
            <TabsContent value="explore" className="mt-8 space-y-6 outline-none">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <PuentesOniricosPanel />
                <div className="space-y-6">
                   <HoyoNegroWidget />
                   <ChallengesSection />
                </div>
                <div className="md:col-span-2">
                   <TrendingMedia />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="reels" className="mt-8">
              <ReelsGrid />
            </TabsContent>

            <TabsContent value="media" className="mt-8 space-y-6">
               <div className="relative p-8 rounded-[3rem] bg-zinc-900 border border-white/5 overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                     <div className="p-6 rounded-[2.5rem] bg-black border border-amber-500/20">
                        <Zap size={40} className="text-amber-500" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-orbitron text-white mb-2 uppercase tracking-widest">MSR Sovereign Economy</h2>
                        <p className="text-sm text-zinc-400 max-w-md italic">Tu interacción no es gratuita. En TAMV, cada pulso genera soberanía financiera para el creador y el nodo.</p>
                     </div>
                  </div>
               </div>
               <MonetizationOverview />
               <ReferralLeague />
            </TabsContent>

            <TabsContent value="learn" className="mt-8 space-y-8">
               <FeaturedCourses />
               <div className="p-8 rounded-[3rem] bg-primary/5 border border-primary/10 flex flex-col items-center text-center space-y-4">
                  <GraduationCap size={48} className="text-primary" />
                  <h3 className="text-xl font-orbitron text-white uppercase tracking-widest">Universidad TAMV</h3>
                  <p className="text-xs text-zinc-400 max-w-sm">Certifica tu conocimiento y conviértete en un Arquitecto de Realidad dentro del ecosistema.</p>
                  <button className="px-8 py-3 rounded-full bg-primary text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                     Explorar Facultad
                  </button>
               </div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* 6. FOOTER NEXUS (DEGRADADO A NEGRO) */}
        <footer className="pt-20 pb-12 flex flex-col items-center gap-6 opacity-40">
           <div className="h-12 w-[1px] bg-gradient-to-b from-primary to-transparent" />
           <p className="text-[9px] font-orbitron tracking-[0.5em] uppercase text-zinc-600">Fin de la Transmisión Segura</p>
        </footer>
      </div>
    </main>
  );
}
