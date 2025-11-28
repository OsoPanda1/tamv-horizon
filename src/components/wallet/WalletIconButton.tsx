import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import BancoTAMVPanel from "./BancoTAMVPanel";

export default function WalletIconButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        id="tamv-wallet"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative hover:text-primary"
      >
        <Wallet className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
      </Button>

      <BancoTAMVPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
