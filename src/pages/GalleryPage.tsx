import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import type { Artwork } from '../lib/data';
import { ArtworkCard } from '../components/Gallery/ArtworkCard';
import { Lightbox } from '../components/Gallery/Lightbox';
import { InquiryPanel } from '../components/Gallery/InquiryPanel';
import { Footer } from '../components/Footer/Footer';
import { supabase } from '../lib/supabase';

export function GalleryPage() {
  const [items, setItems] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [inquiryArtwork, setInquiryArtwork] = useState<Artwork | null>(null);
  const [fullScreenArtwork, setFullScreenArtwork] = useState<Artwork | null>(null);
  const [searchParams] = useSearchParams();

  const PAGE_SIZE = 6;
  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  useEffect(() => {
    const artworkId = searchParams.get('id');
    if (artworkId && items.length > 0) {
      const artwork = items.find(item => String(item.id) === artworkId);
      if (artwork) {
        setSelectedArtwork(artwork);
        const index = items.indexOf(artwork);
        const page = Math.floor(index / PAGE_SIZE) + 1;
        setCurrentPage(page);
      }
    }
  }, [searchParams, items]);

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .eq('is_visible', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Failed to load artworks from Supabase:', error.message);
          return;
        }

        if (data) {
          const mappedData = data.map((doc: any) => ({
            id: doc.id,
            title: doc.title || 'Untitled',
            medium: doc.medium || '',
            size: doc.size_cm || '',
            category: doc.category || '',
            aspectRatio: 0.85,
            imageUrl: doc.image_url || undefined,
            description: doc.description || '',
            isSold: doc.is_sold || false,
          } as Artwork));

          setItems(mappedData);
        }
      } catch (err) {
        console.error('Failed to load artworks:', err);
      }
    }
    loadData();
  }, []);

  return (
    <main className="w-full bg-near-black text-warm-ivory min-h-screen">

      {/* Hero Header */}
      <section className="pt-48 pb-24 px-6 md:px-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-32 right-12 text-[200px] md:text-[320px] font-serif italic text-white/[0.02] leading-none select-none">
            G
          </div>
          <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-aged-gold/20 to-transparent" />
        </div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-2xl"
            >
              <p className="font-sans text-[16px] tracking-[0.3em] uppercase text-aged-gold mb-6">
                Complete Collection
              </p>
              <h1 className="text-display italic leading-[0.9] text-warm-ivory mb-8">
                Gallery
              </h1>
              <p className="font-sans text-base font-light text-ghost-white/50 max-w-lg mx-auto leading-relaxed">
                A curated selection of original paintings spanningColour pencil, watercolour, charcoal, 
                mix medium — each piece a meditation
                on light, memory, and the quiet poetry of the everyday.
              </p>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-12 flex items-center justify-center space-x-4 group cursor-pointer"
                onClick={() => {
                  window.scrollTo({
                    top: window.innerHeight * 0.8,
                    behavior: 'smooth'
                  });
                }}
              >
                <div className="w-px h-12 bg-gradient-to-b from-aged-gold/50 to-transparent relative overflow-hidden">
                  <motion.div
                    animate={{ y: [0, 48] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-aged-gold shadow-[0_0_10px_rgba(184,134,11,0.5)]"
                  />
                </div>
                <span className="font-sans text-base uppercase tracking-[0.3em] text-warm-ivory/70 group-hover:text-aged-gold transition-colors">
                  Explore Collection
                </span>
              </motion.div>

              {/* Stats bar - Integrated */}
              <div className="flex items-center justify-center space-x-8 mt-10 pt-6 border-t border-white/5 max-w-sm mx-auto">
                <div className="flex flex-col min-w-[60px]">
                  <span className="font-serif text-2xl italic text-aged-gold leading-none">{items.length}</span>
                  <span className="font-sans text-[16px] tracking-[0.15em] uppercase text-ghost-white/40 mt-1">Works</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex flex-col min-w-[70px]">
                  <span className="font-serif text-2xl italic text-aged-gold leading-none">
                    {new Set(items.map(i => i.category)).size}
                  </span>
                  <span className="font-sans text-[16px] tracking-[0.15em] uppercase text-ghost-white/40 mt-1">Mediums</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-[1600px] mx-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 bg-white/[0.02] rounded-lg">
              <p className="font-serif italic text-3xl text-warm-ivory/20 mb-6">No artworks have been added yet.</p>
              <p className="font-sans text-base uppercase tracking-[0.3em] text-ghost-white/30 border border-white/10 px-6 py-3">Please use the Admin board to populate the gallery.</p>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="columns-2 lg:columns-4 gap-3 md:gap-4 [column-fill:_balance] mx-auto"
                >
                  {items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((artwork, i) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                      className="break-inside-avoid mb-4"
                    >
                      <ArtworkCard
                        artwork={artwork}
                        onClick={setSelectedArtwork}
                        onInquire={setInquiryArtwork}
                        isLightboxOpen={selectedArtwork?.id === artwork.id}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination & Navigation */}
              <div className="flex flex-col items-center mt-16 md:mt-24 space-y-6 md:space-y-10">

                {/* Progress Bar */}
                <div className="w-full max-w-[280px] md:max-w-xs flex flex-col items-center gap-3">
                  <div className="w-full h-[1px] bg-white/[0.06] rounded-full overflow-hidden relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-aged-gold/70 via-aged-gold to-aged-gold/70 rounded-full"
                      initial={false}
                      animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aged-gold/10 to-transparent animate-pulse" />
                  </div>
                  <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-warm-ivory/25">
                    {currentPage} / {totalPages}
                  </span>
                </div>

                {/* Navigation Row */}
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Prev Button */}
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/[0.06] hover:border-aged-gold/30 disabled:opacity-20 disabled:pointer-events-none transition-all duration-500 hover:bg-white/[0.03] group shrink-0"
                    aria-label="Previous page"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4 text-warm-ivory/40 group-hover:text-aged-gold transition-all duration-300 group-hover:-translate-x-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>

                  {/* Page Numbers with Smart Truncation */}
                  <div className="flex items-center gap-0.5 md:gap-1">
                    {(() => {
                      const getVisiblePages = () => {
                        if (totalPages <= 5) {
                          return Array.from({ length: totalPages }, (_, i) => i + 1);
                        }

                        const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];

                        // Always show first page
                        pages.push(1);

                        if (currentPage > 3) {
                          pages.push('ellipsis-start');
                        }

                        // Pages around current
                        const start = Math.max(2, currentPage - 1);
                        const end = Math.min(totalPages - 1, currentPage + 1);
                        for (let i = start; i <= end; i++) {
                          pages.push(i);
                        }

                        if (currentPage < totalPages - 2) {
                          pages.push('ellipsis-end');
                        }

                        // Always show last page
                        if (totalPages > 1) {
                          pages.push(totalPages);
                        }

                        return pages;
                      };

                      return getVisiblePages().map((item, idx) => {
                        if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                          return (
                            <span
                              key={item}
                              className="w-6 md:w-8 flex items-center justify-center text-warm-ivory/15 font-serif italic text-xs md:text-sm select-none"
                            >
                              ···
                            </span>
                          );
                        }

                        const num = item as number;
                        const isActive = currentPage === num;

                        return (
                          <button
                            key={num}
                            onClick={() => {
                              setCurrentPage(num);
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className={`relative flex items-center justify-center rounded-full font-serif italic transition-all duration-500 ${
                              isActive
                                ? 'w-10 h-10 md:w-12 md:h-12 text-base md:text-lg text-aged-gold z-10'
                                : 'w-8 h-8 md:w-10 md:h-10 text-sm md:text-base text-warm-ivory/25 hover:text-warm-ivory/60'
                            }`}
                            aria-label={`Page ${num}`}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            {/* Active page — animated ring + glow */}
                            {isActive && (
                              <motion.div
                                layoutId="activePage"
                                className="absolute inset-0 rounded-full"
                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                              >
                                {/* Outer glow */}
                                <div className="absolute -inset-1 rounded-full bg-aged-gold/[0.06] blur-md" />
                                {/* Ring */}
                                <div className="absolute inset-0 rounded-full border border-aged-gold/40" />
                                {/* Inner subtle fill */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-aged-gold/[0.08] to-transparent" />
                              </motion.div>
                            )}

                            {/* Hover ring for inactive */}
                            {!isActive && (
                              <div className="absolute inset-0 rounded-full border border-transparent hover:border-white/[0.06] transition-colors duration-300" />
                            )}

                            <span className="relative z-10">{num}</span>
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/[0.06] hover:border-aged-gold/30 disabled:opacity-20 disabled:pointer-events-none transition-all duration-500 hover:bg-white/[0.03] group shrink-0"
                    aria-label="Next page"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4 text-warm-ivory/40 group-hover:text-aged-gold transition-all duration-300 group-hover:translate-x-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Overlays */}
      <AnimatePresence mode="wait">
        {selectedArtwork && (
          <Lightbox
            key={selectedArtwork.id}
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
            onInquire={() => {
              setInquiryArtwork(selectedArtwork);
            }}
            onFullscreen={setFullScreenArtwork}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fullScreenArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullScreenArtwork(null)}
            className="fixed inset-0 z-[100000] bg-near-black flex items-center justify-center p-4 cursor-pointer"
          >
            <button
              onClick={() => setFullScreenArtwork(null)}
              className="absolute top-8 right-8 z-[120] w-12 h-12 flex items-center justify-center text-warm-ivory/50 hover:text-warm-ivory transition-colors"
            >
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={fullScreenArtwork.imageUrl}
              alt={fullScreenArtwork.title}
              className="max-w-full max-h-full object-contain shadow-2xl pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <InquiryPanel
        isOpen={!!inquiryArtwork}
        onClose={() => setInquiryArtwork(null)}
        artwork={inquiryArtwork}
      />

      <Footer />
    </main>
  );
}
