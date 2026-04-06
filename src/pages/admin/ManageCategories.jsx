import { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '' });
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
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      await fetchCategories();
      setShowModal(false);
    } catch (error) {
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
        <button onClick={() => openModal()} className="btn-action">+ Add Category</button>
      </div>
      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{cat.name}</h3>
              {cat.description && <p className="text-gray-500 text-sm">{cat.description}</p>}
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
              <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-f ull border rounded px-3 py-2" />
              <textarea name="description" placeholder="Description" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded px-3 py-2" />
              <input type="text" name="image_url" placeholder="Image URL (optional)" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full border rounded px-3 py-2" />
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-action flex-1 text-orange-400  hover:text-orange-500 cursor-pointer bg-blue-200">{submitting ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;