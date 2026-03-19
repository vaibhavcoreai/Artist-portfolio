import { motion } from 'framer-motion';
import { Footer } from '../components/Footer/Footer';
import AboutImage from '../assets/About.jpg';

const AWARDS = [
  'Nehru Cultural Award – 1995',
  'Chitralila Niketan Award – 1995',
  'Land Scape 1st prize – 1997',
  'Camlin Catalogue selected, Mumbai – 2000',
  'Chitari Academy Merit Certificate, Pune – 2000',
  'Nokia Asia Pacific International Merit Certificate – 2000',
  'Surbhi Kala Ratna Puraskar, Aurangabad – 2003',
  'All India Hyderabad Art Society Cash Award – 2004',
  'All India Lokmanya Tilak, Let G.N.Jadhav Cash Award, Pune – 2004',
  'All India Lokmanaya Tilak 1st Cash Award, Pune – 2007',
  'Prafulla Dahanukar Art Foundation, Mumbai – 2018'
];

const EXHIBITIONS = [
  'Art Society of India, Mumbai – 2000',
  'Camlin Art Foundation, Mumbai – 2000',
  'Chitari Academy, Pune – 2000',
  'South Central Zone, Nagpur – 2001',
  'Tilak Smruti Exhibition, Pune – 2004, 2007',
  'State Art Exhibition, Mumbai – 2007',
  'Bombay Art Society, Mumbai – 2010'
];

const GROUP_SHOWS = [
  'Kala Sadhana Kendra, Solapur – 1998',
  'Monsoon Show Jahangir Art Gallery, Mumbai – 2000',
  'India Art Gallery, Pune – 2001',
  'Shubharai Art Gallery, Solapur – 2003',
  'Artist Center, Mumbai – 2005',
  'Jehangir Art Gallery, Mumbai – 2018',
  'Solapur social foundation, Pune – 2018',
  'Sanskruti Art Festival, Upvan lake, Thane – 2019',
  'Klabadhi Winspir national art exhibition, Kolhapur – 2019',
  'Solapur social foundation, Thane – 2019'
];

const COLLECTIONS = [
  'Mr. Yatin Shah, Chairman of Precision Camshaft – Solapur',
  'Mrs. Devaki Pandit, Star Singer – Mumbai',
  'Mr. N.K. Sharma – Mumbai',
  'Mr. Amol Chafalkar, Architect – Solapur',
  'Mr. Milind Sathe – Pune',
  'Mr. Dinesh Solanki – U.S.A',
  'Mrs. Sangita Karwa – Solapur',
  'Mr. Gopal Joshi – Gulbarga',
  'Mr. Albart Thompson – U.K.',
  'Mr. Kishor Prajapati – Gandhinagar',
  'Various private collections in India and abroad.'
];

