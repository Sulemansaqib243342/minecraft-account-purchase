'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import FloatingCubes from './FloatingCubes';

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1.5} color="#39FF14" />
          <pointLight position={[-5, -5, 3]} intensity={1} color="#8B5CF6" />
          <pointLight position={[0, 3, 5]} intensity={0.7} color="#06B6D4" />
          <fog attach="fog" args={['#0a0a0f', 8, 20]} />
          <FloatingCubes />
        </Suspense>
      </Canvas>
    </div>
  );
}
