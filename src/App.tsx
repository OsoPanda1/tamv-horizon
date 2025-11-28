import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="dark">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explorar" element={<Index />} />
            <Route path="/puentes-oniricos" element={<Index />} />
            <Route path="/conciertos" element={<Index />} />
            <Route path="/dreamspaces" element={<Index />} />
            <Route path="/subastas" element={<Index />} />
            <Route path="/grupos" element={<Index />} />
            <Route path="/canales" element={<Index />} />
            <Route path="/mascotas" element={<Index />} />
            <Route path="/banco" element={<Index />} />
            <Route path="/retos" element={<Index />} />
            <Route path="/tutoriales" element={<Index />} />
            <Route path="/configuracion" element={<Index />} />
            <Route path="/dao" element={<Index />} />
            <Route path="/documentos" element={<Index />} />
            <Route path="/protocolos" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
