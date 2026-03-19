import { useState, useEffect, useCallback } from 'react';
import { useAppwrite } from '../../lib/appwrite';
import { Query, ID } from 'appwrite';
import { Reorder, motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

interface ArtworkEntry {
  id: string;
  title: string;
  medium: string;
  year: number;
  sizeCm: string;
  category: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isVisible: boolean;
}

export function AdminArtworks() {
  const { databases, storage, config } = useAppwrite();
  const [artworks, setArtworks] = useState<ArtworkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ArtworkEntry>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.artworks,
        [Query.orderAsc('displayOrder')]
      );
      
      const data = response.documents.map(doc => ({
        id: doc.$id,
        title: doc.title,
        medium: doc.medium,
        year: doc.year,
        sizeCm: doc.sizeCm,
        category: doc.category,
        description: doc.description,
        imageUrl: doc.imageUrl,
        displayOrder: doc.displayOrder,
        isVisible: doc.isVisible
      })) as ArtworkEntry[];
      setArtworks(data);
    } catch (err) {
      console.error('Error fetching artworks from Appwrite:', err);
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
      // Seqential updates for the new order sequence
      for (let i = 0; i < newOrder.length; i++) {
          await databases.updateDocument(
              config.databaseId,
              config.collections.artworks,
              newOrder[i].id,
              { displayOrder: i }
          );
      }
    } catch (err) {
      console.error('Error reordering artworks:', err);
    }
  };

  const handleToggleVisibility = async (e: React.MouseEvent, id: string, current: boolean) => {
    e.stopPropagation();
    try {
      setArtworks(artworks.map(a => a.id === id ? { ...a, isVisible: !current } : a));
      await databases.updateDocument(
          config.databaseId,
          config.collections.artworks,
          id,
          { isVisible: !current }
      );
    } catch (err) {
       console.error('Error toggling visibility:', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        setArtworks(artworks.filter(a => a.id !== id));
        await databases.deleteDocument(
            config.databaseId,
            config.collections.artworks,
            id
        );
      } catch (err) {
        console.error('Error deleting artwork:', err);
      }
    }
  };

  const openModal = (artwork?: ArtworkEntry) => {
    setFormData(artwork || { 
      title: '', medium: '', year: new Date().getFullYear(), 
      sizeCm: '', category: '', description: '', imageUrl: '', 
      isVisible: true
    });
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadProgress(5);
    
    try {
      const response = await storage.createFile(
          config.bucketId,
          ID.unique(),
          file
      );
      
      setUploadProgress(100);
      
      // Construct public view URL for the file
      const endpoint = (storage as any).client.config.endpoint;
      const project = (storage as any).client.config.project;
      const downloadURL = `${endpoint}/storage/buckets/${config.bucketId}/files/${response.$id}/view?project=${project}`;
      
      setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadProgress(0);
      alert('Image upload failed. Check bucket permissions.');
    }
  }, [storage, config]);

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
        const { id, ...dataToUpdate } = formData;
        await databases.updateDocument(
            config.databaseId,
            config.collections.artworks,
            id!,
            dataToUpdate
        );
        alert('Artwork updated successfully!');
      } else {
        // Insert
        const order = artworks.length > 0 ? Math.max(...artworks.map(a => a.displayOrder)) + 1 : 0;
        await databases.createDocument(
            config.databaseId,
            config.collections.artworks,
            ID.unique(),
            {
                ...formData,
                displayOrder: order
            }
        );
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
          className="bg-aged-gold text-near-black px-6 py-3 font-sans text-xs uppercase tracking-widest hover:bg-warm-ivory transition-colors"
        >
          Add Artwork
        </button>
      </div>

      {loading ? (
        <div className="text-white">Loading database (Appwrite)...</div>
      ) : (
        <div className="bg-deep-charcoal border border-white/5 rounded-sm p-4 h-full">
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/5 text-[10px] uppercase tracking-widest text-ghost-white/50 mb-4 px-4">
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
                key={artwork.id} 
                value={artwork}
                className="grid grid-cols-12 gap-4 items-center bg-near-black p-4 border border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors"
              >
                <div className="col-span-1">
                  {artwork.imageUrl ? (
                    <img src={artwork.imageUrl} alt="" className="w-12 h-12 object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-white/5 border border-white/10" />
                  )}
                </div>
                <div className="col-span-4 font-serif text-lg text-warm-ivory italic truncate">{artwork.title}</div>
                <div className="col-span-2 text-xs text-ghost-white/70">{artwork.medium}</div>
                <div className="col-span-1 text-xs text-aged-gold">{artwork.year}</div>
                <div className="col-span-2">
                  <button 
                    onClick={(e) => handleToggleVisibility(e, artwork.id, artwork.isVisible)}
                    className={`text-[10px] px-3 py-1 uppercase tracking-widest border ${artwork.isVisible ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}`}
                  >
                    {artwork.isVisible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="col-span-2 flex justify-end space-x-4">
                  <button 
                    onPointerDown={(e) => e.stopPropagation()} 
                    onClick={() => openModal(artwork)} 
                    className="text-xs uppercase text-ghost-white/50 hover:text-aged-gold transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onPointerDown={(e) => e.stopPropagation()} 
                    onClick={() => handleDelete(artwork.id, artwork.title)} 
                    className="text-xs uppercase text-red-500/50 hover:text-red-500 transition-colors"
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
                  <label className="text-[10px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Title</label>
                  <input required type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-sm text-warm-ivory focus:border-aged-gold outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Category</label>
                  <input required type="text" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-sm text-warm-ivory focus:border-aged-gold outline-none" placeholder="e.g. Oil, Landscapes, etc." />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Medium (display text)</label>
                  <input required type="text" value={formData.medium || ''} onChange={e => setFormData({ ...formData, medium: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-sm text-warm-ivory focus:border-aged-gold outline-none" placeholder="e.g. Oil on Canvas" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Year</label>
                  <input required type="number" value={formData.year || ''} onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} className="w-full bg-near-black border border-white/10 p-3 text-sm text-warm-ivory focus:border-aged-gold outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Size</label>
                  <input required type="text" value={formData.sizeCm || ''} onChange={e => setFormData({ ...formData, sizeCm: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-sm text-warm-ivory focus:border-aged-gold outline-none" placeholder="e.g. 90x120cm" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Image Upload</label>
                <div {...getRootProps()} className={`w-full border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-aged-gold bg-aged-gold/5' : 'border-white/10 bg-near-black hover:border-white/30'}`}>
                  <input {...getInputProps()} />
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" className="h-32 mx-auto object-contain" />
                  ) : (
                    <p className="text-sm text-ghost-white/50">Drag 'n' drop an image here, or click to select</p>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-deep-charcoal h-1 mt-4">
                      <div className="bg-aged-gold h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-ghost-white/50 mb-2 block">Description</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-near-black border border-white/10 p-3 text-sm text-warm-ivory focus:border-aged-gold outline-none h-24 resize-none" />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 uppercase tracking-widest text-xs font-sans text-ghost-white/50 hover:text-white">Cancel</button>
                <button type="submit" className="px-6 py-3 uppercase tracking-widest text-xs font-sans bg-aged-gold text-near-black">{formData.id ? 'Save Changes' : 'Create Artwork'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
