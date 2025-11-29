import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Comisiones por módulo TAMV
const COMMISSION_RATES: Record<string, number> = {
  concert: 15.00,
  auction: 18.00,
  dreamspace: 25.00,
  group: 25.00,
  channel: 20.00,
  marketplace: 12.00,
  pet_accessory: 100.00 // 100% para TAMV en accesorios
};

interface TransactionRequest {
  buyerId: string;
  sellerId?: string;
  amount: number;
  currency: "TAMV" | "ETH" | "USD" | "MXN";
  module: string;
  referenceId: string;
  referenceType: string;
  description: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const txRequest: TransactionRequest = await req.json();
    const { buyerId, sellerId, amount, currency, module, referenceId, referenceType, description } = txRequest;

    if (!buyerId || !amount || !module || !referenceId) {
      throw new Error("buyerId, amount, module, and referenceId are required");
    }

    // Obtener wallet del comprador
    const { data: buyerWallet, error: buyerError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", buyerId)
      .single();

    if (buyerError || !buyerWallet) {
      throw new Error("Buyer wallet not found");
    }

    // Verificar saldo
    const balanceField = `balance_${currency.toLowerCase()}`;
    if ((buyerWallet as Record<string, number>)[balanceField] < amount) {
      throw new Error(`Insufficient ${currency} balance`);
    }

    // Calcular comisión TAMV
    const commissionPercent = COMMISSION_RATES[module] || 15.00;
    const platformFee = amount * (commissionPercent / 100);
    const creatorAmount = amount - platformFee;

    // Generar hash BookPI para trazabilidad
    const bookpiHash = `tx_${Date.now().toString(16)}_${Math.random().toString(16).slice(2, 10)}`;

    // Iniciar transacción en BD
    // 1. Crear registro de transacción
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        user_id: buyerId,
        wallet_id: buyerWallet.id,
        type: "expense",
        amount,
        currency,
        description,
        module,
        reference_id: referenceId,
        reference_type: referenceType,
        platform_fee: platformFee,
        creator_amount: creatorAmount,
        status: "pending",
        bookpi_hash: bookpiHash
      })
      .select()
      .single();

    if (txError) throw txError;

    // 2. Descontar del comprador
    const newBuyerBalance = (buyerWallet as Record<string, number>)[balanceField] - amount;
    const { error: updateBuyerError } = await supabase
      .from("wallets")
      .update({
        [balanceField]: newBuyerBalance,
        total_spent: buyerWallet.total_spent + amount
      })
      .eq("id", buyerWallet.id);

    if (updateBuyerError) throw updateBuyerError;

    // 3. Si hay vendedor, acreditar su parte
    if (sellerId) {
      const { data: sellerWallet, error: sellerError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", sellerId)
        .single();

      if (sellerWallet) {
        const newSellerBalance = (sellerWallet as Record<string, number>)[balanceField] + creatorAmount;
        await supabase
          .from("wallets")
          .update({
            [balanceField]: newSellerBalance,
            total_earned: sellerWallet.total_earned + creatorAmount
          })
          .eq("id", sellerWallet.id);

        // Crear transacción de ingreso para el vendedor
        await supabase.from("transactions").insert({
          user_id: sellerId,
          wallet_id: sellerWallet.id,
          type: "income",
          amount: creatorAmount,
          currency,
          description: `Venta en ${module}: ${description}`,
          module,
          reference_id: referenceId,
          reference_type: referenceType,
          platform_fee: 0,
          creator_amount: creatorAmount,
          status: "completed",
          bookpi_hash: `${bookpiHash}_seller`
        });
      }
    }

    // 4. Marcar transacción como completada
    await supabase
      .from("transactions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", transaction.id);

    // 5. Registrar en audit log
    await supabase.from("audit_logs").insert({
      entity_type: "transaction",
      entity_id: transaction.id,
      action: "transaction_completed",
      actor_id: buyerId,
      new_state: {
        amount,
        currency,
        module,
        platformFee,
        creatorAmount
      },
      bookpi_hash: bookpiHash,
      metadata: {
        buyerId,
        sellerId,
        referenceType,
        referenceId
      }
    });

    // 6. Crear notificaciones
    await supabase.from("notifications").insert({
      user_id: buyerId,
      type: "economic",
      title: "Compra realizada",
      message: `Has gastado ${amount} ${currency} en ${module}`,
      icon: "shopping-cart"
    });

    if (sellerId) {
      await supabase.from("notifications").insert({
        user_id: sellerId,
        type: "economic",
        title: "Venta realizada",
        message: `Has recibido ${creatorAmount} ${currency} (${100 - commissionPercent}% después de comisión TAMV)`,
        icon: "trending-up"
      });
    }

    console.log(`[TRANSACTION] ${transaction.id.slice(0, 8)}... | ${amount} ${currency} | Module: ${module} | Fee: ${platformFee}`);

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: transaction.id,
        bookpiHash,
        amount,
        currency,
        platformFee,
        creatorAmount,
        commissionPercent,
        newBalance: newBuyerBalance,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Transaction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Transaction failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
