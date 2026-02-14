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
    // Center the dialog box completely in the screen
    return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  };

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Dark overlay with hole for target element */}
      <div className="absolute inset-0 bg-background/90" />
      


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
