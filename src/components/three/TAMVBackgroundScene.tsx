import { Canvas } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Gold particles field
function TAMVCellsField() {
  const count = 150;
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
  }, []);

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

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.08, 0]} />
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

// Aztec symbol floating decoration
function AztecSymbol({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.5, 0.1, 8, 4]} />
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

// Main scene content
function SceneContent() {
  return (
    <>
      {/* Background color */}
      <color attach="background" args={["#020617"]} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={["#020617", 5, 25]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight intensity={0.8} position={[5, 10, 5]} color="#F4D278" />
      <directionalLight intensity={0.4} position={[-5, -4, -3]} color="#F97316" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#F4D278" />
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
      
      {/* Gold particles */}
      <TAMVCellsField />
      
      {/* Aztec decorations */}
      <AztecSymbol position={[-4, 2, -5]} />
      <AztecSymbol position={[4, -2, -6]} />
      <AztecSymbol position={[0, 3, -8]} />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom 
          intensity={0.6} 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Noise opacity={0.05} />
        <Vignette offset={0.3} darkness={0.6} />
      </EffectComposer>
    </>
  );
}

interface TAMVBackgroundSceneProps {
  className?: string;
}

export default function TAMVBackgroundScene({ className }: TAMVBackgroundSceneProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className || ""}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
