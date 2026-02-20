import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  speed: number;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ position, color, speed }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const FloatingShapes: React.FC = () => {
  const shapes = useMemo(
    () => [
      { position: [-4, 2, -5], color: '#ec4899', speed: 0.5 },
      { position: [4, -2, -5], color: '#a855f7', speed: 0.7 },
      { position: [0, 3, -8], color: '#ff6b9d', speed: 0.6 },
      { position: [-3, -3, -6], color: '#f472b6', speed: 0.8 },
      { position: [3, 1, -7], color: '#c084fc', speed: 0.4 },
    ],
    []
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
      {shapes.map((shape, index) => (
        <FloatingShape
          key={index}
          position={shape.position as [number, number, number]}
          color={shape.color}
          speed={shape.speed}
        />
      ))}
    </Canvas>
  );
};

export default FloatingShapes;
