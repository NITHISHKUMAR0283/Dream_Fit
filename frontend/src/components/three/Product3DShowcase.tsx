import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface ProductBoxProps {
  imageUrl: string;
  isHovered: boolean;
}

const ProductBox: React.FC<ProductBoxProps> = ({ imageUrl, isHovered }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  React.useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );
  }, [imageUrl]);

  useFrame((state) => {
    if (meshRef.current) {
      if (isHovered) {
        meshRef.current.rotation.y += 0.01;
      } else {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      }
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[2, 2.8, 0.1]} />
      {texture ? (
        <meshStandardMaterial
          map={texture}
          metalness={0.3}
          roughness={0.4}
          envMapIntensity={1}
        />
      ) : (
        <meshStandardMaterial color="#ec4899" metalness={0.5} roughness={0.5} />
      )}
    </mesh>
  );
};

interface Product3DShowcaseProps {
  imageUrl: string;
  width?: string;
  height?: string;
}

const Product3DShowcase: React.FC<Product3DShowcaseProps> = ({
  imageUrl,
  width = '100%',
  height = '400px',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{ width, height, position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />

        <ambientLight intensity={0.5} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#a855f7" />

        <Environment preset="city" />

        <ProductBox imageUrl={imageUrl} isHovered={isHovered} />

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={5}
          blur={2.5}
          far={4}
        />
      </Canvas>

      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#374151',
            pointerEvents: 'none',
          }}
        >
          Drag to rotate • Scroll to zoom
        </div>
      )}
    </div>
  );
};

export default Product3DShowcase;
