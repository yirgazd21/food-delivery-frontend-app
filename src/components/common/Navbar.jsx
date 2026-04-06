import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-rose-500">
          FoodApp
        </Link>

        {/* Right side menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Role-based links */}
              {user.role === 'admin' ? (
                // Admin links
                <>
                  <Link to="/admin/dashboard" className="text-gray-600 hover:text-rose-500">
                    Dashboard
                  </Link>
                  <Link to="/admin/foods" className="text-gray-600 hover:text-rose-500">
                    Manage Foods
                  </Link>
                  <Link to="/admin/categories" className="text-gray-600 hover:text-rose-500">
                    Categories
                  </Link>
                </>
              ) : (
                // User links
                <>
                  <Link to="/my-orders" className="text-gray-600 hover:text-rose-500">
                    My Orders
                  </Link>
                  <Link to="/cart" className="relative text-gray-600 hover:text-rose-500">
                    🛒
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* User greeting & logout (common for both) */}
              <span className="text-gray-700">Hi, {user.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="text-gray-600 hover:text-rose-500">
                Logout
              </button>
            </>
          ) : (
            // Not logged in
            <>
              <Link to="/login" className="text-gray-600">
                Login
              </Link>
              <Link to="/register" className="btn-action px-4 py-2">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;