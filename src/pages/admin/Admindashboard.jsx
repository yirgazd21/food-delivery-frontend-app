import { useState } from 'react';
import OrdersTab from './OrdersTab';
import ManageFoods from './ManageFoods';
import ManageCategories from './ManageCategories';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tab Buttons */}
      <div className="flex gap-2 border-b mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 font-medium transition-colors ${
            activeTab === 'orders'
              ? 'border-b-2 border-rose-500 text-rose-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('foods')}
          className={`px-6 py-2 font-medium transition-colors ${
            activeTab === 'foods'
              ? 'border-b-2 border-rose-500 text-rose-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Foods
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-2 font-medium transition-colors ${
            activeTab === 'categories'
              ? 'border-b-2 border-rose-500 text-rose-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Categories
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'foods' && <ManageFoods />}
      {activeTab === 'categories' && <ManageCategories />}
    </div>
  );
};

export default AdminDashboard;