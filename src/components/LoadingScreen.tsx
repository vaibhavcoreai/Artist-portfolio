import { motion } from 'framer-motion';
import { useState } from 'react';
import BlurText from './ui/BlurText';
import GaneshaLogo from '../assets/ganesha-logo.svg';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'exit'>('intro');

  const triggerExit = () => {
    setPhase('exit');
    setTimeout(onComplete, 1200); // Match exit transition duration
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200000] flex items-center justify-center overflow-hidden bg-near-black"
      animate={phase === 'exit' ? { opacity: 0, filter: 'blur(12px)', scale: 1.05 } : { opacity: 1, filter: 'blur(0px)', scale: 1 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* ── Background Noise/Grain Overlay ── */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Abstract Animated Glows ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.15, 0.08], scale: [0.8, 1.1, 1.2] }}
        transition={{ duration: 4, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(184,149,106,0.15) 0%, transparent 60%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.1, 0.04], scale: [0.5, 1.4, 1.8] }}
        transition={{ duration: 5, ease: "easeOut", delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(242,237,228,0.08) 0%, transparent 60%)',
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Ganesha Logo */}
        <motion.div
          initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
          animate={{ opacity: 0.85, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          className="mb-10 md:mb-14"
        >
          <img 
            src={GaneshaLogo} 
            alt="Ganesha" 
            className="w-11 md:w-14 h-auto" 
            style={{ filter: 'drop-shadow(0 0 12px rgba(232,195,107,0.3)) brightness(1.2)' }}
          />
        </motion.div>

        {/* Name Reveal */}
        <div className="flex flex-col items-center mb-5 overflow-hidden">
          <BlurText
            text="DEEPAK PATIL"
            delay={80}
            animateBy="words"
            direction="bottom"
            className="text-[28px] md:text-5xl font-serif tracking-[0.2em] md:tracking-[0.25em] text-warm-ivory uppercase text-center"
          />
        </div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="font-sans text-[9px] md:text-[11px] uppercase tracking-[0.5em] md:tracking-[0.6em] text-aged-gold/70 block text-center ml-2">
            Fine Art Portfolio
          </span>
        </motion.div>

        {/* Elegant Progress Line */}
        <div className="mt-16 w-40 md:w-56 h-px relative flex items-center justify-center overflow-hidden">
          {/* Track */}
          <div className="absolute inset-0 bg-white/5" />
          {/* Fill */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ delay: 1.6, duration: 2.2, ease: [0.77, 0, 0.175, 1] }}
            onAnimationComplete={triggerExit}
            className="absolute left-0 w-full h-full bg-gradient-to-r from-transparent via-aged-gold to-aged-gold shadow-[0_0_8px_rgba(184,149,106,0.6)]"
          />
        </div>
      </div>

      {/* ── Year Watermark ── */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ delay: 1.0, duration: 2.5 }}
        className="absolute bottom-[-8%] right-[-5%] font-serif text-[180px] md:text-[280px] italic text-warm-ivory leading-none select-none pointer-events-none"
      >
        2024
      </motion.span>
    </motion.div>
  );
}
