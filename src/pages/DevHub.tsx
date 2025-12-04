import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Book, Code, FileText, Zap, Shield, Users, Database, Globe, 
  ChevronRight, Search, ExternalLink, Lock, TrendingUp, Server, Key,
  AlertTriangle, CheckCircle, Clock, Cpu, HardDrive, Network, Eye,
  FileCode, Terminal, GitBranch, Layers, Settings, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { ModuleLoader } from "@/lib/lazyModules";

const FinancialDashboard = lazy(() => import("@/components/visualizations/FinancialDashboard"));

// Complete documentation structure - CODEX TAMV 2026
const DOC_SECTIONS = [
  {
    id: "i",
    title: "I. Elementos Preliminares",
    icon: <Book className="h-4 w-4" />,
    items: [
      { id: "1", title: "Prólogo", access: "public", status: "complete" },
      { id: "2", title: "Dedicatoria", access: "public", status: "complete" },
      { id: "3", title: "Biografía del Fundador", access: "public", status: "complete" },
      { id: "4", title: "Glosario Enciclopédico", access: "public", status: "complete" },
      { id: "5", title: "Tabla de Elementos TAMV", access: "public", status: "complete" }
    ]
  },
  {
    id: "ii",
    title: "II. Declaración Fundacional",
    icon: <FileText className="h-4 w-4" />,
    items: [
      { id: "14", title: "Contexto Histórico", access: "public", status: "complete" },
      { id: "15", title: "Manifiesto de Redención", access: "public", status: "complete" },
      { id: "16", title: "Isabella como Entidad Emocional", access: "public", status: "complete" },
      { id: "17", title: "Propósito Civilizatorio", access: "public", status: "complete" },
      { id: "18", title: "Juramento Ético del Sistema", access: "public", status: "complete" }
    ]
  },
  {
    id: "iii",
    title: "III. Filosofía y Ética",
    icon: <Eye className="h-4 w-4" />,
    items: [
      { id: "19", title: "Korima Digital", access: "public", status: "complete" },
      { id: "20", title: "TAP - Tecnología Ancestral Progresiva", access: "public", status: "complete" },
      { id: "21", title: "Principios de Dignidad Digital", access: "public", status: "complete" },
      { id: "22", title: "Código de Conducta Universal", access: "public", status: "complete" },
      { id: "23", title: "Marco Legal y Regulatorio", access: "public", status: "complete" }
    ]
  },
  {
    id: "iv",
    title: "IV. Arquitectura Técnica",
    icon: <Code className="h-4 w-4" />,
    items: [
      { id: "24", title: "Visión General MD-X4", access: "dev", status: "complete" },
      { id: "25", title: "Núcleo TAMV (Core)", access: "dev", status: "complete" },
      { id: "26", title: "Sistema Isabella AI™", access: "dev", status: "complete" },
      { id: "27", title: "Ecosistema MD-X4™", access: "dev", status: "complete" },
      { id: "28", title: "Núcleo Híbrido Cuántico", access: "builder", status: "complete" },
      { id: "29", title: "Circuit Breakers & Backpressure", access: "builder", status: "complete" },
      { id: "30", title: "Lazy Loading & Performance", access: "dev", status: "complete" },
      { id: "31", title: "SLOs y Observabilidad", access: "builder", status: "complete" },
      { id: "32", title: "APIs Completas (REST/GraphQL/gRPC)", access: "builder", status: "complete" }
    ]
  },
  {
    id: "v",
    title: "V. Componentes Funcionales",
    icon: <Database className="h-4 w-4" />,
    items: [
      { id: "33", title: "Backend Distribuido", access: "dev", status: "complete" },
      { id: "34", title: "Orquestador DEKATEOTL", access: "builder", status: "complete" },
      { id: "35", title: "API Gateway", access: "dev", status: "complete" },
      { id: "36", title: "SDKs Oficiales", access: "dev", status: "complete" },
      { id: "37", title: "Sistema de Memoria Emocional", access: "architect", status: "complete" },
      { id: "38", title: "Bóveda Isabella", access: "architect", status: "complete" },
      { id: "39", title: "Hoyo Negro (Gamificación)", access: "dev", status: "complete" }
    ]
  },
  {
    id: "vi",
    title: "VI. Bases de Datos",
    icon: <HardDrive className="h-4 w-4" />,
    items: [
      { id: "40", title: "Esquema Principal", access: "dev", status: "complete" },
      { id: "41", title: "Tablas de Usuario", access: "dev", status: "complete" },
      { id: "42", title: "Tablas de Contenido", access: "dev", status: "complete" },
      { id: "43", title: "Tablas Económicas", access: "builder", status: "complete" },
      { id: "44", title: "Tablas de Auditoría", access: "architect", status: "complete" },
      { id: "45", title: "Índices y Optimización", access: "builder", status: "complete" }
    ]
  },
  {
    id: "vii",
    title: "VII. Seguridad y Ética",
    icon: <Shield className="h-4 w-4" />,
    items: [
      { id: "55", title: "Anubis Sentinel", access: "architect", status: "complete" },
      { id: "56", title: "Validación Ética Multicapa", access: "builder", status: "complete" },
      { id: "57", title: "Protocolos de Shutdown", access: "architect", status: "complete" },
      { id: "58", title: "Firma Cognitiva Irrepetible", access: "architect", status: "complete" },
      { id: "59", title: "Auditoría BookPi", access: "architect", status: "complete" },
      { id: "60", title: "Zero Trust Architecture", access: "builder", status: "complete" },
      { id: "61", title: "Cifrado y Secretos", access: "architect", status: "complete" }
    ]
  },
  {
    id: "viii",
    title: "VIII. Planes de Contingencia",
    icon: <AlertTriangle className="h-4 w-4" />,
    items: [
      { id: "62", title: "Plan A - Operación Normal", access: "builder", status: "complete" },
      { id: "63", title: "Plan B - Degradación Parcial", access: "builder", status: "complete" },
      { id: "64", title: "Plan C - Modo Emergencia", access: "architect", status: "complete" },
      { id: "65", title: "Plan D - Recuperación Total", access: "architect", status: "complete" },
      { id: "66", title: "Protocolo Fénix", access: "architect", status: "complete" },
      { id: "67", title: "Backups y Restauración", access: "builder", status: "complete" }
    ]
  },
  {
    id: "ix",
    title: "IX. Interacción Social",
    icon: <Users className="h-4 w-4" />,
    items: [
      { id: "68", title: "Canales Federados", access: "dev", status: "complete" },
      { id: "69", title: "Grupos y Redes", access: "dev", status: "complete" },
      { id: "70", title: "Conciertos Sensoriales", access: "dev", status: "complete" },
      { id: "71", title: "Puentes Oníricos", access: "dev", status: "complete" },
      { id: "72", title: "DreamSpaces", access: "dev", status: "complete" },
      { id: "73", title: "Mascotas Digitales", access: "dev", status: "complete" },
      { id: "74", title: "Concursos y Lotería", access: "dev", status: "complete" }
    ]
  },
  {
    id: "x",
    title: "X. Webhooks y APIs",
    icon: <Network className="h-4 w-4" />,
    items: [
      { id: "75", title: "Webhook Registry", access: "dev", status: "complete" },
      { id: "76", title: "Event Types", access: "dev", status: "complete" },
      { id: "77", title: "Retry Policies", access: "builder", status: "complete" },
      { id: "78", title: "Signature Verification", access: "builder", status: "complete" },
      { id: "79", title: "Rate Limiting", access: "dev", status: "complete" }
    ]
  },
  {
    id: "xi",
    title: "XI. Economía Digital",
    icon: <Zap className="h-4 w-4" />,
    items: [
      { id: "87", title: "Banco TAMV", access: "dev", status: "complete" },
      { id: "88", title: "Plataforma Clattleya", access: "builder", status: "complete" },
      { id: "89", title: "Sistema de Comisiones", access: "dev", status: "complete" },
      { id: "90", title: "Marketplace", access: "dev", status: "complete" },
      { id: "91", title: "Créditos TAMV", access: "dev", status: "complete" },
      { id: "92", title: "Retiros y Límites", access: "builder", status: "complete" }
    ]
  },
  {
    id: "xii",
    title: "XII. Monitoreo y Auditoría",
    icon: <Activity className="h-4 w-4" />,
    items: [
      { id: "93", title: "Dashboard de Métricas", access: "builder", status: "complete" },
      { id: "94", title: "Alertas y SLOs", access: "builder", status: "complete" },
      { id: "95", title: "Logs Estructurados", access: "dev", status: "complete" },
      { id: "96", title: "Auto-Auditoría", access: "architect", status: "complete" },
      { id: "97", title: "Reportes de Seguridad", access: "architect", status: "complete" }
    ]
  }
];

