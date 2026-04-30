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
              <div className="flex flex-col items-center mt-24 space-y-12">

                {/* Current Page Status */}
                <span className="font-sans text-[16px] uppercase tracking-[0.4em] text-aged-gold/40">
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex items-center space-x-2 md:space-x-10">
                  {/* Prev Button */}
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-2 md:space-x-4 px-3 md:px-6 py-2 md:py-3 rounded-full border border-white/5 hover:border-aged-gold/30 disabled:opacity-30 disabled:pointer-events-none transition-all duration-500 hover:bg-white/[0.02] group"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-warm-ivory/50 group-hover:text-aged-gold transition-transform group-hover:-translate-x-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    <span className="hidden md:inline font-sans text-[16px] uppercase tracking-[0.3em] text-warm-ivory/60 group-hover:text-warm-ivory">
                      Previous
                    </span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-2 md:space-x-6">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        onClick={() => {
                          setCurrentPage(num);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-serif italic text-base md:text-xl transition-all duration-500 relative flex items-center justify-center ${currentPage === num
                            ? 'text-aged-gold shadow-[0_0_30px_rgba(184,134,11,0.2)]'
                            : 'text-warm-ivory/30 hover:text-warm-ivory hover:bg-white/5'
                          }`}
                      >
                        {currentPage === num && (
                          <motion.div
                            layoutId="activePage"
                            className="absolute inset-0 border border-aged-gold/50 rounded-full"
                          />
                        )}
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-2 md:space-x-4 px-3 md:px-6 py-2 md:py-3 rounded-full border border-white/5 hover:border-aged-gold/30 disabled:opacity-30 disabled:pointer-events-none transition-all duration-500 hover:bg-white/[0.02] group"
                  >
                    <span className="hidden md:inline font-sans text-[16px] uppercase tracking-[0.3em] text-warm-ivory/60 group-hover:text-warm-ivory">
                      Next
                    </span>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-warm-ivory/50 group-hover:text-aged-gold transition-transform group-hover:translate-x-1">
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
