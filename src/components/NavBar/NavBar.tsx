import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useScrollDir } from '../../hooks/useScrollDir';
import { cx } from '../../lib/utils';

export function NavBar() {
  const { visible, atTop } = useScrollDir(76); // 76px threshold

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={cx(
            "fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-4 md:px-12 transition-colors duration-500 h-[60px] md:h-[76px]",
            !atTop ? "bg-near-black/60 backdrop-blur-md border-b border-white/5 shadow-sm" : "bg-transparent"
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

          {/* Links */}
          <div className="flex items-center space-x-3 md:space-x-8">
            {['Gallery', 'About', 'Inquiry'].map((item) => (
              <NavLink
                key={item}
                to={`/${item.toLowerCase()}`}
                className={({ isActive }) => cx(
                  "font-sans text-[10px] md:text-[13px] font-[200] tracking-[0.1em] md:tracking-[0.12em] uppercase relative group py-2 whitespace-nowrap",
                  isActive ? "text-aged-gold" : "text-ghost-white"
                )}
                data-cursor="hover"
              >
                <span>{item}</span>
                {/* Thin animated underline on hover */}
                <div className="absolute bottom-1 left-0 w-0 h-[1px] bg-aged-gold transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:w-full" />
              </NavLink>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
