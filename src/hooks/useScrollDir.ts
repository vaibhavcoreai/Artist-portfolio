import { useState, useEffect, useRef } from 'react';

/**
 * useScrollDir — returns scroll direction and whether user has scrolled past threshold.
 * Used by NavBar to fade in on scroll-up, hide on scroll-down.
 */
export function useScrollDir(threshold = 60) {
  const [visible, setVisible]  = useState(true);
  const [atTop, setAtTop]      = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < threshold);

      if (Math.abs(currentY - lastY.current) < 4) return; // dead-zone

      if (currentY > lastY.current && currentY > threshold) {
        // Scrolling DOWN — hide nav
        setVisible(false);
      } else {
        // Scrolling UP — show nav
        setVisible(true);
      }

      lastY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { visible, atTop };
}
