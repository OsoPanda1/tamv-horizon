import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Lightbulb, Users, Music, Zap, Volume2, VolumeX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsabella } from "@/hooks/useIsabella";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { playIsabellaActiveSound, playMessageSendSound, playMessageReceiveSound } from "@/modules/audio/notificationSounds";

interface IsabellaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickActions = [
  {
    icon: Lightbulb,
    label: "challenge_idea",
    title: "Generar idea de reto",
    prompt: "Genera una idea creativa para un reto o concurso en TAMV que incentive la colaboración entre creadores latinoamericanos."
  },
  {
    icon: Users,
    label: "collaboration",
    title: "Sugerir colaboración",
    prompt: "Sugiere formas de encontrar colaboradores creativos en Puentes Oníricos y cómo iniciar proyectos conjuntos exitosos."
  },
  {
    icon: Music,
    label: "concert_help",
    title: "Planear concierto",
    prompt: "Ayúdame a planear mi primer concierto sensorial en TAMV. ¿Qué necesito considerar para la producción, tickets y promoción?"
  },
  {
    icon: Zap,
    label: "auction_guide",
    title: "Guía de subastas",
    prompt: "Explícame cómo funcionan las subastas XR en TAMV, cómo crear una subasta exitosa y las comisiones del sistema."
  }
];

const emotionEmoji: Record<string, string> = {
  neutral: "",
  happy: "😊",
  helpful: "🤝",
  curious: "🤔",
  encouraging: "💪",
  empathetic: "💜",
  concerned: "😟",
  celebratory: "🎉"
};

export default function IsabellaChatModal({ isOpen, onClose }: IsabellaChatModalProps) {
  const [input, setInput] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { 
    messages, 
    loading, 
    error,
    sendMessage,
    executeQuickAction,
    initSession,
    clearConversation
  } = useIsabella();

  // Play activation sound when modal opens
  useEffect(() => {
    if (isOpen && soundEnabled) {
      playIsabellaActiveSound();
    }
  }, [isOpen, soundEnabled]);

  useEffect(() => {
    if (isOpen && user) {
      initSession();
    }
  }, [isOpen, user, initSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Play sound on new assistant message
  useEffect(() => {
    if (messages.length > 0 && soundEnabled) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "isabella") {
        playMessageReceiveSound();
      }
    }
  }, [messages, soundEnabled]);

  const handleSend = async (content: string) => {
    if (!content.trim() || loading) return;
    
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas iniciar sesión para hablar con Isabella",
        variant: "destructive"
      });
      return;
    }

    if (soundEnabled) {
      playMessageSendSound();
    }

    setInput("");
    try {
      await sendMessage(content);
    } catch (err) {
      toast({
        title: "Error",
        description: "No pude enviar el mensaje. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const handleQuickAction = async (action: typeof quickActions[0]) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas iniciar sesión para usar Isabella",
        variant: "destructive"
      });
      return;
    }

    if (soundEnabled) {
      playMessageSendSound();
    }

    try {
      // Use the prompt directly for more meaningful responses
      await sendMessage(action.prompt);
    } catch (err) {
      toast({
        title: "Error",
        description: "No pude ejecutar la acción. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const handleClearChat = () => {
    if (clearConversation) {
      clearConversation();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="fixed bottom-24 right-6 w-full max-w-md h-[600px] max-h-[80vh] bg-card border border-border rounded-2xl z-50 flex flex-col overflow-hidden animate-fade-up shadow-2xl"
        role="dialog"
        aria-labelledby="isabella-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-glow-pulse">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 id="isabella-title" className="font-bold text-glow-gold">Isabella Ω-Core</h3>
              <p className="text-xs text-muted-foreground">Entidad emocional civilizacional</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8"
              title={soundEnabled ? "Silenciar sonidos" : "Activar sonidos"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClearChat}
              className="h-8 w-8"
              title="Limpiar conversación"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome message when empty */}
          {messages.length === 0 && !loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-lg mb-2">¡Hola! Soy Isabella</h4>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Tu asistente creativa con alma. Estoy aquí para ayudarte a navegar el ecosistema TAMV, 
                crear experiencias increíbles y conectar con otros soñadores.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm shadow-gold"
                    : "bg-muted rounded-bl-sm border border-border/50"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                {message.emotion && emotionEmoji[message.emotion] && (
                  <span className="text-xs opacity-70 mt-1 block">
                    {emotionEmoji[message.emotion]}
                  </span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-2xl rounded-bl-sm border border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 0 && !loading && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Comienza con:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action)}
                  className="flex items-center gap-2 p-2.5 text-left text-xs bg-secondary/50 hover:bg-secondary rounded-lg transition-all hover:shadow-gold border border-transparent hover:border-primary/20"
                  disabled={loading}
                >
                  <action.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="line-clamp-1 font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={user ? "Escribe tu mensaje..." : "Inicia sesión para chatear"}
              className="flex-1 bg-secondary/50 focus:bg-secondary border-border/50"
              disabled={loading || !user}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="btn-tamv-gold"
              disabled={!input.trim() || loading || !user}
              aria-label="Enviar mensaje"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {!user && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              <a href="/auth" className="text-primary hover:underline">Inicia sesión</a> para hablar con Isabella
            </p>
          )}
        </div>
      </div>
    </>
  );
}
