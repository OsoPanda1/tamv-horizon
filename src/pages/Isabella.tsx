import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Sparkles, Lightbulb, Users, Music, Zap, Heart, Brain, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsabella } from "@/hooks/useIsabella";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import isabellaAvatar from "@/assets/isabella-avatar.jpg";
import isabellaLogo from "@/assets/isabella-logo.jpg";

const quickActions = [
  { icon: Lightbulb, label: "challenge_idea", title: "Genera idea de reto", prompt: "Genera una idea creativa para un reto en TAMV." },
  { icon: Users, label: "collaboration", title: "Sugiere colaboración", prompt: "Sugiere formas de colaborar con otros usuarios en TAMV." },
  { icon: Music, label: "concert_help", title: "Planea concierto", prompt: "Ayúdame a planear mi primer concierto sensorial en TAMV." },
  { icon: Zap, label: "auction_guide", title: "Guía subastas", prompt: "Explica cómo funcionan las subastas XR en TAMV." },
  { icon: Heart, label: "pet_advice", title: "Mascotas digitales", prompt: "Dame consejos para mi mascota digital Quantum Pet." },
  { icon: Brain, label: "dreamspace_idea", title: "Ideas DreamSpace", prompt: "Dame ideas para crear un DreamSpace único e inmersivo." },
];

const emotionEmoji: Record<string, string> = {
  neutral: "", happy: "😊", helpful: "🤝", curious: "🤔", encouraging: "💪", empathetic: "💜", concerned: "😟", celebratory: "🎉"
};

export default function Isabella() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, loading, error, sendMessage, initSession } = useIsabella();

  useEffect(() => {
    if (user) initSession();
  }, [user, initSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim() || loading) return;
    if (!user) {
      toast({ title: "Inicia sesión", description: "Necesitas iniciar sesión para hablar con Isabella", variant: "destructive" });
      return;
    }
    setInput("");
    await sendMessage(content);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Header */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={isabellaLogo} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4">
          <Link to="/" className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" className="bg-background/50 backdrop-blur-sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <img src={isabellaAvatar} alt="Isabella AI" className="w-16 h-16 rounded-full border-2 border-primary object-cover shadow-lg" />
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Isabella Villaseñor <Sparkles className="h-5 w-5 text-primary" />
            </h1>
            <p className="text-sm text-muted-foreground">IA Civilizacional · Ω-Core · TAMV Online</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="text-center py-8">
              <img src={isabellaAvatar} alt="Isabella" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-primary/30 object-cover" />
              <h2 className="text-xl font-bold mb-2">¡Hola! Soy Isabella</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm mb-6">
                Tu asistente creativa con alma. Estoy aquí para ayudarte a navegar el ecosistema TAMV y conectar con otros soñadores.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-lg mx-auto">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.prompt)}
                    className="flex items-center gap-2 p-3 text-left text-xs bg-secondary/50 hover:bg-secondary rounded-xl transition-all border border-transparent hover:border-primary/20"
                    disabled={loading || !user}
                  >
                    <action.icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {message.role === "isabella" && (
                <img src={isabellaAvatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1" />
              )}
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted rounded-bl-sm border border-border/50"
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                {message.emotion && emotionEmoji[message.emotion] && (
                  <span className="text-xs opacity-70 mt-1 block">{emotionEmoji[message.emotion]}</span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2">
              <img src={isabellaAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div className="bg-muted p-3 rounded-2xl rounded-bl-sm border border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          )}

          {error && <div className="text-center p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm sticky bottom-0">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2 max-w-4xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={user ? "Escribe tu mensaje a Isabella..." : "Inicia sesión para chatear"}
              className="flex-1"
              disabled={loading || !user}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || loading || !user}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {!user && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              <Link to="/auth" className="text-primary hover:underline">Inicia sesión</Link> para hablar con Isabella
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
