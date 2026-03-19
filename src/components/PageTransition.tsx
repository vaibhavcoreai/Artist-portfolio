import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, type ReactNode } from 'react';

type Phase = 'idle' | 'cover' | 'reveal';

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [phase, setPhase] = useState<Phase>('idle');
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevPath = useRef(location.pathname);
  const isFirstRender = useRef(true);

  // Update displayChildren when children change AND we're idle (initial load or after transition)
  useEffect(() => {
    if (phase === 'idle') {
      setDisplayChildren(children);
    }
  }, [children, phase]);

  // Detect route change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      setPhase('cover');
    }
  }, [location.pathname]);

  const handleCoverComplete = () => {
    // Curtain is fully covering — swap content
    setDisplayChildren(children);
    // Small delay to let React render the new content behind the curtain
    requestAnimationFrame(() => {
      setPhase('reveal');
    });
  };

  const handleRevealComplete = () => {
    setPhase('idle');
  };

  return (
    <div className="relative min-h-screen">
      {/* Page content */}
      <div key={phase === 'idle' ? location.pathname : undefined}>
        {displayChildren}
      </div>

      {/* Curtain overlay — only renders during transitions */}
      {phase !== 'idle' && (
        <div className="fixed inset-0 z-[150000] pointer-events-none overflow-hidden">
          {/* Back layer */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase === 'cover' ? 1 : 0 }}
            transition={{
              duration: 0.45,
              ease: [0.76, 0, 0.24, 1],
            }}
            onAnimationComplete={() => {
              if (phase === 'cover') handleCoverComplete();
              if (phase === 'reveal') handleRevealComplete();
            }}
            style={{ transformOrigin: phase === 'cover' ? 'left' : 'right' }}
            className="absolute inset-0 bg-[#111014]"
          />

          {/* Front layer with gold accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase === 'cover' ? 1 : 0 }}
            transition={{
              duration: 0.45,
              ease: [0.76, 0, 0.24, 1],
              delay: 0.06,
            }}
            style={{ transformOrigin: phase === 'cover' ? 'left' : 'right' }}
            className="absolute inset-0 bg-[#0a0a0c]"
          >
            {/* Thin gold line on leading edge */}
            <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-aged-gold/50 to-transparent" />
          </motion.div>
        </div>
      )}
    </div>
  );
}
