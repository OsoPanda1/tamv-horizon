import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Gift, Heart, Star, Sparkles, Crown, Gem, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface VirtualGift {
  id: string;
  name: string;
  icon: React.ElementType;
  price: number;
  animation: string;
  color: string;
}

const VIRTUAL_GIFTS: VirtualGift[] = [
  { id: "heart", name: "Corazón", icon: Heart, price: 5, animation: "animate-bounce", color: "text-red-500" },
  { id: "star", name: "Estrella", icon: Star, price: 10, animation: "animate-spin", color: "text-yellow-500" },
  { id: "sparkles", name: "Destellos", icon: Sparkles, price: 25, animation: "animate-pulse", color: "text-purple-500" },
  { id: "crown", name: "Corona", icon: Crown, price: 50, animation: "animate-bounce", color: "text-amber-500" },
  { id: "gem", name: "Gema", icon: Gem, price: 100, animation: "animate-pulse", color: "text-cyan-500" },
  { id: "flame", name: "Llama", icon: Flame, price: 200, animation: "animate-pulse", color: "text-orange-500" },
  { id: "lightning", name: "Rayo", icon: Zap, price: 500, animation: "animate-bounce", color: "text-yellow-400" },
];

interface VirtualGiftsProps {
  recipientId: string;
  recipientName: string;
  contextType?: "concert" | "auction" | "dreamspace" | "profile" | "chat";
  contextId?: string;
  onGiftSent?: (gift: VirtualGift) => void;
}

export default function VirtualGifts({
  recipientId,
  recipientName,
  contextType = "profile",
  contextId,
  onGiftSent
}: VirtualGiftsProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedGift, setSelectedGift] = useState<VirtualGift | null>(null);

  const sendGift = async (gift: VirtualGift) => {
    if (!user) {
      toast.error("Debes iniciar sesión para enviar regalos");
      return;
    }

    setSending(true);
    setSelectedGift(gift);

    try {
      // Deduct from sender's wallet
      const { data: wallet, error: walletError } = await supabase
        .from("wallets")
        .select("balance_tamv")
        .eq("user_id", user.id)
        .single();

      if (walletError || !wallet) {
        toast.error("Error al verificar tu balance");
        return;
      }

      if ((wallet.balance_tamv || 0) < gift.price) {
        toast.error("Balance insuficiente");
        return;
      }

      // Update sender wallet
      await supabase
        .from("wallets")
        .update({ balance_tamv: (wallet.balance_tamv || 0) - gift.price })
        .eq("user_id", user.id);

      // Update recipient wallet (80% goes to recipient)
      const recipientAmount = gift.price * 0.8;
      const { data: recipientWallet } = await supabase
        .from("wallets")
        .select("balance_tamv")
        .eq("user_id", recipientId)
        .single();

      if (recipientWallet) {
        await supabase
          .from("wallets")
          .update({ balance_tamv: (recipientWallet.balance_tamv || 0) + recipientAmount })
          .eq("user_id", recipientId);
      }

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "expense",
        amount: gift.price,
        currency: "TAMV",
        description: `Regalo virtual: ${gift.name} para ${recipientName}`,
        reference_type: "gift",
        reference_id: gift.id,
        platform_fee: gift.price * 0.2,
        creator_amount: recipientAmount,
        status: "completed",
        module: contextType,
        metadata: {
          gift_type: gift.id,
          recipient_id: recipientId,
          context_type: contextType,
          context_id: contextId
        }
      });

      // Create notification for recipient
      await supabase.from("notifications").insert({
        user_id: recipientId,
        title: "¡Nuevo regalo!",
        message: `Has recibido un ${gift.name} de un admirador`,
        type: "social",
        icon: "🎁"
      });

      toast.success(`¡${gift.name} enviado a ${recipientName}!`);
      onGiftSent?.(gift);
      
      // Show animation then close
      setTimeout(() => {
        setSelectedGift(null);
        setOpen(false);
      }, 1500);

    } catch (error) {
      console.error("Error sending gift:", error);
      toast.error("Error al enviar el regalo");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Gift className="h-4 w-4" />
          Enviar Regalo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Enviar regalo a {recipientName}
          </DialogTitle>
        </DialogHeader>

        {/* Gift Animation Display */}
        {selectedGift && (
          <div className="flex justify-center py-8">
            <div className={cn("text-6xl", selectedGift.animation, selectedGift.color)}>
              <selectedGift.icon className="h-24 w-24" />
            </div>
          </div>
        )}

        {/* Gift Grid */}
        {!selectedGift && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {VIRTUAL_GIFTS.map(gift => (
              <button
                key={gift.id}
                onClick={() => sendGift(gift)}
                disabled={sending}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl",
                  "bg-muted/50 hover:bg-muted transition-all",
                  "hover:scale-105 hover:shadow-lg",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <gift.icon className={cn("h-8 w-8", gift.color)} />
                <span className="text-xs font-medium">{gift.name}</span>
                <span className="text-xs text-primary font-bold">{gift.price} TAMV</span>
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          El 80% del valor va al creador, 20% comisión TAMV
        </p>
      </DialogContent>
    </Dialog>
  );
}
