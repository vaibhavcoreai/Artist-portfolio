import { useEffect, useRef } from 'react';

interface BrushCanvasProps {
  id: number;
  className?: string;
  style?: React.CSSProperties;
}

// Simple seeded random to keep brush strokes deterministic per artwork
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function BrushCanvas({ id, className, style }: BrushCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Use artwork id as seed
    const rand = mulberry32(id * 12345);

    // Dynamic resolution based on container could be tricky, 
    // let's just use a fixed high-res internal size
    canvas.width = 800;
    canvas.height = 800; // Will be visually sized by CSS aspect ratio

    // Base palettes based on id
    const palettes = [
      ['#2D2824', '#4A3B32', '#7A5C3A', '#1C1917', '#B8956A'], // Earth / Gold
      ['#1A242B', '#2C3E50', '#85929E', '#EAECEE', '#D5DBDB'], // Cool Blue / Slate
      ['#362222', '#5A3434', '#8E5252', '#F2EDE4', '#111014'], // Crimson / Charcoal
      ['#1B1D1C', '#2F3130', '#B5B1A8', '#FAF8F5', '#4A4D4A'], // Monochromatic
    ];

    const palette = palettes[id % palettes.length];
    
    // Background
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw painterly strokes
    const drawStroke = () => {
      const startX = rand() * canvas.width;
      const startY = rand() * canvas.height;
      const length = rand() * 300 + 100;
      const angle = rand() * Math.PI * 2;
      const thickness = rand() * 40 + 10;
      const color = palette[Math.floor(rand() * palette.length)];
      const opacity = rand() * 0.4 + 0.1;

      ctx.save();
      ctx.translate(startX, startY);
      ctx.rotate(angle);
      
      // Simulate bristle marks
      for (let i = 0; i < thickness; i += 2) {
        ctx.beginPath();
        ctx.moveTo(0, i - thickness/2);
        
        // Wavy line
        ctx.bezierCurveTo(
          length * 0.3, (i - thickness/2) + (rand() * 20 - 10),
          length * 0.7, (i - thickness/2) + (rand() * 20 - 10),
          length, i - thickness/2
        );
        
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity * (rand() * 0.5 + 0.5);
        ctx.lineWidth = rand() * 3 + 1;
        ctx.stroke();
      }
      ctx.restore();
    };

    // Layer multiple strokes
    for (let i = 0; i < 150; i++) {
      drawStroke();
    }

    // Add subtle grain overlay
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (rand() - 0.5) * 15;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
      data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

  }, [id]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className} 
      style={{ ...style, width: '100%', height: '100%', objectFit: 'cover' }} 
    />
  );
}
