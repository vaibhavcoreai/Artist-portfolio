import { motion } from 'framer-motion';
import { useState } from 'react';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'exit'>('intro');

  const triggerExit = () => {
    setPhase('exit');
    setTimeout(onComplete, 900);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200000] flex items-center justify-center overflow-hidden"
      animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Deep black base */}
      <div className="absolute inset-0 bg-[#050507]" />

      {/* Animated radial glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.15, 0.08], scale: [0.5, 1.2, 1.5] }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(184,134,11,0.25) 0%, transparent 70%)',
        }}
      />

      {/* Rotating ring */}
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: [0, 0.3, 0.15], rotate: 180 }}
        transition={{ duration: 3, ease: "linear" }}
        className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full border border-aged-gold/10"
      />

      {/* Inner rotating ring (opposite direction) */}
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: [0, 0.2, 0.1], rotate: -120 }}
        transition={{ duration: 3, ease: "linear" }}
        className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full border border-warm-ivory/5"
      />

      {/* Central content stack */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Horizontal line — top */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-aged-gold/80 to-transparent mb-8 origin-center"
        />

        {/* Brush stroke text reveal */}
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="font-serif text-6xl md:text-8xl lg:text-9xl italic text-warm-ivory leading-none tracking-tight select-none">
              Welcome
            </span>
          </motion.div>
        </div>

        {/* Subtitle with mask reveal */}
        <div className="relative overflow-hidden mt-4">
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.6em] text-aged-gold/90 block">
              Artist Portfolio
            </span>
          </motion.div>
        </div>

        {/* Horizontal line — bottom */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.0, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-20 md:w-32 h-px bg-gradient-to-r from-transparent via-warm-ivory/20 to-transparent mt-8 origin-center"
        />

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 w-32 md:w-40 h-[1px] bg-white/5 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ delay: 1.3, duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            onAnimationComplete={triggerExit}
            className="h-full bg-gradient-to-r from-aged-gold/40 via-aged-gold to-aged-gold/40 shadow-[0_0_8px_rgba(184,134,11,0.6)]"
          />
        </motion.div>
      </div>

      {/* Corner decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.6, duration: 1.5 }}
        className="absolute top-8 left-8 md:top-12 md:left-12"
      >
        <div className="w-8 h-px bg-warm-ivory/30" />
        <div className="w-px h-8 bg-warm-ivory/30" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.6, duration: 1.5 }}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12"
      >
        <div className="flex flex-col items-end">
          <div className="w-8 h-px bg-warm-ivory/30" />
          <div className="w-px h-8 bg-warm-ivory/30 self-end" />
        </div>
      </motion.div>

      {/* Year watermark */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="absolute bottom-8 left-8 md:bottom-12 md:left-12 font-serif text-[80px] md:text-[120px] italic text-warm-ivory leading-none select-none"
      >
        25
      </motion.span>
    </motion.div>
  );
}
