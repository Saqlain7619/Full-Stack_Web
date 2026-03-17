import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X, Package } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', price: '', comparePrice: '', categoryId: '', stock: '', tags: '', featured: false, active: true, images: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15 };
      if (search) params.search = search;
      const [prod, cat] = await Promise.all([api.get('/products', { params }), categories.length ? Promise.resolve({ data: { categories } }) : api.get('/categories')]);
      setProducts(prod.data.products); setPages(prod.data.pages);
      if (!categories.length) setCategories(cat.data.categories);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); load(1); }, 400); return () => clearTimeout(t); }, [search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, description: p.description, price: p.price, comparePrice: p.comparePrice || '', categoryId: p.categoryId, stock: p.stock, tags: p.tags?.join(', ') || '', featured: p.featured, active: p.active, images: p.images?.join(', ') || '' }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null, stock: parseInt(form.stock), tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [], images: form.images ? form.images.split(',').map(i => i.trim()).filter(Boolean) : [] };
      if (editing) { await api.put(`/products/${editing.id}`, payload); toast.success('Product updated!'); }
      else { await api.post('/products', payload); toast.success('Product created!'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Product deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">Products</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-2 px-4"><Plus size={16} />Add Product</button>
      </div>

      <div className="card mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        {loading ? <Spinner className="py-12" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>{['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || 'https://placehold.co/40x40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div><p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>{p.featured && <span className="badge bg-amber-50 text-amber-700 text-xs">Featured</span>}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.category?.name}</td>
                    <td className="px-4 py-3 font-semibold">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3"><span className={`badge ${p.stock === 0 ? 'bg-red-100 text-red-700' : p.stock <= 10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{p.stock}</span></td>
                    <td className="px-4 py-3"><span className={`badge ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.active ? 'Active' : 'Hidden'}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!products.length && <div className="text-center py-12 text-gray-500"><Package size={40} className="mx-auto mb-3 opacity-30" /><p>No products found</p></div>}
          </div>
        )}
        {pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => <button key={i} onClick={() => setPage(i+1)} className={`w-8 h-8 rounded-lg text-sm font-medium ${page === i+1 ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{i+1}</button>)}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-xl">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Product Name *</label><input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field" /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Description *</label><textarea required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="input-field resize-none" /></div>
                <div><label className="block text-sm font-medium mb-1">Price *</label><input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Compare Price</label><input type="number" min="0" step="0.01" value={form.comparePrice} onChange={(e) => setForm({...form, comparePrice: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Category *</label>
                  <select required value={form.categoryId} onChange={(e) => setForm({...form, categoryId: e.target.value})} className="input-field">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Stock *</label><input type="number" required min="0" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="input-field" /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Images (URLs, comma-separated)</label><textarea value={form.images} onChange={(e) => setForm({...form, images: e.target.value})} rows={2} className="input-field resize-none" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Tags (comma-separated)</label><input value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} className="input-field" placeholder="electronics, gadget, sale" /></div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})} className="rounded" /><span className="text-sm font-medium">Featured</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => setForm({...form, active: e.target.checked})} className="rounded" /><span className="text-sm font-medium">Active</span></label>
                </div>
              </div>
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
