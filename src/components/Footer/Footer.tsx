import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MagneticButton } from './MagneticButton';
import { NavLink } from 'react-router-dom';

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  return (
    <footer ref={footerRef} className="bg-near-black pt-32 pb-12 px-6 md:px-24 relative overflow-hidden">

      {/* Animated Top Border */}
      <div className="absolute top-0 left-6 right-6 md:left-24 md:right-24 h-px bg-white/5">
        <motion.div
          className="h-full bg-aged-gold origin-left"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start space-y-24 md:space-y-0">

        {/* Left: Branding */}
        <div className="flex flex-col">
          <h2 className="text-display text-warm-ivory italic leading-none mb-4">
            Deepak<br />Patil
          </h2>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-aged-gold">
            Fine Art · Solapur, India
          </p>
        </div>

        {/* Center: Navigation */}
        <div className="flex flex-col space-y-6 md:pt-4">
          {['Gallery', 'About', 'Inquiry'].map((item) => (
            <NavLink
              key={item}
              to={`/${item.toLowerCase()}`}
              className="font-sans text-xs tracking-widest uppercase text-ghost-white hover:text-aged-gold transition-colors inline-block w-max link-underline pb-1"
              data-cursor="hover"
            >
              {item}
            </NavLink>
          ))}
        </div>

        {/* Right: Contact & Icons */}
        <div className="flex flex-col items-start md:items-end space-y-12 md:pt-4">
          <div className="flex flex-col items-start md:items-end space-y-4">
            <a href="mailto:deepak_patilart@rediffmail.com" className="font-sans text-sm tracking-widest text-ghost-white hover:text-aged-gold transition-colors link-underline pb-1" data-cursor="hover">
              deepak_patilart@rediffmail.com
            </a>

            <div className="flex space-x-6 items-center pt-2">
              <a href="https://www.instagram.com/deepakpatil2430" className="text-ghost-white hover:text-aged-gold transition-colors" data-cursor="hover">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="hover:scale-110 transition-transform">
                  <path d="M7 2H17A5 5 0 0 1 22 7V17A5 5 0 0 1 17 22H7A5 5 0 0 1 2 17V7A5 5 0 0 1 7 2Z" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <path d="M17.5 6.5h.01" />
                </svg>
              </a>
              <a href="https://www.facebook.com/deepak.patil.621222" className="text-ghost-white hover:text-aged-gold transition-colors" data-cursor="hover">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="hover:scale-110 transition-transform">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://wa.me/919890646123" target="_blank" rel="noopener noreferrer" className="text-ghost-white hover:text-aged-gold transition-colors" data-cursor="hover">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="hover:scale-110 transition-transform">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.8 8.4 8.4 0 0 1 3.5.7l5.2-1.5zM17.5 11l-1.5-1-1.5 1V15h3z" />
                  <path d="M12 8v8M8 12h8" strokeLinecap="round" />
                </svg>
              </a>
            </div>
          </div>


          <MagneticButton onClick={() => window.open(`https://wa.me/919890646123?text=${encodeURIComponent("Hello Deepak, I'm interested in commissioning a custom painting. I’d love to know more about your process and availability.")}`, '_blank')}>
            Commission a Painting
          </MagneticButton>
        </div>

      </div>

      <div className="w-full mt-32 text-center">
        <p className="font-sans text-[10px] uppercase tracking-widest text-ghost-white/20 select-none">
          © {new Date().getFullYear()} Deepak Patil. All rights reserved.
        </p>
      </div>

    </footer>
  );
}
