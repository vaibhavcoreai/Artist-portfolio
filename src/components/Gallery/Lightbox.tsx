import { motion } from 'framer-motion';
import type { Artwork } from '../../lib/data';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LightboxProps {
  artwork: Artwork;
  onClose: () => void;
  onInquire: () => void;
  onFullscreen: (artwork: Artwork) => void;
}

export function Lightbox({ artwork, onClose, onInquire, onFullscreen }: LightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    // Lock scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: 'none' }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 bg-[#080608]/95 backdrop-blur-xl"
    >
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xl max-h-[85vh] bg-[#111014] border border-white/10 shadow-3xl z-10 p-8 md:p-12 flex flex-col rounded-[32px] overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-aged-gold to-transparent opacity-40 z-20" />

        <div className="flex justify-between items-start mb-8 relative z-30">
          <div className="flex-1">
            <p className="font-sans text-[10px] tracking-[0.3em] text-aged-gold uppercase mb-3 text-left">
              Catalog № {artwork.id}
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-warm-ivory italic leading-[1.1] text-left">
              {artwork.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-warm-ivory/30 hover:text-white hover:bg-white/5 rounded-full transition-all ml-4"
            data-cursor="hover"
          >
            <span className="text-2xl font-light">✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 text-left">
          <div className="space-y-4 mb-10 pb-4 border-b border-white/5">
            {[
              { label: 'Category', value: artwork.category },
              { label: 'Medium', value: artwork.medium },
              { label: 'Year', value: artwork.year },
              { label: 'Dimensions', value: artwork.size }
            ].map((row, idx) => (
              <div key={idx} className="flex">
                <span className="w-1/3 font-sans text-[10px] text-ghost-white/40 uppercase tracking-widest shrink-0">{row.label}</span>
                <span className="font-sans text-xs text-ghost-white/90 capitalize">{row.value}</span>
              </div>
            ))}
          </div>

          <p className="font-serif text-lg text-ghost-white/70 italic leading-relaxed mb-12">
            {artwork.description || 'A fleeting capture of light and atmosphere, rendered precisely yet emotionally to evoke a profound stillness.'}
          </p>

          <button 
            onClick={() => onFullscreen(artwork)}
            data-cursor="hover"
            className="group relative flex items-center justify-center py-5 px-8 overflow-hidden rounded-full border border-white/10 text-warm-ivory uppercase tracking-[0.3em] text-[10px] transition-all duration-700 w-full mb-4 bg-white/5 hover:bg-white/10"
          >
            <span className="relative z-10 flex items-center transition-colors duration-700 font-sans">
              Take a Close Look
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-3.5 h-3.5 ml-4 transform group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </span>
          </button>

          <button 
            onClick={onInquire}
            data-cursor="hover"
            className="group relative flex items-center justify-center py-5 px-8 overflow-hidden rounded-full border border-aged-gold/50 text-warm-ivory uppercase tracking-[0.3em] text-[10px] transition-all duration-700 w-full mb-2"
          >
            <div className="absolute inset-0 bg-aged-gold opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <span className="relative z-10 group-hover:text-near-black flex items-center transition-colors duration-700">
              Inquire About Price
              <span className="ml-4 transform group-hover:translate-x-2 transition-transform duration-700">→</span>
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
