import { motion } from 'framer-motion';
import { Footer } from '../components/Footer/Footer';

export function InquiryPage() {
  return (
    <main className="w-full bg-near-black text-warm-ivory min-h-screen">
      
      {/* Hero Header */}
      <section className="pt-48 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10 border-b border-white/5 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="font-sans text-[16px] tracking-[0.3em] uppercase text-aged-gold mb-6">Connect with the Studio</p>
            <h1 className="text-display italic leading-[0.9] text-warm-ivory mb-8 font-serif">Inquiry</h1>
            <p className="font-sans text-base font-light text-ghost-white/50 max-w-lg leading-relaxed">
              Whether you are looking to acquire an original painting, commission a custom piece, 
              or simply discuss the art — we welcome your message.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 md:px-12 pb-48">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
            
          {/* Direct Options Hub */}
          <div className="w-full flex flex-col space-y-12">
            
            <div className="space-y-8">
              <h2 className="font-sans text-[16px] uppercase tracking-[0.4em] text-aged-gold text-center">— Select a Direct Channel —</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/919890646123?text=Hello Deepak, I'm interested in knowing more about your artwork."
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-6 p-8 bg-white/[0.02] border border-white/5 hover:border-aged-gold/50 transition-all rounded-[32px] group"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-aged-gold group-hover:text-near-black transition-all duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 1 1-7.6-11.8 8.4 8.4 0 0 1 3.5.7l5.2-1.5zM17.5 11l-1.5-1-1.5 1V15h3z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block font-sans text-[16px] uppercase tracking-widest text-ghost-white/40 mb-1">WhatsApp Chat</span>
                    <span className="block font-serif text-xl italic text-warm-ivory group-hover:text-aged-gold transition-colors">Digital Studio</span>
                  </div>
                </a>

                {/* Phone Call */}
                <a 
                  href="tel:+919890646123"
                  className="flex items-center space-x-6 p-8 bg-white/[0.02] border border-white/5 hover:border-aged-gold/50 transition-all rounded-[32px] group"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-aged-gold group-hover:text-near-black transition-all duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block font-sans text-[16px] uppercase tracking-widest text-ghost-white/40 mb-1">Phone Line</span>
                    <span className="block font-serif text-xl italic text-warm-ivory group-hover:text-aged-gold transition-colors">+91 98906 46123</span>
                  </div>
                </a>

                {/* Email - Full Width on desktop for emphasis */}
                <a 
                  href="mailto:deepak_patilart@rediffmail.com"
                  className="md:col-span-2 flex items-center space-x-6 p-8 bg-white/[0.02] border border-white/5 hover:border-aged-gold/50 transition-all rounded-[32px] group"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-aged-gold group-hover:text-near-black transition-all duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                       <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                       <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="block font-sans text-[16px] uppercase tracking-widest text-ghost-white/40 mb-1">Formal Inquiry</span>
                    <span className="block font-serif text-xl italic text-warm-ivory group-hover:text-aged-gold transition-colors truncate">deepak_patilart@rediffmail.com</span>
                  </div>
                </a>

              </div>
            </div>

            <div className="text-center pt-8">
               <p className="font-serif italic text-base text-ghost-white/30">
                 The artist usually responds to all personal inquiries within 24-48 hours.
               </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
