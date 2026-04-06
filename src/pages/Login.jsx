import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    const data = await login(email, password);
    // Token is stored inside login function
    // Force a small delay to ensure localStorage is written
    setTimeout(() => {
      if (data.user.role === 'admin') {
        window.location.href = '/admin/dashboard'; // Use window.location to force full reload
      } else {
        window.location.href = '/'; // Force reload to re-run auth check
      }
    }, 100);
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>

          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-action w-full flex justify-center  bg-blue-600 hover:bg-blue-700 cursor-pointer "
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-rose-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="text-sm text-center">
            <Link to="/register" className="font-medium text-brand hover:text-brand-dark">
              Don't have an account? <span className='text-blue-500 cursor-pointer'>Register</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;