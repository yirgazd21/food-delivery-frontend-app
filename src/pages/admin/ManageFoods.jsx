import { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: 1,
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterCategory]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory) params.append('category', filterCategory);
      const [foodsRes, categoriesRes] = await Promise.all([
        api.get(`/foods?${params.toString()}`),
        api.get('/categories'),
      ]);
      setFoods(foodsRes.data.foods);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Failed to fetch', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (food = null) => {
    if (food) {
      setEditingFood(food);
      setFormData({
        name: food.name,
        description: food.description || '',
        price: food.price,
        category_id: food.category_id,
        image_url: food.image_url || '',
        is_available: food.is_available,
      });
      setImageFile(null);
    } else {
      setEditingFood(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: categories[0]?.id || '',
        image_url: '',
        is_available: 1,
      });
      setImageFile(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFood(null);
    setImageFile(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category_id', formData.category_id);
    data.append('is_available', formData.is_available);
    if (imageFile) data.append('image', imageFile);
    if (formData.image_url && !imageFile) data.append('image_url', formData.image_url);

    try {
      if (editingFood) {
        await api.put(`/foods/${editingFood.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/foods', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save food');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this food item?')) {
      try {
        await api.delete(`/foods/${id}`);
        await fetchData();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await api.patch(`/foods/${id}/toggle`);
      await fetchData();
    } catch (error) {
      alert('Toggle failed');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Foods</h1>
        <button onClick={() => openModal()} className="btn-action text-orange-400 bg-blue-200 hover:bg-blue-300 cursor-pointer">
          + Add Food
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {foods.map(food => (
              <tr key={food.id}>
                <td className="px-4 py-3">
                  <img src={food.image_url || '/placeholder.jpg'} alt={food.name} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="px-4 py-3 font-medium">{food.name}</td>
                <td className="px-4 py-3">{food.category_name}</td>
                <td className="px-4 py-3">${food.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${food.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {food.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => openModal(food)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => toggleAvailability(food.id, food.is_available)} className="text-yellow-600 hover:underline">
                    {food.is_available ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => handleDelete(food.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingFood ? 'Edit Food' : 'Add Food'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              <textarea name="description" placeholder="Description" rows="3" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              <input type="number" step="0.01" name="price" placeholder="Price" required value={formData.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              <select name="category_id" required value={formData.category_id} onChange={handleChange} className="w-full border rounded px-3 py-2">
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded px-3 py-2" />
              <input type="text" name="image_url" placeholder="Or image URL (optional)" value={formData.image_url} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_available" checked={formData.is_available === 1} onChange={(e) => setFormData({ ...formData, is_available: e.target.checked ? 1 : 0 })} />
                Available
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-action flex-1 text-orange-400  hover:text-orange-500 cursor-pointer bg-blue-200">{submitting ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFoods;