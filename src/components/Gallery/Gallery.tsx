import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Artwork } from '../../lib/data';
import { ArtworkCard } from './ArtworkCard';
import { Lightbox } from './Lightbox';
import { InquiryPanel } from './InquiryPanel';
import { useSupabase } from '../../lib/supabase';

export function Gallery() {
  const [items, setItems] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [inquiryArtwork, setInquiryArtwork] = useState<Artwork | null>(null);
  const [fullScreenArtwork, setFullScreenArtwork] = useState<Artwork | null>(null);
  const { db } = useSupabase();

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
            aspectRatio: 0.85, // default portrait ratio for uploaded images
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
    <section className="min-h-screen bg-near-black py-32 px-6 md:px-12 w-full relative">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Setup */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-headline text-warm-ivory italic mb-2">Selected Works</h2>
            <p className="font-sans text-xs tracking-[0.2em] text-ghost-white/50 uppercase">
              2022 — Present
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 bg-white/[0.02] rounded-sm">
            <p className="font-serif italic text-2xl text-warm-ivory/30 mb-4">The collection is currently quiet.</p>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ghost-white/30">New works are added through the administrator panel.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="columns-2 md:columns-2 lg:columns-3 gap-3 md:gap-4 [column-fill:_balance] mx-auto"
          >
            {items.map((artwork) => (
              <div key={artwork.id} className="break-inside-avoid">
                <ArtworkCard
                  artwork={artwork}
                  onClick={setSelectedArtwork}
                  onInquire={setInquiryArtwork}
                  onFullscreen={setFullScreenArtwork}
                  isLightboxOpen={selectedArtwork?.id === artwork.id}
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Overlays */}
        <AnimatePresence mode="wait">
          {selectedArtwork && (
            <Lightbox 
              key={selectedArtwork.id}
              artwork={selectedArtwork}
              onClose={() => setSelectedArtwork(null)}
              onInquire={() => {
                setInquiryArtwork(selectedArtwork);
                // Keep lightbox open behind the inquiry panel
              }}
            />
          )}
        </AnimatePresence>

        <InquiryPanel 
          isOpen={!!inquiryArtwork} 
          onClose={() => setInquiryArtwork(null)} 
          artwork={inquiryArtwork} 
        />
        
        {/* Fullscreen Mobile ImageViewer */}
        <AnimatePresence>
          {fullScreenArtwork && fullScreenArtwork.image_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100000] bg-near-black flex items-center justify-center p-4 md:hidden"
              onClick={() => setFullScreenArtwork(null)}
            >
              <button 
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-md"
                onClick={() => setFullScreenArtwork(null)}
              >
                ✕
              </button>
              <img
                src={fullScreenArtwork.image_url}
                alt={fullScreenArtwork.title}
                className="w-full h-full object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </section>
  );
}
