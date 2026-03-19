import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { useScrollDir } from '../../hooks/useScrollDir';
import { cx } from '../../lib/utils';

export function NavBar() {
  const { visible, atTop } = useScrollDir(76); // 76px threshold
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const links = ['Gallery', 'About', 'Inquiry', 'Admin'];

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cx(
              "fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-12 transition-colors duration-500 h-[64px] md:h-[76px]",
              !atTop || isOpen ? "bg-near-black/60 backdrop-blur-md border-b border-white/5" : "bg-transparent"
            )}
          >
            {/* Logo / Artist Name */}
            <NavLink
              to="/"
              className="font-serif text-[20px] md:text-[24px] italic text-warm-ivory hover:text-aged-gold transition-colors whitespace-nowrap pr-2"
              data-cursor="hover"
            >
              Deepak Patil
            </NavLink>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              {links.map((item) => (
                <NavLink
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className={({ isActive }) => cx(
                    "font-sans text-[13px] font-[200] tracking-[0.12em] uppercase relative group py-2 whitespace-nowrap",
                    isActive ? "text-aged-gold" : "text-ghost-white"
                  )}
                  data-cursor="hover"
                >
                  <span>{item}</span>
                  <div className="absolute bottom-1 left-0 w-0 h-[1px] bg-aged-gold transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:w-full" />
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col items-center justify-center w-10 h-10 space-y-1 relative z-[110]"
              aria-label="Toggle Menu"
            >
              <motion.span 
                animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="w-5 h-px bg-warm-ivory transition-transform" 
              />
              <motion.span 
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-px bg-warm-ivory/60" 
              />
              <motion.span 
                animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="w-5 h-px bg-warm-ivory transition-transform" 
              />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Dropdown Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[105] bg-near-black flex flex-col items-center justify-center space-y-8 md:hidden p-12 overflow-hidden"
          >
            {/* Close Button Header */}
            <div className="absolute top-0 left-0 right-0 h-[64px] flex items-center justify-end px-6">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-warm-ivory text-2xl font-light"
                aria-label="Close Menu"
              >
                ✕
              </button>
            </div>

            {/* Decorative Bg Element */}
            <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
                <span className="text-[200px] font-serif italic text-white absolute -bottom-10 -right-10 leading-none select-none">Menu</span>
            </div>

            {links.map((item, idx) => (
              <motion.div
                key={`mobile-${item}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1, duration: 0.5 }}
                className="w-full text-center"
              >
                <NavLink
                  to={`/${item.toLowerCase()}`}
                  className={({ isActive }) => cx(
                    "font-serif text-4xl italic transition-colors block py-4",
                    isActive ? "text-aged-gold" : "text-warm-ivory"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </NavLink>
              </motion.div>
            ))}

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.4 }}
               transition={{ delay: 0.8 }}
               className="pt-12 text-[10px] uppercase tracking-widest text-ghost-white font-sans text-center"
            >
              © {new Date().getFullYear()} Deepak Patil Studio
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
