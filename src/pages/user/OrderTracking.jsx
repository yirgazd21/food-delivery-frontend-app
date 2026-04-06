import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';

const OrderTracking = () => {
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
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: '📋' },
    { key: 'confirmed', label: 'Confirmed', icon: '✅' },
    { key: 'preparing', label: 'Preparing', icon: '🍳' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '🏠' },
  ];

  const getCurrentStepIndex = () => {
    const index = statusSteps.findIndex(step => step.key === order?.status);
    return index === -1 ? 0 : index;
  };

  if (loading) return <div className="text-center py-20">Loading order...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Track Order #{order.id}</h1>
      <p className="text-gray-500 mb-8">
        {new Date(order.created_at).toLocaleString()}
      </p>

      {/* Status Timeline */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="relative">
          {statusSteps.map((step, idx) => {
            const isCompleted = idx <= getCurrentStepIndex();
            const isCurrent = idx === getCurrentStepIndex();
            return (
              <div key={step.key} className="flex items-start mb-8 last:mb-0 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl z-10 ${
                  isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.icon}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </h3>
                  {isCurrent && (
                    <p className="text-sm text-rose-500 mt-1">Current status</p>
                  )}
                </div>
                {idx < statusSteps.length - 1 && (
                  <div className={`absolute left-5 top-10 w-0.5 h-12 ${
                    idx < getCurrentStepIndex() ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        <p><strong>Total:</strong> ${order.total_amount}</p>
        <p><strong>Payment:</strong> {order.payment_status === 'completed' ? 'Paid' : 'Pending (COD)'}</p>
        <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
      </div>
    </div>
  );
};

export default OrderTracking;