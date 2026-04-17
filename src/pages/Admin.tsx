import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AdminArtworks } from '../components/Admin/AdminArtworks';
import { AdminSettings } from '../components/Admin/AdminSettings';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('adminAuth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      if (location.pathname === '/admin' || location.pathname === '/admin/') {
        navigate('/admin/artworks', { replace: true });
      }
    }
  }, [location, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      navigate('/admin/artworks');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-near-black flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-deep-charcoal border border-white/10 p-8">
          <h2 className="font-serif text-3xl italic text-warm-ivory mb-6 text-center">Studio Login</h2>
          <form onSubmit={handleLogin} className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2">
              <label className="text-base uppercase tracking-widest text-ghost-white/60">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-b border-white/20 pb-2 text-warm-ivory focus:outline-none focus:border-aged-gold transition-colors font-sans"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-base">{error}</p>}
            <button 
              type="submit"
              className="w-full py-4 bg-aged-gold text-near-black font-sans uppercase tracking-[0.15em] text-base font-medium hover:bg-warm-ivory transition-colors cursor-pointer"
            >
              Enter Studio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-near-black flex flex-col md:flex-row font-sans cursor-auto">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-deep-charcoal border-r border-white/5 flex flex-col p-8 shrink-0">
        <div className="mb-12">
          <h2 className="font-serif text-2xl italic text-warm-ivory mb-2">Deepak Patil</h2>
          <p className="font-sans text-[16px] tracking-[0.2em] uppercase text-aged-gold">Admin Studio</p>
        </div>
        
        <nav className="flex flex-col space-y-4 flex-1">
          {['Artworks', 'Settings'].map(tab => (
            <NavLink
              key={tab}
              to={`/admin/${tab.toLowerCase()}`}
              className={({ isActive }) => `text-base tracking-widest uppercase transition-colors py-2 ${isActive ? 'text-aged-gold' : 'text-ghost-white/50 hover:text-ghost-white'}`}
            >
              {tab}
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="text-base uppercase tracking-widest text-ghost-white/30 hover:text-white text-left mt-auto pt-8 border-t border-white/5"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-near-black overflow-y-auto">
        <Routes>
          <Route path="artworks" element={<AdminArtworks />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
}
