import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { AntigravityCanvas } from './AntigravityCanvas';

export function Hero() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'] // Tracks the first 100vh
  });

  // Scale down and fade title container
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const wordVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2, // wait a bit before starting
      }
    }
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)', scale: 1.2 },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)', 
      scale: 1,
      transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } // luxury ease
    }
  };

  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.8, ease: "easeInOut" as const, delay: 1.5 } 
    }
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[120vh] bg-near-black overflow-hidden flex items-start justify-center pt-[25vh]"
    >
      <AntigravityCanvas scrollProgress={scrollYProgress} />

      <motion.div 
        style={{ scale, opacity, y: yOffset }}
        className="relative z-10 flex flex-col items-center select-none"
      >
        {/* Faint Catalog Number */}
        <div className="absolute -top-16 -left-24 text-warm-ivory/10 font-sans text-base tracking-[0.3em] pointer-events-none">
          № 001
        </div>

        {/* Name Morphing Title */}
        <motion.div 
          className="text-display text-warm-ivory flex flex-col items-center"
          variants={wordVariants}
          initial="hidden"
          animate="show"
        >
          <div className="flex overflow-hidden pb-4">
            {"DEEPAK".split('').map((char, i) => (
              <motion.span key={`d-${i}`} variants={letterVariants} className="inline-block">
                {char}
              </motion.span>
            ))}
          </div>
          <div className="flex overflow-hidden pb-4 -mt-2 md:-mt-8">
            {"PATIL".split('').map((char, i) => (
              <motion.span key={`p-${i}`} variants={letterVariants} className="inline-block">
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Separator Line */}
        <div className="w-full max-w-[200px] h-[1px] mt-8 mb-8 relative flex justify-center">
          <svg className="w-full h-full absolute top-0" preserveAspectRatio="none">
            <motion.line 
              x1="0" y1="0" x2="100%" y2="0" 
              stroke="var(--color-aged-gold)" 
              strokeWidth="1"
              variants={lineVariants}
              initial="hidden"
              animate="show"
            />
          </svg>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-sans text-[12px] md:text-[16px] font-[200] tracking-[0.2em] md:tracking-[0.4em] text-ghost-white uppercase mb-12 md:mb-16 whitespace-nowrap text-center"
        >
          Fine Art · Watercolour · Charcoal
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="group relative flex items-center justify-center px-8 md:px-10 py-3.5 md:py-4.5 overflow-hidden rounded-full border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-700 bg-white/5 backdrop-blur-xl hover:scale-[1.02] hover:bg-white/10"
          data-cursor="hover"
          onClick={() => {
            navigate('/gallery');
          }}
        >
          {/*  Glossy Apple Surface Reflectance */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
          
          {/* Sweeping Light Sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-[1500ms] ease-in-out z-20" />
          
          <span className="relative z-30 flex items-center font-sans text-[12px] md:text-[13px] font-[300] tracking-[0.4em] uppercase text-warm-ivory group-hover:text-white transition-all duration-500">
            Enter the Gallery
            <div className="flex flex-col ml-4 transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-500">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-3.5 h-3.5 text-aged-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </span>
        </motion.button>
      </motion.div>
    </section>
  );
}
