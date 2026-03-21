import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Artwork } from '../lib/data';
import InfiniteMenu, { type MenuItem } from '../components/Gallery/InfiniteMenu';

export function DoomGalleryPage() {
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
        const mappedData = data.map((doc: any) => ({
          id: doc.id,
          title: doc.title || 'Untitled',
          medium: doc.medium || '',
          year: doc.year || new Date().getFullYear(),
          size: doc.size_cm || '',
          category: doc.category || '',
          aspectRatio: 0.85,
          imageUrl: doc.image_url || undefined,
          description: doc.description || '',
        } as Artwork));
        setArtworks(mappedData);
      }
    } catch (err) {
      console.error('Error fetching artworks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();

    // Set up Real-time subscription
    const channel = supabase
      .channel('artworks_doom_gallery')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'artworks'
        },
        () => {
          // Re-fetch when something changes
          fetchArtworks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const menuItems: MenuItem[] = artworks.map((artwork) => ({
    image: artwork.imageUrl || 'https://picsum.photos/900/900?grayscale',
    link: `/gallery?id=${artwork.id}`, // Link back to main gallery with ID
    title: artwork.title,
    description: `${artwork.medium}, ${artwork.year}`
  }));

  return (
    <main className="fixed inset-0 w-full h-full bg-near-black overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-aged-gold/5 blur-[120px] rounded-full" />
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
            <p className="font-sans text-[16px] uppercase tracking-[0.4em] text-aged-gold animate-pulse">
              Initializing Infinite Void
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
              The gallery is currently silent.
            </h1>
            <p className="font-sans text-base uppercase tracking-[0.2em] text-ghost-white/40 max-w-sm leading-loose">
              No works have been summoned to this space yet. Please check back later.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
            {/* Overlay Info Header */}
            <div className="absolute top-24 left-6 md:left-12 z-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <p className="font-sans text-[16px] tracking-[0.4em] uppercase text-aged-gold mb-2">
                  Immersive Viewing
                </p>
                <h1 className="font-serif text-3xl md:text-5xl italic text-warm-ivory leading-none">
                  Infinite Gallery
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="mt-6 flex items-center space-x-3"
              >
                <div className="w-2 h-2 rounded-full bg-aged-gold animate-pulse" />
                <span className="font-sans text-[15px] uppercase tracking-widest text-ghost-white/40">
                  Live Feed Synchronized
                </span>
              </motion.div>
            </div>

            {/* Instruction Overlay */}
            <div className="absolute bottom-12 right-6 md:right-12 z-20 pointer-events-none">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 2, duration: 1 }}
                className="font-sans text-[16px] uppercase tracking-[0.3em] text-ghost-white text-right"
              >
                Drag to orbita • Click to explore
              </motion.p>
            </div>

            <InfiniteMenu items={menuItems} scale={1.2} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-white/5 pointer-events-none rounded-tl-[3rem] m-6 md:m-12" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-white/5 pointer-events-none rounded-br-[3rem] m-6 md:m-12" />
    </main>
  );
}
