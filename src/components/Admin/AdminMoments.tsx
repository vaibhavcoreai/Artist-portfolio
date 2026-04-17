import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Reorder, motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

interface MomentEntry {
  id?: string;
  image_url: string;
  title: string;
  description: string;
  year: number;
  display_order: number;
}

export function AdminMoments() {
  const [moments, setMoments] = useState<MomentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<MomentEntry>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchMoments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('artist_moments')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) {
        console.error('Error fetching moments:', error);
        if (error.code === '42P01') {
          alert('Database table "artist_moments" not found. Please run the SQL script provided earlier in your Supabase SQL Editor.');
        }
      }
      if (!error && data) {
        setMoments(data as MomentEntry[]);
      }
    } catch (err) {
      console.error('Error fetching moments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  const handleReorder = async (newOrder: MomentEntry[]) => {
    setMoments(newOrder);
    try {
      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('artist_moments')
          .update({ display_order: i })
          .eq('id', newOrder[i].id);
      }
    } catch (err) {
      console.error('Error reordering moments:', err);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm('Delete this exhibition photo?')) {
      try {
        setMoments(moments.filter(m => m.id !== id));
        await supabase.from('artist_moments').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting moment:', err);
      }
    }
  };

  const openModal = (moment?: MomentEntry) => {
    setFormData(moment || { 
      title: '', description: '', year: new Date().getFullYear(), image_url: '' 
    });
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadProgress(10);
    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;

    try {
      const { data, error } = await supabase.storage
        .from('artwork-images')
        .upload(`uploads/${fileName}`, file);
      
      if (error) throw error;
      
      if (data) {
        setUploadProgress(100);
        const { data: publicData } = supabase.storage.from('artwork-images').getPublicUrl(data.path);
        setFormData(prev => ({ ...prev, image_url: publicData.publicUrl }));
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert(`Upload failed: ${err.message || 'Check storage bucket permissions'}`);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert('Please upload an image before saving.');
      setLoading(false);
      return;
    }

    try {
      if (formData.id) {
        const { error } = await supabase.from('artist_moments').update(formData).eq('id', formData.id);
        if (error) throw error;
      } else {
        const order = moments.length > 0 ? Math.max(...moments.map(m => m.display_order)) + 1 : 0;
        const { error } = await supabase.from('artist_moments').insert([{ ...formData, display_order: order }]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchMoments();
    } catch (err: any) {
      console.error('Save error detailed:', err);
      alert(`Save error: ${err.message || err.details || 'Unknown database error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 h-screen overflow-y-auto w-full relative">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-4xl italic text-warm-ivory">Exhibition Moments</h1>
        <button 
          onClick={() => openModal()}
          className="bg-aged-gold text-near-black px-6 py-3 font-sans text-base uppercase tracking-widest hover:bg-warm-ivory transition-colors"
        >
          Add Photo
        </button>
      </div>

      {loading ? (
        <div className="text-white opacity-50 uppercase tracking-widest text-xs">Accessing Archives...</div>
      ) : (
        <div className="bg-deep-charcoal border border-white/5 rounded-sm p-4 h-full">
           <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/5 text-[14px] uppercase tracking-widest text-ghost-white/50 mb-4 px-4">
            <div className="col-span-2">Preview</div>
            <div className="col-span-4">Title / Exhibition</div>
            <div className="col-span-1">Year</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <Reorder.Group axis="y" values={moments} onReorder={handleReorder} className="flex flex-col space-y-2">
            {moments.map((moment) => (
              <Reorder.Item 
                key={moment.id!} 
                value={moment}
                className="grid grid-cols-12 gap-4 items-center bg-near-black p-4 border border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors"
              >
                <div className="col-span-2">
                  <img src={moment.image_url} alt="" className="w-20 h-20 object-cover" />
                </div>
                <div className="col-span-4 font-serif text-lg text-warm-ivory italic truncate">{moment.title}</div>
                <div className="col-span-1 text-base text-aged-gold">{moment.year}</div>
                <div className="col-span-3 text-sm text-ghost-white/50 truncate">{moment.description}</div>
                <div className="col-span-2 flex justify-end space-x-4">
                  <button onClick={() => openModal(moment)} className="text-xs uppercase text-ghost-white/50 hover:text-aged-gold">Edit</button>
                  <button onClick={() => handleDelete(moment.id)} className="text-xs uppercase text-red-500/50 hover:text-red-500">Delete</button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-near-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-deep-charcoal border border-white/10 p-8">
            <h2 className="font-serif text-3xl italic text-warm-ivory mb-8">{formData.id ? 'Edit Moment' : 'Add Moment'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-ghost-white/50">Title / Event</label>
                  <input required type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-warm-ivory outline-none focus:border-aged-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-ghost-white/50">Year</label>
                  <input required type="number" value={formData.year || ''} onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} className="w-full bg-near-black border border-white/10 p-3 text-warm-ivory outline-none focus:border-aged-gold" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-ghost-white/50">Gallery Photo</label>
                <div {...getRootProps()} className="border-2 border-dashed border-white/10 p-8 text-center cursor-pointer hover:border-white/30 transition-colors">
                  <input {...getInputProps()} />
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="h-32 mx-auto" />
                  ) : (
                    <p className="text-sm text-ghost-white/30 uppercase tracking-widest">Upload Exhibition Photo</p>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-deep-charcoal h-1 mt-4">
                      <div className="bg-aged-gold h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-ghost-white/50">Description</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-warm-ivory h-24 resize-none outline-none focus:border-aged-gold" />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 uppercase tracking-widest text-ghost-white/50">Cancel</button>
                <button 
                  type="submit" 
                  disabled={!formData.image_url || loading}
                  className={`px-6 py-3 uppercase tracking-widest bg-aged-gold text-near-black ${(!formData.image_url || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-warm-ivory'}`}
                >
                  {loading ? 'Saving...' : 'Save Moment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
