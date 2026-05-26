import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export interface CanvasItem {
  image: string;
  title: string;
  description?: string;
  link?: string;
}

interface InfiniteCanvasProps {
  items: CanvasItem[];
  columns?: number;
  gap?: number;
  cellWidth?: number;
  cellHeight?: number;
  mouseInfluence?: number;
  wheelSpeed?: number;
  dragSpeed?: number;
  className?: string;
}

export function InfiniteCanvas({
  items,
  columns = 4,
  gap = 60, // Large premium spacing between images
  cellWidth = 300,
  cellHeight = 360,
  mouseInfluence = 0.04,
  wheelSpeed = 0.8,
  dragSpeed = 0.9,
  className = '',
}: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Position coordinates
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });
  const velocityRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const idleTimerRef = useRef<number>(0);
  const cellsRef = useRef<HTMLDivElement[]>([]);
  const isEnteringRef = useRef(true);

  // States
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tiltVal, setTiltVal] = useState({ x: 0, y: 0, activeIdx: null as number | null });
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });

  // Update viewport dimensions dynamically
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setViewport({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Guarantee grid is large enough by repeating items if necessary
  const getOptimizedGrid = useCallback(() => {
    if (items.length === 0) return { list: [], cols: columns, gridW: 0, gridH: 0 };

    // Minimum dimensions to ensure no visible popping/snapping during wrap
    const minW = viewport.w * 2 + cellWidth;
    const minH = viewport.h * 2 + cellHeight;

    let repeatCount = 1;
    let tempCols = columns;
    let tempRows = Math.ceil(items.length / tempCols);
    let tempGridW = tempCols * (cellWidth + gap);
    let tempGridH = tempRows * (cellHeight + gap);

    // Keep doubling/multiplying items until we span wider than the viewport wrapping thresholds
    while (tempGridW < minW || tempGridH < minH || (items.length * repeatCount) < 16) {
      repeatCount++;
      // Dynamically adjust columns as we grow
      if (tempGridW < minW) {
        tempCols = Math.max(tempCols, Math.ceil(Math.sqrt(items.length * repeatCount)));
      }
      tempRows = Math.ceil((items.length * repeatCount) / tempCols);
      tempGridW = tempCols * (cellWidth + gap);
      tempGridH = tempRows * (cellHeight + gap);
    }

    const optimizedItems: (CanvasItem & { uniqueKey: string; origIdx: number })[] = [];
    for (let r = 0; r < repeatCount; r++) {
      items.forEach((item, idx) => {
        optimizedItems.push({
          ...item,
          uniqueKey: `opt-${idx}-${r}`,
          origIdx: idx,
        });
      });
    }

    return {
      list: optimizedItems,
      cols: tempCols,
      gridW: tempGridW,
      gridH: tempGridH,
    };
  }, [items, columns, gap, cellWidth, cellHeight, viewport]);

  const { list: optimizedItems, cols: finalCols, gridW, gridH } = getOptimizedGrid();

  // Get base positioning in the wrapping grid
  const getCellPos = useCallback(
    (idx: number) => {
      const col = idx % finalCols;
      const row = Math.floor(idx / finalCols);
      return {
        x: col * (cellWidth + gap),
        y: row * (cellHeight + gap),
      };
    },
    [finalCols, cellWidth, cellHeight, gap]
  );

  // 3D Card Hover Tilt logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltVal({ x, y, activeIdx: idx });
  };

  const handleMouseLeave = () => {
    setTiltVal({ x: 0, y: 0, activeIdx: null });
    setHoveredIndex(null);
  };

  // Entrance Stagger Animation
  useEffect(() => {
    if (cellsRef.current.length === 0 || optimizedItems.length === 0) return;

    cellsRef.current.forEach(cell => {
      if (cell) cell.style.opacity = '0';
    });

    const timer = setTimeout(() => {
      isEnteringRef.current = false;
      gsap.fromTo(
        cellsRef.current.filter(Boolean),
        { scale: 0.7, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          stagger: {
            grid: [Math.ceil(optimizedItems.length / finalCols), finalCols],
            from: "center",
            amount: 0.6
          },
          ease: "power3.out",
        }
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [optimizedItems.length, finalCols]);

  // Main animation ticker loop
  useEffect(() => {
    if (!containerRef.current || optimizedItems.length === 0 || gridW === 0 || gridH === 0) return;

    const ctx = gsap.context(() => {
      const ticker = () => {
        // Subtle drift if idle
        const time = gsap.ticker.time;
        if (!dragRef.current.active && Date.now() - idleTimerRef.current > 2000) {
          targetRef.current.x += Math.sin(time * 0.15) * 0.12;
          targetRef.current.y += Math.cos(time * 0.15) * 0.12;
        }

        // Smooth position interpolation
        posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.08;
        posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.08;

        const mx = (mouseRef.current.x - viewport.w / 2) / viewport.w;
        const my = (mouseRef.current.y - viewport.h / 2) / viewport.h;

        const offsetX = posRef.current.x + mx * mouseInfluence * gridW;
        const offsetY = posRef.current.y + my * mouseInfluence * gridH;

        // Position cells beautifully
        cellsRef.current.forEach((cell, idx) => {
          if (!cell) return;
          const base = getCellPos(idx);

          let cx = base.x + offsetX;
          let cy = base.y + offsetY;

          // Pure off-screen wrapping
          cx = ((cx + gridW / 2) % gridW + gridW) % gridW - gridW / 2;
          cy = ((cy + gridH / 2) % gridH + gridH) % gridH - gridH / 2;

          const vx = viewport.w / 2 + cx - cellWidth / 2;
          const vy = viewport.h / 2 + cy - cellHeight / 2;

          // Extended visibility margin
          const margin = Math.max(cellWidth, cellHeight) * 1.2;
          const visible =
            vx > -margin &&
            vx < viewport.w + margin &&
            vy > -margin &&
            vy < viewport.h + margin;

          if (visible) {
            cell.style.display = 'block';
            cell.style.transform = `translate3d(${vx}px, ${vy}px, 0)`;

            if (!isEnteringRef.current) {
              const distX = (vx + cellWidth / 2 - viewport.w / 2) / viewport.w;
              const distY = (vy + cellHeight / 2 - viewport.h / 2) / viewport.h;
              const dist = Math.sqrt(distX * distX + distY * distY);
              
              const scale = 1 - dist * 0.05;
              const opacity = 1 - dist * 0.3;

              cell.style.opacity = `${Math.max(0.25, Math.min(1, opacity))}`;
              
              const wrapper = cell.querySelector('.canvas-cell-wrapper') as HTMLElement;
              if (wrapper) {
                wrapper.style.transform = `scale(${Math.max(0.88, scale)})`;
              }
            }
          } else {
            cell.style.display = 'none';
          }
        });
      };

      gsap.ticker.add(ticker);
      return () => {
        gsap.ticker.remove(ticker);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [optimizedItems, getCellPos, gridW, gridH, cellWidth, cellHeight, mouseInfluence, viewport]);

  // Wheel events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      idleTimerRef.current = Date.now();
      targetRef.current.x -= e.deltaX * wheelSpeed;
      targetRef.current.y -= e.deltaY * wheelSpeed;
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [wheelSpeed]);

  // Pointer drag events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (e: PointerEvent) => {
      idleTimerRef.current = Date.now();
      dragRef.current.active = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      velocityRef.current = { x: 0, y: 0 };
      container.style.cursor = 'grabbing';
      container.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (!dragRef.current.active) return;
      idleTimerRef.current = Date.now();

      const dx = (e.clientX - dragRef.current.lastX) * dragSpeed;
      const dy = (e.clientY - dragRef.current.lastY) * dragSpeed;

      targetRef.current.x += dx;
      targetRef.current.y += dy;

      velocityRef.current.x = dx;
      velocityRef.current.y = dy;

      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      container.style.cursor = 'grab';
      container.releasePointerCapture(e.pointerId);

      const vx = velocityRef.current.x;
      const vy = velocityRef.current.y;
      
      gsap.to(targetRef.current, {
        x: targetRef.current.x + vx * 10,
        y: targetRef.current.y + vy * 10,
        duration: 1.2,
        ease: 'power2.out',
      });
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointerleave', onPointerUp);

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointerleave', onPointerUp);
    };
  }, [dragSpeed]);

  const handleCellClick = useCallback(
    (item: CanvasItem & { origIdx: number }) => {
      const dx = Math.abs(dragRef.current.startX - dragRef.current.lastX);
      const dy = Math.abs(dragRef.current.startY - dragRef.current.lastY);
      if (dx < 6 && dy < 6 && item.link) {
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 0.97,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => navigate(item.link!)
        });
      }
    },
    [navigate]
  );

  if (items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="font-serif italic text-3xl text-warm-ivory/20">The Canvas is Empty</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none bg-near-black ${className}`}
      style={{ cursor: 'grab', touchAction: 'none', perspective: '1000px' }}
    >
      {/* Ambient Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(8,6,8,0.7) 85%, rgba(8,6,8,0.98) 100%)',
        }}
      />

      {/* Grid wrapper */}
      <div ref={gridRef} className="absolute inset-0">
        {optimizedItems.map((item, idx) => {
          const isCurrentHovered = hoveredIndex === idx;
          const isTilted = tiltVal.activeIdx === idx;
          
          const rotateX = isTilted ? -tiltVal.y * 18 : 0;
          const rotateY = isTilted ? tiltVal.x * 18 : 0;
          const scale = isCurrentHovered ? 1.05 : 1.0;

          return (
            <div
              key={item.uniqueKey}
              ref={(el) => {
                if (el) cellsRef.current[idx] = el;
              }}
              className="absolute top-0 left-0"
              style={{
                width: cellWidth,
                height: cellHeight,
                willChange: 'transform, opacity',
              }}
            >
              <div 
                className="canvas-cell-wrapper w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
                style={{ willChange: 'transform' }}
              >
                <div
                  className="relative w-full h-full rounded-xl overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-300 bg-deep-charcoal border border-white/[0.04]"
                  style={{
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, box-shadow',
                  }}
                  onClick={() => handleCellClick(item)}
                  onMouseMove={(e) => handleMouseMove(e, idx)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Active highlight border */}
                  <div
                    className="absolute inset-0 rounded-xl border transition-opacity duration-300 pointer-events-none z-10"
                    style={{
                      borderColor: 'rgba(184,134,11,0.25)',
                      opacity: isCurrentHovered ? 1 : 0,
                    }}
                  />

                  {/* Image */}
                  <div className="w-full h-full overflow-hidden select-none pointer-events-none">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{
                        transform: isTilted 
                          ? `scale(1.05) translate3d(${tiltVal.x * -8}px, ${tiltVal.y * -8}px, 0)` 
                          : 'scale(1.0) translate3d(0, 0, 0)',
                      }}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* High-Performance solid background hover overlay (eliminates laggy backdrop-blur) */}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end transition-all duration-300 ${
                      isCurrentHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
                    }`}
                    style={{
                      background: 'linear-gradient(to top, rgba(8,6,8,0.95) 0%, rgba(8,6,8,0.75) 75%, transparent 100%)',
                    }}
                  >
                    <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-aged-gold mb-1 block">
                      Deepak Patil
                    </span>
                    <h3 className="font-serif italic text-lg text-warm-ivory leading-tight mb-0.5">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-sans text-[10px] font-light text-ghost-white/40 tracking-[0.05em]">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Focus Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 opacity-[0.04] mix-blend-difference">
        <div className="w-8 h-px bg-aged-gold" />
        <div className="w-px h-8 bg-aged-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}

