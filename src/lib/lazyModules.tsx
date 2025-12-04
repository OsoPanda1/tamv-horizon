// ============= TAMV Lazy Loading System with Confirmation Dialogs =============
import { lazy, Suspense, useState, ComponentType, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Loading fallback component
export function ModuleLoader({ message = 'Cargando módulo...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-b-accent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

// Heavy module configuration
interface HeavyModuleConfig {
  name: string;
  description: string;
  estimatedLoad: 'light' | 'medium' | 'heavy';
  requiresConfirmation: boolean;
}

const HEAVY_MODULES: Record<string, HeavyModuleConfig> = {
  xr: {
    name: 'Experiencia XR',
    description: 'Módulo de realidad virtual/aumentada con gráficos 3D intensivos',
    estimatedLoad: 'heavy',
    requiresConfirmation: true
  },
  dreamspaces: {
    name: 'DreamSpaces',
    description: 'Espacios virtuales inmersivos con renderizado 3D',
    estimatedLoad: 'heavy',
    requiresConfirmation: true
  },
  concerts: {
    name: 'Conciertos Sensoriales',
    description: 'Experiencias multimedia con audio espacial y visuales',
    estimatedLoad: 'medium',
    requiresConfirmation: false
  },
  devhub: {
    name: 'Dev Hub',
    description: 'Centro de documentación y APIs para desarrolladores',
    estimatedLoad: 'medium',
    requiresConfirmation: false
  },
  analytics: {
    name: 'Analytics',
    description: 'Dashboard de métricas y visualizaciones',
    estimatedLoad: 'medium',
    requiresConfirmation: false
  },
  store: {
    name: 'Tienda XR',
    description: 'Marketplace con assets 3D y previews',
    estimatedLoad: 'heavy',
    requiresConfirmation: true
  }
};

// Lazy module wrapper with optional confirmation
interface LazyModuleProps {
  moduleKey: string;
  component: ComponentType;
  fallback?: ReactNode;
  onCancel?: () => void;
}

export function LazyModule({ moduleKey, component: Component, fallback, onCancel }: LazyModuleProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const config = HEAVY_MODULES[moduleKey];

  // If no confirmation needed or already confirmed, render directly
  if (!config?.requiresConfirmation || confirmed) {
    return (
      <Suspense fallback={fallback || <ModuleLoader message={`Cargando ${config?.name || 'módulo'}...`} />}>
        <Component />
      </Suspense>
    );
  }

  // Show confirmation dialog for heavy modules
  if (!showDialog) {
    // Trigger dialog on mount
    setTimeout(() => setShowDialog(true), 0);
  }

  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${
                config.estimatedLoad === 'heavy' ? 'bg-destructive' : 
                config.estimatedLoad === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              {config.name}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {config.description}
              <br /><br />
              <span className="text-muted-foreground">
                Este módulo requiere más recursos del dispositivo.
                {config.estimatedLoad === 'heavy' && (
                  <> En dispositivos móviles o con recursos limitados, puede afectar el rendimiento.</>
                )}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onCancel?.()}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setConfirmed(true);
              setShowDialog(false);
            }}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {fallback || <ModuleLoader message="Esperando confirmación..." />}
    </>
  );
}

// Pre-configured lazy imports
export const LazyXRExperience = lazy(() => import('@/pages/XRExperience'));
export const LazyDreamSpaces = lazy(() => import('@/pages/DreamSpaces'));
export const LazyConciertos = lazy(() => import('@/pages/Conciertos'));
export const LazyDevHub = lazy(() => import('@/pages/DevHub'));
export const LazySubastas = lazy(() => import('@/pages/Subastas'));
export const LazyMascotas = lazy(() => import('@/pages/Mascotas'));
export const LazyGrupos = lazy(() => import('@/pages/Grupos'));
export const LazyCanales = lazy(() => import('@/pages/Canales'));
export const LazyPuentesOniricos = lazy(() => import('@/pages/PuentesOniricos'));
export const LazyBancoTAMV = lazy(() => import('@/pages/BancoTAMV'));
export const LazyExplorar = lazy(() => import('@/pages/Explorar'));
export const LazyTutorialsHub = lazy(() => import('@/pages/TutorialsHub'));

// Prefetch utility for predictive loading
export function prefetchModule(moduleKey: keyof typeof HEAVY_MODULES): void {
  const loaders: Record<string, () => Promise<unknown>> = {
    xr: () => import('@/pages/XRExperience'),
    dreamspaces: () => import('@/pages/DreamSpaces'),
    concerts: () => import('@/pages/Conciertos'),
    devhub: () => import('@/pages/DevHub'),
    analytics: () => import('@/components/visualizations/FinancialDashboard'),
    store: () => import('@/pages/Subastas')
  };

  if (loaders[moduleKey]) {
    // Low priority prefetch
    requestIdleCallback?.(() => loaders[moduleKey]()) || 
    setTimeout(() => loaders[moduleKey](), 100);
  }
}
