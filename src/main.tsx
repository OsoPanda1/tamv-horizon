/**
 * 🌐 TAMV OS - CORE GATEWAY (v3.0 MASTER)
 * Entry Point del Ecosistema Celular Federado
 * Integración: 7 Federaciones | IA Isabella | MSR Economy
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import App from './App';
import './index.css';

// 1. Configuración del Motor de Sincronización (Cell Data Plane)
// Basado en el Blueprint Técnico L0-L3 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de integridad de caché
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// 2. Inicialización del Nexo con Guardianía Predictiva
const mountTAMV = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("CRITICAL: Root element del Nexo no encontrado.");
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* Proveedor de Consultas para el Ledger de las 7 Federaciones */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          {/* Sistema de Notificaciones del Nexo */}
          <Toaster 
            position="top-right" 
            theme="dark" 
            expand={false} 
            richColors 
            closeButton
          />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

// 3. Ejecución del Protocolo de Inicio
// Este es el "Gatekeeper" que asegura que el sistema no inicie si hay fallos de red críticos 
try {
  console.log("🚀 TAMV OS: Iniciando Protocolo de Soberanía Digital...");
  mountTAMV();
} catch (error) {
  console.error("🚨 FALLO CRÍTICO EN EL NÚCLEO L0:", error);
}
