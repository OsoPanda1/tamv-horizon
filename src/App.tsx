import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Conciertos from "./pages/Conciertos";
import Subastas from "./pages/Subastas";
import DreamSpaces from "./pages/DreamSpaces";
import Grupos from "./pages/Grupos";
import Canales from "./pages/Canales";
import Mascotas from "./pages/Mascotas";
import PuentesOniricos from "./pages/PuentesOniricos";
import DevHub from "./pages/DevHub";
import XRExperience from "./pages/XRExperience";
import BancoTAMV from "./pages/BancoTAMV";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/conciertos" element={<Conciertos />} />
          <Route path="/subastas" element={<Subastas />} />
          <Route path="/dreamspaces" element={<DreamSpaces />} />
          <Route path="/grupos" element={<Grupos />} />
          <Route path="/canales" element={<Canales />} />
          <Route path="/mascotas" element={<Mascotas />} />
          <Route path="/puentes-oniricos" element={<PuentesOniricos />} />
          <Route path="/dev-hub" element={<DevHub />} />
          <Route path="/xr" element={<XRExperience />} />
          <Route path="/banco" element={<BancoTAMV />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
