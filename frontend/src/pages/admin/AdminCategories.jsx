import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Tag, Upload, Image } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUrl';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setImageFile(null);
    setImagePreview('');
    setModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || '' });
    setImageFile(null);
    setImagePreview(c.image || '');
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setImageFile(null);
    setImagePreview('');
  };

  /* ── Handle file pick ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Save ── */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Build FormData so file uploads work
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editing) {
        await api.put(`/categories/${editing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Category updated!');
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Category created!');
      }

      closeModal();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete (products exist?)');
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">Categories</h1>
        <button
          onClick={openCreate}
          className="btn-primary flex items-center gap-2 py-2 px-4"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <Spinner className="py-12" />
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Tag size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No categories yet</p>
          <p className="text-sm mt-1">Click "Add Category" to create one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-5 flex items-center gap-4">
              {/* Image */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {cat.image ? (
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ display: cat.image ? 'none' : 'flex' }}
                >
                  <Tag size={20} className="text-gray-400" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {cat.description || 'No description'}
                </p>
                <p className="text-xs text-primary-600 font-medium mt-1">
                  {cat._count?.products || 0} products
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-xl">
                {editing ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Electronics"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="input-field resize-none"
                  placeholder="Short description..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Image
                </label>

                {/* Preview */}
                {imagePreview ? (
                  <div className="relative mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-36 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                      {imageFile ? imageFile.name : 'Current image'}
                    </div>
                  </div>
                ) : null}

                {/* Upload box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/40 transition-all group"
                >
                  <div className="flex flex-col items-center gap-2">
                    {imagePreview ? (
                      <>
                        <Image size={22} className="text-primary-400" />
                        <p className="text-sm text-gray-500">Click to change image</p>
                      </>
                    ) : (
                      <>
                        <Upload size={22} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                        <p className="text-sm font-medium text-gray-600">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, WEBP — max 5MB</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}