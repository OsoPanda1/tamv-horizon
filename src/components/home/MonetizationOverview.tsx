import { useState } from "react";
import { 
  Music, 
  Sparkles, 
  Gavel, 
  Store, 
  Crown, 
  Users, 
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonetizationOption {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  commission: string;
  example: string;
  color: string;
}

const monetizationOptions: MonetizationOption[] = [
  {
    id: "concerts",
    icon: Music,
    title: "Conciertos Sensoriales",
    description: "Crea experiencias musicales inmersivas con audio 3D y visuales XR",
    commission: "12-15%",
    example: "Artista vende 500 entradas a $50 TAMV = $21,250 neto",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "dreamspaces",
    icon: Sparkles,
    title: "DreamSpaces",
    description: "Diseña y monetiza espacios virtuales únicos con acceso premium",
    commission: "10-15%",
    example: "1,000 visitantes pagando $25 TAMV = $21,250 neto",
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: "auctions",
    icon: Gavel,
    title: "Subastas",
    description: "Vende arte digital, coleccionables y activos únicos",
    commission: "12-18%",
    example: "NFT vendido por 5 ETH = 4.1 ETH para el creador",
    color: "from-orange-500 to-red-500"
  },
  {
    id: "marketplace",
    icon: Store,
    title: "Marketplaces",
    description: "Vende productos digitales, cursos y servicios",
    commission: "8-12%",
    example: "Curso de $100 USD × 200 ventas = $17,600 neto",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "memberships",
    icon: Crown,
    title: "Membresías",
    description: "Ofrece contenido exclusivo con suscripciones recurrentes",
    commission: "5-10%",
    example: "500 suscriptores × $10/mes = $4,500/mes neto",
    color: "from-yellow-500 to-amber-500"
  },
  {
    id: "affiliates",
    icon: Users,
    title: "Programa de Afiliados",
    description: "Gana comisiones por referir usuarios y creadores",
    commission: "Variable",
    example: "Referir 1,000 usuarios activos = Premium gratis por 1 año",
    color: "from-indigo-500 to-violet-500"
  }
];

export default function MonetizationOverview() {
  const [selectedOption, setSelectedOption] = useState<MonetizationOption | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">Monetización TAMV</h2>
          <p className="text-sm text-muted-foreground">Múltiples formas de generar ingresos</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Guía completa
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {monetizationOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedOption?.id === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => setSelectedOption(isSelected ? null : option)}
              className={`card-tamv p-4 text-left transition-all ${
                isSelected ? "border-primary ring-1 ring-primary/20" : "hover:border-primary/30"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mb-3`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{option.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {option.description}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">Comisión:</span>
                <span className="text-primary font-medium">{option.commission}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Option Details */}
      {selectedOption && (
        <div className="card-tamv-featured p-4 animate-fade-up">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedOption.color} flex items-center justify-center flex-shrink-0`}>
              <selectedOption.icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{selectedOption.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedOption.description}
              </p>
              
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Info className="h-3 w-3" />
                  <span>Ejemplo de ganancias</span>
                </div>
                <p className="text-sm font-medium">{selectedOption.example}</p>
              </div>

              <div className="flex gap-3 mt-4">
                <Button size="sm" className="btn-tamv-gold">
                  Comenzar
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button size="sm" variant="outline" className="btn-tamv-ghost">
                  Ver tutorial
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
