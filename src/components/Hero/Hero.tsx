import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { AntigravityCanvas } from './AntigravityCanvas';
import GaneshaLogo from '../../assets/ganesha-logo.svg';

export function Hero() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(12px)', scale: 1.15 },
    show: {
      opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
      transition: { duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };


  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: (delay: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    })
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[120vh] bg-near-black overflow-hidden flex items-center justify-center"
    >
      {/* Canvas background */}
      <AntigravityCanvas scrollProgress={scrollYProgress} />

      {/* Deep vignette — corners */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(8,6,8,0.92) 100%)',
          opacity: bgOpacity,
        }}
      />

      {/* Top-left ambient glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[400px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(184,149,106,0.06) 0%, transparent 70%)' }}
      />

      {/* Bottom-right ambient glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[350px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(180,80,60,0.05) 0%, transparent 70%)' }}
      />

      {/* ── Vertical Left Rail ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 2.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-5"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-aged-gold/40" />
        <span className="font-sans text-[9px] tracking-[0.35em] text-warm-ivory/50 uppercase [writing-mode:vertical-rl] rotate-180 select-none">
          Fine Art · 2024
        </span>
        <div className="w-px h-16 bg-gradient-to-t from-transparent to-aged-gold/40" />
      </motion.div>

      {/* ── Vertical Right Rail — Nav Dots ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 2.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3"
      >
        {[
          { label: 'Home', active: true },
          { label: 'Gallery', active: false },
          { label: 'About', active: false },
          { label: 'Contact', active: false },
        ].map(({ label, active }) => (
          <div
            key={label}
            title={label}
            className={`group flex items-center gap-2 cursor-pointer`}
            onClick={() => {
              if (label === 'Gallery') navigate('/gallery');
              else if (label === 'About') document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              else if (label === 'Contact') navigate('/inquiry');
            }}
          >
            <span className="font-sans text-[9px] tracking-[0.25em] text-warm-ivory/50 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1 group-hover:translate-x-0 transition-transform">
              {label}
            </span>
            <div className={`rounded-full transition-all duration-500 ${
              active
                ? 'w-1.5 h-1.5 bg-aged-gold shadow-[0_0_6px_rgba(184,149,106,0.8)]'
                : 'w-1 h-1 bg-warm-ivory/20 group-hover:bg-aged-gold/60 group-hover:scale-110'
            }`} />
          </div>
        ))}
      </motion.div>


      {/* ── Main Content ────────────────────────────────────────────────── */}
      <motion.div
        style={{ scale, opacity, y: yOffset }}
        className="relative z-10 flex flex-col items-center select-none px-4 -mt-8"
      >

        {/* ── DEEPAK PATIL — Name row ─────────────────────────────────── */}
        <motion.div
          className="text-display text-warm-ivory flex flex-wrap justify-center overflow-hidden pb-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {"DEEPAK PATIL".split('').map((char, i) => (
            <motion.span 
              key={`${char}-${i}`} 
              variants={letterVariants} 
              className="inline-block"
              style={{ marginRight: char === ' ' ? '0.25em' : '0' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          animate="show"
          custom={1.9}
          className="font-sans text-[10px] md:text-[13px] font-[300] tracking-[0.35em] md:tracking-[0.55em] text-ghost-white/80 uppercase mt-6 md:mt-8 mb-10 md:mb-14 whitespace-nowrap text-center"
        >
          Fine Art &nbsp;·&nbsp; Pencil Colour &nbsp;·&nbsp; Charcoal
        </motion.p>

        {/* ── CTA Row ─────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="show"
          custom={2.3}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5"
        >
          {/* Primary: Enter Gallery */}
          <button
            className="group relative flex items-center justify-center gap-3 px-8 md:px-10 py-3.5 overflow-hidden rounded-full border border-aged-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-700 bg-aged-gold/10 backdrop-blur-xl hover:bg-aged-gold/20 hover:border-aged-gold/60 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(184,149,106,0.15)]"
            data-cursor="hover"
            onClick={() => navigate('/gallery')}
          >
            {/* Glossy sheen */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
            {/* Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aged-gold/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-[1400ms] ease-in-out" />

            <span className="relative z-10 font-sans text-[11px] md:text-[12px] font-[300] tracking-[0.45em] uppercase text-warm-ivory group-hover:text-white transition-colors duration-500">
              Enter Gallery
            </span>
            <svg fill="none" viewBox="0 0 20 20" strokeWidth={1} stroke="currentColor" className="relative z-10 w-3.5 h-3.5 text-aged-gold transform group-hover:translate-x-0.5 transition-transform duration-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H4.5m15 0v15" />
            </svg>
          </button>

          {/* Secondary: About */}
          <button
            className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-warm-ivory/10 hover:border-warm-ivory/25 transition-all duration-500 backdrop-blur-sm hover:scale-[1.02]"
            data-cursor="hover"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="font-sans text-[11px] md:text-[12px] font-[300] tracking-[0.4em] uppercase text-warm-ivory/70 group-hover:text-warm-ivory transition-colors duration-500">
              About
            </span>
          </button>
        </motion.div>

        {/* ── Ganesha Logo — Below CTA ─────────────────────────────────── */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="show"
          custom={2.6}
          className="mt-16 md:mt-24 flex items-center justify-center pointer-events-none"
        >
          <img
            src={GaneshaLogo}
            alt="Ganesha"
            className="w-10 sm:w-12 md:w-14 h-auto opacity-90"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(232,195,107,0.4)) drop-shadow(0 0 15px rgba(232,195,107,0.15)) brightness(1.2)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.2, ease: 'easeOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="font-sans text-[8px] tracking-[0.45em] text-warm-ivory/50 uppercase">Scroll</span>
        <div className="w-px h-10 overflow-hidden relative">
          <motion.div
            className="w-full h-full bg-gradient-to-b from-aged-gold/60 to-transparent"
            animate={{ y: ['-100%', '120%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
