import { useState, useEffect, lazy, Suspense } from "react";
import TopToolbar from "@/components/layout/TopToolbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import MainFeed from "@/components/feed/MainFeed";
import CinematicIntro from "@/components/home/CinematicIntro";
import ProductTourOverlay from "@/components/home/ProductTourOverlay";
import IsabellaAssistantButton from "@/components/isabella/IsabellaAssistantButton";
import MatrixRain from "@/components/effects/MatrixRain";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useNotifications } from "@/hooks/useNotifications";
import { useGamification } from "@/hooks/useGamification";
import { useAnubisSecurity } from "@/hooks/useAnubisSecurity";

const INTRO_SHOWN_KEY = "tamv_cinematic_shown";

const Index = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { trackPageView } = useAnalytics();
  const { unreadCount } = useNotifications();
  const { userLevel, addXP } = useGamification();
  const { isDegraded, isLockdown } = useAnubisSecurity();

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(INTRO_SHOWN_KEY);
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
    trackPageView("Home");
  }, [trackPageView]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem(INTRO_SHOWN_KEY, "true");
    addXP(10, "¡Bienvenido a TAMV!");
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Crisis Overlay */}
      {isDegraded && (
        <div className="fixed inset-0 z-30 pointer-events-none bg-destructive/5 animate-pulse" />
      )}

      {/* Cinematic Intro (first visit only) */}
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

      {/* Product Tour Overlay */}
      {!showIntro && <ProductTourOverlay />}

      {/* Top Toolbar */}
      <TopToolbar 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onHelpClick={() => {}}
        isSidebarOpen={sidebarOpen}
      />

      {/* Left Sidebar */}
      <LeftSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Feed */}
      <MainFeed />

      {/* Right Sidebar */}
      <RightSidebar />

      {/* Isabella AI Assistant */}
      {!isLockdown && <IsabellaAssistantButton />}
    </div>
  );
};

export default Index;
