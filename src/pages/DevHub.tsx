import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Book, Code, FileText, Zap, Shield, Users, Database, Globe, ChevronRight, Search, ExternalLink, Lock, TrendingUp } from "lucide-react";
import FinancialDashboard from "@/components/visualizations/FinancialDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Documentation structure based on CODEX
const DOC_SECTIONS = [
  {
    id: "i",
    title: "I. Elementos Preliminares",
    icon: <Book className="h-4 w-4" />,
    items: [
      { id: "1", title: "Prólogo", access: "public" },
      { id: "2", title: "Dedicatoria", access: "public" },
      { id: "3", title: "Biografía del Fundador", access: "public" },
      { id: "4", title: "Glosario Enciclopédico", access: "public" },
      { id: "5", title: "Tabla de Elementos TAMV", access: "public" }
    ]
  },
  {
    id: "ii",
    title: "II. Declaración Fundacional",
    icon: <FileText className="h-4 w-4" />,
    items: [
      { id: "14", title: "Contexto Histórico", access: "public" },
      { id: "15", title: "Manifiesto de Redención", access: "public" },
      { id: "16", title: "Isabella como Entidad Emocional", access: "public" },
      { id: "17", title: "Propósito Civilizatorio", access: "public" },
      { id: "18", title: "Juramento Ético del Sistema", access: "public" }
    ]
  },
  {
    id: "iv",
    title: "IV. Arquitectura Técnica",
    icon: <Code className="h-4 w-4" />,
    items: [
      { id: "24", title: "Visión General", access: "dev" },
      { id: "25", title: "Núcleo TAMV", access: "dev" },
      { id: "26", title: "Sistema Isabella AI™", access: "dev" },
      { id: "27", title: "Ecosistema MD-X4™", access: "dev" },
      { id: "28", title: "Núcleo Híbrido Cuántico", access: "builder" },
      { id: "32", title: "APIs Completas (REST/GraphQL/gRPC)", access: "builder" }
    ]
  },
  {
    id: "v",
    title: "V. Componentes Funcionales",
    icon: <Database className="h-4 w-4" />,
    items: [
      { id: "33", title: "Backend Distribuido", access: "dev" },
      { id: "34", title: "Orquestador DEKATEOTL", access: "builder" },
      { id: "35", title: "API Gateway", access: "dev" },
      { id: "36", title: "SDKs", access: "dev" },
      { id: "37", title: "Sistema de Memoria Emocional", access: "architect" }
    ]
  },
  {
    id: "vii",
    title: "VII. Seguridad y Ética",
    icon: <Shield className="h-4 w-4" />,
    items: [
      { id: "55", title: "Anubis Sentinel", access: "architect" },
      { id: "56", title: "Validación Ética Multicapa", access: "builder" },
      { id: "57", title: "Protocolos de Shutdown", access: "architect" },
      { id: "58", title: "Firma Cognitiva Irrepetible", access: "architect" },
      { id: "59", title: "Auditoría Blockchain-like", access: "architect" }
    ]
  },
  {
    id: "ix",
    title: "IX. Interacción Social",
    icon: <Users className="h-4 w-4" />,
    items: [
      { id: "68", title: "Canales Federados", access: "dev" },
      { id: "69", title: "Grupos y Redes", access: "dev" },
      { id: "70", title: "Conciertos Sensoriales", access: "dev" },
      { id: "71", title: "Puentes Oníricos", access: "dev" },
      { id: "74", title: "Concursos y Lotería", access: "dev" }
    ]
  },
  {
    id: "xi",
    title: "XI. Economía Digital",
    icon: <Zap className="h-4 w-4" />,
    items: [
      { id: "87", title: "Banco TAMV", access: "dev" },
      { id: "88", title: "Plataforma Clattleya", access: "builder" },
      { id: "90", title: "Marketplace", access: "dev" },
      { id: "91", title: "Créditos TAMV", access: "dev" }
    ]
  }
];

// API Endpoints
const API_ENDPOINTS = [
  {
    method: "POST",
    path: "/api/isabella/chat",
    description: "Comunicación con Isabella AI",
    auth: "JWT"
  },
  {
    method: "GET",
    path: "/api/recommendations",
    description: "Obtener recomendaciones personalizadas",
    auth: "JWT"
  },
  {
    method: "POST",
    path: "/api/transactions/process",
    description: "Procesar transacciones TAMV",
    auth: "JWT + MFA"
  },
  {
    method: "GET",
    path: "/api/puentes/matches",
    description: "Obtener matches de Puentes Oníricos",
    auth: "JWT"
  },
  {
    method: "POST",
    path: "/api/audit/log",
    description: "Registrar evento auditable",
    auth: "Service Token"
  },
  {
    method: "GET",
    path: "/api/concerts/:id",
    description: "Obtener detalles de concierto",
    auth: "Public/JWT"
  },
  {
    method: "POST",
    path: "/api/auctions/:id/bid",
    description: "Realizar puja en subasta",
    auth: "JWT"
  },
  {
    method: "GET",
    path: "/api/dreamspaces",
    description: "Listar DreamSpaces públicos",
    auth: "Public"
  }
];

// Dev Tiers
const DEV_TIERS = [
  { id: "explorar", name: "Explorar", price: "Gratis", access: "Docs filosóficas", color: "bg-slate-500" },
  { id: "dev", name: "Creador Dev", price: "$9.99/mes", access: "APIs básicas", color: "bg-blue-500" },
  { id: "builder", name: "Builder Avanzado", price: "$29.99/mes", access: "APIs avanzadas", color: "bg-purple-500" },
  { id: "architect", name: "Arquitecto de Mundos", price: "$99.99/mes", access: "Full access", color: "bg-primary" }
];

