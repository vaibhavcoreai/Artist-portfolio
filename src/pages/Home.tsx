import { Hero } from '../components/Hero/Hero';
import { About } from '../components/About/About';
import { Footer } from '../components/Footer/Footer';

export function Home() {
  return (
    <main className="w-full bg-near-black">
      <Hero />
      
      {/* Slide-over About Section */}
      <div id="about" className="relative z-20 w-full rounded-t-[48px] -mt-[20vh] bg-near-black overflow-hidden shadow-[0_-20px_50px_rgba(8,6,8,0.8)] border-t border-aged-gold/20">
        <About />
      </div>

      <Footer />
    </main>
  );
}
