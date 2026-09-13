'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CubeProps {
  position: [number, number, number];
  size: number;
  speed: number;
  color: string;
}

function FloatingCube({ position, size, speed, color }: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.005 * speed;
    meshRef.current.rotation.y += 0.008 * speed;
    meshRef.current.position.y =
      initialY + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.6}
        roughness={0.2}
        metalness={0.9}
        emissive={color}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

export default function FloatingCubes() {
  const cubes = useMemo(() => {
    const items: CubeProps[] = [];
    const colors = ['#39FF14', '#8B5CF6', '#06B6D4', '#22C55E', '#A855F7'];
    for (let i = 0; i < 25; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10 - 5,
        ],
        size: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return items;
  }, []);

  return (
    <>
      {cubes.map((cube, i) => (
        <FloatingCube key={i} {...cube} />
      ))}
    </>
  );
}
