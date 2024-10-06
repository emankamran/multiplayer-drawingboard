
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
 import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import ModernPalette from './Paint'; // Adjust the path according to your file structure
import ArtTools from './ArtTools'; // Adjust the path according to your file structure
interface PaletteProps {
  onColorClick: (color: string) => void;
  width: (lineWidth: number) => void;
  className?: string; // Add this line

}
export default function Palette({ onColorClick ,width, className  }: PaletteProps) {
  const [cursor, setCursor] = useState<string>("default-cursor");
  const [cursorColor, setCursorColor] = useState<string>("");

  useEffect(() => {
    const updateSVGCursorColor = async () => {
      if (cursorColor !== "") {
        try {
          console.log("Updating cursor color to:", cursorColor);

          const response = await fetch(`/assets/${cursor}-cursor.svg`);
          if (!response.ok) throw new Error("Failed to fetch SVG cursor");

          let svgText = await response.text();
          let updatedSVG: string;

          switch (cursor) {
            case "roller":
              updatedSVG = svgText
                .replace(
                  /\.cls-6\s*\{[^}]*fill:[^;}]*;/g,
                  `.cls-6 { fill:${cursorColor}; }`
                )
                .replace(
                  /\.cls-7\s*\{[^}]*fill:[^;}]*;/g,
                  `.cls-7 { fill:${cursorColor}; }`
                )
                .replace(
                  /\.cls-8\s*\{[^}]*fill:[^;}]*;/g,
                  `.cls-8 { fill:${cursorColor}; }`
                );
              break;

            case "flat-brush":
              updatedSVG = svgText
                .replace(/fill:rgb\(244,187,49\)/g, `fill:${cursorColor}`)
                .replace(/fill:rgb\(183,140,37\)/g, `fill:${cursorColor}`)
                .replace(/fill:rgb\(247,204,101\)/g, `fill:${cursorColor}`)
                .replace(/fill:rgb\(158,158,158\)/g, `fill:${cursorColor}`)
                .replace(/fill:rgb\(182,182,182\)/g, `fill:${cursorColor}`)
                .replace(/fill:rgb\(118,118,118\)/g, `fill:${cursorColor}`);
              break;

            case "marker":
              updatedSVG = svgText
                .replace(
                  /\.st0\s*\{[^}]*fill:[^;}]*;/g,
                  `.st0 { fill:${cursorColor}; }`
                )
               
                .replace(
                  /\.st2\s*\{[^}]*fill:[^;}]*;/g,
                  `.st2 { fill:${cursorColor}; }`
                )
                .replace(
                  /\.st3\s*\{[^}]*fill:[^;}]*;/g,
                  `.st3 { fill:${cursorColor}; }`
                );
              break;

            case "pencil":
              updatedSVG = svgText.replace(
                /\.st0\s*\{[^}]*fill:[^;}]*;/g,
                `.st0 { fill:${cursorColor}; }`
              );
              break;

            case "round-brush":
              updatedSVG = svgText
                .replace(/fill:#EF3388/g, `fill:${cursorColor}`)
                .replace(/fill:#BC086B/g, `fill:${cursorColor}`)
                .replace(/fill:#A0005F/g, `fill:${cursorColor}`);
              break;

            default:
              updatedSVG = svgText;
              break;
          }

          const base64SVG = btoa(unescape(encodeURIComponent(updatedSVG)));
          const dataURL = `data:image/svg+xml;base64,${base64SVG}`;

          let hotspotX = 8;
          let hotspotY = 8;
          if (cursor === "round-brush") {
            hotspotX = 12;
            hotspotY = 12;
          }

          document.body.style.cursor = `url(${dataURL}) ${hotspotX} ${hotspotY}, auto`;
        } catch (error) {
          console.error("Error updating cursor color:", error);
        }
      } else {
        document.body.style.cursor = `url("/assets/${cursor}-cursor.svg"), auto`;
      }
    };

    updateSVGCursorColor();
  }, [cursor, cursorColor]);

  const handleToolClick = (tool: string) => {
    console.log("Tool clicked:", tool);
    setCursor(tool);
  };
  const handleLineWidth = (lineWidth: number) => {
    console.log("Tool clicked:", lineWidth);
    width(lineWidth);
  };
  
  const handleColorClick = (color: string) => {
    setCursorColor(color);
    onColorClick(color);
  };

  return (
    <div className={`${className}`}>
      <Canvas shadows fallback={<div>Loading...</div>} >
      <ArtTools onToolClick={handleToolClick} width={handleLineWidth} />
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <ModernPalette onColorClick={handleColorClick} />
       
      </Canvas>
      </div>
   
  );
}
