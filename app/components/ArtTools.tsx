import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface BrushProps {
  position: [number, number, number]
  textureUrl: string
  scale: [number, number, number]
  onClick: () => void
  hovered: boolean
  onPointerOver: () => void
  onPointerOut: () => void
}

const Brush = React.forwardRef<THREE.Mesh, BrushProps>(({ position, textureUrl, scale, onClick, hovered, onPointerOver, onPointerOut }, ref) => {
  const texture = useTexture(textureUrl)
  const [currentScale, setCurrentScale] = useState(scale)

  useEffect(() => {
    if (hovered) {
      setCurrentScale([0.6, 0.6, 0.6]) // Scale up when hovered
    } else {
      setCurrentScale(scale)
    }
  }, [hovered, scale])

  return (
    <mesh 
      ref={ref} 
      position={position} 
      scale={currentScale} 
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
    </mesh>
  )
})

interface ArtToolsProps {
  onToolClick: (tool: string) => void
  width: (lineWidth: number) => void
}

export default function ArtTools({ onToolClick, width }: ArtToolsProps) {
  const brushTextures: Record<string, string> = {
    "round-brush": "/assets/round-brush-cursor.svg",
    "flat-brush": "/assets/flat-brush-cursor.svg",
    roller: "/assets/roller-cursor.svg",
    marker: "/assets/marker-cursor.svg",
    pencil: "/assets/pencil-cursor.svg",
  };
  
  const cursorToLineWidth: Record<string, number> = {
    marker: 5,
    roller: 20,
    "flat-brush": 10,
    pencil: 2,
    "round-brush": 8,
  }

  const group = useRef<THREE.Group>(null)
  const brushRefs = useRef<{ [key: string]: THREE.Mesh }>({})
  const [rotation, setRotation] = useState(0)
  const [isCursorOverCanvas, setIsCursorOverCanvas] = useState(false)
  const [hoveredBrush, setHoveredBrush] = useState<string | null>(null)
  const isDragging = useRef(false)
  const previousMouseX = useRef(0)

  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  useEffect(() => {
    const handleMouseDown = () => {
      isDragging.current = true
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (isCursorOverCanvas && isDragging.current) {
        const deltaX = event.clientX - previousMouseX.current
        setRotation((prevRotation) => prevRotation + deltaX * 0.01)
      }
      previousMouseX.current = event.clientX
    }

    const handleMouseEnterCanvas = () => {
      setIsCursorOverCanvas(true)
    }

    const handleMouseLeaveCanvas = () => {
      setIsCursorOverCanvas(false)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)

    const canvasElement = document.querySelector('canvas')
    if (canvasElement) {
      canvasElement.addEventListener('mouseenter', handleMouseEnterCanvas)
      canvasElement.addEventListener('mouseleave', handleMouseLeaveCanvas)
    }

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)

      if (canvasElement) {
        canvasElement.removeEventListener('mouseenter', handleMouseEnterCanvas)
        canvasElement.removeEventListener('mouseleave', handleMouseLeaveCanvas)
      }
    }
  }, [isCursorOverCanvas])

  useFrame(() => {
    if (group.current && isCursorOverCanvas) {
      group.current.rotation.y = rotation
    }
  })

  const handleClick = (tool: string) => {
    const lineWidth = cursorToLineWidth[tool] || 1
    width(lineWidth)
    onToolClick(tool)
  }

  return (
    <group ref={group} position={[0, -1, 0]}>
      {Object.keys(brushTextures).map((tool, index) => {
        const angle = (index / Object.keys(brushTextures).length) * Math.PI * 2
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2

        const textureUrl = brushTextures[tool]
        
        return (
          <Brush
            key={tool}
            ref={(ref: THREE.Mesh) => {
              if (ref) brushRefs.current[tool] = ref
            }}
            position={[x, 0, z]}
            textureUrl={textureUrl}
            scale={[0.5, 0.5, 0.5]}
            onClick={() => handleClick(tool)}
            hovered={hoveredBrush === tool}
            onPointerOver={() => setHoveredBrush(tool)}
            onPointerOut={() => setHoveredBrush(null)}
          />
        )
      })}
    </group>
  )
}
