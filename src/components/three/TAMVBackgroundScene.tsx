import { Canvas } from "@react-three/fiber";
import { Stars, Float, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef, useState, useCallback, Suspense, lazy } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Performance configuration based on device
interface PerformanceConfig {
  particleCount: number;
  starsCount: number;
  enableBloom: boolean;
  enableVignette: boolean;
  enablePostProcessing: boolean;
  aztecSymbols: number;
  dpr: [number, number];
}

const HIGH_PERFORMANCE: PerformanceConfig = {
  particleCount: 150,
  starsCount: 3000,
  enableBloom: true,
  enableVignette: true,
  enablePostProcessing: true,
  aztecSymbols: 3,
  dpr: [1, 2]
};

const MEDIUM_PERFORMANCE: PerformanceConfig = {
  particleCount: 80,
  starsCount: 1500,
  enableBloom: true,
  enableVignette: true,
  enablePostProcessing: true,
  aztecSymbols: 2,
  dpr: [1, 1.5]
};

const LOW_PERFORMANCE: PerformanceConfig = {
  particleCount: 30,
  starsCount: 500,
  enableBloom: false,
  enableVignette: true,
  enablePostProcessing: true,
  aztecSymbols: 1,
  dpr: [0.5, 1]
};

const MINIMAL_PERFORMANCE: PerformanceConfig = {
  particleCount: 15,
  starsCount: 200,
  enableBloom: false,
  enableVignette: false,
  enablePostProcessing: false,
  aztecSymbols: 0,
  dpr: [0.5, 0.75]
};

// Detect device capabilities
function getDevicePerformanceConfig(): PerformanceConfig {
  if (typeof window === 'undefined') return LOW_PERFORMANCE;
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : true;
  const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Check WebGL capabilities
  let isWeakGPU = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        isWeakGPU = /Intel|Mali|Adreno 3|Adreno 4|PowerVR/i.test(renderer);
      }
    }
  } catch {
    isWeakGPU = true;
  }

  if (hasReducedMotion) return MINIMAL_PERFORMANCE;
  if (isMobile && (isLowEnd || isWeakGPU)) return MINIMAL_PERFORMANCE;
  if (isMobile) return LOW_PERFORMANCE;
  if (isLowEnd || isWeakGPU) return MEDIUM_PERFORMANCE;
  return HIGH_PERFORMANCE;
}

// Gold particles field with LOD
function TAMVCellsField({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ] as [number, number, number],
        scale: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.5 + 0.2
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const goldColor = useMemo(() => new THREE.Color("#F4D278"), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime * particle.speed;
      dummy.position.set(
        particle.position[0] + Math.sin(t + i) * 0.5,
        particle.position[1] + Math.cos(t + i * 0.5) * 0.5,
        particle.position[2] + Math.sin(t * 0.5 + i) * 0.3
      );
      dummy.scale.setScalar(particle.scale * (1 + Math.sin(t * 2) * 0.2));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Simple geometry for LOD
  const geometryDetail = count > 100 ? 0 : count > 50 ? 0 : 0;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled>
      <dodecahedronGeometry args={[0.08, geometryDetail]} />
      <meshStandardMaterial
        color={goldColor}
        emissive={goldColor}
        emissiveIntensity={0.5}
        metalness={1}
        roughness={0.2}
      />
    </instancedMesh>
  );
}

// Aztec symbol with simplified geometry for mobile
function AztecSymbol({ position, simplified = false }: { position: [number, number, number]; simplified?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const segments = simplified ? 4 : 8;
  const radialSegments = simplified ? 3 : 4;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} frustumCulled>
        <torusGeometry args={[0.5, 0.1, segments, radialSegments]} />
        <meshStandardMaterial
          color="#F4D278"
          emissive="#F4D278"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
}

// Post-processing effects with LOD
function PostProcessingEffects({ config }: { config: PerformanceConfig }) {
  if (!config.enablePostProcessing) return null;

  return (
    <EffectComposer multisampling={0}>
      {config.enableBloom && (
        <Bloom 
          intensity={0.6} 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      )}
      {config.enableVignette && (
        <Vignette offset={0.3} darkness={0.6} />
      )}
    </EffectComposer>
  );
}

