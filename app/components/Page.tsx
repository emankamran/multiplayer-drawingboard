import React, { useState, useEffect, useRef } from 'react';
import useDraw from '~/hooks/useDraw'; // Adjust the path as necessary
import drawLine from '~/utils/drawLine'; // Adjust the path as necessary
import Palette from '~/components/Palette';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
  lineWidth: number;
};
type Point = { x: number; y: number };

const Page = () => {
  const [color, setColor] = useState<string>('#000');
  const [lineWidth, setLineWidth] = useState<number>(2); // Default line width
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Function to draw the permanent grid on the background canvas
  useEffect(() => {
    const backgroundCanvas = backgroundCanvasRef.current;
    const bgCtx = backgroundCanvas?.getContext('2d');
    
    const drawGrid = () => {
      if (!bgCtx || !backgroundCanvas) return;
      const gridSize = 25;

      bgCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height); // Clear any existing grid

      // Draw vertical lines
      for (let x = 0; x <= backgroundCanvas.width; x += gridSize) {
        bgCtx.beginPath();
        bgCtx.moveTo(x, 0);
        bgCtx.lineTo(x, backgroundCanvas.height);
        bgCtx.strokeStyle = '#ddd'; // Light grey for grid lines
        bgCtx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y <= backgroundCanvas.height; y += gridSize) {
        bgCtx.beginPath();
        bgCtx.moveTo(0, y);
        bgCtx.lineTo(backgroundCanvas.width, y);
        bgCtx.strokeStyle = '#ddd'; // Light grey for grid lines
        bgCtx.stroke();
      }
    };

    drawGrid(); // Draw the grid once when the component is mounted
  }, []);

  // Set up drawing on the top canvas and handle socket events
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    socket.emit('client-ready');
    socket.on('get-canvas-state', () => {
      if (!canvasRef.current?.toDataURL()) return;
      socket.emit('canvas-state', canvasRef.current.toDataURL());
    });

    socket.on('canvas-state-from-server', (state: string) => {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on('draw-line', ({ prevPoint, currentPoint, color, lineWidth }: DrawLineProps) => {
      if (!ctx) return;
      drawLine({ prevPoint, currentPoint, ctx, color, lineWidth });
    });

    socket.on('clear', clear);

    return () => {
      socket.off('draw-line');
      socket.off('get-canvas-state');
      socket.off('canvas-state-from-server');
      socket.off('clear');
    };
  }, [canvasRef, clear]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit('draw-line', { prevPoint, currentPoint, color, lineWidth });
    drawLine({ prevPoint, currentPoint, ctx, color, lineWidth });
  }

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
  };

  const handleLineWidth = (selectedWidth: number) => {
    setLineWidth(selectedWidth);
  };

  return (
    <div className='bg-white flex justify-between p-5'>
    <div className='flex flex-col w-full '>
    <button
  type='button'
  className='p-1 border-none bg-transparent'
  onClick={() => socket.emit('clear')}
  title='Clear canvas' // Tooltip text
>
  <img src='/assets/eraser.svg' className='w-10 h-10' alt='Clear canvas' />
</button>

<Palette onColorClick={handleColorSelect} width={handleLineWidth} className=" h-[80%] w-full" />

    


    </div>
    
    <div className="relative flex items-center justify-center">
      {/* Background canvas for grid */}
      <canvas
        ref={backgroundCanvasRef}
        width={1100}
        height={690}
        className="border border-black rounded-md"
      />
  
      {/* Foreground canvas for drawing */}
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={1100}
        height={690}
        className="absolute border border-black rounded-md"
      />
    </div>
  </div>
  
  );
};

export default Page;
