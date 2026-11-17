import { motion } from 'framer-motion';
import { ARTWORKS } from '../data/artworks';
import InfiniteMenu, { type MenuItem } from '../components/Gallery/InfiniteMenu';

const artworks = ARTWORKS
  .filter((item) => item.is_visible !== false)
  .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

export function DoomGalleryPage() {
  const menuItems: MenuItem[] = artworks.map((artwork) => ({
    image: artwork.thumbnailUrl || artwork.imageUrl || 'https://picsum.photos/900/900?grayscale',
    link: `/gallery?id=${artwork.id}`,
    title: artwork.title,
    description: `${artwork.medium}`
  }));

  return (
    <main className="fixed inset-0 w-full h-full bg-near-black overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-aged-gold/5 blur-[120px] rounded-full" />
      </div>

      {artworks.length === 0 ? (
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

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-white/5 pointer-events-none rounded-tl-[3rem] m-6 md:m-12" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-white/5 pointer-events-none rounded-br-[3rem] m-6 md:m-12" />
    </main>
  );
}
