import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X, Package } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatPrice';

// ✅ FIX 1: Yeh function local path ko full URL mein convert karta hai
const getImageUrl = (path) => {
  if (!path) return null;
  // Agar already full URL hai (http/https) toh as-is return karo
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Local path ko full URL banao
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${cleanPath}`;
};

const emptyForm = {
  name: '', description: '', price: '', comparePrice: '',
  categoryId: '', stock: '', tags: '', featured: false, active: true,
  images: null,
  avatarImage: null, // New field for static try-on
  recommendations: []
};

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
  const [allProducts, setAllProducts] = useState([]);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15, admin: true };
      if (search) params.search = search;
      const [prod, cat] = await Promise.all([
        api.get('/products', { params }),
        categories.length
          ? Promise.resolve({ data: { categories } })
          : api.get('/categories'),
      ]);
      setProducts(prod.data.products);
      setPages(prod.data.pages);
      if (!categories.length) setCategories(cat.data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    fetchAllProducts();
    setModal(true);
  };

  const fetchAllProducts = async () => {
    try {
      const res = await api.get('/products?limit=1000');
      setAllProducts(res.data.products);
    } catch {}
  };

  const openEdit = async (p) => {
    setEditing(p);
    
    // Set base form
    const editForm = {
      name: p.name,
      description: p.description,
      price: p.price,
      comparePrice: p.comparePrice || '',
      categoryId: p.categoryId,
      stock: p.stock,
      tags: p.tags?.join(', ') || '',
      featured: p.featured,
      active: p.active,
      images: null,
      avatarImage: null,
      recommendations: [],
    };
    
    setForm(editForm);
    fetchAllProducts();
    setModal(true);

    try {
      const res = await api.get(`/recommendations/${p.id}`);
      if (res.data.products) {
        setForm(f => ({ ...f, recommendations: res.data.products.map(x => x.id) }));
      }
    } catch {}
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // ✅ FIX 3: Min 5 hataya — ab max 4, optional hai
      if (form.images && form.images.length > 4) {
        toast.error('Maximum 4 images allowed');
        setSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('comparePrice', form.comparePrice || '');
      formData.append('stock', form.stock);
      formData.append('categoryId', form.categoryId);
      formData.append('tags', form.tags || '');
      formData.append('featured', form.featured);
      formData.append('active', form.active);

      // Images optional hain — sirf tab append karo jab user ne select kiya ho
      if (form.images && form.images.length > 0) {
        Array.from(form.images).forEach((file) => {
          formData.append('images', file);
        });
      }

      // Append Avatar Image
      if (form.avatarImage) {
        formData.append('avatarImage', form.avatarImage);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      let savedProductId = null;
      if (editing) {
        const res = await api.put(`/products/${editing.id}`, formData, config);
        savedProductId = editing.id;
        toast.success('Product updated!');
      } else {
        const res = await api.post('/products', formData, config);
        savedProductId = res.data.product.id;
        toast.success('Product created!');
      }

      // Save recommendations
      if (savedProductId) {
        try {
          await api.post('/recommendations', {
            productId: savedProductId,
            recommendedProductIds: form.recommendations
          });
        } catch (err) {
          toast.error('Failed to save recommendations');
        }
      }

      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">Products</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-2 px-4">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="card mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {loading ? <Spinner className="py-12" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* ✅ FIX 4: getImageUrl() se full URL banta hai */}
                        <img
                          src={getImageUrl(p.images?.[0]) || 'https://placehold.co/40x40'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          onError={(e) => { e.target.src = 'https://placehold.co/40x40'; }}
                        />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                          {p.featured && (
                            <span className="badge bg-amber-50 text-amber-700 text-xs">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.category?.name}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        p.stock === 0 ? 'bg-red-100 text-red-700'
                        : p.stock <= 10 ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                      }`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!products.length && (
              <div className="text-center py-12 text-gray-500">
                <Package size={40} className="mx-auto mb-3 opacity-30" />
                <p>No products found</p>
              </div>
            )}
          </div>
        )}

        {pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  page === i + 1 ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-xl">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (Rs.) *</label>
                  <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Compare Price (Rs.)</label>
                  <input type="number" min="0" step="0.01" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-field">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock *</label>
                  <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
                </div>

                {/* ✅ FIX 5: Max 4 images, optional */}
                {/* Images Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Images{' '}
                    <span className="text-gray-400 font-normal">(optional — max 4)</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files.length > 4) {
                        toast.error('Maximum 4 images select kar sakte hain');
                        e.target.value = '';
                        return;
                      }
                      setForm({ ...form, images: files });
                    }}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 4 files</p>

                  {/* New image previews */}
                  {form.images && form.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {Array.from(form.images).map((img, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(img)}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          alt={`preview-${i}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Edit mode mein existing images bhi dikhao */}
                  {editing && editing.images?.length > 0 && !form.images && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Current images:</p>
                      <div className="flex gap-2 flex-wrap">
                        {editing.images.map((img, i) => (
                          <img
                            key={i}
                            src={getImageUrl(img)}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            alt={`existing-${i}`}
                            onError={(e) => { e.target.src = 'https://placehold.co/64x64'; }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar Try-On Image Upload */}
                <div className="sm:col-span-2 p-4 bg-primary-50/30 rounded-2xl border border-primary-100">
                  <label className="block text-sm font-bold text-primary-900 mb-1">
                    Avatar Try-On Image
                    <span className="text-primary-400 font-normal ml-2">(for virtual try-on simulation)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, avatarImage: e.target.files[0] })}
                    className="input-field border-primary-200 focus:ring-primary-500"
                  />
                  <p className="text-xs text-primary-600/60 mt-1">Upload an image of a model wearing this item</p>

                  {/* Avatar preview */}
                  {form.avatarImage && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-primary-700 mb-1">New Avatar Preview:</p>
                      <img
                        src={URL.createObjectURL(form.avatarImage)}
                        className="w-32 h-40 object-cover rounded-xl border-2 border-primary-200 shadow-sm"
                        alt="avatar-preview"
                      />
                    </div>
                  )}

                  {editing && editing.avatarImage && !form.avatarImage && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-primary-700 mb-1">Current Avatar:</p>
                      <img
                        src={getImageUrl(editing.avatarImage)}
                        className="w-32 h-40 object-cover rounded-xl border-2 border-primary-100 opacity-80"
                        alt="current-avatar"
                        onError={(e) => { e.target.src = 'https://placehold.co/120x160?text=No+Avatar'; }}
                      />
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="electronics, gadget, sale" />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Recommended Products (Complete The Look)</label>
                  <select 
                    multiple
                    value={form.recommendations}
                    onChange={(e) => {
                      const options = [...e.target.selectedOptions];
                      const values = options.map(option => option.value);
                      setForm({ ...form, recommendations: values });
                    }}
                    className="input-field pt-2 pb-2 h-32"
                  >
                    {allProducts.filter(p => !editing || p.id !== editing.id).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple products</p>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                    <span className="text-sm font-medium">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}