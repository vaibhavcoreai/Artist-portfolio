import { useRef } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import AboutImage from '../../assets/About.jpg';

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  
  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-near-black py-32 md:py-48 px-6 md:px-24 overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-32">
        
        {/* Left: Image with Parallax */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-deep-charcoal border border-white/5 shadow-2xl rounded-[32px]">
            <motion.img 
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              src={AboutImage} 
              alt="Deepak Gurunath Patil" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-near-black/50 to-transparent mix-blend-multiply" />
          </div>
          {/* Subtle gold accent frame */}
          <div className="absolute -inset-4 border border-aged-gold/20 -z-10 pointer-events-none transform translate-y-8 translate-x-8 rounded-[32px]" />
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start z-10">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-aged-gold mb-6">
            The Artist
          </p>
          <h2 className="text-display text-warm-ivory italic leading-none mb-10">
            Deepak<br />Patil
          </h2>
          
          <div className="font-sans font-light text-ghost-white/70 leading-relaxed space-y-6 max-w-lg mb-12">
            <p>
              Born in 1980, Deepak Gurunath Patil is an award-winning fine artist whose work spans across watercolour and charcoal. A masterful classical technician, he holds an A.T.D., G.D.Art (ptg.), and Dip.A.Ed.
            </p>
            <p>
              Presently serving as the Principal at Appasaheb Kadadi Chitrakala Mahavidyalaya, Solapur, Deepak’s extensive studio practice has earned him the Nehru Cultural Award, Prafulla Dahanukar Art Foundation recognition, and spots in prominent private collections spanning from India to the US and UK.
            </p>
          </div>

          <NavLink 
            to="/about"
            data-cursor="hover"
            className="group relative inline-flex items-center space-x-6 pb-4 border-b border-white/10 hover:border-aged-gold transition-colors"
          >
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-warm-ivory group-hover:text-aged-gold transition-colors">
              Read Full Biography & CV
            </span>
            <span className="text-aged-gold font-sans text-xs group-hover:translate-x-2 transition-transform">
              →
            </span>
          </NavLink>
        </div>

      </div>
    </section>
  );
}