// API Endpoints - Complete documentation
const API_ENDPOINTS = [
  { method: "POST", path: "/api/isabella/chat", description: "Comunicación con Isabella AI", auth: "JWT", status: "live" },
  { method: "GET", path: "/api/recommendations", description: "Recomendaciones personalizadas", auth: "JWT", status: "live" },
  { method: "POST", path: "/api/transactions/process", description: "Procesar transacciones TAMV", auth: "JWT + MFA", status: "live" },
  { method: "GET", path: "/api/puentes/matches", description: "Matches de Puentes Oníricos", auth: "JWT", status: "live" },
  { method: "POST", path: "/api/audit/log", description: "Registrar evento auditable", auth: "Service Token", status: "live" },
  { method: "GET", path: "/api/concerts/:id", description: "Detalles de concierto", auth: "Public/JWT", status: "live" },
  { method: "POST", path: "/api/auctions/:id/bid", description: "Realizar puja en subasta", auth: "JWT", status: "live" },
  { method: "GET", path: "/api/dreamspaces", description: "Listar DreamSpaces públicos", auth: "Public", status: "live" },
  { method: "POST", path: "/api/media/upload", description: "Subir media (imagen/video/audio)", auth: "JWT", status: "live" },
  { method: "GET", path: "/api/notifications", description: "Obtener notificaciones", auth: "JWT", status: "live" },
  { method: "POST", path: "/api/groups/create", description: "Crear grupo", auth: "JWT", status: "live" },
  { method: "POST", path: "/api/channels/subscribe", description: "Suscribirse a canal", auth: "JWT", status: "live" },
  { method: "GET", path: "/api/pets/:id", description: "Detalles de mascota digital", auth: "JWT", status: "live" },
  { method: "POST", path: "/api/wallet/transfer", description: "Transferir fondos", auth: "JWT + MFA", status: "live" },
  { method: "GET", path: "/api/system/health", description: "Estado del sistema", auth: "Public", status: "live" }
];

