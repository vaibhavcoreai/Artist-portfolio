import { useState, useEffect } from 'react';
import { useSupabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface InquiryEntry {
  id: string;
  artwork_title: string;
  name: string;
  email: string;
  budget_range: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export function AdminInquiries() {
  const { db } = useSupabase();
  const [inquiries, setInquiries] = useState<InquiryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await db.from('inquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) setInquiries(data as InquiryEntry[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
    await db.from('inquiries').update({ status }).eq('id', id);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete inquiry from ${name}?`)) {
      setInquiries(inquiries.filter(i => i.id !== id));
      await db.from('inquiries').delete().eq('id', id);
      if (expandedId === id) setExpandedId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-aged-gold text-near-black';
      case 'read': return 'bg-white/10 text-ghost-white/70';
      case 'replied': return 'bg-green-500 text-white';
      default: return 'bg-white/10 text-white';
    }
  };

  return (
    <div className="p-8 md:p-12 h-screen overflow-y-auto w-full">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-4xl italic text-warm-ivory">Inquiries</h1>
      </div>

      {loading ? (
        <div className="text-white">Loading database...</div>
      ) : (
        <div className="flex flex-col space-y-4">
          {inquiries.map((inq) => (
            <motion.div 
              key={inq.id}
              layout
              className={`bg-deep-charcoal border transition-colors ${expandedId === inq.id ? 'border-aged-gold/30' : 'border-white/5 hover:border-white/20'}`}
            >
              {/* Row Header */}
              <div 
                className="grid grid-cols-12 gap-4 items-center p-6 cursor-pointer"
                onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
              >
                <div className="col-span-1">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm ${getStatusColor(inq.status)}`}>
                    {inq.status}
                  </span>
                </div>
                <div className="col-span-3 font-serif text-lg text-warm-ivory truncate">{inq.artwork_title}</div>
                <div className="col-span-3 text-sm text-ghost-white/80 truncate">{inq.name}</div>
                <div className="col-span-2 text-xs text-aged-gold truncate">{inq.budget_range || 'M/A'}</div>
                <div className="col-span-2 text-xs text-ghost-white/50">{new Date(inq.created_at).toLocaleDateString()}</div>
                <div className="col-span-1 text-right text-white/50">{expandedId === inq.id ? '▲' : '▼'}</div>
              </div>

              {/* Expansion Details */}
              <AnimatePresence>
                {expandedId === inq.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/5"
                  >
                    <div className="p-6 bg-near-black flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-ghost-white/50 mb-1">Email</p>
                          <a href={`mailto:${inq.email}`} className="text-sm text-aged-gold hover:underline">{inq.email}</a>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-ghost-white/50 mb-2">Message</p>
                          <p className="text-sm font-light leading-relaxed text-ghost-white whitespace-pre-wrap pl-4 border-l-2 border-white/10">
                            {inq.message}
                          </p>
                        </div>
                      </div>

                      <div className="w-48 flex flex-col space-y-3 shrink-0">
                        <p className="text-[10px] uppercase tracking-widest text-ghost-white/50 mb-2">Actions</p>
                        {inq.status === 'new' && (
                          <button onClick={() => updateStatus(inq.id, 'read')} className="text-xs uppercase tracking-widest p-2 bg-white/5 hover:bg-white/10 text-white transition-colors text-left pl-4 border-l-4 border-gray-500">
                            Mark as Read
                          </button>
                        )}
                        {inq.status !== 'replied' && (
                          <button onClick={() => updateStatus(inq.id, 'replied')} className="text-xs uppercase tracking-widest p-2 bg-white/5 hover:bg-green-500/20 text-white transition-colors text-left pl-4 border-l-4 border-green-500">
                            Mark as Replied
                          </button>
                        )}
                        <button onClick={() => handleDelete(inq.id, inq.name)} className="text-xs uppercase tracking-widest p-2 bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors text-left pl-4 border-l-4 border-red-500 mt-4">
                          Delete Inquiry
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {inquiries.length === 0 && (
             <div className="text-center py-24 text-white/50 border border-dashed border-white/10">
               No inquiries found in the database.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
