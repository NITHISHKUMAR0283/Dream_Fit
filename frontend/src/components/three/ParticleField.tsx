import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesCount = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const col = new Float32Array(particlesCount * 3);
    const color1 = new THREE.Color('#ec4899'); // Pink
    const color2 = new THREE.Color('#a855f7'); // Purple
    const color3 = new THREE.Color('#ff6b9d'); // Rose

    for (let i = 0; i < particlesCount; i++) {
      const mixedColor = new THREE.Color();
      const rand = Math.random();
      if (rand < 0.33) {
        mixedColor.copy(color1);
      } else if (rand < 0.66) {
        mixedColor.copy(color2);
      } else {
        mixedColor.copy(color3);
      }
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return col;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  }, [positions, colors]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

interface ParticleFieldProps {
  opacity?: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ opacity = 1 }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <Particles />
      </Canvas>
    </div>
  );
};

export default ParticleField;
