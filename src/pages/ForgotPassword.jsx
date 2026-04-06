import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
                <p className="text-gray-600 mb-4">Enter your email and we'll send you a reset link.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    {message && <div className="bg-green-100 text-green-700 p-2 rounded text-sm">{message}</div>}
                    {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-action w-full py-2 text-orange-400 bg-blue-400 hover:bg-blue-500 cursor-pointer"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-orange-500 hover:underline bg-blue-600 px-3 py-1 rounded">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;