import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, type ReactNode } from 'react';

type Phase = 'idle' | 'cover' | 'reveal';

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [phase, setPhase] = useState<Phase>('idle');
  const [displayChildren, setDisplayChildren] = useState(children);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      // Route changed: trigger cover animation and DO NOT update displayChildren yet.
      setPhase('cover');
      setCurrentPath(location.pathname);
    } else if (phase === 'idle') {
      // Only keep children synced if we are fully idle.
      setDisplayChildren(children);
    }
  }, [location.pathname, currentPath, phase, children]);


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

  const layers = [
    { id: 1, color: 'bg-deep-charcoal', delay: 0 },
    { id: 2, color: 'bg-aged-gold', delay: 0.1 },
    { id: 3, color: 'bg-near-black', delay: 0.2 },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Page content */}
      <div key={phase === 'idle' ? location.pathname : undefined}>
        {displayChildren}
      </div>

      {/* Curtain overlay — only renders during transitions */}
      {phase !== 'idle' && (
        <div className="fixed inset-0 z-[150000] pointer-events-none overflow-hidden">
          {layers.map((layer, index) => {
            const isLastLayer = index === layers.length - 1;
            return (
              <motion.div
                key={layer.id}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: phase === 'cover' ? 1 : 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.76, 0, 0.24, 1], // Custom luxury easing
                  delay: layer.delay,
                }}
                onAnimationComplete={() => {
                  if (isLastLayer) {
                    if (phase === 'cover') handleCoverComplete();
                    if (phase === 'reveal') handleRevealComplete();
                  }
                }}
                style={{ 
                  transformOrigin: phase === 'cover' ? 'bottom' : 'top' 
                }}
                className={`absolute inset-0 w-full h-full ${layer.color} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
