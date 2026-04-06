import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data.order);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-center py-20">Loading order...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">✅</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-6">Your order #{order.id} has been received.</p>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-left">
        <h2 className="font-semibold mb-3">Order Details</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Total Amount:</strong> ${order.total_amount}</p>
          <p><strong>Payment Method:</strong> Cash on Delivery</p>
          <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
          <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link to="/my-orders" className="btn-action px-6 py-2">
          View My Orders
        </Link>
        <Link to="/" className="px-6 py-2 border border-rose-500 text-rose-500 rounded-full hover:bg-rose-50">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;