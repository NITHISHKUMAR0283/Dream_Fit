import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface RotatingSphereProps {
  color: string;
}

const RotatingSphere: React.FC<RotatingSphereProps> = ({ color }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.6}
        speed={1.5}
        roughness={0}
        metalness={0.8}
      />
    </Sphere>
  );
};

interface AnimatedSphereProps {
  color?: string;
  width?: string;
  height?: string;
  className?: string;
}

const AnimatedSphere: React.FC<AnimatedSphereProps> = ({
  color = '#ec4899',
  width = '400px',
  height = '400px',
  className = '',
}) => {
  return (
    <div className={className} style={{ width, height, position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#a855f7" />
        <RotatingSphere color={color} />
      </Canvas>
    </div>
  );
};

export default AnimatedSphere;
