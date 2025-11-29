import { supabase } from "@/integrations/supabase/client";

export interface WalletBalance {
  tamv: number;
  eth: number;
  usd: number;
  mxn: number;
  totalEarned: number;
  totalSpent: number;
}

export interface Transaction {
  id: string;
  type: "income" | "expense" | "transfer" | "commission" | "refund" | "withdrawal";
  amount: number;
  currency: "TAMV" | "ETH" | "USD" | "MXN";
  description: string;
  module?: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  platformFee: number;
  creatorAmount: number;
  createdAt: string;
  completedAt?: string;
}

export interface TransactionRequest {
  buyerId: string;
  sellerId?: string;
  amount: number;
  currency: "TAMV" | "ETH" | "USD" | "MXN";
  module: string;
  referenceId: string;
  referenceType: string;
  description: string;
}

// Obtener balance del wallet
export async function getWalletBalance(userId: string): Promise<WalletBalance | null> {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching wallet:", error);
    return null;
  }

  return {
    tamv: Number(data.balance_tamv) || 0,
    eth: Number(data.balance_eth) || 0,
    usd: Number(data.balance_usd) || 0,
    mxn: Number(data.balance_mxn) || 0,
    totalEarned: Number(data.total_earned) || 0,
    totalSpent: Number(data.total_spent) || 0
  };
}

// Obtener historial de transacciones
export async function getTransactions(userId: string, limit = 20): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return (data || []).map(tx => ({
    id: tx.id,
    type: tx.type as Transaction["type"],
    amount: Number(tx.amount),
    currency: tx.currency as Transaction["currency"],
    description: tx.description || "",
    module: tx.module || undefined,
    status: tx.status as Transaction["status"],
    platformFee: Number(tx.platform_fee) || 0,
    creatorAmount: Number(tx.creator_amount) || 0,
    createdAt: tx.created_at,
    completedAt: tx.completed_at || undefined
  }));
}

// Procesar una transacción
export async function processTransaction(request: TransactionRequest): Promise<{
  success: boolean;
  transactionId?: string;
  newBalance?: number;
  error?: string;
}> {
  const { data, error } = await supabase.functions.invoke("process-transaction", {
    body: request
  });

  if (error) {
    console.error("Transaction error:", error);
    return { success: false, error: error.message };
  }

  return {
    success: true,
    transactionId: data.transactionId,
    newBalance: data.newBalance
  };
}

// Formatear moneda
export function formatCurrency(amount: number, currency: "TAMV" | "ETH" | "USD" | "MXN"): string {
  switch (currency) {
    case "TAMV":
      return `${amount.toLocaleString()} TAMV`;
    case "ETH":
      return `${amount.toFixed(6)} ETH`;
    case "USD":
      return `$${amount.toFixed(2)} USD`;
    case "MXN":
      return `$${amount.toFixed(2)} MXN`;
    default:
      return `${amount}`;
  }
}

// Calcular comisión
export function calculateCommission(amount: number, commissionPercent: number): {
  creatorAmount: number;
  platformAmount: number;
} {
  const platformAmount = amount * (commissionPercent / 100);
  const creatorAmount = amount - platformAmount;
  return { creatorAmount, platformAmount };
}
