import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

interface BrushProps {
    position: [number, number, number];
    textureUrl: string;
    onClick: () => void;
    scale?: [number, number, number]; // Make scale optional
    ref: any;
  }
  
  export default function Brush({ position, textureUrl, onClick,scale = [1, 1, 1], ref }: BrushProps) {
    const texture = useLoader(TextureLoader, textureUrl);
  
    return (
      <mesh position={position} onClick={onClick} scale={scale} ref={ref} castShadow receiveShadow>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={texture} transparent={true} />
      </mesh>
    );
  }
  