import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Lightbulb, Users, Music, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IsabellaMessage } from "@/types/tamv";

interface IsabellaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickActions = [
  {
    icon: Lightbulb,
    label: "Generar idea de reto",
    prompt: "Dame una idea creativa para un reto de la comunidad TAMV"
  },
  {
    icon: Users,
    label: "Sugerir colaboración",
    prompt: "Sugiere con qué tipo de creador podría colaborar según mis intereses"
  },
  {
    icon: Music,
    label: "Planear concierto",
    prompt: "Ayúdame a planear mi primer concierto sensorial en TAMV"
  },
  {
    icon: Zap,
    label: "Monetización",
    prompt: "¿Cuáles son las mejores formas de monetizar mi contenido en TAMV?"
  }
];

export default function IsabellaChatModal({ isOpen, onClose }: IsabellaChatModalProps) {
  const [messages, setMessages] = useState<IsabellaMessage[]>([
    {
      id: "welcome",
      role: "isabella",
      content: "¡Hola! Soy Isabella, tu asistente creativa en TAMV. Estoy aquí para ayudarte a crear, conectar y descubrir oportunidades. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date().toISOString(),
      emotion: "happy"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: IsabellaMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate Isabella response (in production, this would call the edge function)
    setTimeout(() => {
      const responses = [
        "¡Excelente pregunta! Basándome en tu perfil y actividad, te sugiero explorar los DreamSpaces de arte digital. Hay una comunidad muy activa de artistas que están creando experiencias inmersivas increíbles.",
        "Me encanta tu curiosidad. En TAMV, las mejores colaboraciones surgen cuando combinas habilidades complementarias. Por ejemplo, un desarrollador con un artista visual puede crear DreamSpaces únicos.",
        "Para tu primer concierto sensorial, te recomiendo empezar con un formato íntimo de 30-50 asistentes. Esto te permite probar la experiencia y recibir feedback directo. ¿Quieres que te guíe paso a paso?",
        "La monetización en TAMV tiene múltiples caminos. Los más populares son: 1) Conciertos sensoriales con entradas, 2) DreamSpaces premium, 3) Membresías de contenido exclusivo. ¿Cuál te interesa más?"
      ];

      const isabellaMessage: IsabellaMessage = {
        id: `isabella-${Date.now()}`,
        role: "isabella",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        emotion: "helpful"
      };

      setMessages(prev => [...prev, isabellaMessage]);
      setIsTyping(false);
    }, 1500);
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold">Isabella IA</h3>
              <p className="text-xs text-muted-foreground">Tu asistente creativa</p>
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
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Acciones rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.prompt)}
                  className="flex items-center gap-2 p-2 text-left text-xs bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                >
                  <action.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="line-clamp-1">{action.label}</span>
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
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="btn-tamv-gold"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
