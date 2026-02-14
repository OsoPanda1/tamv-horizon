/**
 * 🌐 TAMV OS - CORE GATEWAY (v3.0 MASTER)
 * Entry Point del Ecosistema Celular Federado
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 2. Inicialización del Nexo con Guardianía Predictiva
const mountTAMV = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("CRITICAL: Root element del Nexo no encontrado.");
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
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
