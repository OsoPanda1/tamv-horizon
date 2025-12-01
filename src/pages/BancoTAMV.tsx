import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, RefreshCw, CreditCard, Send, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { formatCurrency } from "@/lib/api/wallet";

export default function BancoTAMVPage() {
  const { user } = useAuth();
  const { balance, transactions, loading, refresh } = useWallet();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Créditos TAMV",
      value: formatCurrency(balance?.tamv || 0, "TAMV"),
      change: "+12.5%",
      trend: "up",
      icon: <Wallet className="h-5 w-5" />
    },
    {
      title: "USD Equivalente",
      value: formatCurrency(balance?.usd || 0, "USD"),
      change: "+8.2%",
      trend: "up",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: "ETH Balance",
      value: formatCurrency(balance?.eth || 0, "ETH"),
      change: "-2.1%",
      trend: "down",
      icon: <TrendingUp className="h-5 w-5" />
    }
  ];

  const quickActions = [
    { icon: <Send className="h-5 w-5" />, label: "Enviar", action: "send" },
    { icon: <Download className="h-5 w-5" />, label: "Recibir", action: "receive" },
    { icon: <ArrowUpRight className="h-5 w-5" />, label: "Swap", action: "swap" },
    { icon: <CreditCard className="h-5 w-5" />, label: "Tarjeta", action: "card" }
  ];

  const handleQuickAction = (action: string) => {
    toast({
      title: "Próximamente",
      description: `La función de ${action} estará disponible pronto.`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Banco TAMV</h1>
              <p className="text-xs text-muted-foreground">Tu economía digital soberana</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {/* Balance Overview */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Balance Total</p>
                <h2 className="text-4xl font-bold text-glow-gold mb-2">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    formatCurrency(balance?.tamv || 0, "TAMV")
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15.3% este mes
                  </Badge>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    className="flex-col h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary/50"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    {action.icon}
                    <span className="text-xs mt-1">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {stat.icon}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={stat.trend === "up" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}
                  >
                    {stat.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{loading ? "..." : stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="earnings">Ganancias</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Commission Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Modelo de Comisiones TAMV</CardTitle>
                <CardDescription>
                  Fair Split: Tu ganancia transparente en cada transacción
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { module: "Conciertos", commission: "20%", creator: "80%" },
                    { module: "Subastas", commission: "12%", creator: "88%" },
                    { module: "DreamSpaces", commission: "25%", creator: "75%" },
                    { module: "Grupos/Canales", commission: "25%", creator: "75%" }
                  ].map((item) => (
                    <div key={item.module} className="p-3 rounded-lg bg-muted/50">
                      <p className="font-medium mb-2">{item.module}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Comisión TAMV:</span>
                        <span className="text-primary">{item.commission}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tu ganancia:</span>
                        <span className="text-green-500">{item.creator}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay transacciones recientes
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          tx.type === "income" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                        }`}>
                          {tx.type === "income" ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.module || "Transacción"}
                          </p>
                        </div>
                        <div className={`text-right ${tx.type === "income" ? "text-green-500" : "text-red-500"}`}>
                          <p className="font-medium">
                            {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, tx.currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Transacciones</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay transacciones
                  </p>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          tx.type === "income" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                        }`}>
                          {tx.type === "income" ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{tx.description}</p>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>{tx.status}</span>
                            {tx.module && <Badge variant="outline" className="text-xs">{tx.module}</Badge>}
                          </div>
                        </div>
                        <div className={`text-right ${tx.type === "income" ? "text-green-500" : "text-red-500"}`}>
                          <p className="font-bold">
                            {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, tx.currency)}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Ganancias</CardTitle>
                <CardDescription>
                  Tus ingresos por módulo en el ecosistema TAMV
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Las estadísticas de ganancias estarán disponibles cuando tengas más actividad.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
