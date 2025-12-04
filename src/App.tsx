import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ModuleLoader, LazyXRExperience, LazyDreamSpaces, LazyDevHub, LazySubastas, LazyMascotas, LazyConciertos, LazyGrupos, LazyCanales, LazyPuentesOniricos, LazyBancoTAMV, LazyExplorar, LazyTutorialsHub } from "@/lib/lazyModules";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/explorar" element={<Suspense fallback={<ModuleLoader />}><LazyExplorar /></Suspense>} />
          <Route path="/conciertos" element={<Suspense fallback={<ModuleLoader message="Cargando Conciertos Sensoriales..." />}><LazyConciertos /></Suspense>} />
          <Route path="/subastas" element={<Suspense fallback={<ModuleLoader message="Cargando Subastas XR..." />}><LazySubastas /></Suspense>} />
          <Route path="/dreamspaces" element={<Suspense fallback={<ModuleLoader message="Cargando DreamSpaces..." />}><LazyDreamSpaces /></Suspense>} />
          <Route path="/grupos" element={<Suspense fallback={<ModuleLoader />}><LazyGrupos /></Suspense>} />
          <Route path="/canales" element={<Suspense fallback={<ModuleLoader />}><LazyCanales /></Suspense>} />
          <Route path="/mascotas" element={<Suspense fallback={<ModuleLoader message="Cargando Quantum Pets..." />}><LazyMascotas /></Suspense>} />
          <Route path="/puentes-oniricos" element={<Suspense fallback={<ModuleLoader />}><LazyPuentesOniricos /></Suspense>} />
          <Route path="/dev-hub" element={<Suspense fallback={<ModuleLoader message="Cargando Dev Hub..." />}><LazyDevHub /></Suspense>} />
          <Route path="/xr" element={<Suspense fallback={<ModuleLoader message="Preparando experiencia XR..." />}><LazyXRExperience /></Suspense>} />
          <Route path="/banco" element={<Suspense fallback={<ModuleLoader message="Cargando Banco TAMV..." />}><LazyBancoTAMV /></Suspense>} />
          <Route path="/tutoriales" element={<Suspense fallback={<ModuleLoader />}><LazyTutorialsHub /></Suspense>} />
          {/* Redirects for incomplete pages */}
          <Route path="/retos" element={<Navigate to="/explorar" replace />} />
          <Route path="/dao" element={<Navigate to="/dev-hub" replace />} />
          <Route path="/documentos" element={<Navigate to="/dev-hub" replace />} />
          <Route path="/protocolos" element={<Navigate to="/dev-hub" replace />} />
          <Route path="/configuracion" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
