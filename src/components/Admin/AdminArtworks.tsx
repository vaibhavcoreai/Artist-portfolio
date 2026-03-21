import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Reorder, motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

interface ArtworkEntry {
  id?: string;
  title: string;
  medium: string;
  year: number;
  size_cm: string;
  category: string;
  description: string;
  image_url: string;
  display_order: number;
  is_visible: boolean;
}

export function AdminArtworks() {
  const [artworks, setArtworks] = useState<ArtworkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ArtworkEntry>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (!error && data) {
        setArtworks(data as ArtworkEntry[]);
      } else if (error) {
         console.error('Error fetching artworks from Supabase:', error);
      }
    } catch (err) {
      console.error('Error fetching artworks from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleReorder = async (newOrder: ArtworkEntry[]) => {
    setArtworks(newOrder); // Optimistic UI update
    
    try {
      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('artworks')
          .update({ display_order: i })
          .eq('id', newOrder[i].id);
      }
    } catch (err) {
      console.error('Error reordering artworks:', err);
    }
  };

  const handleToggleVisibility = async (e: React.MouseEvent, id: string | undefined, current: boolean) => {
    e.stopPropagation();
    if (!id) return;
    try {
      setArtworks(artworks.map(a => a.id === id ? { ...a, is_visible: !current } : a));
      await supabase
        .from('artworks')
        .update({ is_visible: !current })
        .eq('id', id);
    } catch (err) {
       console.error('Error toggling visibility:', err);
    }
  };

  const handleDelete = async (id: string | undefined, title: string) => {
    if (!id) return;
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        setArtworks(artworks.filter(a => a.id !== id));
        await supabase
          .from('artworks')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.error('Error deleting artwork:', err);
      }
    }
  };

  const openModal = (artwork?: ArtworkEntry) => {
    setFormData(artwork || { 
      title: '', medium: '', year: new Date().getFullYear(), 
      size_cm: '', category: '', description: '', image_url: '', 
      is_visible: true
    });
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadProgress(10);
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    try {
      const { data, error } = await supabase.storage
        .from('artwork-images')
        .upload(`uploads/${fileName}`, file, { cacheControl: '3600', upsert: false });
      
      if (error) {
        console.error('Upload failed:', error.message);
        setUploadProgress(0);
        return;
      }
      
      if (data) {
        setUploadProgress(100);
        const { data: publicData } = supabase.storage.from('artwork-images').getPublicUrl(data.path);
        setFormData(prev => ({ ...prev, image_url: publicData.publicUrl }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadProgress(0);
      alert('Image upload failed. Check bucket permissions.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] },
    maxFiles: 1 
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('artworks')
          .update(formData)
          .eq('id', formData.id);

        if (error) throw error;
        alert('Artwork updated successfully!');
      } else {
        // Insert
        const order = artworks.length > 0 ? Math.max(...artworks.map(a => a.display_order)) + 1 : 0;
        const { error } = await supabase
          .from('artworks')
          .insert([{ ...formData, display_order: order }]);

        if (error) throw error;
        alert('New artwork created successfully!');
      }
      setIsModalOpen(false);
      fetchArtworks();
    } catch (err: any) {
      console.error('Save error:', err);
      alert(`Error saving artwork: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 h-screen overflow-y-auto w-full relative">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-4xl italic text-warm-ivory">Artworks</h1>
        <button 
          onClick={() => openModal()}
          className="bg-aged-gold text-near-black px-6 py-3 font-sans text-base uppercase tracking-widest hover:bg-warm-ivory transition-colors"
        >
          Add Artwork
        </button>
      </div>

      {loading ? (
        <div className="text-white">Loading database (Supabase)...</div>
      ) : (
        <div className="bg-deep-charcoal border border-white/5 rounded-sm p-4 h-full">
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/5 text-[16px] uppercase tracking-widest text-ghost-white/50 mb-4 px-4">
            <div className="col-span-1">Image</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Medium</div>
            <div className="col-span-1">Year</div>
            <div className="col-span-2">Visibility</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <Reorder.Group axis="y" values={artworks} onReorder={handleReorder} className="flex flex-col space-y-2">
            {artworks.map((artwork) => (
              <Reorder.Item 
                key={artwork.id!} 
                value={artwork}
                className="grid grid-cols-12 gap-4 items-center bg-near-black p-4 border border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors"
              >
                <div className="col-span-1">
                  {artwork.image_url ? (
                    <img src={artwork.image_url} alt="" className="w-12 h-12 object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-white/5 border border-white/10" />
                  )}
                </div>
                <div className="col-span-4 font-serif text-lg text-warm-ivory italic truncate">{artwork.title}</div>
                <div className="col-span-2 text-base text-ghost-white/70">{artwork.medium}</div>
                <div className="col-span-1 text-base text-aged-gold">{artwork.year}</div>
                <div className="col-span-2">
                  <button 
                    onClick={(e) => handleToggleVisibility(e, artwork.id, artwork.is_visible)}
                    className={`text-[16px] px-3 py-1 uppercase tracking-widest border ${artwork.is_visible ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}`}
                  >
                    {artwork.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="col-span-2 flex justify-end space-x-4">
                  <button 
                    onPointerDown={(e) => e.stopPropagation()} 
                    onClick={() => openModal(artwork)} 
                    className="text-base uppercase text-ghost-white/50 hover:text-aged-gold transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onPointerDown={(e) => e.stopPropagation()} 
                    onClick={() => handleDelete(artwork.id, artwork.title)} 
                    className="text-base uppercase text-red-500/50 hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-near-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-deep-charcoal border border-white/10 p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-3xl italic text-warm-ivory">{formData.id ? 'Edit Artwork' : 'Add Artwork'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white text-xl">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[16px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Title</label>
                  <input required type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-base text-warm-ivory focus:border-aged-gold outline-none" />
                </div>
                <div>
                  <label className="text-[16px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Category</label>
                  <input required type="text" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-base text-warm-ivory focus:border-aged-gold outline-none" placeholder="e.g. Oil, Landscapes, etc." />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-[16px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Medium (display text)</label>
                  <input required type="text" value={formData.medium || ''} onChange={e => setFormData({ ...formData, medium: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-base text-warm-ivory focus:border-aged-gold outline-none" placeholder="e.g. Oil on Canvas" />
                </div>
                <div>
                  <label className="text-[16px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Year</label>
                  <input required type="number" value={formData.year || ''} onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} className="w-full bg-near-black border border-white/10 p-3 text-base text-warm-ivory focus:border-aged-gold outline-none" />
                </div>
                <div>
                  <label className="text-[16px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Size</label>
                  <input required type="text" value={formData.size_cm || ''} onChange={e => setFormData({ ...formData, size_cm: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-base text-warm-ivory focus:border-aged-gold outline-none" placeholder="e.g. 90x120cm" />
                </div>
              </div>

              <div>
                <label className="text-[16px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Image Upload</label>
                <div {...getRootProps()} className={`w-full border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-aged-gold bg-aged-gold/5' : 'border-white/10 bg-near-black hover:border-white/30'}`}>
                  <input {...getInputProps()} />
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="h-32 mx-auto object-contain" />
                  ) : (
                    <p className="text-base text-ghost-white/50">Drag 'n' drop an image here, or click to select</p>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-deep-charcoal h-1 mt-4">
                      <div className="bg-aged-gold h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[16px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Description</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-base text-warm-ivory focus:border-aged-gold outline-none h-24 resize-none" />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 uppercase tracking-widest text-base font-sans text-ghost-white/50 hover:text-white">Cancel</button>
                <button type="submit" className="px-6 py-3 uppercase tracking-widest text-base font-sans bg-aged-gold text-near-black">{formData.id ? 'Save Changes' : 'Create Artwork'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
