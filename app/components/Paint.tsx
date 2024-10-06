import React, { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const colors: string[] = [
  "#FF3333",
  "#f20cb6",
  "#3333FF",
  "#FFFF33",
  "#FF33FF",
  "#33FFFF",
  "#FFA533",
  "#A533FF",
  "#f20c8b",
  "#FF5733",
  "#33A5FF",
  "#7FFF33",
];

export interface ModernPaletteProps {
  onColorClick: (color: string) => void;
}

export default function ModernPalette({ onColorClick }: ModernPaletteProps) {
  const group = useRef<THREE.Group>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const lightenColor = (color: string, percent: number) => {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
    
    r = Math.min(255, Math.floor(r + (255 - r) * percent));
    g = Math.min(255, Math.floor(g + (255 - g) * percent));
    b = Math.min(255, Math.floor(b + (255 - b) * percent));

    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
  };

  // If you want to lock the rotation at a fixed angle
  useFrame(() => {
    if (group.current) {
        group.current.rotation.set(Math.PI / 2, 0, 0);
        // Locks the group at a fixed angle
    }
  });

  return (
    <group ref={group} position={[0, 1, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.5} roughness={0.5} />
      </mesh>
      {colors.map((color, index) => {
        const row = Math.floor(index / 6);
        const col = index % 6;
        const x = (col - 2.5) * 0.6;
        const z = (row - 0.5) * 0.6;
        const isHovered = hoveredColor === color;
        const displayColor = isHovered ? lightenColor(color, 0.3) : color;

        return (
          <mesh
            key={index}
            position={[x, 0.1, z]}
            castShadow
            receiveShadow
            onClick={() => onColorClick(color)}
            onPointerOver={() => setHoveredColor(color)}
            onPointerOut={() => setHoveredColor(null)}
          >
            <boxGeometry args={[0.5, 0.1, 0.5]} />
            <meshStandardMaterial color={displayColor} metalness={0.3} roughness={0.2} />
          </mesh>
        );
      })}
      <Text
        position={[0, 0.2, -1.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="#ECF0F1"
        anchorX="center"
        anchorY="middle"
      >
        Paint Palette
      </Text>
    </group>
  );
}
