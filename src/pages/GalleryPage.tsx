import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Artwork } from '../lib/data';
import { ArtworkCard } from '../components/Gallery/ArtworkCard';
import { Lightbox } from '../components/Gallery/Lightbox';
import { InquiryPanel } from '../components/Gallery/InquiryPanel';
import { Footer } from '../components/Footer/Footer';
import { useSupabase } from '../lib/supabase';

export function GalleryPage() {
  const [items, setItems] = useState<Artwork[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [inquiryArtwork, setInquiryArtwork] = useState<Artwork | null>(null);
  const [fullScreenArtwork, setFullScreenArtwork] = useState<Artwork | null>(null);
  const { db } = useSupabase();

  const PAGE_SIZE = 6;
  const hasMore = visibleCount < items.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await db
          .from('artworks')
          .select('*')
          .eq('is_visible', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Supabase fetch error:', error.message);
          return;
        }

        if (data) {
          setItems(data.map(d => ({
            id: d.id,
            title: d.title || 'Untitled',
            medium: d.medium || '',
            year: d.year || new Date().getFullYear(),
            size: d.size_cm || '',
            category: d.category || '',
            aspectRatio: 0.85,
            image_url: d.image_url || undefined,
            description: d.description || '',
          })));
        }
      } catch (err) {
        console.error('Failed to load artworks:', err);
      }
    }
    loadData();
  }, [db]);

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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-aged-gold mb-6">
              Complete Collection
            </p>
            <h1 className="text-display italic leading-[0.9] text-warm-ivory mb-8">
              Gallery
            </h1>
            <p className="font-sans text-sm font-light text-ghost-white/50 max-w-lg leading-relaxed">
              A curated selection of original paintings spanning watercolour, charcoal, 
              and mixed media — each piece a meditation 
              on light, memory, and the quiet poetry of the everyday.
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center space-x-12 mt-16 pt-8 border-t border-white/5"
          >
            <div className="flex flex-col">
              <span className="font-serif text-3xl italic text-aged-gold">{items.length}</span>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-ghost-white/40 mt-1">Works</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="font-serif text-3xl italic text-aged-gold">
                {new Set(items.map(i => i.category)).size}
              </span>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-ghost-white/40 mt-1">Mediums</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="font-serif text-3xl italic text-aged-gold">
                {Math.min(...items.map(i => i.year))}—{Math.max(...items.map(i => i.year))}
              </span>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-ghost-white/40 mt-1">Period</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-[1600px] mx-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 bg-white/[0.02] rounded-lg">
              <p className="font-serif italic text-3xl text-warm-ivory/20 mb-6">No artworks have been added yet.</p>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-ghost-white/30 border border-white/10 px-6 py-3">Please use the Admin board to populate the gallery.</p>
            </div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="columns-2 lg:columns-3 gap-3 md:gap-4 [column-fill:_balance] mx-auto"
              >
                {items.slice(0, visibleCount).map((artwork) => (
                  <div key={artwork.id} className="break-inside-avoid">
                    <ArtworkCard
                      artwork={artwork}
                      onClick={setSelectedArtwork}
                      onInquire={setInquiryArtwork}
                      isLightboxOpen={selectedArtwork?.id === artwork.id}
                    />
                  </div>
                ))}
              </motion.div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-24">
                  <button
                    onClick={handleLoadMore}
                    data-cursor="hover"
                    className="group relative px-12 py-4 overflow-hidden rounded-full border border-aged-gold/30 hover:border-aged-gold transition-colors duration-500"
                  >
                    <div className="absolute inset-0 bg-aged-gold/5 -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative font-sans text-[11px] tracking-[0.3em] uppercase text-warm-ivory group-hover:text-near-black flex items-center">
                      Load More 
                      <span className="ml-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">↓</span>
                    </span>
                  </button>
                </div>
              )}
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
              src={fullScreenArtwork.image_url}
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
