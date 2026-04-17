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
        className="relative w-full lg:max-w-6xl max-w-[95vw] h-[90vh] lg:h-auto lg:max-h-[90vh] bg-[#111014] border border-white/10 shadow-3xl z-10 flex flex-col lg:flex-row rounded-[24px] md:rounded-[40px] overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-aged-gold to-transparent opacity-40 z-20" />

        {/* Painting Preview */}
        <div className="w-full lg:w-3/5 h-[40vh] lg:h-auto bg-black/40 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 relative group/preview shrink-0">
          {artwork.imageUrl ? (
            <>
              <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                src={artwork.imageUrl} 
                alt={artwork.title} 
                className="w-full h-full object-cover opacity-40 group-hover/preview:opacity-60 transition-opacity duration-1000"
              />
              <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12 lg:p-16">
                <motion.img 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  src={artwork.imageUrl} 
                  alt={artwork.title} 
                  className="max-w-full max-h-full object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] transition-transform duration-1000 group-hover/preview:scale-[1.03]"
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif italic text-warm-ivory/20">Image Preview Unavailable</span>
            </div>
          )}
        </div>

        {/* Details Container */}
        <div className="flex-1 p-6 md:p-10 lg:p-14 flex flex-col min-h-0 bg-[#111014] relative overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-8 lg:mb-10 relative z-30">
            <div className="flex-1 min-w-0 pr-4">
              <div className="mb-4 lg:mb-6">
                <p className="font-sans text-[10px] md:text-[11px] tracking-[0.3em] text-aged-gold uppercase opacity-60 mb-1">
                  Catalog №
                </p>
                <p className="font-sans text-[11px] md:text-[12px] tracking-wider text-ghost-white/40 break-all leading-relaxed max-w-xs">
                  {artwork.id}
                </p>
              </div>
              
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-warm-ivory italic leading-[1.1] text-left mb-6 lg:mb-10 break-words overflow-hidden">
                {artwork.title}
              </h2>

              <div className="flex justify-start mb-8 lg:mb-10">
                <button
                  onClick={() => onFullscreen(artwork)}
                  data-cursor="hover"
                  className="group relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full border border-white/10 hover:border-aged-gold/40 transition-all duration-700 bg-white/[0.02]"
                >
                  <div className="absolute inset-2 border border-dashed border-white/5 rounded-full group-hover:rotate-45 transition-transform duration-1000" />
                  <div className="font-sans text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] flex flex-col items-center leading-relaxed text-warm-ivory/60 group-hover:text-aged-gold transition-colors text-center relative z-10">
                    <span>Take a</span>
                    <span>Close</span>
                    <span>Look</span>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-3 h-3 mt-1.5 md:mt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-warm-ivory/30 hover:text-white hover:bg-white/5 rounded-full transition-all"
              data-cursor="hover"
            >
              <span className="text-2xl font-light">✕</span>
            </button>
          </div>

          <div className="flex-1 min-h-0 text-left">
            <div className="space-y-4 md:space-y-6 mb-10 md:mb-12 pb-8 md:pb-10 border-b border-white/5">
              {[
                { label: 'Category', value: artwork.category },
                { label: 'Medium', value: artwork.medium },
                { label: 'Year', value: artwork.year },
                { label: 'Dimensions', value: artwork.size }
              ].map((row, idx) => (row.value && (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <span className="w-24 md:w-28 font-sans text-[11px] md:text-[12px] text-ghost-white/30 uppercase tracking-[0.2em] shrink-0">{row.label}</span>
                  <span className="font-sans text-sm md:text-base text-ghost-white/80 capitalize tracking-wide break-words">{row.value}</span>
                </div>
              )))}
            </div>

            <div className="relative mb-10 md:mb-14 pl-5 md:pl-6">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-aged-gold/40 via-aged-gold/10 to-transparent" />
              <p className="font-serif text-lg md:text-2xl text-ghost-white/70 italic leading-relaxed md:leading-[1.8] text-left">
                {artwork.description || 'A fleeting capture of light and atmosphere, rendered precisely yet emotionally to evoke a profound stillness.'}
              </p>
            </div>

            <div className="mt-auto">
              {artwork.isSold ? (
                <div className="flex items-center justify-center py-4 md:py-5 px-6 md:px-8 rounded-full border border-aged-gold/20 bg-aged-gold/[0.05] text-aged-gold font-medium uppercase tracking-[0.3em] text-[12px] md:text-[14px] w-full mb-2 cursor-default select-none">
                  <span>Sold • Private Collection</span>
                </div>
              ) : (
                <button 
                  onClick={onInquire}
                  data-cursor="hover"
                  className="group relative flex items-center justify-center py-4 md:py-5 px-6 md:px-8 overflow-hidden rounded-full border border-aged-gold/40 text-warm-ivory uppercase tracking-[0.3em] text-[12px] md:text-[14px] transition-all duration-700 w-full mb-2"
                >
                  <div className="absolute inset-0 bg-aged-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.25, 0.46, 0.45, 0.94]" />
                  <span className="relative z-10 group-hover:text-near-black flex items-center transition-colors duration-700">
                    Inquire About Price
                    <span className="ml-4 md:ml-5 transform group-hover:translate-x-3 transition-transform duration-700">→</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>



      </motion.div>
    </motion.div>,
    document.body
  );
}
