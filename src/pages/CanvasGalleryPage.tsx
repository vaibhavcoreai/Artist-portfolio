import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Artwork } from '../lib/data';
import { InfiniteCanvas, type CanvasItem } from '../components/Gallery/InfiniteCanvas';

export function CanvasGalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      if (data) {
        const mapped = data.map((doc: any) => ({
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
        setArtworks(mapped);
      }
    } catch (err) {
      console.error('Error fetching artworks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();

    const channel = supabase
      .channel('artworks_canvas_gallery')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'artworks'
        },
        () => fetchArtworks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const canvasItems: CanvasItem[] = artworks.map((artwork) => ({
    image: artwork.imageUrl || 'https://picsum.photos/900/900?grayscale',
    link: `/gallery?id=${artwork.id}`,
    title: artwork.title,
    description: artwork.medium,
  }));

  return (
    <main className="fixed inset-0 w-full h-full bg-near-black overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-aged-gold/[0.03] blur-[150px] rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-muted-bronze/[0.02] blur-[100px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 border-2 border-aged-gold/20 border-t-aged-gold rounded-full animate-spin mb-6" />
            <p className="font-sans text-[14px] uppercase tracking-[0.4em] text-aged-gold/60 animate-pulse">
              Loading Canvas
            </p>
          </motion.div>
        ) : artworks.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col items-center justify-center p-12 text-center"
          >
            <h1 className="font-serif italic text-4xl text-warm-ivory mb-6 opacity-30">
              The canvas awaits.
            </h1>
            <p className="font-sans text-base uppercase tracking-[0.2em] text-ghost-white/40 max-w-sm leading-loose">
              No artworks have been added yet.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
            <InfiniteCanvas
              items={canvasItems}
              columns={4}
              gap={14}
              cellWidth={260}
              cellHeight={320}
              mouseInfluence={0.06}
              wheelSpeed={1.4}
              dragSpeed={1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-6">
          {/* Scroll icon */}
          <div className="flex items-center gap-2 opacity-25">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-ivory">
              <rect x="7" y="2" width="10" height="18" rx="5" />
              <line x1="12" y1="6" x2="12" y2="10" />
            </svg>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-warm-ivory/40">Scroll</span>
          </div>

          <div className="w-px h-3 bg-white/10" />

          {/* Drag icon */}
          <div className="flex items-center gap-2 opacity-25">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-ivory">
              <path d="M12 2l0 20M2 12l20 0M5 5l2 2M17 5l-2 2M5 19l2-2M17 19l-2-2" />
            </svg>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-warm-ivory/40">Drag</span>
          </div>

          <div className="w-px h-3 bg-white/10" />

          {/* Click icon */}
          <div className="flex items-center gap-2 opacity-25">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-ivory">
              <path d="M15 15l-2 5L9 9l11 4-5 2z" />
            </svg>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-warm-ivory/40">Click</span>
          </div>
        </div>
      </motion.div>

      {/* Decorative frame */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-white/[0.04] pointer-events-none rounded-tl-[2rem] m-4 md:m-8" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-white/[0.04] pointer-events-none rounded-br-[2rem] m-4 md:m-8" />
    </main>
  );
}
