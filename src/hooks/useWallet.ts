import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getWalletBalance, getTransactions, processTransaction, type WalletBalance, type Transaction, type TransactionRequest } from "@/lib/api/wallet";
import { useAuth } from "./useAuth";

export function useWallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletData = useCallback(async () => {
    if (!user) {
      setBalance(null);
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [walletBalance, txHistory] = await Promise.all([
        getWalletBalance(user.id),
        getTransactions(user.id, 20)
      ]);

      setBalance(walletBalance);
      setTransactions(txHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading wallet");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("wallet-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refrescar datos cuando hay cambios
          fetchWalletData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchWalletData]);

  const makeTransaction = async (request: Omit<TransactionRequest, "buyerId">) => {
    if (!user) {
      return { success: false, error: "Usuario no autenticado" };
    }

    const result = await processTransaction({
      ...request,
      buyerId: user.id
    });

    if (result.success) {
      // Refrescar datos
      await fetchWalletData();
    }

    return result;
  };

  return {
    balance,
    transactions,
    loading,
    error,
    refresh: fetchWalletData,
    makeTransaction
  };
}
