import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function MagneticButton({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3; // magnetic pull strength
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative px-8 py-5 border border-aged-gold/50 text-warm-ivory uppercase font-sans text-xs tracking-widest overflow-hidden group hover:border-aged-gold"
      data-cursor="hover"
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
    >
      <span className="relative z-10 transition-colors duration-500 group-hover:text-near-black">
        {children}
      </span>
      <div 
        className="absolute inset-0 bg-aged-gold transform scale-y-0 origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-y-100 z-0" 
      />
    </motion.button>
  );
}
