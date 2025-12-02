import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Lightbulb, Users, Music, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsabella } from "@/hooks/useIsabella";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface IsabellaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickActions = [
  {
    icon: Lightbulb,
    label: "challenge_idea",
    title: "Generar idea de reto",
  },
  {
    icon: Users,
    label: "collaboration",
    title: "Sugerir colaboración",
  },
  {
    icon: Music,
    label: "concert_help",
    title: "Planear concierto",
  },
  {
    icon: Zap,
    label: "auction_guide",
    title: "Guía de subastas",
  }
];

export default function IsabellaChatModal({ isOpen, onClose }: IsabellaChatModalProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { 
    messages, 
    loading, 
    error,
    sendMessage,
    executeQuickAction,
    initSession 
  } = useIsabella();

  useEffect(() => {
    if (isOpen && user) {
      initSession();
    }
  }, [isOpen, user, initSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleQuickAction = async (actionId: string) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas iniciar sesión para usar Isabella",
        variant: "destructive"
      });
      return;
    }

    try {
      await executeQuickAction(actionId);
    } catch (err) {
      toast({
        title: "Error",
        description: "No pude ejecutar la acción. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-24 right-6 w-full max-w-md h-[600px] max-h-[80vh] bg-card border border-border rounded-2xl z-50 flex flex-col overflow-hidden animate-fade-up shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-glow-pulse">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-glow-gold">Isabella IA</h3>
              <p className="text-xs text-muted-foreground">Asistente creativa con alma</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm shadow-gold"
                    : "bg-muted rounded-bl-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.emotion && (
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.emotion === "happy" && "😊"}
                    {message.emotion === "helpful" && "🤝"}
                    {message.emotion === "curious" && "🤔"}
                  </span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-sm text-destructive">
              {error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && !loading && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Acciones rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex items-center gap-2 p-2 text-left text-xs bg-secondary/50 hover:bg-secondary rounded-lg transition-all hover:shadow-gold"
                  disabled={loading}
                >
                  <action.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="line-clamp-1">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
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
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-secondary/50 focus:bg-secondary"
              disabled={loading || !user}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="btn-tamv-gold"
              disabled={!input.trim() || loading || !user}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {!user && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Inicia sesión para hablar con Isabella
            </p>
          )}
        </div>
      </div>
    </>
  );
}
