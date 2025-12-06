import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Gift, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VirtualGift {
  id: string;
  name: string;
  icon_url: string;
  price: number;
  rarity: string;
  category: string;
}

interface VirtualGiftsProps {
  recipientId: string;
  recipientName: string;
  contextType?: "concert" | "auction" | "dreamspace" | "profile" | "chat";
  contextId?: string;
  onGiftSent?: (gift: VirtualGift) => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: "border-gray-400",
  rare: "border-blue-500",
  epic: "border-purple-500",
  legendary: "border-amber-500",
  mythic: "border-rose-500"
};

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
  const [gifts, setGifts] = useState<VirtualGift[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch virtual gifts from database
  useEffect(() => {
    const fetchGifts = async () => {
      const { data, error } = await supabase
        .from("virtual_gifts")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) {
        console.error("Error fetching gifts:", error);
        return;
      }

      setGifts(data || []);
      setLoading(false);
    };

    if (open) {
      fetchGifts();
    }
  }, [open]);

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
      const { data: transaction } = await supabase.from("transactions").insert({
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
          gift_id: gift.id,
          recipient_id: recipientId,
          context_type: contextType,
          context_id: contextId
        }
      }).select().single();

      // Record gift transaction
      await supabase.from("gift_transactions").insert({
        gift_id: gift.id,
        sender_id: user.id,
        recipient_id: recipientId,
        amount: gift.price,
        context_type: contextType,
        context_id: contextId,
        transaction_id: transaction?.id
      });

      // Create notification for recipient
      await supabase.from("notifications").insert({
        user_id: recipientId,
        title: "¡Nuevo regalo!",
        message: `Has recibido un ${gift.name} de un admirador`,
        type: "social",
        icon: gift.icon_url
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
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-6xl animate-bounce mb-4">
              {selectedGift.icon_url}
            </div>
            <p className="text-lg font-semibold text-primary">
              ¡{selectedGift.name} enviado!
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && !selectedGift && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Gift Grid */}
        {!selectedGift && !loading && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {gifts.map(gift => (
              <button
                key={gift.id}
                onClick={() => sendGift(gift)}
                disabled={sending}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl",
                  "bg-muted/50 hover:bg-muted transition-all",
                  "hover:scale-105 hover:shadow-lg",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "border-2",
                  RARITY_COLORS[gift.rarity] || "border-border"
                )}
              >
                <span className="text-3xl">{gift.icon_url}</span>
                <span className="text-xs font-medium text-center">{gift.name}</span>
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