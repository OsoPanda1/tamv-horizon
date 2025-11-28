import { X, ArrowUpRight, ArrowDownLeft, ExternalLink, TrendingUp, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWalletState, formatCurrency } from "@/modules/wallet/walletState";

interface BancoTAMVPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BancoTAMVPanel({ isOpen, onClose }: BancoTAMVPanelProps) {
  const walletState = getWalletState();
  const recentTransactions = walletState.transactions.slice(0, 5);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-glow-gold">Banco TAMV</h2>
            <p className="text-xs text-muted-foreground">Tu centro financiero digital</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Balance Cards */}
          <div className="grid gap-3">
            {/* TAMV Balance */}
            <div className="card-tamv-featured p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Saldo TAMV</span>
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {walletState.balance.tamv.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">≈ ${(walletState.balance.tamv * 0.5).toFixed(2)} USD</p>
            </div>

            {/* ETH & USD */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card-tamv p-4">
                <span className="text-xs text-muted-foreground">ETH</span>
                <p className="text-xl font-bold mt-1">{walletState.balance.eth.toFixed(4)}</p>
              </div>
              <div className="card-tamv p-4">
                <span className="text-xs text-muted-foreground">USD</span>
                <p className="text-xl font-bold mt-1">${walletState.balance.usd.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button className="btn-tamv-gold h-12">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Enviar
            </Button>
            <Button className="btn-tamv-cyan h-12">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Recibir
            </Button>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Transacciones recientes</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                Ver todas
              </Button>
            </div>

            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === "income" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                    }`}>
                      {tx.type === "income" ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString("es-MX", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    tx.type === "income" ? "text-accent" : "text-foreground"
                  }`}>
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount, tx.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Module Earnings Info */}
          <div className="card-tamv p-4">
            <h4 className="font-semibold text-sm mb-3">Comisiones TAMV</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conciertos Sensoriales</span>
                <span>12-15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subastas</span>
                <span>12-18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DreamSpaces Premium</span>
                <span>10-15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grupos/Canales de paga</span>
                <span>8-12%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * Las comisiones ayudan a mantener y mejorar el ecosistema TAMV
            </p>
          </div>

          {/* CTA */}
          <Button className="w-full btn-tamv-ghost" asChild>
            <a href="/banco">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ir a Banco TAMV completo
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
