import { useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export interface UserBehavior {
  sessionDuration: number;
  pagesVisited: string[];
  actionsPerformed: string[];
  lastActive: Date;
}

export function useAnalytics(userId?: string) {
  const track = useCallback(async (event: string, properties?: Record<string, any>) => {
    try {
      const eventData: AnalyticsEvent = {
        event,
        properties: {
          ...properties,
          url: window.location.href,
          referrer: document.referrer,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          userAgent: navigator.userAgent,
        },
        userId,
        timestamp: Date.now(),
      };

      // Registrar interacción en la base de datos
      if (userId) {
        await supabase.from("user_interactions").insert([{
          user_id: userId,
          entity_type: "analytics",
          entity_id: event,
          interaction_type: "track",
          weight: 1
        }]);
      }

      // Log local para desarrollo
      console.log("[Analytics]", event, eventData.properties);

      // Aquí se podría enviar a servicios externos como Google Analytics, Mixpanel, etc.
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  }, [userId]);

  const trackPageView = useCallback((pageName: string, properties?: Record<string, any>) => {
    track("page_view", {
      page_name: pageName,
      ...properties
    });
  }, [track]);

  const trackClick = useCallback((element: string, properties?: Record<string, any>) => {
    track("click", {
      element,
      ...properties
    });
  }, [track]);

  const trackFeatureUse = useCallback((feature: string, action: string, properties?: Record<string, any>) => {
    track("feature_use", {
      feature,
      action,
      ...properties
    });
  }, [track]);

  const trackConversion = useCallback((conversionType: string, value?: number, properties?: Record<string, any>) => {
    track("conversion", {
      conversion_type: conversionType,
      value,
      ...properties
    });
  }, [track]);

  const trackError = useCallback((error: Error, context?: string) => {
    track("error", {
      error_message: error.message,
      error_stack: error.stack,
      context
    });
  }, [track]);

  // Tracking automático de sesión
  useEffect(() => {
    const sessionStart = Date.now();

    track("session_start");

    // Track session duration on unload
    const handleUnload = () => {
      const duration = Date.now() - sessionStart;
      track("session_end", { duration_ms: duration });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
    };
  }, [track]);

  // Tracking de performance
  useEffect(() => {
    if (window.performance && window.performance.timing) {
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      if (loadTime > 0) {
        track("page_performance", {
          load_time_ms: loadTime,
          dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
          time_to_interactive: perfData.domInteractive - perfData.navigationStart
        });
      }
    }
  }, [track]);

  return {
    track,
    trackPageView,
    trackClick,
    trackFeatureUse,
    trackConversion,
    trackError,
  };
}