export function AboutPage() {
  
  return (
    <main className="w-full bg-near-black text-warm-ivory min-h-screen pt-32 md:pt-48">
      
      {/* 1. Header Grid */}
      <section className="container-luxury mb-48 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 items-end">
          
          <div className="flex flex-col space-y-6">
            <h1 className="text-5xl md:text-display italic leading-[1] md:leading-[0.9] text-warm-ivory">
              Deepak Gurunath<br />Patil
            </h1>
          </div>

          <div className="flex flex-col space-y-8 font-sans border-t border-aged-gold/30 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 md:gap-8 text-[11px] uppercase tracking-widest text-ghost-white/70">
              <div className="space-y-1.5 flex flex-col">
                <span className="text-aged-gold text-[9px]">Date of Birth</span>
                <span className="text-warm-ivory font-medium">4 September 1980</span>
              </div>
              <div className="space-y-1.5 flex flex-col">
                <span className="text-aged-gold text-[9px]">Qualifications</span>
                <span className="text-warm-ivory font-medium normal-case tracking-normal text-sm leading-relaxed">
                  A.T.D., G.D.Art (ptg.),<br />Dip.A.Ed.
                </span>
              </div>
              <div className="space-y-1.5 flex flex-col md:col-span-2">
                <span className="text-aged-gold text-[9px]">Occupation</span>
                <span className="text-warm-ivory font-medium normal-case tracking-normal text-sm leading-relaxed">
                  Principal, Appasaheb Kadadi<br className="md:hidden" /> Chitrakala Mahavidyalaya, Solapur
                </span>
              </div>
              <div className="space-y-1.5 flex flex-col md:col-span-2">
                <span className="text-aged-gold text-[9px]">Contact</span>
                <a href="mailto:deepak_patilart@rediffmail.com" className="text-warm-ivory font-medium normal-case tracking-normal hover:text-aged-gold transition tracking-widest text-xs truncate">
                  deepak_patilart@rediffmail.com
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. Parallax Image Break */}
      <section className="w-full px-6 flex justify-center h-[50vh] md:h-[75vh] relative overflow-hidden mt-32 md:mt-0 mb-48 md:mb-48">
        <motion.div 
          className="w-full max-w-2xl aspect-[4/5] md:aspect-[3/4] border border-white/5 relative bg-deep-charcoal rounded-[40px] overflow-hidden shadow-2xl"
        >
          <motion.img 
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            src={AboutImage} 
            alt="Deepak Patil Artist" 
            className="w-full h-full object-cover object-top grayscale opacity-80 mix-blend-lighten"
          />
        </motion.div>
      </section>

      {/* 3. Deep Curriculum Vitae */}
      <section className="container-luxury pb-48 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32">
          
          {/* Sticky Left Rail CV Table of Contents */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-48 flex flex-col space-y-6 text-[10px] uppercase tracking-[0.2em] text-ghost-white/40">
              <a href="#awards" className="hover:text-aged-gold transition-colors">Awards</a>
              <a href="#exhibitions" className="hover:text-aged-gold transition-colors">Exhibitions & Participation</a>
              <a href="#groupshows" className="hover:text-aged-gold transition-colors">Group Shows</a>
              <a href="#collections" className="hover:text-aged-gold transition-colors">Collections</a>
            </div>
          </div>

          <div className="lg:col-span-9 flex flex-col space-y-20 md:space-y-32">
            
            {/* Awards Panel */}
            <div id="awards" className="flex flex-col space-y-8 md:space-y-12">
              <h2 className="font-serif text-3xl italic text-aged-gold border-b border-white/10 pb-6 uppercase tracking-wider">
                Select Awards
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 font-sans text-ghost-white/80 text-sm font-light">
                {AWARDS.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex text-[13px] leading-snug tracking-wide"
                  >
                    <span className="w-2 h-px bg-aged-gold mt-2.5 mr-4 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Exhibitions Panel */}
            <div id="exhibitions" className="flex flex-col space-y-8 md:space-y-12">
              <h2 className="font-serif text-3xl italic text-aged-gold border-b border-white/10 pb-6 uppercase tracking-wider">
                Exhibitions & Participation
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 font-sans text-ghost-white/80 text-sm font-light">
                {EXHIBITIONS.map((item, i) => (
                  <motion.li 
                    key={`exb-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex text-[13px] leading-snug tracking-wide"
                  >
                    <span className="w-2 h-px bg-aged-gold mt-2.5 mr-4 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Group Shows Panel */}
            <div id="groupshows" className="flex flex-col space-y-8 md:space-y-12">
              <h2 className="font-serif text-3xl italic text-aged-gold border-b border-white/10 pb-6 uppercase tracking-wider">
                Group Shows
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 font-sans text-ghost-white/80 text-sm font-light">
                {GROUP_SHOWS.map((item, i) => (
                  <motion.li 
                    key={`gs-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex text-[13px] leading-snug tracking-wide"
                  >
                    <span className="w-2 h-px bg-aged-gold mt-2.5 mr-4 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Collections Panel */}
            <div id="collections" className="flex flex-col space-y-8 md:space-y-12">
              <h2 className="font-serif text-3xl italic text-aged-gold border-b border-white/10 pb-6 uppercase tracking-wider">
                Prominent Collections
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 font-sans text-ghost-white/80 text-sm font-light">
                {COLLECTIONS.map((item, i) => (
                  <motion.li 
                    key={`col-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex text-[13px] leading-snug tracking-wide ${i === COLLECTIONS.length - 1 ? 'md:col-span-2 text-aged-gold mt-6 italic font-[400]' : ''}`}
                  >
                    <span className={`h-px bg-aged-gold mt-2.5 mr-4 shrink-0 ${i === COLLECTIONS.length - 1 ? 'w-4' : 'w-2'}`} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
