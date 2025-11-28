import { WalletBalance, WalletTransaction } from "@/types/tamv";
import { MOCK_WALLET_BALANCE, MOCK_TRANSACTIONS } from "@/data/mockData";

const WALLET_STORAGE_KEY = "tamv_wallet_state";

export interface WalletState {
  balance: WalletBalance;
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: string | null;
}

export function getWalletState(): WalletState {
  const stored = localStorage.getItem(WALLET_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getDefaultState();
    }
  }
  return getDefaultState();
}

function getDefaultState(): WalletState {
  return {
    balance: MOCK_WALLET_BALANCE,
    transactions: MOCK_TRANSACTIONS,
    isLoading: false,
    error: null
  };
}

export function saveWalletState(state: WalletState): void {
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(state));
}

export function addTransaction(transaction: Omit<WalletTransaction, "id" | "timestamp" | "status">): WalletTransaction {
  const state = getWalletState();
  
  const newTransaction: WalletTransaction = {
    ...transaction,
    id: `tx-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: "pending"
  };
  
  state.transactions = [newTransaction, ...state.transactions];
  
  // Update balance
  if (transaction.type === "income") {
    if (transaction.currency === "TAMV") {
      state.balance.tamv += transaction.amount;
    } else if (transaction.currency === "ETH") {
      state.balance.eth += transaction.amount;
    } else {
      state.balance.usd += transaction.amount;
    }
  } else if (transaction.type === "expense") {
    if (transaction.currency === "TAMV") {
      state.balance.tamv -= transaction.amount;
    } else if (transaction.currency === "ETH") {
      state.balance.eth -= transaction.amount;
    } else {
      state.balance.usd -= transaction.amount;
    }
  }
  
  saveWalletState(state);
  return newTransaction;
}

export function getRecentTransactions(limit: number = 5): WalletTransaction[] {
  const state = getWalletState();
  return state.transactions.slice(0, limit);
}

export function getTransactionsByModule(module: string): WalletTransaction[] {
  const state = getWalletState();
  return state.transactions.filter(tx => tx.module === module);
}

export function formatCurrency(amount: number, currency: "TAMV" | "ETH" | "USD"): string {
  switch (currency) {
    case "TAMV":
      return `${amount.toLocaleString()} TAMV`;
    case "ETH":
      return `${amount.toFixed(4)} ETH`;
    case "USD":
      return `$${amount.toFixed(2)} USD`;
    default:
      return `${amount}`;
  }
}

export function calculateCommission(amount: number, commissionPercent: number): {
  creatorAmount: number;
  platformAmount: number;
} {
  const platformAmount = amount * (commissionPercent / 100);
  const creatorAmount = amount - platformAmount;
  return { creatorAmount, platformAmount };
}

// Audit logging stub - connects to backend in production
export function logWalletEvent(eventType: string, data: Record<string, unknown>): void {
  // This event should be recorded in ledger / audit log when connected to production backend
  console.log(`[AUDIT] Wallet Event: ${eventType}`, {
    ...data,
    timestamp: new Date().toISOString(),
    eventId: `evt-${Date.now()}`
  });
}
