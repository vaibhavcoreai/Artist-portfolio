import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer/Footer';
import AboutImage from '../assets/About.jpg';
import BlurText from '../components/ui/BlurText';

interface Moment {
  id: string;
  image_url: string;
  title: string;
  description: string;
  year: number;
}

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
  'Mr. Mahesh Majrekar, Indian actor, film director, screenwriter and producer – Mumbai',
  'Mrs. Devaki Pandit, Indian Classical Singer – Mumbai',
  'Mr. Yatin Shah, Chairman of Precision Camshaft – Solapur',
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

const renderEditorialListItem = (item: string, isLast: boolean = false) => {
  const parts = item.split(' – ');
  if (parts.length >= 2) {
    const yearOrLocation = parts.pop(); // Take the last part as year/location
    const title = parts.join(' – '); // Rejoin the rest in case there were multiple dashes
    return (
      <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-baseline w-full pb-4 border-b border-white/5 group-hover:border-aged-gold/40 transition-colors duration-500`}>
        <span className="text-[15px] leading-snug tracking-wide text-ghost-white/90 group-hover:text-warm-ivory transition-colors duration-500 pr-4">
          {title}
        </span>
        <span className="font-serif italic text-aged-gold/80 text-sm whitespace-nowrap mt-1 sm:mt-0 group-hover:text-aged-gold transition-colors duration-500">
          {yearOrLocation}
        </span>
      </div>
    );
  }
  return (
    <div className={`flex flex-col w-full pb-4 ${isLast ? '' : 'border-b border-white/5'} group-hover:border-aged-gold/40 transition-colors duration-500`}>
      <span className={`text-[15px] leading-snug tracking-wide transition-colors duration-500 ${isLast ? 'text-aged-gold italic font-[400] mt-2' : 'text-ghost-white/90 group-hover:text-warm-ivory'}`}>
        {item}
      </span>
    </div>
  );
};

export function AboutPage() {
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    const fetchMoments = async () => {
      const { data, error } = await supabase
        .from('artist_moments')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        setMoments(data);
      }
    };
    fetchMoments();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2
      }
    }
  };

  const portraitVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -2 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1.8
      }
    }
  };

  return (
    <main className="w-full bg-near-black text-warm-ivory min-h-screen pt-32 md:pt-48">

      {/* 1 & 2. Unified Header & Portrait Grid */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container-luxury mb-32 md:mb-48 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-0 items-start">

          {/* Left Side: Name and Details */}
          <div className="md:col-span-7 flex flex-col pt-0 md:pt-8 relative z-10">
            {/* Decorative line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-px bg-aged-gold mb-10"
            />

            <div className="flex flex-col mb-16 md:mb-20">
              <BlurText
                text="Deepak Gurunath"
                delay={80}
                animateBy="words"
                direction="bottom"
                className="text-5xl md:text-display italic leading-[1.05] text-warm-ivory m-0 p-0"
              />
              <BlurText
                text="Patil"
                delay={120}
                animateBy="words"
                direction="bottom"
                className="text-5xl md:text-display italic leading-[1.05] text-warm-ivory m-0 p-0"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="font-sans text-[11px] md:text-[13px] tracking-[0.4em] text-aged-gold uppercase mt-6 ml-1"
              >
                Fine Artist · Colour Pencil · Charcoal
              </motion.p>
            </div>

            <motion.div variants={fadeInUp} className="flex flex-col font-sans border-t border-white/10 pt-10 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-[15px]">
                {/* Placard-style detail items */}
                <div className="flex flex-col border-b border-white/5 pb-6">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-ghost-white/40 mb-2">Date of Birth</span>
                  <span className="text-warm-ivory font-light text-lg">4 September 1980</span>
                </div>
                <div className="flex flex-col border-b border-white/5 pb-6">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-ghost-white/40 mb-2">Qualifications</span>
                  <span className="text-warm-ivory font-light text-base leading-relaxed">
                    A.T.D., G.D.Art (ptg.), Dip.A.Ed.
                  </span>
                </div>
                <div className="flex flex-col border-b border-white/5 pb-6 md:col-span-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-ghost-white/40 mb-2">Occupation</span>
                  <span className="text-warm-ivory font-light text-lg leading-relaxed">
                    Artist
                  </span>
                </div>
                <div className="flex flex-col md:col-span-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-ghost-white/40 mb-2">Contact</span>
                  <a href="mailto:deepakpatilart123@gmail.com" className="text-aged-gold hover:text-warm-ivory transition-colors font-light text-lg truncate flex items-center gap-3">
                    deepakpatilart123@gmail.com
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Portrait Break */}
          <div className="md:col-span-5 md:pl-12 w-full">
            <motion.div
              variants={portraitVariants}
              className="w-full aspect-[4/5] md:aspect-[3/4] border border-white/5 relative bg-deep-charcoal rounded-[40px] overflow-hidden shadow-2xl"
            >
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                src={AboutImage}
                alt="Deepak Patil Artist"
                className="w-full h-full object-cover object-top grayscale opacity-80 mix-blend-lighten"
              />
            </motion.div>
          </div>

        </div>
      </motion.section>

      {/* 2.5 Exhibition Moments Grid */}
      {moments.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container-luxury mb-32 md:mb-48 relative z-20"
        >
          <div className="flex flex-col mb-16 border-b border-white/10 pb-12">
            <h2 className="font-serif text-4xl italic text-aged-gold mb-4">Exhibition Moments</h2>
            <p className="font-sans text-[16px] tracking-[0.2em] uppercase text-ghost-white/40">From Mumbai Galleries & Solo Exhibitions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            {moments.map((moment, idx) => (
              <motion.div
                key={moment.id}
                variants={fadeInUp}
                className={`flex flex-col space-y-8 ${idx % 2 !== 0 ? 'md:pt-24' : ''}`}
              >
                <div className="group relative overflow-hidden bg-deep-charcoal aspect-[4/3] border border-white/5">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
                    src={moment.image_url}
                    alt={moment.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
                  />
                </div>
                <div className="space-y-4 max-w-xl">
                  <div className="text-aged-gold font-sans text-[11px] tracking-[0.3em] uppercase">
                    {moment.year}
                  </div>
                  <h3 className="font-serif text-2xl italic text-warm-ivory">{moment.title}</h3>
                  <p className="font-sans text-base leading-relaxed text-ghost-white/60 font-light">
                    {moment.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 3. Deep Curriculum Vitae */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container-luxury pb-48 relative z-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32">

          {/* Sticky Left Rail CV Table of Contents */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block lg:col-span-3 text-[16px] uppercase tracking-[0.2em] text-ghost-white/40"
          >
            <div className="sticky top-48 flex flex-col space-y-6">
              {moments.length > 0 && <a href="#moments" className="hover:text-aged-gold transition-colors text-aged-gold/60">Exhibition Moments</a>}
              <a href="#acclaim" className="hover:text-aged-gold transition-colors">Critical Acclaim</a>
              <a href="#awards" className="hover:text-aged-gold transition-colors">Awards</a>
              <a href="#exhibitions" className="hover:text-aged-gold transition-colors">Exhibitions & Participation</a>
              <a href="#groupshows" className="hover:text-aged-gold transition-colors">Group Shows</a>
              <a href="#collections" className="hover:text-aged-gold transition-colors">Collections</a>
            </div>
          </motion.div>

          <div className="lg:col-span-9 flex flex-col space-y-20 md:space-y-32 text-warm-ivory">

            {/* Critical Acclaim Panel */}
            <div id="acclaim" className="flex flex-col space-y-10 md:space-y-16 relative">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-3xl italic text-aged-gold border-b border-white/10 pb-6 uppercase tracking-wider"
              >
                Critical Acclaim
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative bg-deep-charcoal/50 border border-white/5 p-8 md:p-14 rounded-2xl overflow-hidden"
              >
                {/* Large background quote mark */}
                <div className="absolute -top-6 -left-2 text-[200px] leading-none font-serif text-aged-gold/5 select-none pointer-events-none">
                  "
                </div>

                <div className="relative z-10 font-sans text-ghost-white/80 text-[16px] md:text-[18px] font-light space-y-6 max-w-4xl leading-relaxed">
                  <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-aged-gold first-letter:mr-1 first-letter:float-left">
                    Young artist from Solapur Deepak Patil has brought a broad spectrum of portraits depicting women's emotions whilst she drapes, makes over in front of mirror. She is engrossed in 'Shringar' transforming into a beautiful person, expressing different moods.
                  </p>
                  <p>
                    The work is on a black paper and the colouring is with amazing dexterity with colour pencil. The artist has very diligently kept the texture of the work deceptively close to brush strokes.
                  </p>
                  <p>
                    Black background of all paintings provides a sharp contrast to the bright colours used by artist. Besides detailing all postures, curves and expressions of the women in different moods, the artist has also painted the details of the beautiful drapery.
                  </p>
                  <p>
                    The Sanskrit names for each painting like 'Pushpvirahini' truly depicts the yearning of a young girl eagerly awaiting to meet her lover. Whilst 'Priyamvada' is engrossed in a thought of meeting her lover.
                  </p>
                  <p>
                    The most beautiful painting is 'Deepragini'. The expression of devotion on the face of the young girl. Glow of the lamp on her face reminds me of the most celebrated of painting of Master of yesteryears S.L. Haldankar and his painting 'Lady with a lamp'.
                  </p>
                  <p className="font-serif italic text-xl text-warm-ivory/90 mt-4">
                    "Deepak Patil keeps the promise of returning to connoisseurs with more delight in future."
                  </p>

                  <div className="pt-10 mt-10 border-t border-white/10 flex items-center gap-6">
                    <div className="w-12 h-px bg-aged-gold/50" />
                    <div>
                      <p className="text-aged-gold font-serif text-2xl italic">Shri Kishor Dixit</p>
                      <p className="text-ghost-white/50 text-[11px] tracking-[0.2em] uppercase mt-1">Poet & Art Critic (Mumbai)</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Awards Panel */}
            <div id="awards" className="flex flex-col space-y-8 md:space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-3xl italic text-aged-gold border-b border-white/10 pb-6 uppercase tracking-wider"
              >
                Select Awards
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
                {AWARDS.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-aged-gold/40 mt-2 mr-4 shrink-0 group-hover:bg-aged-gold transition-colors duration-500" />
                    {renderEditorialListItem(item)}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Exhibitions Panel */}
            <div id="exhibitions" className="flex flex-col space-y-8 md:space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-3xl italic text-aged-gold border-b border-white/10 pb-6 uppercase tracking-wider"
              >
                Exhibitions & Participation
              </motion.h2>
              <div className="grid grid-cols-1 gap-y-2 max-w-4xl">
                {EXHIBITIONS.map((item, i) => (
                  <motion.div
                    key={`exb-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-aged-gold/40 mt-2 mr-4 shrink-0 group-hover:bg-aged-gold transition-colors duration-500" />
                    {renderEditorialListItem(item)}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Group Shows Panel */}
            <div id="groupshows" className="flex flex-col space-y-8 md:space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-3xl italic text-aged-gold border-b border-white/10 pb-6 uppercase tracking-wider"
              >
                Group Shows
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
                {GROUP_SHOWS.map((item, i) => (
                  <motion.div
                    key={`gs-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-aged-gold/40 mt-2 mr-4 shrink-0 group-hover:bg-aged-gold transition-colors duration-500" />
                    {renderEditorialListItem(item)}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Collections Panel */}
            <div id="collections" className="flex flex-col space-y-8 md:space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-3xl italic text-aged-gold border-b border-white/10 pb-6 uppercase tracking-wider"
              >
                Prominent Collections
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
                {COLLECTIONS.map((item, i) => (
                  <motion.div
                    key={`col-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`group flex ${i === COLLECTIONS.length - 1 ? 'md:col-span-2' : ''}`}
                  >
                    <div className={`h-1.5 rounded-full bg-aged-gold/40 mt-2 mr-4 shrink-0 group-hover:bg-aged-gold transition-colors duration-500 ${i === COLLECTIONS.length - 1 ? 'hidden' : 'w-1.5'}`} />
                    {renderEditorialListItem(item, i === COLLECTIONS.length - 1)}
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
