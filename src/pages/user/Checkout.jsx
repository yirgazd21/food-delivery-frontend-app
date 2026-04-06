import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/orderService';

const Checkout = () => {
    const { cart, emptyCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        deliveryAddress: user?.address || '',
        paymentMethod: 'cash',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if cart is empty
    useEffect(() => {
        if (!cart.items || cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart.items, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await createOrder({
                deliveryAddress: formData.deliveryAddress,
                paymentMethod: formData.paymentMethod,
            });

            await emptyCart();
            navigate(`/order-confirmation/${response.order.orderId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    // Show nothing while redirecting
    if (!cart.items || cart.items.length === 0) {
        return null; // or a loading spinner
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Checkout Form */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                            <textarea
                                name="deliveryAddress"
                                required
                                rows="3"
                                value={formData.deliveryAddress}
                                onChange={handleChange}
                                placeholder="Enter your full delivery address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={formData.paymentMethod === 'cash'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-rose-500"
                                    />
                                    <span>Cash on Delivery</span>
                                </label>
                                <label className="flex items-center gap-3 opacity-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        disabled
                                        className="w-4 h-4"
                                    />
                                    <span>Card Payment (Coming Soon)</span>
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-action w-full py-3 text-center disabled:opacity-50 text-orange-400 hover:text-orange-500 bg-blue-200"
                        >
                            {loading ? 'Placing Order...' : `Place Order • $${cart.total.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:w-96">
                    <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                            {cart.items.map((item) => (
                                <div key={item.cart_item_id} className="flex justify-between text-sm">
                                    <span>{item.quantity} × {item.name}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-3 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cart.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery Fee</span>
                                <span>Free</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-4 pt-3 border-t">
                            <span>Total</span>
                            <span>${cart.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;