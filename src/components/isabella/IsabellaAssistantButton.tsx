import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import IsabellaChatModal from "./IsabellaChatModal";

export default function IsabellaAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        id="tamv-isabella"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full btn-tamv-gold shadow-lg z-40 animate-glow-pulse"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      <IsabellaChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
