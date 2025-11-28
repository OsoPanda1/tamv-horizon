import { useState, useEffect } from "react";
import { Glasses, X, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkXRSupport, startXRScene, shouldShowVRPrompt, hideVRPrompt, XRCapabilities } from "@/modules/xr/scene";

export default function EnterVRButton() {
  const [xrCapabilities, setXrCapabilities] = useState<XRCapabilities | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    checkXRSupport().then(setXrCapabilities);
  }, []);

  const handleClick = () => {
    if (shouldShowVRPrompt()) {
      setShowPrompt(true);
    } else {
      enterExperience();
    }
  };

  const enterExperience = async () => {
    setIsEntering(true);
    try {
      const mode = xrCapabilities?.supportsVR ? "vr" : "3d";
      await startXRScene(mode);
    } finally {
      setIsEntering(false);
    }
  };

  const handleDontShowAgain = () => {
    hideVRPrompt();
    setShowPrompt(false);
    enterExperience();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isEntering}
        className="btn-tamv-cyan"
      >
        {xrCapabilities?.supportsVR ? (
          <>
            <Glasses className="h-4 w-4 mr-2" />
            Entrar en VR
          </>
        ) : (
          <>
            <Monitor className="h-4 w-4 mr-2" />
            Modo 3D
          </>
        )}
      </Button>

      {/* VR Prompt Modal */}
      {showPrompt && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setShowPrompt(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md card-tamv-featured p-6 z-50 animate-fade-up">
            <button
              onClick={() => setShowPrompt(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                {xrCapabilities?.supportsVR ? (
                  <Glasses className="h-8 w-8 text-primary-foreground" />
                ) : (
                  <Monitor className="h-8 w-8 text-primary-foreground" />
                )}
              </div>
              
              {xrCapabilities?.supportsVR ? (
                <>
                  <h3 className="font-bold text-xl mb-2">¡VR detectado!</h3>
                  <p className="text-muted-foreground">
                    Tu dispositivo soporta experiencias de realidad virtual. 
                    Prepara tu headset para una experiencia inmersiva única.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-xl mb-2">Modo 3D disponible</h3>
                  <p className="text-muted-foreground">
                    No detectamos hardware VR, pero puedes disfrutar la experiencia 
                    en modo 3D interactivo desde tu pantalla.
                  </p>
                </>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full btn-tamv-gold"
                onClick={enterExperience}
              >
                {xrCapabilities?.supportsVR ? "Iniciar experiencia VR" : "Entrar en modo 3D"}
              </Button>
              
              <Button 
                variant="outline"
                className="w-full btn-tamv-ghost"
                onClick={handleDontShowAgain}
              >
                No volver a mostrar
              </Button>
            </div>

            {xrCapabilities && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                Modos soportados: {xrCapabilities.supportedModes.join(", ") || "3D básico"}
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}
