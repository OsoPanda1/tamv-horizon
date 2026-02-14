import { useEffect, useState, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ProductTourState,
  shouldShowTour,
  startTour,
  nextStep,
  prevStep,
  skipTour,
  completeTour,
  getCurrentStep,
  getStepProgress,
  TAMV_TOUR_STEPS
} from "@/modules/productTour/productTour";

interface ProductTourOverlayProps {
  onComplete?: () => void;
}

export default function ProductTourOverlay({ onComplete }: ProductTourOverlayProps) {
  const [tourState, setTourState] = useState<ProductTourState>({ isActive: false, currentStepIndex: 0 });
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (shouldShowTour()) {
      // Small delay to let the UI render first
      setTimeout(() => {
        setTourState(startTour());
      }, 1200);
    }
  }, []);

  useEffect(() => {
    if (!tourState.isActive) return;

    const currentStep = getCurrentStep(tourState);
    if (!currentStep) return;

    const element = document.querySelector(currentStep.targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);

      // Scroll element into view if needed
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setTargetRect(null);
    }
  }, [tourState]);

  const handleNext = useCallback(() => {
    const newState = nextStep(tourState);
    setTourState(newState);
    if (!newState.isActive) {
      onComplete?.();
    }
  }, [tourState, onComplete]);

  const handlePrev = useCallback(() => {
    setTourState(prevStep(tourState));
  }, [tourState]);

  const handleSkip = useCallback(() => {
    setTourState(skipTour());
    onComplete?.();
  }, [onComplete]);

  const handleComplete = useCallback(() => {
    setTourState(completeTour());
    onComplete?.();
  }, [onComplete]);

  if (!tourState.isActive) return null;

  const currentStep = getCurrentStep(tourState);
  const progress = getStepProgress(tourState);

  if (!currentStep) return null;

  const getTooltipPosition = () => {
    if (!targetRect) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }

    const padding = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    switch (currentStep.position) {
      case "bottom":
        return {
          top: `${targetRect.center + padding}px`,
          left: `${Math.max(padding, Math.min(targetRect.left + targetRect.width / 4 - tooltipWidth / 4, window.innerWidth - tooltipWidth - padding))}px`
        };
      case "top":
        return {
          top: `${targetRect.top - tooltipHeight - padding}px`,
          left: `${Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding))}px`
        };
      case "left":
        return {
          top: `${targetRect.top + targetRect.height / 2 - tooltipHeight / 2}px`,
          left: `${targetRect.left - tooltipWidth - padding}px`
        };
      case "right":
        return {
          top: `${targetRect.top + targetRect.height / 2 - tooltipHeight / 2}px`,
          left: `${targetRect.right + padding}px`
        };
      default:
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
  };

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Dark overlay with hole for target element */}
      <div className="absolute inset-0 bg-background/90" />
      
      {/* Highlight around target element */}
      {targetRect && (
        <div
          className="absolute border-2 border-primary rounded-lg animate-glow-pulse pointer-events-none"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 10,
            height: targetRect.height + 10,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.8)"
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute w-80 card-tamv-featured p-5 animate-fade-up z-10"
        style={getTooltipPosition()}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Progress indicator */}
        <div className="flex gap-1 mb-4">
          {TAMV_TOUR_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= tourState.currentStepIndex ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <h3 className="font-bold text-lg mb-2 text-glow-gold">{currentStep.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{currentStep.description}</p>

        {/* Progress text */}
        <p className="text-xs text-muted-foreground mb-4">
          Paso {progress.current} de {progress.total}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            <SkipForward className="h-4 w-4 mr-1" />
            Omitir tour
          </Button>

          <div className="flex gap-2">
            {tourState.currentStepIndex > 0 && (
              <Button variant="outline" size="sm" onClick={handlePrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            
            {tourState.currentStepIndex < TAMV_TOUR_STEPS.length - 1 ? (
              <Button size="sm" className="btn-tamv-gold" onClick={handleNext}>
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" className="btn-tamv-gold" onClick={handleComplete}>
                ¡Comenzar!
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
