import { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cat = null) => {
    if (cat) {
      setEditing(cat);
      setFormData({ name: cat.name, description: cat.description || '', image_url: cat.image_url || '' });
    } else {
      setEditing(null);
      setFormData({ name: '', description: '', image_url: '' });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.image_url) {
        data.append('image_url', formData.image_url);
      }

      if (editing) {
        await api.put(`/categories/${editing.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/categories', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      await fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert('Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category? All foods will lose category.')) {
      try {
        await api.delete(`/categories/${id}`);
        await fetchCategories();
      } catch (error) {
        alert('Delete failed (maybe has foods?)');
      }
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <button onClick={() => openModal()} className="btn-action text-orange-400 bg-blue-200 hover:bg-blue-300 cursor-pointer">
          + Add Category
        </button>
      </div>
      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {cat.image_url && (
                <img src={cat.image_url} alt={cat.name} className="w-12 h-12 object-cover rounded" />
              )}
              <div>
                <h3 className="font-semibold text-lg">{cat.name}</h3>
                {cat.description && <p className="text-gray-500 text-sm">{cat.description}</p>}
              </div>
            </div>
            <div className="space-x-2">
              <button onClick={() => openModal(cat)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(cat.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                name="description"
                placeholder="Description"
                rows="2"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
              {/* File upload for image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])}
                  className="w-full border rounded px-3 py-2"
                />
                {formData.image_url && !imageFile && (
                  <p className="text-xs text-gray-500 mt-1">Current: {formData.image_url}</p>
                )}
              </div>
              {/* Optional image URL field (fallback) */}
              <input
                type="text"
                name="image_url"
                placeholder="Or image URL (optional)"
                value={formData.image_url}
                onChange={e => setFormData({...formData, image_url: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-action flex-1 text-orange-400 bg-blue-200 hover:bg-blue-300 cursor-pointer">
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;