import { motion } from 'framer-motion';
import { Footer } from '../components/Footer/Footer';

export function InquiryPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message. This form is a demonstration; for direct artwork inquiries, please use WhatsApp or Phone below.');
  };

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
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-aged-gold mb-6">Connect with the Studio</p>
            <h1 className="text-display italic leading-[0.9] text-warm-ivory mb-8 font-serif">Inquiry</h1>
            <p className="font-sans text-sm font-light text-ghost-white/50 max-w-lg leading-relaxed">
              Whether you are looking to acquire an original painting, commission a custom piece, 
              or simply discuss the art — we welcome your message.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32">
          
          {/* Left Column: Direct Options */}
          <div className="flex flex-col space-y-16">
            
            {/* Quick Contact Buttons */}
            <div className="space-y-6">
              <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-aged-gold">Direct Channels</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                <a 
                  href="https://wa.me/919890646123?text=Hello Deepak, I'm interested in knowing more about your artwork."
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-5 p-6 bg-white/[0.02] border border-white/5 hover:border-aged-gold/50 transition-all rounded-[24px] group"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-aged-gold group-hover:text-near-black transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 1 1-7.6-11.8 8.4 8.4 0 0 1 3.5.7l5.2-1.5zM17.5 11l-1.5-1-1.5 1V15h3z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block font-sans text-[9px] uppercase tracking-widest text-ghost-white/40 mb-1">WhatsApp</span>
                    <span className="block font-serif text-lg italic text-warm-ivory group-hover:text-aged-gold transition-colors">Chat Directly</span>
                  </div>
                </a>

                <a 
                  href="tel:+919890646123"
                  className="flex items-center space-x-5 p-6 bg-white/[0.02] border border-white/5 hover:border-aged-gold/50 transition-all rounded-[24px] group"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-aged-gold group-hover:text-near-black transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block font-sans text-[9px] uppercase tracking-widest text-ghost-white/40 mb-1">Call Studio</span>
                    <span className="block font-serif text-lg italic text-warm-ivory group-hover:text-aged-gold transition-colors">+91 98906 46123</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Studio Address */}
            <div className="space-y-6">
              <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-aged-gold">Studio Location</h2>
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                       <circle cx="12" cy="10" r="3" />
                    </svg>
                 </div>
                 <div className="relative z-10">
                    <p className="font-serif text-2xl italic leading-relaxed text-warm-ivory mb-6">
                      Fine Arts Studio, Solapur<br />
                      Maharashtra, India
                    </p>
                    <div className="space-y-4">
                       <div className="flex flex-col">
                          <span className="font-sans text-[10px] uppercase tracking-widest text-ghost-white/40 mb-1">Email Inquiry</span>
                          <a href="mailto:deepak_patilart@rediffmail.com" className="text-aged-gold hover:text-warm-ivory transition-colors">deepak_patilart@rediffmail.com</a>
                       </div>
                       <div className="flex flex-col pt-4">
                          <span className="font-sans text-[10px] uppercase tracking-widest text-ghost-white/40 mb-1">Visiting Hours</span>
                          <span className="text-ghost-white/70">By appointment only</span>
                       </div>
                    </div>
                 </div>
                 
                 {/* Stylized Dark Map Placeholder */}
                 <div className="w-full h-48 bg-near-black rounded-2xl relative overflow-hidden border border-white/5 mt-4">
                    <div className="absolute inset-0 grayscale opacity-20 contrast-125 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Solapur,Maharashtra&zoom=10&size=600x300&maptype=roadmap&style=feature:all|element:labels|visibility:off&style=feature:geometry|color:0x212121&style=feature:water|color:0x000000')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-near-black/60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-aged-gold rounded-full animate-ping group-hover:animate-none" />
                        <div className="w-2 h-2 bg-aged-gold rounded-full absolute" />
                    </div>
                 </div>
              </div>
            </div>

          </div>

          {/* Right Column: General Form */}
          <div className="bg-white/5 p-10 md:p-16 rounded-[40px] border border-white/5 relative">
            <h2 className="font-serif text-3xl italic text-warm-ivory mb-12">General Inquiry</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-aged-gold block ml-1">Your Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., Alexander Smith" 
                  className="w-full bg-near-black border border-white/10 rounded-2xl p-4 text-sm focus:border-aged-gold outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-aged-gold block ml-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  placeholder="e.g., alex@gallery.com" 
                  className="w-full bg-near-black border border-white/10 rounded-2xl p-4 text-sm focus:border-aged-gold outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-aged-gold block ml-1">Subject</label>
                <select className="w-full bg-near-black border border-white/10 rounded-2xl p-4 text-sm focus:border-aged-gold outline-none transition-colors appearance-none">
                  <option>Artwork Inquiry</option>
                  <option>Commission Request</option>
                  <option>Studio Visit</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-aged-gold block ml-1">Message</label>
                <textarea 
                  required
                  placeholder="Tell us about the piece you are interested in..." 
                  className="w-full bg-near-black border border-white/10 rounded-2xl p-4 text-sm focus:border-aged-gold outline-none transition-colors h-40 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-aged-gold text-near-black font-sans text-xs uppercase tracking-[0.3em] font-bold rounded-full hover:bg-warm-ivory transition-colors duration-500 shadow-xl"
              >
                Send Inquiry
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
