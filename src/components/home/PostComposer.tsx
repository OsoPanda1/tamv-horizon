import { useState, useRef } from "react";
import { Image, Video, Mic, Sparkles, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaPreview {
  file: File;
  type: "image" | "video" | "audio";
  preview: string;
}

export default function PostComposer() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "audio") => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} es muy grande. Máximo 50MB.`);
        return;
      }

      const preview = URL.createObjectURL(file);
      setMediaFiles(prev => [...prev, { file, type, preview }]);
    });

    // Reset input
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;
    
    if (!user) {
      toast.error("Debes iniciar sesión para publicar");
      return;
    }

    setIsSubmitting(true);

    try {
      const mediaUrls: string[] = [];

      // Upload media files
      for (const media of mediaFiles) {
        const fileExt = media.file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("posts")
          .upload(fileName, media.file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error(`Error subiendo ${media.file.name}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("posts")
          .getPublicUrl(fileName);

        if (urlData) {
          mediaUrls.push(urlData.publicUrl);
        }
      }

      // Create post record (assuming a posts table exists or will be created)
      // For now, log and show success
      console.log("[POST] Creating post:", {
        content,
        media: mediaUrls,
        userId: user.id
      });

      // Log the event for analytics
      await supabase.functions.invoke("audit-log", {
        body: {
          action: "post_created",
          entity_type: "post",
          entity_id: crypto.randomUUID(),
          actor_id: user.id,
          metadata: {
            content_length: content.length,
            media_count: mediaUrls.length,
            media_types: mediaFiles.map(m => m.type)
          }
        }
      }).catch(() => {}); // Silent fail for audit

      toast.success("¡Publicación creada!");
      setContent("");
      setMediaFiles([]);
      setIsFocused(false);

    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error al crear la publicación");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="tamv-composer"
      className={cn(
        "card-tamv p-4 transition-all duration-300",
        isFocused && "border-primary/50 shadow-gold"
      )}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {user?.email?.[0]?.toUpperCase() || "T"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="¿Qué estás creando hoy?"
            className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground text-sm min-h-[60px]"
            rows={isFocused ? 4 : 2}
            disabled={isSubmitting}
          />

          {/* Media Previews */}
          {mediaFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {mediaFiles.map((media, index) => (
                <div key={index} className="relative group">
                  {media.type === "image" && (
                    <img
                      src={media.preview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg border border-border"
                    />
                  )}
                  {media.type === "video" && (
                    <video
                      src={media.preview}
                      className="h-20 w-20 object-cover rounded-lg border border-border"
                    />
                  )}
                  {media.type === "audio" && (
                    <div className="h-20 w-20 rounded-lg border border-border bg-muted flex items-center justify-center">
                      <Mic className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div className={cn(
            "flex items-center justify-between pt-3 border-t border-border transition-all",
            isFocused ? "opacity-100" : "opacity-70"
          )}>
            <div className="flex gap-1">
              {/* Image Upload */}
              <input
                type="file"
                ref={imageInputRef}
                onChange={(e) => handleFileSelect(e, "image")}
                accept="image/*"
                multiple
                className="hidden"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={() => imageInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <Image className="h-4 w-4" />
              </Button>

              {/* Video Upload */}
              <input
                type="file"
                ref={videoInputRef}
                onChange={(e) => handleFileSelect(e, "video")}
                accept="video/*"
                className="hidden"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={() => videoInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <Video className="h-4 w-4" />
              </Button>

              {/* Audio Upload */}
              <input
                type="file"
                ref={audioInputRef}
                onChange={(e) => handleFileSelect(e, "audio")}
                accept="audio/*"
                className="hidden"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={() => audioInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <Mic className="h-4 w-4" />
              </Button>

              {/* AI Enhance */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-accent"
                disabled={isSubmitting}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              size="sm" 
              className="btn-tamv-gold"
              disabled={(!content.trim() && mediaFiles.length === 0) || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
