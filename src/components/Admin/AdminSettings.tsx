import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

interface Setting {
  id: number;
  key: string;
  value: string;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      if (data) setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
      // If table doesn't exist, we might want to handle it gracefully
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      for (const setting of settings) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: setting.value })
          .eq('key', setting.key);
        
        if (error) throw error;
      }
      setMessage({ text: 'Settings updated successfully!', type: 'success' });
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setMessage({ text: `Error: ${err.message}`, type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-warm-ivory animate-pulse font-sans uppercase tracking-widest">
        Loading System Configurations...
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-4xl">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-serif text-4xl italic text-warm-ivory mb-2">General Settings</h1>
          <p className="font-sans text-[16px] tracking-[0.2em] uppercase text-ghost-white/40">Manage global portfolio configurations</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`px-8 py-3 bg-aged-gold text-near-black font-sans uppercase tracking-widest text-sm font-medium transition-all ${saving ? 'opacity-50 cursor-wait' : 'hover:bg-warm-ivory cursor-pointer'}`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-4 border ${message.type === 'success' ? 'border-green-500/50 text-green-400 bg-green-500/5' : 'border-red-500/50 text-red-400 bg-red-500/5'} font-sans text-sm tracking-wide uppercase`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="space-y-12 bg-deep-charcoal border border-white/5 p-8 md:p-12 rounded-sm">
        
        {/* Contact Information */}
        <section className="space-y-8">
          <h2 className="font-serif text-2xl italic text-aged-gold border-b border-white/5 pb-4">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-ghost-white/40">Portfolio Title</label>
              <input 
                type="text" 
                value={settings.find(s => s.key === 'portfolio_title')?.value || ''}
                onChange={(e) => handleUpdateSetting('portfolio_title', e.target.value)}
                className="w-full bg-near-black border border-white/10 p-4 text-warm-ivory font-sans focus:border-aged-gold outline-none transition-colors"
                placeholder="Site Title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-ghost-white/40">Inquiry Email Address</label>
              <input 
                type="email" 
                value={settings.find(s => s.key === 'contact_email')?.value || ''}
                onChange={(e) => handleUpdateSetting('contact_email', e.target.value)}
                className="w-full bg-near-black border border-white/10 p-4 text-warm-ivory font-sans focus:border-aged-gold outline-none transition-colors"
                placeholder="contact@artist.com"
              />
            </div>
          </div>
        </section>

        {/* Social Presence */}
        <section className="space-y-8 pt-4">
          <h2 className="font-serif text-2xl italic text-aged-gold border-b border-white/5 pb-4">Social Presence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-ghost-white/40">Instagram Profile URL</label>
              <input 
                type="text" 
                value={settings.find(s => s.key === 'instagram_url')?.value || ''}
                onChange={(e) => handleUpdateSetting('instagram_url', e.target.value)}
                className="w-full bg-near-black border border-white/10 p-4 text-warm-ivory font-sans focus:border-aged-gold outline-none transition-colors"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-ghost-white/40">Facebook Profile URL</label>
              <input 
                type="text" 
                value={settings.find(s => s.key === 'facebook_url')?.value || ''}
                onChange={(e) => handleUpdateSetting('facebook_url', e.target.value)}
                className="w-full bg-near-black border border-white/10 p-4 text-warm-ivory font-sans focus:border-aged-gold outline-none transition-colors"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </section>

        {/* System Notice */}
        <div className="pt-8 mt-12 border-t border-white/5">
          <p className="text-xs text-ghost-white/20 font-sans tracking-widest uppercase italic">
            Note: These settings update global variables across the entire portfolio site.
          </p>
        </div>
      </div>
    </div>
  );
}
