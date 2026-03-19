import { Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { InquiryPage } from './pages/InquiryPage';
import { useCursor } from './hooks/useCursor';

export default function App() {
  const { dotRef, ringRef } = useCursor();

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
      </Routes>

      {/* Global Cursor */}
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}
