import { useState, useEffect } from "react";
import TopToolbar from "@/components/layout/TopToolbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import MainFeed from "@/components/feed/MainFeed";
import WelcomeAnimation from "@/components/home/WelcomeAnimation";
import ProductTourOverlay from "@/components/home/ProductTourOverlay";
import IsabellaAssistantButton from "@/components/isabella/IsabellaAssistantButton";
import TAMVBackgroundScene from "@/components/three/TAMVBackgroundScene";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useNotifications } from "@/hooks/useNotifications";
import { useGamification } from "@/hooks/useGamification";
import { useAnubisSecurity } from "@/hooks/useAnubisSecurity";

const WELCOME_SHOWN_KEY = "tamv_welcome_shown";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { trackPageView } = useAnalytics();
  const { unreadCount } = useNotifications();
  const { userLevel, addXP } = useGamification();
  const { isDegraded, isLockdown } = useAnubisSecurity();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
    trackPageView("Home");
  }, [trackPageView]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    localStorage.setItem(WELCOME_SHOWN_KEY, "true");
    addXP(10, "¡Bienvenido a TAMV!");
  };

  return (
    <div className="min-h-screen bg-background relative tamv-depth-bg">
      {/* 3D Background Scene */}
      <TAMVBackgroundScene />

      {/* Crisis Overlay */}
      {isDegraded && (
        <div className="fixed inset-0 z-30 pointer-events-none bg-destructive/5 animate-pulse" />
      )}

      {/* Welcome Animation (first visit only) */}
      {showWelcome && <WelcomeAnimation onComplete={handleWelcomeComplete} />}

      {/* Product Tour Overlay */}
      {!showWelcome && <ProductTourOverlay />}

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

      {/* Right Sidebar - Restored with accordion pattern */}
      <RightSidebar />

      {/* Isabella AI Assistant - hidden during lockdown */}
      {!isLockdown && <IsabellaAssistantButton />}
    </div>
  );
};

export default Index;
