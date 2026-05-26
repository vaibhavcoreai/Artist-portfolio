import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { NavBar } from './components/NavBar/NavBar';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { DoomGalleryPage } from './pages/DoomGalleryPage';
import { CanvasGalleryPage } from './pages/CanvasGalleryPage';
import { InquiryPage } from './pages/InquiryPage';
import { useCursor } from './hooks/useCursor';
import { ScrollToTop } from './components/ScrollToTop';
import { LoadingScreen } from './components/LoadingScreen';
import { PageTransition } from './components/PageTransition';

export default function App() {
  const { dotRef, ringRef } = useCursor();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Initial Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <ScrollToTop />
          <NavBar />

          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/exhibit" element={<DoomGalleryPage />} />
              <Route path="/canvas" element={<CanvasGalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/inquiry" element={<InquiryPage />} />
            </Routes>
          </PageTransition>

          {/* Global Cursor */}
          <div ref={dotRef} className="cursor-dot hidden md:block" />
          <div ref={ringRef} className="cursor-ring hidden md:block" />
        </>
      )}
    </>
  );
}
