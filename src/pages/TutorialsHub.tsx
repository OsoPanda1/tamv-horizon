import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Clock, Award, Search, Filter, BookOpen, Sparkles, Users, Coins, Trophy, Shield, Rocket, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VIDEO_TUTORIALS, TUTORIAL_CATEGORIES } from "@/data/tutorials";
import type { TutorialCategory } from "@/types/tamv";

const LEVEL_COLORS = {
  basico: "bg-green-500/20 text-green-600",
  intermedio: "bg-yellow-500/20 text-yellow-600",
  avanzado: "bg-red-500/20 text-red-600"
};

const CATEGORY_ICONS: Record<string, any> = {
  inicio: Rocket,
  creacionContenido: Palette,
  experiencias: Sparkles,
  puentesOniricos: Users,
  monetizacion: Coins,
  concursos: Trophy,
  seguridad: Shield
};

export default function TutorialsHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<TutorialCategory | "all">("all");

  const filteredTutorials = VIDEO_TUTORIALS.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || tutorial.level === selectedLevel;
    const matchesCategory = activeCategory === "all" || tutorial.category === activeCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
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
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Centro de Tutoriales</h1>
              <p className="text-xs text-muted-foreground">Aprende a dominar TAMV Online</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-primary/20 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Maestría TAMV</h2>
                <p className="text-muted-foreground mb-3">
                  Completa tutoriales, gana insignias y desbloquea características avanzadas
                </p>
                <div className="flex gap-3">
                  <Badge variant="secondary" className="gap-1">
                    <Play className="h-3 w-3" />
                    {VIDEO_TUTORIALS.length} tutoriales disponibles
                  </Badge>
                  <Badge variant="outline">
                    <Trophy className="h-3 w-3 mr-1" />
                    0/14 completados
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tutoriales..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedLevel === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(null)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Todos
            </Button>
            <Button
              variant={selectedLevel === "basico" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(selectedLevel === "basico" ? null : "basico")}
            >
              Básico
            </Button>
            <Button
              variant={selectedLevel === "intermedio" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(selectedLevel === "intermedio" ? null : "intermedio")}
            >
              Intermedio
            </Button>
            <Button
              variant={selectedLevel === "avanzado" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(selectedLevel === "avanzado" ? null : "avanzado")}
            >
              Avanzado
            </Button>
          </div>
        </div>

        {/* Categories Tabs */}
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)}>
          <TabsList className="grid grid-cols-4 md:grid-cols-8 w-full">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {Object.entries(TUTORIAL_CATEGORIES).map(([key, cat]) => {
              const Icon = CATEGORY_ICONS[key];
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                  <Icon className="h-3 w-3" />
                  <span className="hidden md:inline">{cat.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? "es" : ""} encontrado{filteredTutorials.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Tutorials Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTutorials.map((tutorial) => {
                const Icon = CATEGORY_ICONS[tutorial.category];
                return (
                  <Card key={tutorial.id} className="group hover:border-primary/50 transition-all cursor-pointer">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg aspect-video bg-muted">
                        <img
                          src={tutorial.thumbnailUrl}
                          alt={tutorial.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center">
                            <Play className="h-6 w-6 text-primary-foreground" />
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(tutorial.durationSeconds)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <CardTitle className="text-base line-clamp-2">
                          {tutorial.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm line-clamp-2 mb-3">
                        {tutorial.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className={LEVEL_COLORS[tutorial.level]}
                        >
                          {tutorial.level.charAt(0).toUpperCase() + tutorial.level.slice(1)}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          Ver ahora
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredTutorials.length === 0 && (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No se encontraron tutoriales</h3>
                <p className="text-muted-foreground">
                  Intenta ajustar tus filtros o buscar algo diferente
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Progress Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Tu Progreso de Aprendizaje</CardTitle>
            <CardDescription>
              Sigue tu avance y obtén certificaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(TUTORIAL_CATEGORIES).map(([key, cat]) => {
                const Icon = CATEGORY_ICONS[key];
                const categoryTutorials = VIDEO_TUTORIALS.filter(t => t.category === key);
                const completed = 0; // Would come from user progress
                const total = categoryTutorials.length;
                const percentage = (completed / total) * 100;

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {completed}/{total}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
