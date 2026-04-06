import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? 'bg-rose-500 text-white' : 'hover:bg-gray-100'}`}>Dashboard</NavLink>
        <NavLink to="/admin/foods" className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? 'bg-rose-500 text-white' : 'hover:bg-gray-100'}`}>Manage Foods</NavLink>
        <NavLink to="/admin/categories" className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? 'bg-rose-500 text-white' : 'hover:bg-gray-100'}`}>Manage Categories</NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;