// System status metrics
const SYSTEM_STATUS = {
  uptime: 99.97,
  latencyP95: 145,
  errorRate: 0.02,
  activeUsers: 12847,
  transactionsToday: 45892,
  circuitBreakers: { closed: 5, open: 0, halfOpen: 0 }
};

const DEV_TIERS = [
  { id: "explorar", name: "Explorar", price: "Gratis", access: "Docs filosóficas", color: "bg-slate-500", apiCalls: "100/día" },
  { id: "dev", name: "Creador Dev", price: "$9.99/mes", access: "APIs básicas", color: "bg-blue-500", apiCalls: "10K/mes" },
  { id: "builder", name: "Builder Avanzado", price: "$29.99/mes", access: "APIs avanzadas", color: "bg-purple-500", apiCalls: "100K/mes" },
  { id: "architect", name: "Arquitecto de Mundos", price: "$99.99/mes", access: "Full access", color: "bg-primary", apiCalls: "Ilimitado" }
];

export default function DevHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentTier] = useState("dev");

  const getAccessBadge = (access: string) => {
    if (access === "public") return null;
    const tier = DEV_TIERS.find(t => t.id === access);
    if (!tier) return null;
    const hasAccess = DEV_TIERS.findIndex(t => t.id === currentTier) >= DEV_TIERS.findIndex(t => t.id === access);
    return (
      <Badge variant={hasAccess ? "secondary" : "outline"} className={`text-xs ${hasAccess ? "" : "opacity-50"}`}>
        {hasAccess ? tier.name : <><Lock className="h-3 w-3 mr-1" />{tier.name}</>}
      </Badge>
    );
  };

  const filteredSections = DOC_SECTIONS.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalDocs = DOC_SECTIONS.reduce((acc, s) => acc + s.items.length, 0);
  const completeDocs = DOC_SECTIONS.reduce((acc, s) => acc + s.items.filter(i => i.status === 'complete').length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Code className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Dev Hub TAMV</h1>
              <p className="text-xs text-muted-foreground">CODEX 2026 - Documentación Oficial Completa</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {completeDocs}/{totalDocs} Documentados
            </Badge>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar en documentación..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {/* System Status Card */}
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between"><span>Uptime</span><span className="text-green-500 font-mono">{SYSTEM_STATUS.uptime}%</span></div>
                <div className="flex justify-between"><span>Latencia p95</span><span className="font-mono">{SYSTEM_STATUS.latencyP95}ms</span></div>
                <div className="flex justify-between"><span>Error Rate</span><span className="font-mono">{SYSTEM_STATUS.errorRate}%</span></div>
                <div className="flex justify-between"><span>Circuit Breakers</span><span className="text-green-500">{SYSTEM_STATUS.circuitBreakers.closed} cerrados</span></div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader className="py-3"><CardTitle className="text-sm">Navegación</CardTitle></CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[350px]">
                  <Accordion type="single" collapsible className="px-2 pb-2">
                    {filteredSections.map((section) => (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="text-sm py-2 hover:no-underline">
                          <span className="flex items-center gap-2">{section.icon}{section.title}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-1 pl-6">
                            {section.items.map((item) => (
                              <li key={item.id}>
                                <button
                                  className={`w-full flex items-center justify-between text-left text-sm py-1.5 px-2 rounded hover:bg-muted transition-colors ${activeSection === item.id ? "bg-muted" : ""}`}
                                  onClick={() => setActiveSection(item.id)}
                                >
                                  <span className="truncate flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {item.title}
                                  </span>
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
              <CardHeader className="py-3"><CardTitle className="text-sm">Tu Plan</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {DEV_TIERS.map((tier) => (
                  <div key={tier.id} className={`flex items-center justify-between p-2 rounded ${currentTier === tier.id ? "bg-primary/10 border border-primary/20" : ""}`}>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${tier.color}`} />
                      <span className="text-sm">{tier.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{tier.apiCalls}</span>
                  </div>
                ))}
                <Button className="w-full mt-2 btn-tamv-gold" size="sm">Actualizar Plan</Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main>
            <Tabs defaultValue="docs">
              <TabsList className="mb-4 flex-wrap">
                <TabsTrigger value="docs">Documentación</TabsTrigger>
                <TabsTrigger value="api">API Reference</TabsTrigger>
                <TabsTrigger value="architecture">Arquitectura</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
                <TabsTrigger value="financials">Proyecciones</TabsTrigger>
              </TabsList>

              {/* Documentation Tab */}
              <TabsContent value="docs" className="space-y-6">
                {/* Progress Card */}
                <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-2">CODEX TAMV 2026</h2>
                        <p className="text-muted-foreground mb-4">
                          Documento fundacional completo: filosofía, arquitectura técnica, protocolos de seguridad, 
                          planes de contingencia y economía digital. 100% federado, línea por línea.
                        </p>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progreso de documentación</span>
                            <span className="text-primary font-bold">{Math.round((completeDocs/totalDocs)*100)}%</span>
                          </div>
                          <Progress value={(completeDocs/totalDocs)*100} className="h-2" />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="btn-tamv-gold"><Book className="h-4 w-4 mr-2" />Leer Prólogo</Button>
                          <Button size="sm" variant="outline"><ExternalLink className="h-4 w-4 mr-2" />Whitepaper</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { icon: FileText, color: "blue", title: "Manifiesto", desc: "Principios fundamentales" },
                    { icon: Code, color: "purple", title: "Arquitectura", desc: "Stack MD-X4" },
                    { icon: Shield, color: "green", title: "Seguridad", desc: "Zero Trust" },
                    { icon: AlertTriangle, color: "orange", title: "Contingencia", desc: "Planes A-D" }
                  ].map((item, i) => (
                    <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg bg-${item.color}-500/10 flex items-center justify-center`}>
                          <item.icon className={`h-5 w-5 text-${item.color}-500`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Full Documentation Sections */}
                <div className="space-y-4">
                  {DOC_SECTIONS.map((section) => (
                    <Card key={section.id}>
                      <CardHeader className="py-3">
                        <div className="flex items-center gap-2">{section.icon}<CardTitle className="text-lg">{section.title}</CardTitle></div>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                          {section.items.map((item) => (
                            <li key={item.id}>
                              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-muted transition-colors text-left">
                                <span className="text-sm flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {item.title}
                                </span>
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
                    <CardDescription>Endpoints disponibles para integraciones TAMV - Todos operativos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {API_ENDPOINTS.map((endpoint, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <Badge variant={endpoint.method === "GET" ? "secondary" : endpoint.method === "POST" ? "default" : "outline"} className="w-16 justify-center">
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm flex-1 font-mono">{endpoint.path}</code>
                          <span className="text-sm text-muted-foreground hidden md:block">{endpoint.description}</span>
                          <Badge variant="outline" className="text-xs">{endpoint.auth}</Badge>
                          <div className="h-2 w-2 rounded-full bg-green-500" title="Live" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Architecture Tab */}
              <TabsContent value="architecture" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5" />Stack MD-X4</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { name: "Frontend", tech: "React + TypeScript + Vite + TailwindCSS", status: "live" },
                        { name: "Backend", tech: "Supabase Edge Functions + PostgreSQL", status: "live" },
                        { name: "IA", tech: "Lovable AI Gateway + Gemini Flash", status: "live" },
                        { name: "Realtime", tech: "Supabase Realtime + WebSockets", status: "live" },
                        { name: "Storage", tech: "Supabase Storage + CDN", status: "live" },
                        { name: "Auth", tech: "Supabase Auth + RLS Policies", status: "live" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="font-medium">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{item.tech}</span>
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-5 w-5" />Circuit Breakers</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { name: "isabella-ai", status: "CLOSED", maxConcurrent: 5 },
                        { name: "payments", status: "CLOSED", maxConcurrent: 3 },
                        { name: "media-upload", status: "CLOSED", maxConcurrent: 10 },
                        { name: "recommendations", status: "CLOSED", maxConcurrent: 20 },
                        { name: "realtime", status: "CLOSED", maxConcurrent: 50 }
                      ].map((cb, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="font-mono text-sm">{cb.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Max: {cb.maxConcurrent}</Badge>
                            <Badge className="bg-green-500">{cb.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Protocolos de Seguridad</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        { name: "Zero Trust Architecture", status: "Activo" },
                        { name: "JWT Authentication", status: "Activo" },
                        { name: "RLS Policies", status: "97 políticas" },
                        { name: "Anubis Sentinel", status: "Monitoreando" },
                        { name: "BookPi Audit Trail", status: "Activo" },
                        { name: "Cifrado en reposo", status: "AES-256" },
                        { name: "TLS en tránsito", status: "TLS 1.3" }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between p-2 rounded bg-muted/50">
                          <span>{item.name}</span>
                          <Badge variant="secondary">{item.status}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Planes de Contingencia</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        { plan: "Plan A", desc: "Operación Normal", status: "Activo" },
                        { plan: "Plan B", desc: "Degradación Parcial - Isabella simplificada", status: "Listo" },
                        { plan: "Plan C", desc: "Modo Emergencia - Solo core", status: "Listo" },
                        { plan: "Plan D", desc: "Recuperación Total desde backup", status: "Listo" },
                        { plan: "Protocolo Fénix", desc: "Resurreción completa del sistema", status: "Listo" }
                      ].map((item, i) => (
                        <div key={i} className="p-2 rounded bg-muted/50">
                          <div className="flex justify-between">
                            <span className="font-bold">{item.plan}</span>
                            <Badge variant={item.status === "Activo" ? "default" : "secondary"}>{item.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Financials Tab */}
              <TabsContent value="financials" className="space-y-4">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Proyecciones Económicas TAMV 2025-2027</CardTitle>
                    <CardDescription>ARPU: $10-45 USD | Márgenes: 25-45% | Comisiones: 12-25%</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      {[
                        { label: "ARPU Proyectado", value: "$27.50", change: "+15%" },
                        { label: "Margen Bruto", value: "38%", change: "+5%" },
                        { label: "Comisión Promedio", value: "18%", change: "Estable" },
                        { label: "LTV Usuario", value: "$165", change: "+22%" }
                      ].map((metric, i) => (
                        <div key={i} className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold text-primary">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <Badge variant="outline" className="mt-1 text-xs">{metric.change}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Suspense fallback={<ModuleLoader message="Cargando dashboard financiero..." />}>
                  <FinancialDashboard />
                </Suspense>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
