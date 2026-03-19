import { useEffect, useRef, useCallback } from 'react';

/**
 * useCursor — drives the custom crosshair dot + ring cursor
 * The dot snaps instantly; the ring lags behind with lerp interpolation.
 */
export function useCursor() {
  const dotRef  = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const mouse  = useRef({ x: -100, y: -100 });
  const ring   = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
    ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);

    if (dotRef.current) {
      dotRef.current.style.transform =
        `translate(calc(${mouse.current.x}px - 50%), calc(${mouse.current.y}px - 50%))`;
    }

    if (ringRef.current) {
      ringRef.current.style.transform =
        `translate(calc(${ring.current.x}px - 50%), calc(${ring.current.y}px - 50%))`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('a, button, [data-cursor="hover"]');
      dotRef.current?.classList.toggle('is-hovering', isInteractive);
      ringRef.current?.classList.toggle('is-hovering', isInteractive);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onMouseOver);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return { dotRef, ringRef };
}
