import { motion } from 'framer-motion';
import { ARTWORKS } from '../data/artworks';
import { InfiniteCanvas, type CanvasItem } from '../components/Gallery/InfiniteCanvas';

const artworks = ARTWORKS
  .filter((item) => item.is_visible !== false)
  .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

export function CanvasGalleryPage() {
  const canvasItems: CanvasItem[] = artworks.map((artwork) => ({
    image: artwork.thumbnailUrl || artwork.imageUrl || 'https://picsum.photos/900/900?grayscale',
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

      {artworks.length === 0 ? (
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
