import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  offset: number;
  wobbleSpeed: number;
  baseX: number;
  vx: number;
  vy: number;
}

interface CanvasProps {
  scrollProgress: any;
}

export function AntigravityCanvas({ scrollProgress }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  
  const colors = [
    'rgba(184, 149, 106, 0.4)', // gold
    'rgba(242, 237, 228, 0.4)', // ivory
    'rgba(180, 80, 60, 0.3)',   // deep terracotta
    'rgba(60, 60, 100, 0.3)',   // indigo
    'rgba(200, 120, 80, 0.3)',  // burnt sienna
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Performance optimization: Detection
    const isMobile = window.innerWidth < 768;
    const numParticles = isMobile ? 35 : 75;

    const resize = () => {
      // Use 1x DPI on mobile for performance, or clamp it
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resize);
    resize();

    const createParticle = (yOffset = 0): Particle => {
      return {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + yOffset + Math.random() * 200,
        size: Math.random() * (isMobile ? 30 : 40) + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 1.5 + 0.5,
        offset: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        baseX: Math.random() * window.innerWidth,
        vx: 0,
        vy: 0,
      };
    };

    for (let i = 0; i < numParticles; i++) {
      particles.push(createParticle(-window.innerHeight * Math.random()));
    }

    const drawBlob = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      if (isMobile) {
        // Simpler shape for mobile: Circle
        ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
      } else {
        // Irregular blob shape for desktop
        ctx.moveTo(x + size * 0.3, y - size * 0.8);
        ctx.bezierCurveTo(x + size * 0.9, y - size * 0.9, x + size * 1.1, y - size * 0.2, x + size * 0.8, y + size * 0.4);
        ctx.bezierCurveTo(x + size * 0.5, y + size * 1.0, x - size * 0.5, y + size * 0.9, x - size * 0.8, y + size * 0.4);
        ctx.bezierCurveTo(x - size * 1.1, y - size * 0.2, x - size * 0.8, y - size * 0.9, x + size * 0.3, y - size * 0.8);
        ctx.closePath();
      }
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      const scrollSpeedMult = 1 + (scrollProgress.get() * 8);

      particles.forEach((p, i) => {
        p.offset += p.wobbleSpeed;
        const targetX = p.baseX + Math.sin(p.offset) * (isMobile ? 20 : 40);
        
        const dx = targetX - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const repulseRadius = isMobile ? 80 : 150;
        if (dist < repulseRadius) {
          const force = (repulseRadius - dist) / repulseRadius;
          p.vx += (dx / dist) * force * 2;
          p.vy += (dy / dist) * force * 2;
        }

        p.vx += (targetX - p.x) * 0.02;
        p.vx *= 0.9;
        p.vy *= 0.9;
        
        p.x += p.vx;
        p.y -= (p.speed * scrollSpeedMult) - p.vy;

        if (p.y < -100) {
          particles[i] = createParticle();
          particles[i].baseX = p.x;
        }

        ctx.fillStyle = p.color;
        drawBlob(ctx, p.x, p.y, p.size);
      });

      animationFrameId = requestAnimationFrame(render);
    };
    
    render();

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.4, zIndex: 0, willChange: 'transform' }}
    />
  );
}

