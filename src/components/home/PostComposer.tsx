import { useState } from "react";
import { Image, Video, Mic, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function PostComposer() {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;
    // In production, this would submit to the backend
    console.log("[POST] Creating new post:", content);
    setContent("");
    setIsFocused(false);
  };

  return (
    <div 
      id="tamv-composer"
      className={`card-tamv p-4 transition-all ${isFocused ? "border-primary/50 shadow-lg" : ""}`}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" />
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="¿Qué estás creando hoy?"
            className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground text-sm min-h-[60px]"
            rows={isFocused ? 3 : 2}
          />

          {/* Action Bar */}
          <div className={`flex items-center justify-between pt-3 border-t border-border transition-all ${isFocused ? "opacity-100" : "opacity-70"}`}>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Image className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Mic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent">
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              size="sm" 
              className="btn-tamv-gold"
              disabled={!content.trim()}
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4 mr-1" />
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
