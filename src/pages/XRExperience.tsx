import { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Headphones, Monitor, Smartphone, Loader2, Play, Pause, Settings, Volume2, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Text3D, Center, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { checkXRSupport, type XRCapabilities } from "@/modules/xr/scene";

// Gold TAMV Material
function GoldMaterial() {
  return (
    <meshPhysicalMaterial
      color="#F4D278"
      metalness={1}
      roughness={0.18}
      clearcoat={0.6}
      envMapIntensity={1.2}
    />
  );
}

// Quantum Pod visualization
function QuantumPod({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <dodecahedronGeometry args={[1, 0]} />
        <GoldMaterial />
      </mesh>
    </Float>
  );
}

// Aztec Ring decoration
function AztecRing({ position, radius = 2 }: { position: [number, number, number]; radius?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.05, 8, 64]} />
      <GoldMaterial />
    </mesh>
  );
}

// Particle field
function ParticleField() {
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#F4D278" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// Main XR Scene
function XRScene() {
  return (
    <>
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 5, 30]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#F4D278" />
      <pointLight position={[0, 0, 0]} intensity={1} color="#F4D278" />
      
      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Quantum Pods */}
      <QuantumPod position={[0, 0, 0]} scale={1.5} />
      <QuantumPod position={[-4, 2, -3]} scale={0.5} />
      <QuantumPod position={[4, -1, -4]} scale={0.7} />
      <QuantumPod position={[-3, -2, -2]} scale={0.4} />
      <QuantumPod position={[3, 3, -5]} scale={0.6} />
      
      {/* Aztec Rings */}
      <AztecRing position={[0, 0, 0]} radius={3} />
      <AztecRing position={[0, 0, 0]} radius={4} />
      <AztecRing position={[0, 0, 0]} radius={5} />
      
      {/* Particles */}
      <ParticleField />
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        minDistance={3}
        maxDistance={15}
      />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom 
          intensity={0.8} 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        {/* ChromaticAberration removed due to type issues */}
      </EffectComposer>
    </>
  );
}

// Loading component
function LoadingScene() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Cargando experiencia XR...</p>
      </div>
    </div>
  );
}

export default function XRExperiencePage() {
  const [xrCapabilities, setXrCapabilities] = useState<XRCapabilities | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    checkXRSupport().then(setXrCapabilities);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
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
              <Headphones className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Experiencia XR TAMV</h1>
              <p className="text-xs text-muted-foreground">Quantum Visualization MD-X4</p>
            </div>
          </div>
          
          {/* XR Capabilities */}
          <div className="ml-auto flex gap-2">
            {xrCapabilities?.supportsVR && (
              <Badge variant="secondary" className="gap-1">
                <Headphones className="h-3 w-3" />
                VR Ready
              </Badge>
            )}
            {xrCapabilities?.supportsAR && (
              <Badge variant="secondary" className="gap-1">
                <Smartphone className="h-3 w-3" />
                AR Ready
              </Badge>
            )}
            <Badge variant="outline" className="gap-1">
              <Monitor className="h-3 w-3" />
              3D
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* 3D Canvas */}
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative aspect-video lg:aspect-auto lg:h-[600px]">
              <Suspense fallback={<LoadingScene />}>
                <Canvas
                  camera={{ position: [0, 0, 8], fov: 60 }}
                  dpr={[1, 2]}
                  gl={{ 
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance"
                  }}
                >
                  <XRScene />
                </Canvas>
              </Suspense>
              
              {/* Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="ml-auto flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                      <Maximize className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>QuantumPods™ Visualization</CardTitle>
                <CardDescription>
                  Visualización 4D del núcleo cuántico TAMV MD-X4
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Modo</span>
                    <span className="font-medium">WebGL 2.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">FPS Target</span>
                    <span className="font-medium">60 FPS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Post-processing</span>
                    <span className="font-medium">Bloom + CA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* XR Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Opciones XR</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant={xrCapabilities?.supportsVR ? "default" : "outline"}
                  disabled={!xrCapabilities?.supportsVR}
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  {xrCapabilities?.supportsVR ? "Entrar en VR" : "VR no disponible"}
                </Button>
                <Button 
                  className="w-full" 
                  variant={xrCapabilities?.supportsAR ? "default" : "outline"}
                  disabled={!xrCapabilities?.supportsAR}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  {xrCapabilities?.supportsAR ? "Entrar en AR" : "AR no disponible"}
                </Button>
                <Button className="w-full" variant="outline">
                  <Monitor className="h-4 w-4 mr-2" />
                  Modo Escritorio
                </Button>
              </CardContent>
            </Card>

            {/* DreamSpaces Link */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Explora DreamSpaces</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Descubre espacios inmersivos creados por la comunidad TAMV.
                </p>
                <Link to="/dreamspaces">
                  <Button size="sm" className="w-full">
                    Ver DreamSpaces
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
