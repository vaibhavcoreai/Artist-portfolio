import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import type { Artwork } from '../lib/data';
import { ARTWORKS } from '../data/artworks';
import { ArtworkCard } from '../components/Gallery/ArtworkCard';
import { Lightbox } from '../components/Gallery/Lightbox';
import { InquiryPanel } from '../components/Gallery/InquiryPanel';
import { Footer } from '../components/Footer/Footer';

const STATIC_ARTWORKS: Artwork[] = ARTWORKS
  .filter(item => item.is_visible !== false)
  .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

// ---------------------------------------------------------------------------
// GalleryPagination — responsive, accessible, editorial style
// ---------------------------------------------------------------------------
interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getDesktopPageRange(current: number, total: number): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
  pages.push(1);

  if (current > 3) {
    pages.push('ellipsis-start');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('ellipsis-end');
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

function GalleryPagination({ currentPage, totalPages, onPageChange }: GalleryPaginationProps) {
  if (totalPages <= 1) return null;

  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  // Mobile (<640px): exactly 4 items in one row [ < ] [ pageA ] [ pageB ] [ > ]
  // Neighbor is next page; if on last page, neighbor is previous page so order is ascending
  const isLast = currentPage === totalPages;
  const mobilePages = isLast
    ? [currentPage - 1, currentPage]
    : [currentPage, currentPage + 1];

  const desktopPages = getDesktopPageRange(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      style={{ marginTop: '48px', marginBottom: '32px' }}
      className="w-full flex flex-col items-center"
    >
      {/* Mobile Layout (< 640px): exactly 4 items, gap-12px, centered, side padding >= 16px */}
      <div
        style={{ overflow: 'visible' }}
        className="w-full px-4 flex sm:hidden justify-center items-center gap-[12px] flex-nowrap overflow-visible"
      >
        {/* Prev Arrow */}
        <button
          type="button"
          onClick={() => !prevDisabled && onPageChange(currentPage - 1)}
          disabled={prevDisabled}
          aria-label="Previous page"
          aria-disabled={prevDisabled ? 'true' : undefined}
          style={{
            width: '44px',
            height: '44px',
            minWidth: '44px',
            minHeight: '44px',
            maxWidth: '44px',
            maxHeight: '44px',
            padding: 0,
            boxSizing: 'border-box',
            flex: 'none',
          }}
          className={`w-[44px] h-[44px] p-0 box-border rounded-full flex-none shrink-0 flex items-center justify-center text-[#FAF8F5] border border-[rgba(196,164,104,0.5)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A468] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080608] ${
            prevDisabled
              ? 'opacity-35 cursor-not-allowed'
              : 'hover:bg-[rgba(196,164,104,0.08)] hover:border-[rgba(196,164,104,0.8)] cursor-pointer'
          }`}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* 2 Page Numbers (Current & Neighbor in ascending order) */}
        {mobilePages.map((num) => {
          const isActive = num === currentPage;
          if (isActive) {
            return (
              <button
                key={num}
                type="button"
                onClick={() => onPageChange(num)}
                aria-label={`Page ${num}`}
                aria-current="page"
                style={{
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  minHeight: '44px',
                  maxWidth: '44px',
                  maxHeight: '44px',
                  padding: 0,
                  boxSizing: 'border-box',
                  flex: 'none',
                  boxShadow: '0 0 12px rgba(196,164,104,0.45), 0 0 4px rgba(196,164,104,0.3)',
                }}
                className="w-[44px] h-[44px] p-0 box-border rounded-full flex-none shrink-0 flex items-center justify-center font-serif text-[18px] font-bold bg-[#C4A468] text-[#080608] border border-[#C4A468] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A468] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080608]"
              >
                {num}
              </button>
            );
          }

          return (
            <button
              key={num}
              type="button"
              onClick={() => onPageChange(num)}
              aria-label={`Page ${num}`}
              style={{
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                maxWidth: '44px',
                maxHeight: '44px',
                padding: 0,
                boxSizing: 'border-box',
                flex: 'none',
              }}
              className="w-[44px] h-[44px] p-0 box-border rounded-full flex-none shrink-0 flex items-center justify-center font-serif italic text-[18px] text-[rgba(250,248,245,0.8)] border border-[rgba(196,164,104,0.4)] transition-all duration-200 hover:bg-[rgba(196,164,104,0.08)] hover:text-[#FAF8F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A468] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080608] cursor-pointer"
            >
              {num}
            </button>
          );
        })}

        {/* Next Arrow */}
        <button
          type="button"
          onClick={() => !nextDisabled && onPageChange(currentPage + 1)}
          disabled={nextDisabled}
          aria-label="Next page"
          aria-disabled={nextDisabled ? 'true' : undefined}
          style={{
            width: '44px',
            height: '44px',
            minWidth: '44px',
            minHeight: '44px',
            maxWidth: '44px',
            maxHeight: '44px',
            padding: 0,
            boxSizing: 'border-box',
            flex: 'none',
          }}
          className={`w-[44px] h-[44px] p-0 box-border rounded-full flex-none shrink-0 flex items-center justify-center text-[#FAF8F5] border border-[rgba(196,164,104,0.5)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A468] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080608] ${
            nextDisabled
              ? 'opacity-35 cursor-not-allowed'
              : 'hover:bg-[rgba(196,164,104,0.08)] hover:border-[rgba(196,164,104,0.8)] cursor-pointer'
          }`}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Desktop Layout (>= 640px): full numbered pagination */}
      <div className="w-full px-4 hidden sm:flex justify-center items-center gap-2 flex-nowrap">
        {/* Prev Arrow */}
        <button
          type="button"
          onClick={() => !prevDisabled && onPageChange(currentPage - 1)}
          disabled={prevDisabled}
          aria-label="Previous page"
          aria-disabled={prevDisabled ? 'true' : undefined}
          className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-[#FAF8F5] border border-[rgba(196,164,104,0.5)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A468] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080608] ${
            prevDisabled
              ? 'opacity-35 cursor-not-allowed'
              : 'hover:bg-[rgba(196,164,104,0.08)] hover:border-[rgba(196,164,104,0.8)] cursor-pointer'
          }`}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Page numbers with ellipsis */}
        {desktopPages.map((item, idx) => {
          if (item === 'ellipsis-start' || item === 'ellipsis-end') {
            return (
              <span
                key={`${item}-${idx}`}
                aria-hidden="true"
                className="flex items-center justify-center w-10 h-10 font-serif italic text-base select-none text-[rgba(250,248,245,0.7)]"
              >
                …
              </span>
            );
          }

          const num = item as number;
          const isActive = currentPage === num;

          if (isActive) {
            return (
              <button
                key={num}
                type="button"
                onClick={() => onPageChange(num)}
                aria-label={`Page ${num}`}
                aria-current="page"
                style={{
                  boxShadow: '0 0 12px rgba(196,164,104,0.45), 0 0 4px rgba(196,164,104,0.3)',
                }}
                className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-serif text-[16px] font-bold bg-[#C4A468] text-[#080608] border border-[#C4A468] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A468] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080608]"
              >
                {num}
              </button>
            );
          }

          return (
            <button
              key={num}
              type="button"
              onClick={() => onPageChange(num)}
              aria-label={`Page ${num}`}
              className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-serif italic text-[16px] text-[rgba(250,248,245,0.7)] border border-[rgba(196,164,104,0.3)] transition-all duration-200 hover:bg-[rgba(196,164,104,0.08)] hover:text-[#FAF8F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A468] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080608] cursor-pointer"
            >
              {num}
            </button>
          );
        })}

        {/* Next Arrow */}
        <button
          type="button"
          onClick={() => !nextDisabled && onPageChange(currentPage + 1)}
          disabled={nextDisabled}
          aria-label="Next page"
          aria-disabled={nextDisabled ? 'true' : undefined}
          className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-[#FAF8F5] border border-[rgba(196,164,104,0.5)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A468] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080608] ${
            nextDisabled
              ? 'opacity-35 cursor-not-allowed'
              : 'hover:bg-[rgba(196,164,104,0.08)] hover:border-[rgba(196,164,104,0.8)] cursor-pointer'
          }`}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

export function GalleryPage() {
  const [items] = useState<Artwork[]>(STATIC_ARTWORKS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const galleryGridRef = useRef<HTMLDivElement>(null);
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
        <div className="max-w-[1600px] mx-auto" ref={galleryGridRef}>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <GalleryPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    galleryGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                />
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
