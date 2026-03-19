import { motion, type Variants } from 'framer-motion';
import type { Artwork } from '../../lib/data';
import { BrushCanvas } from './BrushCanvas';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
  onInquire: (artwork: Artwork) => void;
  onFullscreen?: (artwork: Artwork) => void;
  isLightboxOpen: boolean;
}

export function ArtworkCard({ artwork, onClick, onInquire, onFullscreen, isLightboxOpen }: ArtworkCardProps) {
  // Random slight rotation for luxury editorial staggered entrance
  const getRotation = () => Math.random() * 4 - 2; // -2 to +2

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, rotate: getRotation() },
    show: {
      opacity: 1, 
      y: 0, 
      rotate: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'tween', duration: 0.5, ease: 'easeOut' }}
      className="relative mb-2 md:mb-4 cursor-pointer overflow-hidden group bg-deep-charcoal border border-white/5"
      style={{ paddingBottom: `${(1 / artwork.aspectRatio) * 100}%` }} // CSS aspect ratio sizing
      data-cursor="hover"
    >
      {/* Visual Canvas matching the layoutId for morphing */}
      {/* Only use layoutId if not already expanded into lightbox to prevent ghosting */}
      <motion.div 
        layoutId={isLightboxOpen ? undefined : `card-${artwork.id}`}
        className="absolute inset-0 w-full h-full p-[2px]"
      >
        {artwork.image_url ? (
          <img 
            src={artwork.image_url} 
            alt={artwork.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <BrushCanvas id={typeof artwork.id === 'string' ? artwork.id.charCodeAt(0) : artwork.id} />
        )}
      </motion.div>

      {/* Mobile Fullscreen Button */}
      {onFullscreen && artwork.image_url && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFullscreen(artwork);
          }}
          className="md:hidden absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-near-black/50 text-warm-ivory backdrop-blur-md rounded-full border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.4)] active:scale-95 transition-all duration-300"
          aria-label="View fullscreen"
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </button>
      )}

      {/* Hover Overlay */}
      <div 
        onClick={() => onClick(artwork)}
        className="absolute inset-0 bg-gradient-to-t from-near-black/90 via-near-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-auto flex flex-col justify-end p-6"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        >
          <div className="flex justify-between items-end">
            <div>
              <p className="font-sans text-[10px] text-aged-gold uppercase tracking-[0.2em] mb-2">{artwork.year}</p>
              <h3 className="font-serif text-2xl text-warm-ivory italic leading-none mb-1">{artwork.title}</h3>
              <p className="font-sans text-xs text-ghost-white/70 tracking-wide">{artwork.medium}</p>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInquire(artwork);
              }}
              className="text-xs font-sans tracking-widest text-ghost-white group/btn flex items-center mb-1"
            >
              <span className="hidden md:inline mr-2 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                Inquire
              </span>
              <span className="w-8 h-[1px] bg-ghost-white flex items-center relative group-hover/btn:w-12 transition-all duration-300">
                <span className="absolute right-0 text-[10px] transform group-hover/btn:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
