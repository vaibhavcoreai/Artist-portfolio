import { motion, AnimatePresence } from 'framer-motion';
import type { Artwork } from '../../lib/data';

interface InquiryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: Artwork | null;
}

export function InquiryPanel({ isOpen, onClose, artwork }: InquiryPanelProps) {
  // Close when clicking outside on the backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100001] bg-near-black/60 backdrop-blur-sm flex justify-end"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md h-full bg-deep-charcoal border-l border-white/5 flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="font-serif text-2xl text-warm-ivory italic">Inquire</h2>
              <button 
                onClick={onClose}
                className="text-ghost-white/50 hover:text-white transition-colors"
                data-cursor="hover"
              >
                ✕
              </button>
            </div>

            <div className="p-8 flex-1 flex flex-col space-y-12">
              {/* Artwork Summary */}
              <div className="flex space-x-6 bg-near-black/40 p-6 rounded-[16px] border border-white/5">
                <div className="w-20 h-24 bg-muted-bronze overflow-hidden shrink-0 rounded-sm">
                  {artwork.image_url ? (
                    <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover opacity-60" />
                  ) : (
                    <div className="w-full h-full bg-aged-gold/20" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-warm-ivory mb-2">{artwork.title}</h3>
                  <p className="font-sans text-[11px] tracking-widest uppercase text-ghost-white/50">{artwork.medium}</p>
                  <p className="font-sans text-[11px] tracking-widest uppercase text-ghost-white/50 mt-1">{artwork.size}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-6">
                <div>
                  <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] text-aged-gold mb-8 text-center">— Inquire Directly —</h4>
                  
                  <div className="space-y-4">
                    <a 
                      href={`https://wa.me/919890646123?text=Hello, I am interested in inquiring about your artwork: "${artwork.title}"`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-4 w-full py-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-aged-gold/50 transition-all rounded-[16px] group"
                      data-cursor="hover"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="group-hover:scale-110 transition-transform">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 1 1-7.6-11.8 8.4 8.4 0 0 1 3.5.7l5.2-1.5zM17.5 11l-1.5-1-1.5 1V15h3z"/>
                        <path d="M12 8v8M8 12h8" strokeLinecap="round"/>
                      </svg>
                      <div className="flex flex-col items-start">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-ghost-white/60 group-hover:text-aged-gold transition-colors">Start a Chat</span>
                        <span className="font-serif text-lg text-warm-ivory italic leading-none">WhatsApp</span>
                      </div>
                    </a>

                    <a 
                      href="tel:+919890646123"
                      className="flex items-center justify-center space-x-4 w-full py-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-aged-gold/50 transition-all rounded-[16px] group"
                      data-cursor="hover"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="group-hover:scale-110 transition-transform">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <div className="flex flex-col items-start">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-ghost-white/60 group-hover:text-aged-gold transition-colors">Call Studio</span>
                        <span className="font-serif text-lg text-warm-ivory italic leading-none">+91 98906 46123</span>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="pt-8 text-center">
                  <p className="font-serif italic text-sm text-ghost-white/40">
                    The artist will respond to your inquiry personally.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
