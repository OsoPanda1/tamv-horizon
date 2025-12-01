import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Sparkles, Target, MessageCircle, Check, X, Loader2, Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  findMatches, 
  sendCollaborationRequest, 
  getPendingRequests, 
  getActiveCollaborations,
  respondToRequest,
  type CollaboratorMatch,
  type CollaborationRequest
} from "@/lib/api/puentes";

export default function PuentesOniricosPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("discover");
  const [matches, setMatches] = useState<CollaboratorMatch[]>([]);
  const [pendingRequests, setPendingRequests] = useState<CollaborationRequest[]>([]);
  const [collaborations, setCollaborations] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<CollaboratorMatch | null>(null);
  const [connectMessage, setConnectMessage] = useState("");
  const [projectIdea, setProjectIdea] = useState("");
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [matchesData, requestsData, collabsData] = await Promise.all([
        findMatches(user.id),
        getPendingRequests(user.id),
        getActiveCollaborations(user.id)
      ]);
      setMatches(matchesData);
      setPendingRequests(requestsData);
      setCollaborations(collabsData);
    } catch (error) {
      console.error("Error loading puentes data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedMatch || !user) return;
    
    try {
      const result = await sendCollaborationRequest(
        user.id,
        selectedMatch.userId,
        connectMessage,
        projectIdea
      );
      
      if (result.success) {
        toast({
          title: "Solicitud enviada",
          description: "Tu solicitud de colaboración ha sido enviada exitosamente."
        });
        setShowConnectDialog(false);
        setSelectedMatch(null);
        setConnectMessage("");
        setProjectIdea("");
        loadData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const handleRespondRequest = async (requestId: string, accepted: boolean) => {
    if (!user) return;
    
    try {
      const result = await respondToRequest(user.id, requestId, accepted);
      if (result.success) {
        toast({
          title: accepted ? "Colaboración aceptada" : "Solicitud rechazada",
          description: accepted 
            ? "¡Ahora pueden comenzar a colaborar!"
            : "La solicitud ha sido rechazada."
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud.",
        variant: "destructive"
      });
    }
  };

  const filteredMatches = matches.filter(match =>
    match.profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.profile.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
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
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Puentes Oníricos</h1>
              <p className="text-xs text-muted-foreground">Conecta talentos complementarios</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Encuentra tu colaborador ideal</h2>
                <p className="text-muted-foreground mb-4">
                  Nuestro algoritmo de matching conecta creadores con habilidades complementarias 
                  para formar equipos de alto impacto en el ecosistema TAMV.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-primary/50">
                    <Users className="h-3 w-3 mr-1" />
                    {matches.length} matches encontrados
                  </Badge>
                  <Badge variant="outline" className="border-accent/50">
                    <Target className="h-3 w-3 mr-1" />
                    {collaborations.length} colaboraciones activas
                  </Badge>
                </div>
              </div>
              <Button onClick={loadData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Actualizar matches
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="discover">Descubrir</TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes
                {pendingRequests.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="active">Activos</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o habilidad..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredMatches.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No se encontraron matches</h3>
                <p className="text-sm text-muted-foreground">
                  Completa tu perfil con más habilidades e intereses para encontrar colaboradores.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMatches.map((match) => (
                  <Card key={match.userId} className="hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={match.profile.avatar} />
                          <AvatarFallback>{match.profile.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{match.profile.displayName}</CardTitle>
                          <CardDescription className="text-xs">@{match.profile.username}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {match.matchScore}% match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Match Score Progress */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Compatibilidad</span>
                          <span className="text-primary font-medium">{match.matchScore}%</span>
                        </div>
                        <Progress value={match.matchScore} className="h-2" />
                      </div>

                      {/* Complementary Skills */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Habilidades complementarias:</p>
                        <div className="flex flex-wrap gap-1">
                          {match.complementarySkills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Suggested Project */}
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Proyecto sugerido:</p>
                        <p className="text-sm font-medium">{match.suggestedProject}</p>
                      </div>

                      {/* Connect Button */}
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setSelectedMatch(match);
                          setShowConnectDialog(true);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Conectar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Requests Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Sin solicitudes pendientes</h3>
                <p className="text-sm text-muted-foreground">
                  Cuando alguien quiera colaborar contigo, aparecerá aquí.
                </p>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">Solicitud de colaboración</h4>
                          <Badge variant="secondary">{request.matchScore}% match</Badge>
                        </div>
                        {request.message && (
                          <p className="text-sm text-muted-foreground mb-2">{request.message}</p>
                        )}
                        {request.projectIdea && (
                          <div className="bg-muted/50 rounded p-2 mb-3">
                            <p className="text-xs text-muted-foreground">Idea de proyecto:</p>
                            <p className="text-sm">{request.projectIdea}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleRespondRequest(request.id, true)}>
                            <Check className="h-4 w-4 mr-1" />
                            Aceptar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRespondRequest(request.id, false)}>
                            <X className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Active Collaborations Tab */}
          <TabsContent value="active" className="space-y-4">
            {collaborations.length === 0 ? (
              <Card className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Sin colaboraciones activas</h3>
                <p className="text-sm text-muted-foreground">
                  Cuando inicies una colaboración, aparecerá aquí.
                </p>
              </Card>
            ) : (
              collaborations.map((collab) => (
                <Card key={collab.id} className="border-green-500/20 bg-green-500/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Colaboración activa</h4>
                        {collab.projectIdea && (
                          <p className="text-sm text-muted-foreground">{collab.projectIdea}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {collab.complementarySkills.map((skill) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Connect Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conectar con {selectedMatch?.profile.displayName}</DialogTitle>
            <DialogDescription>
              Envía un mensaje para iniciar una colaboración.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Mensaje (opcional)</label>
              <Textarea
                placeholder="Preséntate y explica por qué te gustaría colaborar..."
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Idea de proyecto (opcional)</label>
              <Textarea
                placeholder="¿Tienes alguna idea de proyecto en mente?"
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConnect}>
              Enviar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
