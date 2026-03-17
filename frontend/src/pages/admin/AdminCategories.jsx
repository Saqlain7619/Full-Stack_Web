import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/categories'); setCategories(data.categories); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '', image: '' }); setModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '', image: c.image || '' }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await api.put(`/categories/${editing.id}`, form); toast.success('Category updated!'); }
      else { await api.post('/categories', form); toast.success('Category created!'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Category deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot delete (products exist?)'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">Categories</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-2 px-4"><Plus size={16} />Add Category</button>
      </div>

      {loading ? <Spinner className="py-12" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {cat.image ? <img src={cat.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Tag size={20} className="text-gray-400" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500 truncate">{cat.description || 'No description'}</p>
                <p className="text-xs text-primary-600 font-medium mt-1">{cat._count?.products || 0} products</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cat)} className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-xl">{editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-1">Name *</label><input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="input-field resize-none" /></div>
              <div><label className="block text-sm font-medium mb-1">Image URL</label><input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className="input-field" placeholder="https://example.com/image.jpg" /></div>
              {form.image && <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded-xl" onError={(e) => e.target.style.display='none'} />}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