export default function DevHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentTier] = useState("explorar"); // Would come from user profile

  const getAccessBadge = (access: string) => {
    if (access === "public") return null;
    const tier = DEV_TIERS.find(t => t.id === access);
    if (!tier) return null;
    
    const hasAccess = DEV_TIERS.findIndex(t => t.id === currentTier) >= DEV_TIERS.findIndex(t => t.id === access);
    
    return (
      <Badge 
        variant={hasAccess ? "secondary" : "outline"} 
        className={`text-xs ${hasAccess ? "" : "opacity-50"}`}
      >
        {hasAccess ? tier.name : <><Lock className="h-3 w-3 mr-1" />{tier.name}</>}
      </Badge>
    );
  };

  const filteredSections = DOC_SECTIONS.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              <Code className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Dev Hub TAMV</h1>
              <p className="text-xs text-muted-foreground">Documentación Oficial del Ecosistema</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en documentación..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Navigation */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Navegación</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <Accordion type="single" collapsible className="px-2 pb-2">
                    {filteredSections.map((section) => (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="text-sm py-2 hover:no-underline">
                          <span className="flex items-center gap-2">
                            {section.icon}
                            {section.title}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-1 pl-6">
                            {section.items.map((item) => (
                              <li key={item.id}>
                                <button
                                  className={`w-full flex items-center justify-between text-left text-sm py-1.5 px-2 rounded hover:bg-muted transition-colors ${
                                    activeSection === item.id ? "bg-muted" : ""
                                  }`}
                                  onClick={() => setActiveSection(item.id)}
                                >
                                  <span className="truncate">{item.title}</span>
                                  {getAccessBadge(item.access)}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Dev Tiers */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Tu Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {DEV_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className={`flex items-center justify-between p-2 rounded ${
                      currentTier === tier.id ? "bg-primary/10 border border-primary/20" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${tier.color}`} />
                      <span className="text-sm">{tier.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{tier.price}</span>
                  </div>
                ))}
                <Button className="w-full mt-2" variant="outline" size="sm">
                  Actualizar Plan
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main>
            <Tabs defaultValue="docs">
              <TabsList className="mb-4">
                <TabsTrigger value="docs">Documentación</TabsTrigger>
                <TabsTrigger value="api">API Reference</TabsTrigger>
                <TabsTrigger value="examples">Ejemplos</TabsTrigger>
                <TabsTrigger value="financials">Proyecciones Financieras</TabsTrigger>
              </TabsList>

              {/* Documentation Tab */}
              <TabsContent value="docs" className="space-y-6">
                {/* Welcome Card */}
                <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-2">CODEX TAMV 2026</h2>
                        <p className="text-muted-foreground mb-4">
                          Documento fundacional auditable de un ecosistema de IA soberana, 
                          diseñado en México para la protección integral de la dignidad digital humana.
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm">
                            <Book className="h-4 w-4 mr-2" />
                            Leer Prólogo
                          </Button>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver Whitepaper
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Manifiesto</h3>
                        <p className="text-xs text-muted-foreground">Principios fundamentales</p>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Code className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Arquitectura</h3>
                        <p className="text-xs text-muted-foreground">Stack técnico MD-X4</p>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Seguridad</h3>
                        <p className="text-xs text-muted-foreground">Zero Trust & Ética</p>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                </div>

                {/* Content Sections */}
                <div className="space-y-4">
                  {DOC_SECTIONS.slice(0, 3).map((section) => (
                    <Card key={section.id}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          {section.icon}
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid gap-2 md:grid-cols-2">
                          {section.items.map((item) => (
                            <li key={item.id}>
                              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-muted transition-colors text-left">
                                <span className="text-sm">{item.title}</span>
                                {getAccessBadge(item.access)}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* API Reference Tab */}
              <TabsContent value="api" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>API Endpoints</CardTitle>
                    <CardDescription>
                      Endpoints disponibles para integraciones TAMV
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {API_ENDPOINTS.map((endpoint, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <Badge
                            variant={endpoint.method === "GET" ? "secondary" : "default"}
                            className={`w-16 justify-center ${
                              endpoint.method === "GET" ? "bg-green-500/20 text-green-600" :
                              endpoint.method === "POST" ? "bg-blue-500/20 text-blue-600" :
                              "bg-orange-500/20 text-orange-600"
                            }`}
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="flex-1 text-sm font-mono">{endpoint.path}</code>
                          <span className="text-sm text-muted-foreground hidden md:block">
                            {endpoint.description}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {endpoint.auth}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Examples Tab */}
              <TabsContent value="examples" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ejemplos de Código</CardTitle>
                    <CardDescription>
                      Snippets y ejemplos de integración
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// Ejemplo: Comunicación con Isabella AI
import { sendMessageToIsabella } from "@/lib/api/isabella";

const response = await sendMessageToIsabella(
  "Ayúdame a crear un concierto sensorial",
  sessionId,
  userId,
  "concerts"
);

console.log(response.response);
// Isabella: "¡Genial! Para crear un concierto sensorial..."
`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Financials Tab */}
              <TabsContent value="financials" className="space-y-6">
                <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-2">Estudio Financiero TAMV 2025-2028</h2>
                        <p className="text-muted-foreground mb-4">
                          Proyecciones de ingresos, usuarios y sostenibilidad basadas en análisis de mercado LATAM.
                          Escenario conservador con penetración del 0.73% TAM en 36 meses.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <FinancialDashboard />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
