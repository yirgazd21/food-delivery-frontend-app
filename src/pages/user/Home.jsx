import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getFoods, getCategories } from '../../services/foodService';

const Home = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pass search and category to backend
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory) params.append('category', selectedCategory);
        const [foodsRes, categoriesRes] = await Promise.all([
          getFoods(params.toString()),
          getCategories(),
        ]);
        setFoods(foodsRes.foods || []);
        setCategories(categoriesRes.categories || []);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, selectedCategory]); // refetch when filters change

  const handleAddToCart = async (foodId, e) => {
    e.stopPropagation();
    setAdding(foodId);
    const success = await addItem(foodId, 1);
    setAdding(null);
    if (!success) alert('Please login to add items');
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Food Delivery</h1>
        <p className="text-lg opacity-90">Order your favorite meals from the best restaurants</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${!selectedCategory ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === cat.id ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foods.map(food => (
          <div key={food.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">

            <img
              src={
                food.image_url
                  ? food.image_url.startsWith('http')
                    ? food.image_url
                    : `${import.meta.env.VITE_API_URL.replace('/api', '')}${food.image_url}`
                  : '/placeholder.jpg'
              }
              alt={food.name}
              className="w-full h-48 sm:h-56 md:h-60 object-cover rounded-t-xl"
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg">{food.name}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{food.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-rose-500 font-bold text-lg">${food.price}</span>
                <button
                  onClick={(e) => handleAddToCart(food.id, e)}
                  disabled={adding === food.id}
                  className="btn-action px-4 py-1.5 text-sm"
                >
                  {adding === food.id ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {foods.length === 0 && (
        <div className="text-center py-12 text-gray-500">No foods found. Try different search or category.</div>
      )}
    </div>
  );
};

export default Home;