// Main scene content with performance config
function SceneContent({ config }: { config: PerformanceConfig }) {
  const aztecPositions: [number, number, number][] = [
    [-4, 2, -5],
    [4, -2, -6],
    [0, 3, -8]
  ];

  return (
    <>
      {/* Background color */}
      <color attach="background" args={["#020617"]} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={["#020617", 5, 25]} />
      
      {/* Lighting - reduced for mobile */}
      <ambientLight intensity={0.4} />
      <directionalLight intensity={0.8} position={[5, 10, 5]} color="#F4D278" />
      {config.particleCount > 50 && (
        <directionalLight intensity={0.4} position={[-5, -4, -3]} color="#F97316" />
      )}
      {config.particleCount > 30 && (
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#F4D278" />
      )}
      
      {/* Stars background with LOD */}
      <Stars 
        radius={100} 
        depth={50} 
        count={config.starsCount} 
        factor={3} 
        saturation={0} 
        fade 
        speed={1} 
      />
      
      {/* Gold particles with LOD */}
      <TAMVCellsField count={config.particleCount} />
      
      {/* Aztec decorations with LOD */}
      {aztecPositions.slice(0, config.aztecSymbols).map((pos, i) => (
        <AztecSymbol 
          key={i} 
          position={pos} 
          simplified={config.particleCount < 80}
        />
      ))}
      
      {/* Post-processing with LOD */}
      <PostProcessingEffects config={config} />
    </>
  );
}

// Adaptive scene that adjusts based on FPS
function AdaptiveScene({ initialConfig }: { initialConfig: PerformanceConfig }) {
  const [config, setConfig] = useState(initialConfig);

  const handleIncline = useCallback(() => {
    // Performance is good, can increase quality
    if (config === MINIMAL_PERFORMANCE) setConfig(LOW_PERFORMANCE);
    else if (config === LOW_PERFORMANCE) setConfig(MEDIUM_PERFORMANCE);
    else if (config === MEDIUM_PERFORMANCE) setConfig(HIGH_PERFORMANCE);
  }, [config]);

  const handleDecline = useCallback(() => {
    // Performance is bad, reduce quality
    if (config === HIGH_PERFORMANCE) setConfig(MEDIUM_PERFORMANCE);
    else if (config === MEDIUM_PERFORMANCE) setConfig(LOW_PERFORMANCE);
    else if (config === LOW_PERFORMANCE) setConfig(MINIMAL_PERFORMANCE);
  }, [config]);

  return (
    <>
      <PerformanceMonitor
        onIncline={handleIncline}
        onDecline={handleDecline}
        flipflops={3}
        factor={0.5}
      />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <SceneContent config={config} />
    </>
  );
}

interface TAMVBackgroundSceneProps {
  className?: string;
  disabled?: boolean;
}

export default function TAMVBackgroundScene({ className, disabled = false }: TAMVBackgroundSceneProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [initialConfig] = useState(() => getDevicePerformanceConfig());
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy initialization - only render when in viewport
  useMemo(() => {
    if (typeof window === 'undefined' || disabled) return;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Small delay to prioritize main content

    return () => clearTimeout(timer);
  }, [disabled]);

  // Don't render on very low-end devices or if disabled
  if (disabled || (initialConfig === MINIMAL_PERFORMANCE && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) {
    return (
      <div 
        className={`fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-tamv-dark ${className || ""}`}
        aria-hidden="true"
      />
    );
  }

  if (!isVisible) {
    return (
      <div 
        ref={containerRef}
        className={`fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-tamv-dark ${className || ""}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 -z-10 ${className || ""}`}
      aria-hidden="true"
    >
      <Suspense fallback={
        <div className="w-full h-full bg-gradient-to-br from-background via-background to-tamv-dark" />
      }>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={initialConfig.dpr}
          gl={{ 
            antialias: initialConfig.particleCount > 50,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          frameloop="demand"
          performance={{ min: 0.5 }}
        >
          <AdaptiveScene initialConfig={initialConfig} />
        </Canvas>
      </Suspense>
    </div>
  );
}
