import { useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const QUOTES = [
  {
    text: "Meticulous and deeply emotional. Deepak's work transformed our dining hall with a profound sense of stillness.",
    author: "Elena Rossi",
    location: "Milan, Italy"
  },
  {
    text: "The monochromatic studies present a masterful command of light. It commands attention without raising its voice.",
    author: "Arthur PENDLETON",
    location: "New York, USA"
  },
  {
    text: "A generational talent bridging classical technique with modern atmospheric sensibility.",
    author: "SARAH DESAI",
    location: "Mumbai, India"
  }
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const dragX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDragEnd = () => {
    const x = dragX.get();
    if (x <= -50 && active < QUOTES.length - 1) {
      setActive(active + 1);
    } else if (x >= 50 && active > 0) {
      setActive(active - 1);
    }
  };

  return (
    <section className="bg-near-black py-48 px-6 md:px-24 relative overflow-hidden flex flex-col items-center border-t border-white/5">
      
      {/* Huge Background Quotation Mark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] font-serif text-warm-ivory/5 select-none pointer-events-none italic leading-none h-48 mb-64 flex justify-center items-center font-[200]">
        "
      </div>
      
      <div 
        ref={containerRef} 
        className="w-full max-w-4xl overflow-hidden relative"
      >
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          onDragEnd={onDragEnd}
          style={{ x: dragX }}
          animate={{ x: `-${active * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex cursor-grab active:cursor-grabbing"
        >
          {QUOTES.map((quote, idx) => (
            <div 
              key={idx} 
              className="w-full shrink-0 flex flex-col items-center justify-center text-center px-4 md:px-16"
            >
              <h3 className="text-3xl md:text-5xl font-serif text-warm-ivory italic leading-relaxed mb-12 drop-shadow-lg">
                "{quote.text}"
              </h3>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-aged-gold mb-2">
                {quote.author}
              </p>
              <p className="font-sans text-xs uppercase tracking-widest text-ghost-white/50">
                {quote.location}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Interactive Dots */}
      <div className="flex space-x-4 mt-24">
        {QUOTES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className="w-8 h-8 flex items-center justify-center group"
            data-cursor="hover"
          >
            <motion.div 
              className={`rounded-full transition-colors duration-500 ${active === idx ? 'bg-aged-gold' : 'bg-white/20'}`}
              animate={{ 
                scale: active === idx ? 1.5 : 1,
                width: active === idx ? "8px" : "4px",
                height: active === idx ? "8px" : "4px",
              }}
              transition={{ duration: 0.4 }}
            />
          </button>
        ))}
      </div>
      
    </section>
  );
}
