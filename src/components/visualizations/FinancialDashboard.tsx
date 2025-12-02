import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Activity, Globe, Zap } from "lucide-react";

// Financial projections based on TAMV_Estudio_Financiero_Mercadotecnia_Completo
const METRICS = {
  tam: {
    latam: 650_000_000,
    creators: 12_300_000,
    entrepreneurs: 22_000_000
  },
  projections: {
    month12: {
      users: 150_000,
      arpu: 12,
      revenue: 1_800_000
    },
    month24: {
      users: 850_000,
      arpu: 25,
      revenue: 21_250_000
    },
    month36: {
      users: 2_500_000,
      arpu: 35,
      revenue: 87_500_000
    }
  },
  commissions: {
    concerts: 20,
    auctions: 20,
    dreamspaces: 25,
    groups: 25,
    channels: 25,
    marketplace: 15
  }
};

export default function FinancialDashboard() {
  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              Mercado LATAM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">650M</div>
            <p className="text-xs text-muted-foreground">Población total</p>
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary" className="text-xs">
                65% internet
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              Creadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.3M</div>
            <p className="text-xs text-muted-foreground">Creadores digitales</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                TAM: 1.9%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Emprendedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22M</div>
            <p className="text-xs text-muted-foreground">Freelancers/PYMES</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                TAM: 3.4%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              TAM Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34.3M</div>
            <p className="text-xs text-muted-foreground">Usuarios potenciales</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                5.3% LATAM
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Proyecciones de Ingresos (36 meses)
          </CardTitle>
          <CardDescription>
            Escenario base: Penetración conservadora del 0.73% TAM en 36 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Month 12 */}
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Mes 12</div>
                  <div className="text-2xl font-bold">$1.8M USD</div>
                </div>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-600">
                  150K usuarios
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ARPU:</span>
                  <span className="font-semibold ml-2">$12</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Penetración:</span>
                  <span className="font-semibold ml-2">0.44%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Crecimiento:</span>
                  <span className="font-semibold ml-2">Base</span>
                </div>
              </div>
            </div>

            {/* Month 24 */}
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Mes 24</div>
                  <div className="text-2xl font-bold">$21.3M USD</div>
                </div>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-600">
                  850K usuarios
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ARPU:</span>
                  <span className="font-semibold ml-2">$25</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Penetración:</span>
                  <span className="font-semibold ml-2">2.48%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Crecimiento:</span>
                  <span className="font-semibold ml-2 text-green-600">+467%</span>
                </div>
              </div>
            </div>

            {/* Month 36 */}
            <div className="border-l-4 border-primary pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Mes 36</div>
                  <div className="text-2xl font-bold">$87.5M USD</div>
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  2.5M usuarios
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ARPU:</span>
                  <span className="font-semibold ml-2">$35</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Penetración:</span>
                  <span className="font-semibold ml-2">7.29%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Crecimiento:</span>
                  <span className="font-semibold ml-2 text-green-600">+311%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Estructura de Comisiones TAMV
          </CardTitle>
          <CardDescription>
            Fair Split: Modelo de reparto equitativo con creadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(METRICS.commissions).map(([module, commission]) => {
              const creatorShare = 100 - commission;
              return (
                <div key={module} className="border rounded-lg p-3">
                  <div className="font-semibold capitalize mb-2">
                    {module.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Creador:</span>
                      <span className="font-semibold text-green-600">{creatorShare}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TAMV:</span>
                      <span className="font-semibold text-blue-600">{commission}%</span>
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${creatorShare}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Streams */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fuentes de Ingreso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between py-1">
              <span>Membresías Premium</span>
              <span className="font-semibold">$9.99-49.99/mes</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Comisiones Conciertos</span>
              <span className="font-semibold">20%</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Comisiones Subastas</span>
              <span className="font-semibold">20%</span>
            </div>
            <div className="flex justify-between py-1">
              <span>DreamSpaces Premium</span>
              <span className="font-semibold">25%</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Grupos/Canales de Paga</span>
              <span className="font-semibold">25%</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Accesorios Mascotas</span>
              <span className="font-semibold">100%</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Marketplace</span>
              <span className="font-semibold">15%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Métricas Clave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">LTV Promedio:</span>
              <span className="font-semibold">$400-1,200</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">CAC Target:</span>
              <span className="font-semibold">$15-25</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Ratio LTV/CAC:</span>
              <span className="font-semibold text-green-600">16:1 - 48:1</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Retención Mes 3:</span>
              <span className="font-semibold">70%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Margen Bruto:</span>
              <span className="font-semibold">60-75%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Break-Even:</span>
              <span className="font-semibold">Mes 18-22</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Payback Period:</span>
              <span className="font-semibold">2-4 meses</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
